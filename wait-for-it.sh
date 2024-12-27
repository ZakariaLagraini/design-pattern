#!/bin/bash
# wait-for-it.sh

host="$1"
port="$2"
shift 2
cmd="$@"

# First wait for the port to be available
until nc -z "$host" "$port"; do
  echo "Waiting for $host:$port..."
  sleep 3
done

# For Spring Boot services, wait for the actuator health endpoint
if [[ $port != "5432" ]]; then  # Skip for postgres
  until wget -q --spider http://$host:$port/actuator/health; do
    echo "Waiting for $host:$port to be healthy..."
    sleep 3
  done
  
  # Check if the service is actually UP
  until wget -q -O - http://$host:$port/actuator/health | grep -q "UP"; do
    echo "Waiting for $host:$port to be UP..."
    sleep 3
  done
fi

echo "$host:$port is available and healthy"
exec $cmd 