import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { DocumentIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

export default function PatternGenerator() {
  const [code, setCode] = useState('');
  const [patterns, setPatterns] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'paste'

  const onDrop = async (acceptedFiles) => {
    // Handle file upload (static for now)
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setCode(e.target.result);
    };
    reader.readAsText(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'text/plain': ['.txt', '.js', '.jsx', '.ts', '.tsx', '.java', '.py', '.cpp', '.c', '.cs'],
    }
  });

  const handleAnalyze = () => {
    // Simulate pattern analysis
    setPatterns([
      { name: 'Singleton Pattern', confidence: 90 },
      { name: 'Factory Pattern', confidence: 85 },
      { name: 'Observer Pattern', confidence: 75 },
    ]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Design Pattern Generator
        </h1>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('upload')}
              className={`${
                activeTab === 'upload'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex items-center whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              <DocumentIcon className="h-5 w-5 mr-2" />
              Upload Files
            </button>
            <button
              onClick={() => setActiveTab('paste')}
              className={`${
                activeTab === 'paste'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } flex items-center whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
            >
              <CodeBracketIcon className="h-5 w-5 mr-2" />
              Paste Code
            </button>
          </nav>
        </div>

        {/* Content Area */}
        <div className="space-y-6">
          {activeTab === 'upload' ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
                transition-colors duration-200 ease-in-out
                ${isDragActive 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-300 hover:border-primary-400'}`}
            >
              <input {...getInputProps()} />
              <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm font-medium text-gray-900">
                Drop your code files here, or click to browse
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Supports: .js, .jsx, .ts, .tsx, .java, .py, .cpp, .c, .cs
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-gray-300 shadow-sm">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Paste your code here..."
                  rows={15}
                  className="block w-full rounded-lg border-0 py-4 px-4 text-gray-900 font-mono text-sm
                    placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          )}

          {code && (
            <div className="flex justify-end">
              <button
                onClick={handleAnalyze}
                className="btn-primary flex items-center gap-2"
              >
                Analyze Patterns
              </button>
            </div>
          )}

          {/* Results Section */}
          {patterns && (
            <div className="mt-8 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Detected Patterns
              </h2>
              <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
                {patterns.map((pattern, index) => (
                  <div key={index} className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {pattern.name}
                      </h3>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">
                          Confidence:
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${pattern.confidence >= 90 
                            ? 'bg-green-100 text-green-800'
                            : pattern.confidence >= 80
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {pattern.confidence}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 