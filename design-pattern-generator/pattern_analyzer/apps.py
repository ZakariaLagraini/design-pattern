from django.apps import AppConfig
from pattern_analyzer.services.eureka_client import EurekaClient


class PatternAnalyzerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'pattern_analyzer'
    
    def ready(self):
        """Initialize Eureka client when Django starts"""
        if not self.apps.is_installed('pattern_analyzer'):
            return
            
        eureka_client = EurekaClient()
        eureka_client.register()
