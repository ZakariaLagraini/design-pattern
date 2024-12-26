import os

# Application configuration
APP_NAME = "design-pattern-generator"
SERVER_PORT = 8000

# Eureka configuration
EUREKA_SERVER_URL = "http://localhost:8761/eureka"
EUREKA_INSTANCE = {
    "instanceId": f"{APP_NAME}:{SERVER_PORT}",
    "app": APP_NAME,
    "hostName": "localhost",
    "ipAddr": "127.0.0.1",
    "port": {"$": SERVER_PORT, "@enabled": "true"},
    "vipAddress": APP_NAME,
    "secureVipAddress": APP_NAME,
    "status": "UP",
    "dataCenterInfo": {
        "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
        "name": "MyOwn"
    },
    "leaseInfo": {
        "renewalIntervalInSecs": 30,
        "durationInSecs": 90
    }
} 