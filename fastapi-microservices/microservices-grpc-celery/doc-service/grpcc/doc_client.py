import grpc
from proto import detect_pb2
from proto import detect_pb2_grpc
from typing import List

def call_detect_service(number: List[int]):
    with grpc.insecure_channel("localhost:50051") as channel:
        stub = detect_pb2_grpc.DetectServiceStub(channel)
        request = detect_pb2.EvenListRequest(numList = number)
        response = stub.calculateEven(request)
        return response