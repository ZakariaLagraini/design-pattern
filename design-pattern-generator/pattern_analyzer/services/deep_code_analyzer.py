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
            model="gemini-1.5-flash-latest",
            temperature=0.7,
            google_api_key=os.getenv('GOOGLE_API_KEY')
        )

        # Enhanced prompt template with more detailed code examples
        self.prompt_template = PromptTemplate(
            input_variables=["code_content"],
            template="""
Analyze this Django backend codebase and provide detailed design pattern recommendations with implementation examples.
Focus on practical, implementable patterns that would improve the code structure and maintainability.

Code to analyze:
{code_content}

Please provide a detailed analysis in the following format:
{{
    "current_patterns": [
        {{
            "pattern_name": "Name of pattern currently used",
            "category": "Architectural/Creational/Structural/Behavioral",
            "implementation": "How it's currently implemented",
            "effectiveness": "How well it works",
            "suggestions": "How to improve it",
            "current_files": ["List of files currently using this pattern"],
            "code_example": {{
                "current": "// Current implementation example",
                "improved": "// Suggested improved implementation"
            }}
        }}
    ],
    "recommended_patterns": [
        {{
            "pattern_name": "Name of recommended pattern",
            "category": "Architectural/Creational/Structural/Behavioral",
            "purpose": "Why this pattern would be useful",
            "implementation_guide": {{
                "description": "Detailed implementation steps",
                "files_to_create": [
                    {{
                        "path": "path/to/new/file.py",
                        "purpose": "What this file will do",
                        "code_example": "Complete code example with comments"
                    }}
                ],
                "files_to_modify": [
                    {{
                        "path": "path/to/existing/file.py",
                        "changes": [
                            {{
                                "description": "What to change",
                                "current_code": "// Current code snippet",
                                "new_code": "// New code snippet",
                                "explanation": "Why this change is needed"
                            }}
                        ]
                    }}
                ],
                "dependencies": [
                    {{
                        "name": "Package name",
                        "version": "Version requirement",
                        "purpose": "Why this dependency is needed"
                    }}
                ]
            }},
            "benefits": ["List of specific benefits"],
            "challenges": ["Potential implementation challenges"],
            "priority": "High/Medium/Low",
            "estimated_effort": "Story points or time estimate",
            "testing_considerations": [
                {{
                    "aspect": "What to test",
                    "test_example": "Example test code"
                }}
            ]
        }}
    ],
    "architecture_suggestions": {{
        "current_architecture": "Description of current architecture",
        "suggested_improvements": [
            {{
                "area": "Area of improvement",
                "suggestion": "Detailed suggestion",
                "implementation": {{
                    "steps": ["Step-by-step implementation guide"],
                    "files": [
                        {{
                            "path": "path/to/file.py",
                            "changes": {{
                                "before": "// Current code",
                                "after": "// Suggested code",
                                "explanation": "Why this change helps"
                            }}
                        }}
                    ],
                    "configuration": {{
                        "file": "path/to/config/file",
                        "changes": "Required configuration changes"
                    }}
                }},
                "priority": "High/Medium/Low"
            }}
        ]
    }},
    "implementation_roadmap": [
        {{
            "phase": "Phase number",
            "patterns": ["Patterns to implement"],
            "description": "Phase description",
            "tasks": [
                {{
                    "description": "Task description",
                    "files": ["Files involved"],
                    "code_changes": {{
                        "before": "// Current code",
                        "after": "// New code"
                    }},
                    "effort": "Estimated effort",
                    "dependencies": ["Required changes"]
                }}
            ]
        }}
    ]
}}

Focus on Django-specific patterns and best practices, including:
1. Django REST framework patterns
2. Service layer patterns
3. Repository/Manager patterns
4. Authentication/Permission patterns
5. Middleware patterns
6. Caching strategies
7. Database access patterns
8. Error handling patterns
9. Testing patterns
10. Async patterns

For each pattern suggestion:
- Provide complete, working code examples
- Include docstrings and comments
- Show both current and suggested implementations
- Include unit test examples
- Specify exact file locations and changes
- Consider Django best practices
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
                return {
                    'status': 'success',
                    'analysis': parsed_response,
                    'metadata': {
                        'analyzer_version': '2.0',
                        'framework': 'Django',
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
                        return {
                            'status': 'success',
                            'analysis': parsed_response,
                            'metadata': {
                                'analyzer_version': '2.0',
                                'framework': 'Django',
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