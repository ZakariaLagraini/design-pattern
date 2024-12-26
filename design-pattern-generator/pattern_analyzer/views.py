from django.shortcuts import render
from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import ProjectAnalysisSerializer
import json
import logging
import os
from .services.deep_code_analyzer import DeepCodeAnalyzer
from .services.file_scanner import FileScanner
from asgiref.sync import sync_to_async

logger = logging.getLogger(__name__)

class CodeAnalysisView(views.APIView):
    def __init__(self):
        super().__init__()
        self.analyzer = DeepCodeAnalyzer()
        self.scanner = FileScanner()

    def post(self, request):
        try:
            # Validate input data using serializer
            serializer = ProjectAnalysisSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(
                    {'status': 'error', 'message': serializer.errors}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get validated data
            project_path = serializer.validated_data['project_path']
            source_dir = serializer.validated_data.get('source_dir', 'src')
            scan_type = serializer.validated_data.get('scan_type', 'full')

            # Combine project path with source directory
            full_path = os.path.join(project_path, source_dir)
            
            # Ensure the path exists
            if not os.path.exists(full_path):
                return Response({
                    'status': 'error',
                    'message': f'Path not found: {full_path}'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Scan the directory first
            scan_results = self.scanner.scan_directory(full_path)
            
            if scan_results['status'] == 'error':
                return Response(scan_results, status=status.HTTP_400_BAD_REQUEST)

            # Add scan type to results
            scan_results['scan_type'] = scan_type

            # Perform deep analysis synchronously
            import asyncio
            analysis_results = asyncio.run(self.analyzer.analyze(scan_results))
            
            logger.debug("Response Data: %s", json.dumps(analysis_results, indent=2))
            return Response(analysis_results)

        except Exception as e:
            error_response = {
                'status': 'error',
                'message': str(e)
            }
            logger.error("Analysis error: %s", str(e))
            return Response(error_response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
