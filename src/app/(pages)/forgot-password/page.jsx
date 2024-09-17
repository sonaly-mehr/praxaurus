'use client';
import { useState } from 'react';
import { toast } from 'sonner';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/request-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        toast.success('Password reset link sent to your email!');
        setEmail('');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'An error occurred. Please try again.');
        setEmail('');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full max-w-md mx-auto flex items-center justify-center h-[80vh] px-4'>
      <div className='w-full bg-white shadow-lg rounded-lg p-6'>
        <h2 className='text-2xl font-bold mb-4 text-center'>Forgot Password</h2>
        <p className='text-gray-600 mb-6 text-center text-sm'>
          Enter your email address below, and we will send you a password reset link.
        </p>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className='w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-3 py-2.5 uppercase text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
      </div>
    </div>
  );
}