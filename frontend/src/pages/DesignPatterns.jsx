import { useState, useEffect } from 'react';
import { getDesignPatterns, getPatternDetails } from '../services/designPatternService';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function DesignPatterns() {
  const [patterns, setPatterns] = useState([]);
  const [selectedPattern, setSelectedPattern] = useState(null);
  const [patternDetails, setPatternDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Creational', 'Structural', 'Behavioral'];

  useEffect(() => {
    fetchPatterns();
  }, []);

  useEffect(() => {
    if (selectedPattern) {
      fetchPatternDetails(selectedPattern.name + ' pattern');
    }
  }, [selectedPattern]);

  const fetchPatterns = async () => {
    try {
      setLoading(true);
      const data = await getDesignPatterns();
      const groupedPatterns = data.reduce((acc, pattern) => {
        const category = acc.find(c => c.category === pattern.category);
        if (category) {
          category.patterns.push(pattern);
        } else {
          acc.push({
            category: pattern.category,
            patterns: [pattern]
          });
        }
        return acc;
      }, []);
      setPatterns(groupedPatterns);
    } catch (err) {
      setError('Failed to load design patterns');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPatternDetails = async (patternTitle) => {
    try {
      const details = await getPatternDetails(patternTitle);
      setPatternDetails(details);
    } catch (err) {
      console.error('Error fetching pattern details:', err);
    }
  };

  const filteredPatterns = patterns.filter(category => 
    selectedCategory === 'All' || category.category === selectedCategory
  ).map(category => ({
    ...category,
    patterns: category.patterns.filter(pattern =>
      pattern.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.patterns.length > 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Design Patterns Documentation</h1>
        <p className="text-lg text-gray-600">
          Explore and learn about different software design patterns and their implementations.
        </p>
      </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search patterns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${selectedCategory === category
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-4">
          <nav className="space-y-1">
            {filteredPatterns.map((category) => (
              <div key={category.category} className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3 px-3">
                  {category.category} Patterns
                </h2>
                <ul className="space-y-1">
                  {category.patterns.map((pattern) => (
                    <li key={pattern.id}>
                      <button
                        onClick={() => setSelectedPattern(pattern)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors
                          ${selectedPattern?.id === pattern.id
                            ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-500'
                            : 'text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        {pattern.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Pattern Details */}
        <div className="lg:col-span-3">
          {selectedPattern ? (
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedPattern.name}</h2>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 mb-4">
                  {selectedPattern.category}
                </span>
                
                <div className="prose prose-lg max-w-none">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Overview</h3>
                    <p className="text-gray-600">{selectedPattern.description}</p>
                  </div>

                  {patternDetails && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Detailed Description</h3>
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-600 whitespace-pre-line">{patternDetails.content}</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 text-sm text-gray-500">
                    <p>Source: Wikipedia</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="max-w-md mx-auto">
                <h3 className="text-xl font-medium text-gray-900 mb-2">Select a Pattern</h3>
                <p className="text-gray-500">
                  Choose a design pattern from the sidebar to view its detailed documentation.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 