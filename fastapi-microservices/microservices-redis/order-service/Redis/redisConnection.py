from redis_om import get_redis_connection


redis = get_redis_connection(
    host="redis-10619.c12.us-east-1-4.ec2.redns.redis-cloud.com",
    port="10619",
    password="WE8NV0fHSuZgbH92M71otMLYTBpdUhke",
    decode_responses=True
)