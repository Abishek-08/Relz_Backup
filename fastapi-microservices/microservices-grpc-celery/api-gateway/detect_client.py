import grpc
import detect_pb2
import detect_pb2_grpc

def call_detect_service(image_url: str):
    with grpc.insecure_channel("localhost:50051") as channel:
        stub = detect_pb2_grpc.DetectServiceStub(channel)
        # request = detect_pb2.ImageRequest(image_url=image_url)
        # response = stub.ProcessImage(request)
        # return response
        request = detect_pb2.TestRequest(msg=image_url)
        response = stub.TestMethod(request)
        return response
    

response = call_detect_service(image_url="Hi from api-gateway request")
print("Response: ", response)