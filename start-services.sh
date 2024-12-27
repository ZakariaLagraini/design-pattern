#!/bin/bash

# Function to wait for a port to be available with timeout
wait_for_port() {
    local host=$1
    local port=$2
    local timeout=60  # 60 seconds timeout
    local start_time=$(date +%s)
    
    echo "Waiting for $host:$port..."
    while ! timeout 1 bash -c "echo > /dev/tcp/$host/$port" 2>/dev/null; do
        local current_time=$(date +%s)
        local elapsed=$((current_time - start_time))
        
        if [ $elapsed -gt $timeout ]; then
            echo "Timeout waiting for $host:$port after ${timeout} seconds"
            echo "Checking container logs..."
            docker compose logs --tail=50 $(docker compose ps -q | grep $port)
            exit 1
        fi
        
        echo "Waiting for $host:$port... ($elapsed seconds)"
        sleep 3
    done
    echo "$host:$port is available"
}

# Start and wait for Postgres
echo "Starting Postgres instances..."
docker compose up postgres-user postgres-catalog -d
wait_for_port localhost 5434  # Changed from 5432
wait_for_port localhost 5433  # Changed from 5432

# Start and wait for Service Registry
echo "Starting Service Registry..."
docker compose up service-registry -d
wait_for_port localhost 8761

# Start and wait for User Management
echo "Starting User Management..."
docker compose up user-management-service -d
docker compose logs user-management-service  # Added to see startup logs
wait_for_port localhost 8081

# Start and wait for Design Pattern Catalog
echo "Starting Design Pattern Catalog..."
docker compose up design-pattern-catalog-service -d
docker compose logs design-pattern-catalog-service  # Added to see startup logs
wait_for_port localhost 8082

# Start and wait for Recommendation Engine
echo "Starting Recommendation Engine..."
docker compose up recommendation-engine-service -d
wait_for_port localhost 8083

# Start and wait for AI Helper
echo "Starting AI Helper..."
docker compose up ai-helper-service -d
wait_for_port localhost 8084

# Start and wait for API Gateway
echo "Starting API Gateway..."
docker compose up api-gateway -d
wait_for_port localhost 8080

echo "All services are up and running!" 