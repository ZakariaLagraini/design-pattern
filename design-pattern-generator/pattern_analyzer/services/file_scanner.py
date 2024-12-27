import os
from typing import Dict
import json

class FileScanner:
    def __init__(self):
        self.supported_extensions = {
            '.java': 'Java',
            '.py': 'Python',
            '.js': 'JavaScript',
            '.ts': 'TypeScript',
            '.cpp': 'C++',
            '.cs': 'C#',
            '.jsx': 'React',
            '.tsx': 'React',
            '.html': 'HTML',
            '.css': 'CSS',
            '.scss': 'CSS',
            '.sass': 'CSS',
            '.less': 'CSS',
            '.styl': 'CSS',
            '.php': 'PHP',
            '.sql': 'SQL',
            '.json': 'JSON',
            '.yaml': 'YAML',
            '.yml': 'YAML',
            '.go': 'Go',
            '.rb': 'Ruby',
            '.swift': 'Swift',
            '.kt': 'Kotlin',
            '.kts': 'Kotlin',
            '.rs': 'Rust',
            '.dart': 'Dart',
            '.r': 'R',
            '.m': 'Objective-C',
            '.mm': 'Objective-C',

        }

    def scan_directory(self, base_path: str) -> Dict:
        """
        Recursively scan a directory and return all source files in a formatted way
        """
        if not os.path.exists(base_path):
            return {
                'status': 'error',
                'message': f'Directory not found: {base_path}'
            }

        try:
            files_content = {}
            
            for root, _, files in os.walk(base_path):
                for file in files:
                    file_path = os.path.join(root, file)
                    _, ext = os.path.splitext(file)
                    
                    if ext in self.supported_extensions:
                        with open(file_path, 'r', encoding='utf-8') as f:
                            relative_path = os.path.relpath(file_path, base_path)
                            files_content[relative_path] = {
                                'content': f.read(),
                                'language': self.supported_extensions[ext],
                                'path': relative_path
                            }

            # Format the response in a more structured way
            formatted_response = {
                'status': 'success',
                'files': [
                    {
                        'path': file_info['path'],
                        'language': file_info['language'],
                        'content': file_info['content'].replace('\n', '\\n').replace('\t', '\\t')
                    }
                    for file_info in files_content.values()
                ],
                'summary': {
                    'languages': self._count_languages(files_content)
                }
            }

            return formatted_response

        except Exception as e:
            return {
                'status': 'error',
                'message': str(e)
            }

    def _count_languages(self, files_content: Dict) -> Dict:
        """Count files per programming language"""
        language_count = {}
        for file_info in files_content.values():
            lang = file_info['language']
            language_count[lang] = language_count.get(lang, 0) + 1
        return language_count