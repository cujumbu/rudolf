import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Snowflake } from 'lucide-react';
import { translations } from '../utils/translations';

const { common, auth } = translations;

export const LoginPage: React.FC = () => {
  const { user, signIn } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
    } catch (err) {
      setError(auth.invalidCredentials);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Snowflake className="h-16 w-16 text-[#D42D27]" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-[#2F4538]">
          Tidsregistrering af medarbejdere
        </h2>
        <p className="mt-2 text-center text-lg font-medium text-[#4A6FA5]">
          Rudolf.dk
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg rounded-lg sm:px-10 border border-[#E8ECF3]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#2F4538]">
                {common.email}
              </label>
              <input
                id="email"
                type="email"
                required
                className="input-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[#2F4538]">
                {common.password}
              </label>
              <input
                id="password"
                type="password"
                required
                className="input-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full btn-primary"
            >
              {auth.signIn}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};