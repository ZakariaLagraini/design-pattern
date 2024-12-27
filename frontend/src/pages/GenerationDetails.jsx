import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function GenerationDetails() {
  const [generation, setGeneration] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const selectedGeneration = JSON.parse(localStorage.getItem('selectedGeneration'));
    if (!selectedGeneration) {
      navigate('/catalog');
      return;
    }
    setGeneration(selectedGeneration);
  }, [id, navigate]);

  if (!generation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Generation Details</h1>
          <button
            onClick={() => navigate('/catalog')}
            className="btn-primary"
          >
            Back to Catalog
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          {/* Project Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Project Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Project Path</p>
                <p className="text-gray-900">{generation.project_path}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Analysis Timestamp</p>
                <p className="text-gray-900">
                  {new Date(generation.analysis_timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Framework Detection */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Framework Detection</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900">
                <span className="font-medium">Framework: </span>
                {generation.framework_detection.name}
              </p>
              <p className="text-gray-600 mt-2">
                <span className="font-medium">Confidence: </span>
                {generation.framework_detection.confidence}%
              </p>
            </div>
          </div>

          {/* Design Patterns */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Suggested Design Patterns</h2>
            <div className="space-y-4">
              {generation.suggested_design_patterns.map((pattern, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{pattern.name}</h3>
                      <p className="text-sm text-gray-500">{pattern.type}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                      ${pattern.priority === 'High' ? 'bg-red-100 text-red-800' :
                        pattern.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'}`}>
                      {pattern.priority} Priority
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600">{pattern.implementation.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Target Files</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        {pattern.target_files.map((file, fileIndex) => (
                          <li key={fileIndex}>{file}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Implementation Example</h4>
                      <pre className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
                        <code>{pattern.implementation.example}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 