import os
import json
import base64
import asyncio
import cv2
import numpy as np
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
from ultralytics import YOLO

MODEL = os.getenv("YOLO_MODEL", "yolov8n.pt")
BOOT = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "192.168.49.2:30000")

async def main():
    # load model (may download if not present)
    model = YOLO(MODEL)

    consumer = AIOKafkaConsumer(
        "frames",
        bootstrap_servers=BOOT,
        group_id="gpu-worker-group",
        auto_offset_reset="earliest"
    )
    producer = AIOKafkaProducer(bootstrap_servers=BOOT)

    await consumer.start()
    await producer.start()
    try:
        async for msg in consumer:
            try:
                payload = json.loads(msg.value.decode())
                session_id = payload.get("session_id")
                b64 = payload.get("frame_jpeg_b64")
                if not b64:
                    continue
                frame_bytes = base64.b64decode(b64)
                nparr = np.frombuffer(frame_bytes, np.uint8)
                img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

                # run YOLO inference
                results = model(img)  # returns a Results object
                detections = []
                # iterate detections
                for r in results:
                    boxes = getattr(r, "boxes", None)
                    if boxes is None:
                        continue
                    for box in boxes:
                        xyxy = box.xyxy.tolist()[0] if hasattr(box.xyxy, 'tolist') else box.xyxy
                        conf = float(box.conf.tolist()[0]) if hasattr(box.conf, 'tolist') else float(box.conf)
                        cls = int(box.cls.tolist()[0]) if hasattr(box.cls, 'tolist') else int(box.cls)
                        detections.append({
                            "bbox": xyxy,
                            "conf": conf,
                            "class_id": cls
                        })

                out = {
                    "session_id": session_id,
                    "results": detections
                }
                await producer.send_and_wait("results", json.dumps(out).encode("utf-8"))
            except Exception as e:
                print("Error processing frame:", e)
    finally:
        await consumer.stop()
        await producer.stop()

if __name__ == '__main__':
    asyncio.run(main())
