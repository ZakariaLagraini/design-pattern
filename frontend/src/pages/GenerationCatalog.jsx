import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

export default function GenerationCatalog() {
  const [generations, setGenerations] = useState([
    // Adding some static data for testing
    {
      id: 1,
      project_path: 'C:/Users/pc/Desktop/project/design-pattern/test-project',
      timestamp: new Date().toISOString(),
      analysis_result: {
        analysis: {
          analysis: {
            framework_detection: {
              name: 'Spring Boot',
              confidence: 'High'
            },
            suggested_design_patterns: [
              {
                name: 'Dependency Injection',
                type: 'Structural',
                priority: 'High'
              },
              {
                name: 'Strategy Pattern',
                type: 'Behavioral',
                priority: 'Medium'
              }
            ]
          }
        }
      }
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this generation?')) return;
    setGenerations(generations.filter(gen => gen.id !== id));
  };

  const handleViewDetails = (generation) => {
    // Store the generation details in localStorage
    localStorage.setItem('selectedGeneration', JSON.stringify(generation));
    navigate(`/generator/${generation.id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Generation Catalog</h1>
        <button
          onClick={() => navigate('/generator')}
          className="btn-primary"
        >
          New Generation
        </button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {generations.map((generation) => (
          <div key={generation.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {generation.project_path.split('/').pop()}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {new Date(generation.timestamp).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(generation.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-2">
                <div className="text-sm">
                  <span className="font-semibold">Framework: </span>
                  {generation.analysis_result.analysis.analysis.framework_detection.name}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Patterns Found: </span>
                  {generation.analysis_result.analysis.analysis.suggested_design_patterns.length}
                </div>
                <div className="mt-4">
                  <h3 className="text-sm font-semibold mb-2">Suggested Patterns:</h3>
                  <div className="flex flex-wrap gap-2">
                    {generation.analysis_result.analysis.analysis.suggested_design_patterns.map((pattern, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded-full text-xs ${
                          pattern.priority === 'High' ? 'bg-red-100 text-red-800' :
                          pattern.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}
                      >
                        {pattern.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleViewDetails(generation)}
                className="mt-4 w-full btn-primary"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 