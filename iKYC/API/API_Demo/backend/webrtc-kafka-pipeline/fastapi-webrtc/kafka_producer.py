import os, json, asyncio
from aiokafka import AIOKafkaProducer

_producer = None

async def get_producer():
    global _producer
    if not _producer:
        bootstrap = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "192.168.49.2:30000")
        _producer = AIOKafkaProducer(bootstrap_servers=bootstrap)
        await _producer.start()
    return _producer

async def send_frame_to_kafka(payload: dict):
    producer = await get_producer()
    await producer.send_and_wait("frames", json.dumps(payload).encode("utf-8"))
