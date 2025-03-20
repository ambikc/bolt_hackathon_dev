import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface RegisterProps {
  onClose?: () => void;
}

function Register({ onClose }: RegisterProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    githubUrl: '',
    linkedinUrl: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      // First, create the registration record
      const { error: registrationError } = await supabase
        .from('registrations')
        .insert([
          {
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            github_url: formData.githubUrl || null,
            linkedin_url: formData.linkedinUrl || null,
            active: false
          }
        ]);

      if (registrationError) throw registrationError;

      // Send confirmation email
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: crypto.randomUUID(), // Generate a random password as we'll use email confirmation only
        options: {
          emailRedirectTo: `${window.location.origin}/confirm`,
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName
          }
        }
      });

      if (signUpError) throw signUpError;
      
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStatus('error');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (status === 'success') {
    return (
      <div className="flex items-center justify-center">
        <div className="bg-slate-800/80 p-8 rounded-2xl max-w-md w-full backdrop-blur-sm border border-blue-500/20 shadow-xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Registration Complete</h1>
          <p className="text-gray-300 mb-8 text-center">
            Thank you for registering! We've sent a confirmation email with more details.
          </p>
          <div className="flex justify-center gap-4">
            <a 
              href="/"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all"
            >
              Return to Home
            </a>
            {onClose && (
              <button 
                onClick={onClose}
                className="inline-block bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-full font-semibold transition-all"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="bg-slate-800/80 p-8 rounded-2xl max-w-md w-full backdrop-blur-sm border border-blue-500/20 shadow-xl">
        <h2 className="text-3xl font-bold text-white mb-6">Register for the Hackathon</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
              First Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
              Last Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-300 mb-1">
              GitHub URL <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="url"
              id="githubUrl"
              name="githubUrl"
              value={formData.githubUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-300 mb-1">
              LinkedIn URL <span className="text-gray-500">(optional)</span>
            </label>
            <input
              type="url"
              id="linkedinUrl"
              name="linkedinUrl"
              value={formData.linkedinUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {error && (
            <div className="text-red-400 text-sm mt-2">{error}</div>
          )}
          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all disabled:opacity-50"
          >
            {status === 'loading' ? 'Registering...' : 'Register Now'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;