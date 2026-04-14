import os, json
from aiokafka import AIOKafkaConsumer

async def start_results_consumer():
    bootstrap = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "192.168.49.2:30000")
    consumer = AIOKafkaConsumer(
        "results",
        bootstrap_servers=bootstrap,
        group_id="fastapi-results-group",
        auto_offset_reset="earliest"
    )
    await consumer.start()
    try:
        async for msg in consumer:
            data = json.loads(msg.value.decode())
            yield data
    finally:
        await consumer.stop()
