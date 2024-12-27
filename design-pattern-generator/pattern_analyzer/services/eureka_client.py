import requests
import json
import logging
import time
import threading
from django.conf import settings
from design_pattern_analyzer.config import EUREKA_SERVER_URL, EUREKA_INSTANCE

logger = logging.getLogger(__name__)

class EurekaClient:
    def __init__(self):
        self.eureka_url = EUREKA_SERVER_URL
        self.instance = EUREKA_INSTANCE
        self.headers = {"Content-Type": "application/json"}
        self._heartbeat_thread = None
        
    def register(self):
        """Register the service with Eureka"""
        try:
            url = f"{self.eureka_url}/apps/{self.instance['app']}"
            response = requests.post(
                url,
                data=json.dumps({"instance": self.instance}),
                headers=self.headers
            )
            if response.status_code == 204:
                logger.info(f"Successfully registered with Eureka at {url}")
                self._start_heartbeat()
                return True
            else:
                logger.error(f"Failed to register with Eureka: {response.status_code}")
                return False
        except Exception as e:
            logger.error(f"Error registering with Eureka: {str(e)}")
            return False

    def _heartbeat(self):
        """Send heartbeat to Eureka"""
        while True:
            try:
                url = f"{self.eureka_url}/apps/{self.instance['app']}/{self.instance['instanceId']}"
                response = requests.put(url, headers=self.headers)
                if response.status_code != 200:
                    logger.warning(f"Failed to send heartbeat: {response.status_code}")
            except Exception as e:
                logger.error(f"Heartbeat error: {str(e)}")
            time.sleep(30)  # Send heartbeat every 30 seconds

    def _start_heartbeat(self):
        """Start the heartbeat thread"""
        if not self._heartbeat_thread:
            self._heartbeat_thread = threading.Thread(target=self._heartbeat, daemon=True)
            self._heartbeat_thread.start() 