# Design Pattern Generator - API Documentation

![Microservices Architecture](assets/Architecture%20of%20our%20microservice.png)

## Project Overview
The **Design Pattern Generator** is a comprehensive microservices-based application that helps developers identify and implement design patterns in their code. The system consists of multiple services:

- **User Management Service**: Handles authentication and user operations.
- **Design Pattern Catalog Service**: Manages the catalog of design patterns.
- **Recommendation Engine Service**: Provides pattern recommendations based on user interactions and code analysis.
- **AI Helper Service**: Integrates with Google's Gemini API for intelligent pattern suggestions.
- **API Gateway**: Routes requests to appropriate services.

---

## APIs Endpoints

### User Management Service
| Method | Path                | Description                | User Authenticated | Available from UI |
|--------|---------------------|----------------------------|--------------------|-------------------|
| POST   | /auth/register      | Register a new user        | ✓                  | ✓                 |
| POST   | /auth/login         | Authenticate user and get token | ✓               | ✓                 |
| GET    | /auth/user/{id}     | Get user details           | ✓                  | ✓                 |
| PUT    | /auth/user/{id}     | Update user information    | ✓                  | ✓                 |
| DELETE | /auth/user/{id}     | Delete user account        | ✓                  | ✓                 |

---

### Design Pattern Catalog Service
| Method | Path                | Description                | User Authenticated | Available from UI |
|--------|---------------------|----------------------------|--------------------|-------------------|
| GET    | /patterns           | Get all design patterns    | ✓                  | ✓                 |
| GET    | /patterns/{id}      | Get specific pattern details | ✓                | ✓                 |
| POST   | /patterns           | Add new design pattern     | ✓                  | ✓                 |

---

### Recommendation Engine Service
| Method | Path                                       | Description                         | User Authenticated | Available from UI |
|--------|-------------------------------------------|-------------------------------------|--------------------|-------------------|
| GET    | /recommendations/{userId}                 | Get recommendations for user        | ✓                  | ✓                 |
| GET    | /recommendations                          | Get all recommendations             | ✓                  | ✓                 |
| POST   | /recommendations/interactions/{userId}/{patternId} | Record user interaction            | ✓                  | ✓                 |
| POST   | /recommendations/gemini                   | Get AI-powered recommendations      | ✓                  | ✓                 |

---

### AI Helper Service
| Method | Path                | Description                          | User Authenticated | Available from UI |
|--------|---------------------|--------------------------------------|--------------------|-------------------|
| POST   | /api/chat/ask       | Get AI assistance for pattern implementation | ✓           | ✓                 |

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

## Detailed Services Description

### 1. API Gateway (Port: 8080)
- **Entry point for all client requests**
- Routes requests to appropriate microservices
- Handles cross-cutting concerns:
    - **Authentication**
    - **Request logging**
    - **Rate limiting**
    - **CORS configuration**

#### Configuration
```yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-management-service
          uri: lb://user-management-service
          predicates:
            - Path=/auth/**
        - id: catalog-service
          uri: lb://design-pattern-catalog-service
          predicates:
            - Path=/patterns/**
        - id: recommendation-service
          uri: lb://recommendation-engine-service
          predicates:
            - Path=/recommendations/**
        - id: ai-service
          uri: lb://ai-helper-service
          predicates:
            - Path=/ai/**
```

### 2. User Management Service (Port: 8081)
- **Handles user authentication and authorization**
- **Manages user profiles and preferences**
- **Implements JWT-based security**

#### Key Features
- User registration and login
- Password encryption with BCrypt
- JWT token generation and validation
- User profile management

---

### 3. Design Pattern Catalog Service (Port: 8082)
- **Maintains the catalog of design patterns**
- **Provides pattern details and implementations**

#### Categories
- **Creational Patterns**
- **Structural Patterns**
- **Behavioral Patterns**

#### Database Schema
- Design pattern historique
- Implementation examples

---

### 4. Recommendation Engine Service (Port: 8083)
- **Analyzes code and suggests appropriate patterns**
- **Uses machine learning for pattern matching**
- **Tracks user interactions for personalized recommendations**

#### Features
- Code analysis
- Pattern matching algorithms
- User interaction history
- Personalized recommendations
- Integration with AI service

---

### 5. AI Helper Service (Port: 8084)
- **An intelligent chatbot that:**
    - Provides AI-powered pattern suggestions
    - Helps with pattern implementation

#### Configuration
```properties
gemini.api.key=YOUR_API_KEY
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
```

## Frontend Architecture

### Technology Stack
- **React 18**
- **Vite**
- **Tailwind CSS**
- **React Router v6**
- **Axios for API calls**

---

## Database Architecture

### User Database
- User profiles
- Authentication data
- User preferences

### Pattern Catalog Database
- Design pattern historique
- Implementation examples

### Recommendation Database
- User interactions
- Pattern usage statistics
- Recommendation history

---

## Security Implementation

### 1. JWT Authentication
```java
public class JwtTokenProvider {
    private final String secretKey;
    private final long validityInMilliseconds;

    public String createToken(String username) {
        // Token generation logic
    }

    public boolean validateToken(String token) {
        // Token validation logic
    }
}
```
### 2. Password Encryption
```java
@Configuration
public class SecurityConfig {
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
```

## Deployment

### Docker Containers
```yaml
version: '3.8'
services:
  api-gateway:
    build: ./api-gateway
    ports:
      - "8080:8080"
    
  user-service:
    build: ./user-management-service
    ports:
      - "8081:8081"
    
  pattern-service:
    build: ./design-pattern-catalog-service
    ports:
      - "8082:8082"
    
  # Other services...
```

## CI/CD Pipeline
- **GitHub Actions workflow**
- **Automated testing**
- **Code quality checks**
- **Docker image building**
- **Container registry publishing**

---

## Monitoring and Logging
- **Spring Boot Actuator for metrics**
- **Centralized logging with ELK Stack**
- **Performance monitoring**
- **Error tracking**

---

## Future Enhancements

### Pattern Analysis
- Enhanced AI integration
- More accurate pattern matching
- Support for more programming languages

### User Experience
- Interactive pattern visualization
- Code generation improvements
- Pattern comparison tools

### Integration
- IDE plugins
- Git repository analysis
- Team collaboration features

---

## Contributing
1. Fork the repository.
2. Create your feature branch.
3. Commit your changes.
4. Push to the branch.
5. Create a Pull Request.

---

## License
This project is licensed under the MIT License - see the `LICENSE.md` file for details.
