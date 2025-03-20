import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

function Confirm() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const navigate = useNavigate();

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) throw new Error('Unable to confirm email');

        // Update the active status in registrations table
        const { error: updateError } = await supabase
          .from('registrations')
          .update({ active: true })
          .eq('email', user.email);

        if (updateError) throw updateError;

        setStatus('success');
      } catch (err) {
        console.error('Confirmation error:', err);
        setStatus('error');
      }
    };

    handleEmailConfirmation();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black flex items-center justify-center p-4">
      <div className="bg-slate-800/50 p-8 rounded-2xl max-w-md w-full backdrop-blur-lg border border-blue-500/20">
        <div className="text-center">
          {status === 'loading' && (
            <h2 className="text-3xl font-bold text-white mb-4">Confirming your email...</h2>
          )}
          {status === 'success' && (
            <>
              <h2 className="text-3xl font-bold text-white mb-4">Email Confirmed!</h2>
              <p className="text-gray-300 mb-6">
                Your registration is now complete. We're excited to have you join the World's Largest Hackathon!
              </p>
              <button
                onClick={() => navigate('/')}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all"
              >
                Return to Home
              </button>
            </>
          )}
          {status === 'error' && (
            <>
              <h2 className="text-3xl font-bold text-white mb-4">Confirmation Failed</h2>
              <p className="text-gray-300 mb-6">
                We couldn't confirm your email. Please try registering again or contact support.
              </p>
              <button
                onClick={() => navigate('/register')}
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-semibold transition-all"
              >
                Register Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Confirm;