import asyncio
import grpc
from grpc import aio
from proto import detect_pb2
from proto import detect_pb2_grpc
from app.celery.tasks import calculate_odd_even

class DetectService(detect_pb2_grpc.DetectServiceServicer):
    async def TestMethod(self, request, context):
        return detect_pb2.TestResponse(msg=f'{request} from the Detect grpc server')
    
    async def calculateEven(self, request, context):
        result = calculate_odd_even.delay(request)
        return detect_pb2.EvenListResponse(evenList = result.get())



async def serve():
    server = aio.server()
    detect_pb2_grpc.add_DetectServiceServicer_to_server(DetectService(), server)
    server.add_insecure_port('[::]:50051')
    await server.start()
    print("Detect async gRPC server started.")
    await server.wait_for_termination()

   


