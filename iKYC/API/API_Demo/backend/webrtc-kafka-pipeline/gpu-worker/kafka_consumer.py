from aiokafka import AIOKafkaConsumer
import os, json, asyncio

async def consume_frames(callback):
    bootstrap = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "192.168.49.2:30000")
    consumer = AIOKafkaConsumer(
        "frames",
        bootstrap_servers=bootstrap,
        group_id="gpu-workers",
        auto_offset_reset="earliest"
    )
    await consumer.start()
    try:
        async for msg in consumer:
            data = json.loads(msg.value.decode())
            await callback(data['session_id'], data.get('frame_jpeg_b64'), data.get('timestamp'))
    finally:
        await consumer.stop()
