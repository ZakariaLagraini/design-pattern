import { useState } from 'react';
import axiosInstance from '../utils/axios';

const BASE_PATH = 'C:/Users/pc/Desktop/project/design-pattern/';

export default function PatternGenerator() {
  const [projectPath, setProjectPath] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState(null);

  const handleFolderPick = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.webkitdirectory = true;
      input.directory = true;
      
      input.onchange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
          const fullPath = files[0].webkitRelativePath.split('/')[0];
          
          // Remove path validation since we can't actually check the full system path
          // due to browser security restrictions
          console.log('Selected folder path:', fullPath);
          
          // Create file structure object
          const fileStructure = {};
          files.forEach(file => {
            const relativePath = file.webkitRelativePath.replace(fullPath + '/', '');
            fileStructure[relativePath] = {
              name: file.name,
              path: BASE_PATH + relativePath,
              size: file.size,
              type: file.type
            };
          });
          
          setProjectPath(BASE_PATH + fullPath);
          setSelectedFiles(fileStructure);
          setError('');
        }
      };
      
      input.click();
    } catch (err) {
      console.error('Error selecting folder:', err);
      setError('Failed to select folder: ' + err.message);
    }
  };

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setError('');

      if (!selectedFiles) {
        setError('Please select a project folder first');
        return;
      }

      const payload = {
        project_path: projectPath,
        base_path: BASE_PATH,
        files: selectedFiles,
        scan_type: 'full'
      };

      console.log('Sending analysis request:', payload);

      const response = await axiosInstance.post('/analyze/', payload);

      if (response.data && response.data.analysis) {
        setAnalysis(response.data.analysis);
        console.log('Analysis response:', response.data);
      } else if (response.data && response.data.status === 'error') {
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Full error:', err);
      if (err.response?.data) {
        setError(err.response.data.message || 'Failed to analyze project');
      } else {
        setError('Failed to connect to the analysis server');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Pattern Generator
        </h1>

        <div className="space-y-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Please create your project in this directory:
                  <br />
                  <code className="text-xs bg-yellow-100 px-2 py-1 rounded">
                    {BASE_PATH}
                  </code>
                </p>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={handleFolderPick}
              className="btn-primary"
              disabled={loading}
            >
              Select Project Folder
            </button>
            {projectPath && (
              <p className="mt-2 text-sm text-gray-600">
                Selected folder: {projectPath}
              </p>
            )}
            {selectedFiles && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  {Object.keys(selectedFiles).length} files selected
                </p>
                <button
                  onClick={handleAnalyze}
                  className="btn-primary mt-2"
                  disabled={loading}
                >
                  {loading ? 'Analyzing...' : 'Generate Patterns'}
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            </div>
          )}

          {analysis && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
                {JSON.stringify(analysis, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 