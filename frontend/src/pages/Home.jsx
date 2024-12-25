import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Design Pattern Generator
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Upload your code and discover the design patterns that best fit your project.
            Optimize your architecture with AI-powered suggestions.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {user ? (
              <Link to="/generator" className="btn-primary">
                Start Generating
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary">
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Sign in <span aria-hidden="true">→</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 