import os
from typing import Dict
import json

class FileScanner:
    def __init__(self):
        self.supported_extensions = {
            '.java': 'Java',
            '.xml': 'XML',
            '.properties': 'Properties',
            '.yml': 'YAML',
            '.yaml': 'YAML',
            '.json': 'JSON',
            '.gradle': 'Gradle',
            '.md': 'Markdown',
            '.py': 'Python',
            '.js': 'JavaScript',
            '.ts': 'TypeScript',
            '.html': 'HTML',
            '.css': 'CSS',
            '.scss': 'SCSS',
            '.less': 'LESS',
            '.sql': 'SQL',
            '.go': 'Go',
            '.rb': 'Ruby',
            '.php': 'PHP',
            '.cs': 'C#',
            '.swift': 'Swift',
            '.kt': 'Kotlin',
            
        }

    def scan_directory(self, base_path: str) -> Dict:
        """
        Recursively scan a directory and return all source files
        """
        if not os.path.exists(base_path):
            return {
                'status': 'error',
                'message': f'Directory not found: {base_path}'
            }

        try:
            files_content = {}
            ignored_dirs = {'target', 'build', 'out', '.git', '.idea', 'node_modules'}
            
            for root, dirs, files in os.walk(base_path):
                # Skip ignored directories
                dirs[:] = [d for d in dirs if d not in ignored_dirs]
                
                for file in files:
                    file_path = os.path.join(root, file)
                    _, ext = os.path.splitext(file)
                    
                    if ext in self.supported_extensions:
                        try:
                            with open(file_path, 'r', encoding='utf-8') as f:
                                content = f.read()
                                if content.strip():  # Only include non-empty files
                                    relative_path = os.path.relpath(file_path, base_path)
                                    files_content[relative_path] = {
                                        'content': content,
                                        'language': self.supported_extensions[ext],
                                        'path': relative_path,
                                        'size': len(content)
                                    }
                        except Exception as e:
                            print(f"Error reading file {file_path}: {str(e)}")
                            continue

            # Format the response
            return {
                'status': 'success',
                'files': [
                    {
                        'path': file_info['path'],
                        'language': file_info['language'],
                        'content': file_info['content'],
                        'size': file_info['size']
                    }
                    for file_info in files_content.values()
                ],
                'summary': {
                    'languages': self._count_languages(files_content),
                    'total_files': len(files_content),
                    'file_types': self._count_file_types(files_content)
                }
            }

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

    def _count_file_types(self, files_content: Dict) -> Dict:
        """Count files by extension"""
        type_count = {}
        for file_path in files_content.keys():
            _, ext = os.path.splitext(file_path)
            type_count[ext] = type_count.get(ext, 0) + 1
        return type_count