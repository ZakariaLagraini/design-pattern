const DESIGN_PATTERNS = [
  { title: "Singleton pattern", category: "Creational" },
  { title: "Factory method pattern", category: "Creational" },
  { title: "Abstract factory pattern", category: "Creational" },
  { title: "Builder pattern", category: "Creational" },
  { title: "Prototype pattern", category: "Creational" },
  { title: "Adapter pattern", category: "Structural" },
  { title: "Bridge pattern", category: "Structural" },
  { title: "Composite pattern", category: "Structural" },
  { title: "Decorator pattern", category: "Structural" },
  { title: "Facade pattern", category: "Structural" },
  { title: "Observer pattern", category: "Behavioral" },
  { title: "Strategy pattern", category: "Behavioral" },
  { title: "Command pattern", category: "Behavioral" },
  { title: "State pattern", category: "Behavioral" },
  { title: "Template method pattern", category: "Behavioral" }
];

export const getDesignPatterns = async () => {
  try {
    const patterns = await Promise.all(
      DESIGN_PATTERNS.map(async (pattern) => {
        const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${encodeURIComponent(pattern.title)}&exintro=1&explaintext=1&origin=*`;
        
        const response = await fetch(url);
        const data = await response.json();
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        const extract = pages[pageId].extract;

        return {
          id: pageId,
          name: pattern.title.replace(' pattern', ''),
          category: pattern.category,
          description: extract,
          useCase: null,
          examples: null,
          pros: null,
          cons: null
        };
      })
    );

    return patterns;
  } catch (error) {
    console.error('Error fetching design patterns:', error);
    throw error;
  }
};

export const getPatternDetails = async (patternTitle) => {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=${encodeURIComponent(patternTitle)}&explaintext=1&origin=*`;
    
    const response = await fetch(url);
    const data = await response.json();
    const pages = data.query.pages;
    const pageId = Object.keys(pages)[0];
    
    return {
      id: pageId,
      content: pages[pageId].extract
    };
  } catch (error) {
    console.error('Error fetching pattern details:', error);
    throw error;
  }
}; 