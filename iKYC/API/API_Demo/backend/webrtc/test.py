import asyncio, json
from aiokafka import AIOKafkaProducer, AIOKafkaConsumer
 
TOPIC = "test-topic"
 
async def produce():
    producer = AIOKafkaProducer(bootstrap_servers="192.168.49.2:30000")
    await producer.start()
    try:
        for i in range(5):
            msg = {"msg": f"hello {i}"}
            await producer.send_and_wait(TOPIC, json.dumps(msg).encode())
            print(f"Sent: {msg}")
    finally:
        await producer.stop()
 
async def consume():
    consumer = AIOKafkaConsumer(
        TOPIC,
        bootstrap_servers="192.168.49.2:30000",
        group_id="test-group",
        auto_offset_reset="earliest"
    )
    await consumer.start()
    try:
        async for msg in consumer:
            print(f"Received: {json.loads(msg.value.decode())}")
            break
    finally:
        await consumer.stop()
 
async def main():
    await produce()
    await consume()
 
if __name__ == "__main__":
    asyncio.run(main())
 