# Design Pattern Generator - API Documentation

## Project Overview
The **Design Pattern Generator** is a comprehensive microservices-based application that helps developers identify and implement design patterns in their code. The system consists of multiple services:

- **User Management Service**: Handles authentication and user operations.
- **Design Pattern Catalog Service**: Manages the catalog of design patterns.
- **Recommendation Engine Service**: Provides pattern recommendations based on user interactions and code analysis.
- **AI Helper Service**: Integrates with Google's Gemini API for intelligent pattern suggestions.
- **API Gateway**: Routes requests to appropriate services.

---

## API Endpoints

### User Management Service
| Method | Path                | Description                | User Authenticated | Available from UI |
|--------|---------------------|----------------------------|--------------------|-------------------|
| POST   | /auth/register      | Register a new user        |                    | ✗                 |
| POST   | /auth/login         | Authenticate user and get token |               | ✗                 |
| GET    | /auth/user/{id}     | Get user details           | ✓                  | ✗                 |
| PUT    | /auth/user/{id}     | Update user information    | ✓                  | ✗                 |
| DELETE | /auth/user/{id}     | Delete user account        | ✓                  | ✗                 |

### Design Pattern Catalog Service
| Method | Path                | Description                | User Authenticated | Available from UI |
|--------|---------------------|----------------------------|--------------------|-------------------|
| GET    | /patterns           | Get all design patterns    |                    | ✗                 |
| GET    | /patterns/{id}      | Get specific pattern details |                  | ✗                 |
| POST   | /patterns           | Add new design pattern     | ✓                  | ✗                 |

### Recommendation Engine Service
| Method | Path                                       | Description                         | User Authenticated | Available from UI |
|--------|-------------------------------------------|-------------------------------------|--------------------|-------------------|
| GET    | /recommendations/{userId}                 | Get recommendations for user        | ✓                  | ✗                 |
| GET    | /recommendations                          | Get all recommendations             | ✓                  | ✗                 |
| POST   | /recommendations/interactions/{userId}/{patternId} | Record user interaction            | ✓                  | ✗                 |
| POST   | /recommendations/gemini                   | Get AI-powered recommendations      | ✓                  | ✗                 |

### AI Helper Service
| Method | Path                | Description                          | User Authenticated | Available from UI |
|--------|---------------------|--------------------------------------|--------------------|-------------------|
| POST   | /api/chat/ask       | Get AI assistance for pattern implementation | ✓           | ✗                 |

---

## Frontend Features
The application includes a modern React-based frontend with:

- **Responsive design** using Tailwind CSS.
- **User authentication flow**.
- **Pattern generator interface** with code upload/paste functionality.
- **Interactive chatbot** for pattern assistance.
- **Dashboard** for managing patterns and recommendations.

### Example Code Component
```javascript
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

  const handleAnalyze = () => {
    setShowPreview(false);
    setPatterns([
      {
        name: 'Singleton Pattern',
        confidence: 90,
        implementation: `class Singleton { ... }`,
        description: 'Ensures a class has only one instance.',
      },
    ]);
  };

  return (
    <div className="app-container">
      <h1>Design Pattern Generator</h1>
      {/* UI Logic */}
    </div>
  );
}
```
## Architecture
The system follows a microservices architecture with:

- **Service Registry** for service discovery.
- **API Gateway** for request routing.
- **JWT-based authentication**.
- **PostgreSQL databases** for persistent storage.
- **Integration with Google's Gemini AI API**.

---

## Security
- **BCrypt password encryption**.
- **JWT token-based authentication**.
- Protected API endpoints with proper **CORS configuration**.

---

## Development Setup

### Install Dependencies
```bash
# Backend services (each service directory)
./mvnw clean install

# Frontend
cd frontend
npm install
```

### Configure Environment Variables
- **Database connections**: Set up the connection strings for your PostgreSQL databases.
- **JWT secret**: Define a secure secret for JWT-based authentication.
- **Gemini API key**: Configure the API key for integration with Google's Gemini AI API.
- **Service URLs**: Specify the URLs for each microservice.

---

### Run Services
```bash
# Backend services
./mvnw spring-boot:run

# Frontend
npm run dev
```

## CI/CD Pipeline
The project includes GitHub Actions workflows for:

- **Automated testing**
- **Code quality analysis** with SonarCloud
- **Docker image building**
- **Container registry publishing**

### Example Workflow Configuration
```yaml
- name: Build and Analyze User Management Service
  env:
    SPRING_DATASOURCE_URL: jdbc:postgresql://localhost:5432/user_db
    SPRING_DATASOURCE_USERNAME: postgres
  run: |
    ./mvnw verify org.sonarsource.scanner.maven:sonar-maven-plugin:sonar \
      -Dsonar.projectKey=design-pattern_user-management
```

## Technologies Used

### Backend
- **Spring Boot**
- **Spring Cloud**
- **Spring Security**
- **JPA**

### Frontend
- **React**
- **Tailwind CSS**
- **Axios**

### Database
- **PostgreSQL**

### AI Integration
- **Google Gemini API**

### Tools
- **Docker**
- **Maven**
- **npm**

### CI/CD
- **GitHub Actions**
- **SonarCloud**

