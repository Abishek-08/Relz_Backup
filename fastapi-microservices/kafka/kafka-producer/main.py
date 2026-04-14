from fastapi import FastAPI, BackgroundTasks
from kafka.admin import KafkaAdminClient, NewTopic
from kafka_producer import produce_kafka_message
from contextlib import asynccontextmanager
from producer_schema import ProducerMessage

KAFKA_BROKER = 'localhost:9092'
KAFKA_TOPIC = 'fastapi-topic'
KAFKA_ADMIN_CLIENT = 'fastapi-admin-client'

@asynccontextmanager
async def p_lifespan(app: FastAPI):

    admin_client = KafkaAdminClient(
        bootstrap_servers = KAFKA_BROKER,
        client_id = KAFKA_ADMIN_CLIENT
    )
    
    if not KAFKA_TOPIC in admin_client.list_topics():
        admin_client.create_topics(
            new_topics=[
                NewTopic(
                    name=KAFKA_TOPIC,
                    num_partitions=1,
                    replication_factor=1 
                )
            ], validate_only=False
        )
        # admin_client.delete_topics(topics=[KAFKA_TOPIC])
    yield # separation point


app = FastAPI(lifespan=p_lifespan)

@app.post("/produce/message")
async def produce_message(message_request: ProducerMessage, backgroud_tasks:BackgroundTasks):
    backgroud_tasks.add_task(produce_kafka_message, message_request)
    return {"message": "Message received thank you for sending message"}