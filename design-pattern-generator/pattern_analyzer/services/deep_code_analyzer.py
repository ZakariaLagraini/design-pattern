import os
from typing import Dict
import logging
import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain
from dotenv import load_dotenv
import json
from .pattern_suggestion_service import PatternSuggestionService
import datetime

class DeepCodeAnalyzer:
    def __init__(self):
        load_dotenv()
        self.logger = logging.getLogger(__name__)
        
        # Configure Gemini
        genai.configure(api_key=os.getenv('GOOGLE_API_KEY'))
        
        # Initialize LangChain with Gemini
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-pro",
            temperature=0.7,
            google_api_key=os.getenv('GOOGLE_API_KEY')
        )

        # Simplified prompt template
        self.prompt_template = PromptTemplate(
            input_variables=["code_content"],
            template="""
Analyze the provided codebase and provide a clear, concise analysis in the following format:

Code to analyze:
{code_content}

Provide analysis in this simplified JSON format:
{{
    "status": "success",
    "analysis": {{
        "framework_detection": {{
            "name": "Name of detected framework",
            "confidence": "High/Medium/Low",
            "key_files": [
                "List of main framework files found"
            ]
        }},
        "code_structure": {{
            "main_components": [
                "List of key components/files"
            ],
            "weaknesses": [
                "List of identified weaknesses or areas for improvement"
            ]
        }},
        "suggested_patterns": [
            {{
                "name": "Pattern name",
                "type": "Creational/Structural/Behavioral",
                "priority": "High/Medium/Low",
                "target_files": [
                    "Files where this pattern should be implemented"
                ],
                "implementation": {{
                    "description": "Brief description of how to implement",
                    "example": "// Simple code example showing implementation"
                }}
            }}
        ]
    }},
    "metadata": {{
        "analyzer_version": "2.0",
        "analysis_timestamp": "Current timestamp"
    }}
}}

Focus on:
1. Clear framework detection
2. Key weaknesses in the code
3. Most important patterns to implement
4. Simple, actionable suggestions
"""
        )

        self.chain = LLMChain(llm=self.llm, prompt=self.prompt_template)

    async def analyze(self, scan_results: Dict) -> Dict:
        if scan_results['status'] != 'success':
            return scan_results

        try:
            code_content = self._prepare_code_content(scan_results)
            response = await self.chain.arun(code_content=code_content)
            
            # Clean up the response
            cleaned_response = response.replace('```json\n', '').replace('\n```', '')
            
            try:
                parsed_response = json.loads(cleaned_response)
                
                # Add metadata using detected framework
                framework = parsed_response.get('framework_detection', {}).get('detected_framework', 'Unknown')
                
                return {
                    'status': 'success',
                    'analysis': parsed_response,
                    'metadata': {
                        'analyzer_version': '2.0',
                        'framework': framework,
                        'analysis_timestamp': datetime.datetime.now().isoformat()
                    }
                }
            except json.JSONDecodeError as e:
                # Try to extract JSON from the response if it contains other text
                import re
                json_match = re.search(r'\{[\s\S]*\}', response)
                if json_match:
                    try:
                        parsed_response = json.loads(json_match.group())
                        framework = parsed_response.get('framework_detection', {}).get('detected_framework', 'Unknown')
                        return {
                            'status': 'success',
                            'analysis': parsed_response,
                            'metadata': {
                                'analyzer_version': '2.0',
                                'framework': framework,
                                'analysis_timestamp': datetime.datetime.now().isoformat()
                            }
                        }
                    except:
                        pass
                
                return {
                    'status': 'error',
                    'message': 'Failed to parse analysis results',
                    'error': str(e),
                    'raw_response': response
                }

        except Exception as e:
            self.logger.error(f"Analysis error: {str(e)}")
            return {
                'status': 'error',
                'message': str(e)
            }

    def _prepare_code_content(self, scan_results: Dict) -> str:
        """Prepare code content with better structure for analysis"""
        content = []
        content.append("Project Structure:")
        
        # Group files by type
        django_files = []
        model_files = []
        view_files = []
        other_files = []
        
        for file_info in scan_results['files']:
            path = file_info['path']
            if 'models.py' in path:
                model_files.append(file_info)
            elif 'views.py' in path:
                view_files.append(file_info)
            elif path.endswith('.py'):
                django_files.append(file_info)
            else:
                other_files.append(file_info)
        
        # Add files in a structured way
        for category, files in [
            ("Models:", model_files),
            ("Views:", view_files),
            ("Django Files:", django_files),
            ("Other Files:", other_files)
        ]:
            if files:
                content.append(f"\n{category}")
                for file_info in files:
                    content.append(f"\nFile: {file_info['path']}")
                    content.append(f"Content:\n{file_info['content']}")
                    content.append("-" * 80)
        
        return "\n".join(content) 