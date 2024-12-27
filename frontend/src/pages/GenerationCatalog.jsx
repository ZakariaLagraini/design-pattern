import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

export default function GenerationCatalog() {
  const [generations, setGenerations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch generations from local storage
    const storedGenerations = JSON.parse(localStorage.getItem('generations')) || [];
    // Filter out any malformed data
    const validGenerations = storedGenerations.filter(gen => 
      gen && 
      gen.project_path && 
      gen.framework_detection &&
      gen.suggested_design_patterns
    );
    setGenerations(validGenerations);
  }, []);

  const handleViewDetails = (generation) => {
    localStorage.setItem('selectedGeneration', JSON.stringify(generation));
    navigate(`/generator/${generation.id}`);
  };

  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this generation?')) {
      try {
        const updatedGenerations = [...generations];
        updatedGenerations.splice(index, 1);
        setGenerations(updatedGenerations);
        localStorage.setItem('generations', JSON.stringify(updatedGenerations));
        toast.success('Generation deleted successfully');
      } catch (error) {
        console.error('Error deleting generation:', error);
        toast.error('Failed to delete generation');
      }
    }
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

      {generations.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No generations found. Create a new generation to get started.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {generations.map((generation, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {generation.project_path ? generation.project_path.split('/').pop() : 'Unnamed Project'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {generation.analysis_timestamp ? 
                        new Date(generation.analysis_timestamp).toLocaleString() : 
                        'No timestamp'
                      }
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(index);
                    }}
                    className="text-red-500 hover:text-red-700 transition-colors"
                    title="Delete Generation"
                  >
                    <svg 
                      className="h-5 w-5" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                      />
                    </svg>
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="text-sm">
                    <span className="font-semibold">Framework: </span>
                    {generation.framework_detection?.name || 'Unknown'}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Patterns Found: </span>
                    {generation.suggested_design_patterns?.length || 0}
                  </div>
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold mb-2">Suggested Patterns:</h3>
                    <div className="flex flex-wrap gap-2">
                      {generation.suggested_design_patterns?.map((pattern, index) => (
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
                      )) || <span className="text-gray-500">No patterns found</span>}
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
      )}
    </div>
  );
} 