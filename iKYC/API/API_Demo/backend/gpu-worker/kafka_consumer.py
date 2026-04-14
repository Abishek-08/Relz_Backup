from aiokafka import AIOKafkaConsumer
import asyncio, json
 
 
async def consume_frames(callback):
    consumer = AIOKafkaConsumer(
    'frames',
    bootstrap_servers='localhost:9092',
    group_id='gpu-workers',
    auto_offset_reset='earliest'
    )
    await consumer.start()
    try:
        async for msg in consumer:
            data = json.loads(msg.value.decode())
            # ensure the callback receives (session_id, frame_b64, timestamp)
            await callback(data['session_id'], data.get('frame_jpeg_b64'), data.get('timestamp'))
    finally:
        await consumer.stop()
 