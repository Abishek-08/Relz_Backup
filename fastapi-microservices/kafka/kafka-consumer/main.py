from fastapi import FastAPI
import asyncio
from kafka import KafkaConsumer
import json

KAFKA_BROKER_URL = "localhost:9092"
KAFKA_TOPIC = "fastapi-topic"
KAFKA_CONSUMER_ID = "fastapi-consumer"

stop_polling_event = asyncio.Event()
app = FastAPI()

def json_deserializer(value):
    if value is None:
        return None
    try:
        return json.loads(value.decode('utf-8'))
    except:
        print('unable to decode')
        return None
    
def create_kafka_consumer():

    consumer = KafkaConsumer(
        KAFKA_TOPIC,
        bootstrap_servers=[KAFKA_BROKER_URL],
        auto_offset_reset='earliest',
        enable_auto_commit=True,
        group_id = KAFKA_CONSUMER_ID,
        value_deserializer = json_deserializer
    )
    return consumer

async def poll_consumer(consumer: KafkaConsumer):
    try:
        while not stop_polling_event.is_set():
            print("Trying to poll again")
            records = consumer.poll(timeout_ms=5000, max_records=250)
            if records:
                for record in records.values():
                    for message in record:
                        m = json.loads(message.value).get("message")
                        print(f'Received message {m} from the {message.topic}')
            await asyncio.sleep(5)
    except Exception as e:
        print(f'error available {e}')
    finally:
        print("closing the consumer")
        consumer.close()


task_list = []

@app.get('/trigger')
async def trigger_polling():
    if not task_list:
        stop_polling_event.clear() # reset flag
        consumer = create_kafka_consumer()
        task = asyncio.create_task(poll_consumer(consumer))
        task_list.append(task)

        return {'status':'kafka polling has started'}
    return {'status':'kafka polling was already trigged'}

@app.get('/stop-polling')
async def stop_polling():
    stop_polling_event.set()
    if task_list:
        task_list.pop()
    
    return {'status':'kafka polling stopped'}