import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

export default function PatternGenerator() {
  const [basePath, setBasePath] = useState('C:/Users/pc/Desktop/project/design-pattern/');
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
          
          console.log('Selected folder path:', fullPath);
          
          const fileStructure = {};
          files.forEach(file => {
            const relativePath = file.webkitRelativePath.replace(fullPath + '/', '');
            fileStructure[relativePath] = {
              name: file.name,
              path: basePath + relativePath,
              size: file.size,
              type: file.type
            };
          });
          
          setProjectPath(basePath + fullPath);
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
        base_path: basePath,
        files: selectedFiles,
        scan_type: 'full'
      };

      console.log('Sending payload:', payload);

      const response = await axiosInstance.post('/analyze/', payload);
      console.log('Received response:', response.data);

      if (response.data && response.data.status === 'success') {
        setAnalysis(response.data);
      } else {
        setError('No analysis data received from server');
      }
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.response?.data?.message || 'Failed to analyze project');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (analysis) {
      console.log('Analysis data:', analysis);
    }
  }, [analysis]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Design Pattern Generator
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="mb-4">
            <label htmlFor="basePath" className="block text-sm font-medium text-gray-700 mb-2">
              Base Project Path
            </label>
            <input
              type="text"
              id="basePath"
              value={basePath}
              onChange={(e) => setBasePath(e.target.value)}
              className="input-field w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleFolderPick}
              className="btn-primary flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              Select Project Folder
            </button>
            {selectedFiles && (
              <button
                onClick={handleAnalyze}
                className="btn-primary flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                disabled={loading}
              >
                {loading ? 'Analyzing...' : 'Generate Patterns'}
              </button>
            )}
          </div>

          {projectPath && (
            <p className="mt-4 text-sm text-gray-600">
              Selected project: {projectPath}
            </p>
          )}
        </div>

        {analysis?.analysis?.analysis && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Framework Detection
                </h2>
                <div className="bg-white rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-semibold text-gray-900">
                      {analysis.analysis.analysis.framework_detection.name}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {analysis.analysis.analysis.framework_detection.confidence} Confidence
                    </span>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-900">Key Files:</h3>
                    <ul className="mt-2 divide-y divide-gray-200">
                      {analysis.analysis.analysis.framework_detection.key_files.map((file, index) => (
                        <li key={index} className="py-2 text-sm text-gray-600">
                          {file}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Code Structure Analysis
                </h2>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Main Components</h3>
                    <ul className="space-y-2">
                      {analysis.analysis.analysis.code_structure.main_components.map((component, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <svg className="w-5 h-5 text-purple-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {component}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Areas for Improvement</h3>
                    <ul className="space-y-2">
                      {analysis.analysis.analysis.code_structure.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <svg className="w-5 h-5 text-yellow-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          {weakness}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Suggested Design Patterns
                </h2>
                <div className="space-y-4">
                  {analysis.analysis.analysis.suggested_patterns.map((pattern, index) => (
                    <div key={index} className="bg-white rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{pattern.name}</h3>
                        <div className="flex space-x-2">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {pattern.type}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            pattern.priority === 'High' ? 'bg-red-100 text-red-800' :
                            pattern.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {pattern.priority} Priority
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{pattern.implementation.description}</p>
                      <div className="bg-gray-50 rounded-md p-4">
                        <pre className="text-sm text-gray-800 overflow-x-auto">
                          <code>{pattern.implementation.example}</code>
                        </pre>
                      </div>
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-900">Target Files:</h4>
                        <ul className="mt-1 space-y-1">
                          {pattern.target_files.map((file, fileIndex) => (
                            <li key={fileIndex} className="text-sm text-gray-600 flex items-center">
                              <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                              {file}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 