from aiokafka import AIOKafkaConsumer
import asyncio, json
 
 
async def start_results_consumer():
    consumer = AIOKafkaConsumer(
    'results',
    bootstrap_servers='192.168.49.2:30000',
    group_id='fastapi-results-group',
    auto_offset_reset='earliest'
    )
    await consumer.start()
    try:
        async for msg in consumer:
            data = json.loads(msg.value.decode())
            yield data
    finally:
        await consumer.stop()
 