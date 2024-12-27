import { useState } from 'react';
import axiosInstance from '../utils/axios';
import { FolderIcon } from '@heroicons/react/24/outline';

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
          // Construct the full path
          const fullPath = `C:/Users/pc/Desktop/lchgar-micro/design-pattern/${files[0].webkitRelativePath.split('/')[0]}`;
          const normalizedPath = fullPath.replace(/\\/g, '/');
          console.log('Selected folder path:', normalizedPath);
          
          setProjectPath(normalizedPath);
          setSelectedFiles(files);
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
      
      if (!projectPath) {
        setError('Please select a folder first');
        return;
      }

      // Ensure path ends with forward slash
      const normalizedPath = projectPath.endsWith('/') 
        ? projectPath 
        : `${projectPath}/`;
      
      const payload = {
        project_path: normalizedPath,
        source_dir: "src",
        scan_type: "full"
      };

      console.log('Sending request with payload:', payload);

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
        console.log('Error response:', err.response.data);
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Design Pattern Generator
        </h1>

        <div className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FolderIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={projectPath}
                readOnly
                placeholder="Select your project folder..."
                className="block w-full rounded-lg border-gray-300 pl-10 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                onClick={handleFolderPick}
                type="button"
                className="absolute inset-y-0 right-0 px-3 flex items-center bg-gray-50 hover:bg-gray-100 rounded-r-lg border-l border-gray-300"
              >
                Browse
              </button>
            </div>
            <button
              onClick={handleAnalyze}
              disabled={loading || !projectPath}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed min-w-[150px]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing...
                </div>
              ) : (
                'Generate Patterns'
              )}
            </button>
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
          <p className="mt-2 text-sm text-gray-500">
            Select the root folder of your project containing the 'src' directory
          </p>
        </div>

        {analysis && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Analysis Results</h2>
              <pre className="bg-gray-50 p-4 rounded-lg overflow-auto">
                {JSON.stringify(analysis, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 