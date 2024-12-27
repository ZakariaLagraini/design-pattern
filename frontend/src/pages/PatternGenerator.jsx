import { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function PatternGenerator() {
  // const [basePath, setBasePath] = useState('C:/Users/pc/Desktop/project/design-pattern/');
  const [basePath, setBasePath] = useState('C:/Users/MSI/Desktop/project/design-pattern/');
  const [projectPath, setProjectPath] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleFolderPick = async () => {
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.webkitdirectory = true;
      input.directory = true;
      
      input.onchange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
          const selectedFolder = files[0].webkitRelativePath.split('/')[0];
          const projectFullPath = basePath + selectedFolder;
          
          console.log('Project path:', projectFullPath);
          
          const fileStructure = {};
          files.forEach(file => {
            const relativePath = file.webkitRelativePath;
            fileStructure[relativePath] = {
              name: file.name,
              path: basePath + relativePath,
              size: file.size,
              type: file.type
            };
          });
          
          setProjectPath(projectFullPath);
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

  const handleSaveGeneration = async () => {
    if (!analysis) return;

    const newGeneration = {
      id: Date.now(), // Simple way to generate unique IDs
      project_path: projectPath,
      timestamp: new Date().toISOString(),
      analysis_result: analysis
    };

    // Get existing generations from localStorage
    const existingGenerations = JSON.parse(localStorage.getItem('generations') || '[]');
    
    // Add new generation
    const updatedGenerations = [...existingGenerations, newGeneration];
    
    // Save to localStorage
    localStorage.setItem('generations', JSON.stringify(updatedGenerations));
    
    // Show success message
    toast.success('Generation saved successfully!');
    
    // Navigate to catalog
    navigate('/catalog');
  };

  useEffect(() => {
    if (analysis) {
      console.log('Analysis data:', analysis);
    }
  }, [analysis]);

  return (
    <div className="container mx-auto px-4 py-8">
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

        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-red-500">{error}</div>}

        {analysis?.analysis?.analysis && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Framework Detection</h2>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-lg font-semibold text-gray-800">
                    Framework: {analysis.analysis.analysis.framework_detection.name}
                  </p>
                  <p className="text-md text-gray-600">
                    Confidence: {analysis.analysis.analysis.framework_detection.confidence}
                  </p>
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-700">Key Files:</h3>
                    <ul className="list-disc pl-5">
                      {analysis.analysis.analysis.framework_detection.key_files?.map((file, index) => (
                        <li key={index} className="py-2 text-sm text-gray-600">{file}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Code Structure Analysis</h2>
                <div className="bg-white rounded-lg p-4">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Main Components:</h3>
                    <ul className="space-y-2">
                      {analysis.analysis.analysis.code_structure.main_components?.map((component, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start">
                          <svg className="w-5 h-5 text-purple-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {component}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Weaknesses:</h3>
                    <ul className="space-y-2">
                      {analysis.analysis.analysis.code_structure.weaknesses?.map((weakness, index) => (
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
                <h2 className="text-2xl font-bold text-white mb-4">Suggested Design Patterns</h2>
                <div className="space-y-4">
                  {analysis.analysis.analysis.suggested_design_patterns?.map((pattern, index) => (
                    <div key={index} className="bg-white rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{pattern.name}</h3>
                          <p className="text-sm text-gray-600">Type: {pattern.type}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          pattern.priority === 'High' ? 'bg-red-100 text-red-800' :
                          pattern.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {pattern.priority} Priority
                        </span>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-semibold text-gray-700">Target Files:</p>
                        <ul className="list-disc pl-5">
                          {pattern.target_files?.map((file, fileIndex) => (
                            <li key={fileIndex} className="text-sm text-gray-600">{file}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-semibold text-gray-700">Implementation:</p>
                        <p className="text-sm text-gray-600 mt-1">{pattern.implementation.description}</p>
                        <pre className="mt-2 p-3 bg-gray-100 rounded-lg text-sm overflow-x-auto">
                          <code>{pattern.implementation.example}</code>
                        </pre>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {analysis?.analysis?.analysis && (
          <div className="relative mt-4">
            <div className="flex justify-end">
              <button
                onClick={handleSaveGeneration}
                disabled={isSaving}
                className="btn-primary flex items-center space-x-2 shadow-lg hover:shadow-xl transition-shadow"
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    <span>Save Generation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 