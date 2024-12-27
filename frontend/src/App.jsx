import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import PatternGenerator from './pages/PatternGenerator';
import ChatBot from './components/ChatBot';
import GenerationCatalog from './pages/GenerationCatalog';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/generator" element={<PatternGenerator />} />
            <Route path="/catalog" element={<GenerationCatalog />} />
          </Routes>
          <ChatBot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
