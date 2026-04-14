# gpu-worker/worker.py
import asyncio
import base64
import json
import cv2
import numpy as np
from aiokafka import AIOKafkaProducer
from kafka_consumer import consume_frames
 
 
async def detect_on_image(img):
    # Replace with real model inference (YOLO / ONNX / TensorRT)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    mean_val = float(np.mean(gray))
    return {'brightness': mean_val}
 
 
async def produce_result(producer, session_id, result, timestamp):
    payload = {
    'session_id': session_id,
    'timestamp': timestamp,
    'results': result
    }
    await producer.send_and_wait('results', json.dumps(payload).encode('utf-8'))
 
 
async def process_callback(producer, session_id, frame_b64, timestamp):
    try:
        frame_bytes = base64.b64decode(frame_b64)
        npimg = np.frombuffer(frame_bytes, dtype=np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
        res = await detect_on_image(img)
        await produce_result(producer, session_id, res, timestamp)
    except Exception as e:
        print('error processing frame', e)
 
 
async def main():
    producer = AIOKafkaProducer(bootstrap_servers='localhost:9092')
    await producer.start()
    try:
        async def cb(session_id, frame_b64, timestamp):
            await process_callback(producer, session_id, frame_b64, timestamp)
        await consume_frames(cb)
    finally:
        await producer.stop()
 
 
if __name__ == '__main__':
    asyncio.run(main())
 