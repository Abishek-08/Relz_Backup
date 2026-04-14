# WebRTC-Kafka-Pipeline (YOLO + local Kafka)

This repo contains a runnable local pipeline for frame capture, Kafka transport, YOLO detection and result fanout.

Services:
- fastapi (frame ingestion via WebSocket, publishes to Kafka 'frames' topic, forwards 'results' topic back to clients)
- gpu-worker (consumes 'frames', runs YOLOv8 inference, publishes 'results')
- kafka + zookeeper (using wurstmeister images)
- client (simple HTML page to send frames via WebSocket)

## Requirements
- Docker & Docker Compose
- Internet access for initial YOLO model download (ultralytics will download yolov8n.pt on first run)
- If running outside Docker, set KAFKA_BOOTSTRAP_SERVERS accordingly (default: localhost:9092)

## Run
1. Build and start:
   docker compose up --build

2. Open the client:
   http://localhost:8000/client/index.html

Notes:
- The gpu-worker uses ultralytics YOLO; first run will download model weights and may take time.
- For production or real GPU, replace the base image of gpu-worker Dockerfile with a CUDA-enabled image and install GPU drivers.
