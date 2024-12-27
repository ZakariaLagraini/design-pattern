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
            scan_type = serializer.validated_data.get('scan_type', 'full')

            # Log the path being analyzed
            logger.info(f"Analyzing project at path: {project_path}")
            
            # Ensure the path exists
            if not os.path.exists(project_path):
                return Response({
                    'status': 'error',
                    'message': f'Path not found: {project_path}'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Scan the directory first
            logger.info("Starting directory scan...")
            scan_results = self.scanner.scan_directory(project_path)
            
            if scan_results['status'] == 'error':
                logger.error(f"Scan failed: {scan_results.get('message')}")
                return Response(scan_results, status=status.HTTP_400_BAD_REQUEST)

            logger.info(f"Found {len(scan_results['files'])} files to analyze")
            
            # Add scan type to results
            scan_results['scan_type'] = scan_type

            # Perform deep analysis
            logger.info("Starting deep analysis...")
            import asyncio
            analysis_results = asyncio.run(self.analyzer.analyze(scan_results))
            
            logger.info("Analysis completed successfully")
            return Response(analysis_results)

        except Exception as e:
            logger.error(f"Analysis error: {str(e)}", exc_info=True)
            error_response = {
                'status': 'error',
                'message': str(e)
            }
            return Response(error_response, status=status.HTTP_500_INTERNAL_SERVER_ERROR)