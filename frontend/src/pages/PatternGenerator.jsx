import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  DocumentIcon, 
  CodeBracketIcon, 
  ClipboardIcon, 
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

export default function PatternGenerator() {
  const [code, setCode] = useState('');
  const [patterns, setPatterns] = useState(null);
  const [activeTab, setActiveTab] = useState('upload');
  const [showPreview, setShowPreview] = useState(false);

  const onDrop = async (acceptedFiles) => {
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
    setShowPreview(false);
    // Simulate pattern analysis
    setPatterns([
      { 
        name: 'Singleton Pattern',
        confidence: 90,
        implementation: `class Singleton {
  private static instance: Singleton;
  
  private constructor() {}
  
  public static getInstance(): Singleton {
    if (!Singleton.instance) {
      Singleton.instance = new Singleton();
    }
    return Singleton.instance;
  }
}`,
        description: 'Ensures a class has only one instance and provides a global point of access to it.'
      },
      { 
        name: 'Factory Pattern',
        confidence: 85,
        implementation: `interface Product {}

class ConcreteProductA implements Product {}
class ConcreteProductB implements Product {}

class Factory {
  createProduct(type: string): Product {
    switch(type) {
      case 'A':
        return new ConcreteProductA();
      case 'B':
        return new ConcreteProductB();
      default:
        throw new Error('Invalid product type');
    }
  }
}`,
        description: 'Creates objects without exposing the instantiation logic to the client.'
      },
    ]);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const downloadCode = (code, filename) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
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
            <>
              <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
                transition-colors duration-200 ease-in-out
                ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}`}>
                <input {...getInputProps()} />
                <DocumentIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm font-medium text-gray-900">
                  Drop your code files here, or click to browse
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  Supports: .js, .jsx, .ts, .tsx, .java, .py, .cpp, .c, .cs
                </p>
              </div>
              {code && (
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setShowPreview(true)}
                    className="inline-flex items-center px-4 py-2 text-sm text-primary-600 hover:text-primary-700"
                  >
                    <EyeIcon className="h-5 w-5 mr-2" />
                    Preview Code
                  </button>
                  <button
                    onClick={handleAnalyze}
                    className="btn-primary"
                  >
                    Generate Patterns
                  </button>
                </div>
              )}
            </>
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
              {code && (
                <div className="flex justify-end">
                  <button
                    onClick={handleAnalyze}
                    className="btn-primary"
                  >
                    Generate Patterns
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Code Preview */}
          {showPreview && code && (
            <div className="mt-8 space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Code Preview</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="overflow-x-auto font-mono text-sm">
                  {code}
                </pre>
              </div>
            </div>
          )}

          {/* Results Section */}
          {patterns && (
            <div className="mt-8 space-y-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Suggested Design Patterns
              </h2>
              <div className="bg-white rounded-lg shadow divide-y divide-gray-200">
                {patterns.map((pattern, index) => (
                  <div key={index} className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900">
                        {pattern.name}
                      </h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${pattern.confidence >= 90 
                          ? 'bg-green-100 text-green-800'
                          : pattern.confidence >= 80
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {pattern.confidence}% Match
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{pattern.description}</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-end space-x-4 mb-2">
                        <button
                          onClick={() => copyToClipboard(pattern.implementation)}
                          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                        >
                          <ClipboardIcon className="h-4 w-4 mr-1" />
                          Copy
                        </button>
                        <button
                          onClick={() => downloadCode(pattern.implementation, `${pattern.name.toLowerCase().replace(' ', '_')}.ts`)}
                          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      </div>
                      <pre className="overflow-x-auto font-mono text-sm">
                        {pattern.implementation}
                      </pre>
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