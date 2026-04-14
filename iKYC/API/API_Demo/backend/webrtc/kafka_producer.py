from aiokafka import AIOKafkaProducer
import asyncio, json
 
 
_producer = None
 
 
async def get_producer():
    global _producer
    if not _producer:
        _producer = AIOKafkaProducer(bootstrap_servers='192.168.49.2:30000')
        await _producer.start()
    return _producer
 
 
async def send_frame_to_kafka(payload: dict):
    producer = await get_producer()
    await producer.send_and_wait('frames', json.dumps(payload).encode('utf-8'))
    