# Kafka + Zookeeper + Kafdrop UI Docker Setup

This setup runs Kafka, Zookeeper, and Kafdrop (a Kafka UI tool) using Docker Compose.

## 🔧 How to Use

### 1. Start Services

```bash
docker-compose up -d
```

### 2. Access Kafka UI

Open your browser:

```
http://localhost:9000
```

Use the UI to inspect topics, partitions, consumer groups, etc.

### 3. CLI: Create a Topic

```bash
docker exec kafka kafka-topics --create --topic test-topic --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
```

### 4. CLI: Produce Messages

```bash
docker exec -it kafka kafka-console-producer --topic test-topic --bootstrap-server localhost:9092
```

### 5. CLI: Consume Messages

```bash
docker exec -it kafka kafka-console-consumer --topic test-topic --from-beginning --bootstrap-server localhost:9092
```

### 6. Stop Services

```bash
docker-compose down
```

telnet localhost 9092
