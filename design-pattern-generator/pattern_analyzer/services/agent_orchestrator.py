from typing import Dict
import os
from .file_scanner import FileScanner
import logging

class AgentOrchestrator:
    def __init__(self):
        self.scanner = FileScanner()
        self.logger = logging.getLogger(__name__)
    
    async def analyze_project(self, project_path: str, source_dir: str = "") -> Dict:
        try:
            scan_path = project_path
            if source_dir:
                scan_path = os.path.join(project_path, source_dir)
                
            return self.scanner.scan_directory(scan_path)
            
        except Exception as e:
            self.logger.error(f"Scanning error: {str(e)}")
            return {
                'status': 'error',
                'message': str(e)
            } 