import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function Register() {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      if (!userData.email || !userData.password) {
        setError('Please fill in all fields');
        return;
      }
      if (userData.password !== userData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (userData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      await register(userData);
      setSuccess('Inscription réussie ! Veuillez vous connecter.');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Un compte existe déjà avec cette adresse email. Veuillez vous connecter ou utiliser une autre adresse.');
      } else {
        setError(err.response?.data?.message || 'Une erreur est survenue lors de l\'inscription.');
      }
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
              <p className="font-medium">Registration Error</p>
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
              <p className="font-medium">Succès</p>
              <p>{success}</p>
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="input-field pl-10"
                  placeholder="you@example.com"
                  value={userData.email}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="input-field pl-10"
                  placeholder="••••••••"
                  value={userData.password}
                  onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  className="input-field pl-10"
                  placeholder="••••••••"
                  value={userData.confirmPassword}
                  onChange={(e) => setUserData({ ...userData, confirmPassword: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div>
            <button type="submit" className="btn-primary w-full flex justify-center items-center gap-2">
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}