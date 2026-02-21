import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithMagicLink } from '../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalState = 'idle' | 'loading' | 'sent' | 'error';

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<ModalState>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setState('loading');
    setErrorMsg('');

    const { error } = await signInWithMagicLink(email.trim());

    if (error) {
      setErrorMsg(error);
      setState('error');
    } else {
      setState('sent');
    }
  };

  const handleClose = () => {
    setEmail('');
    setState('idle');
    setErrorMsg('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 px-4"
          >
            <div className="bg-surface-base border border-theme-border-subtle rounded-2xl p-8 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">✦</div>
                <h2 className="font-serif text-2xl font-medium mb-1">Enter the Temple</h2>
                <p className="text-theme-text-secondary text-sm">
                  Sign in with your email — we'll send a magic link. No password needed.
                </p>
              </div>

              {state === 'sent' ? (
                /* Success state */
                <div className="text-center py-4">
                  <div className="text-3xl mb-3">🕯</div>
                  <h3 className="font-serif text-lg mb-2 text-cyan-300">Check your inbox</h3>
                  <p className="text-theme-text-secondary text-sm mb-2">
                    We sent a magic link to
                  </p>
                  <p className="text-white font-medium mb-4">{email}</p>
                  <p className="text-theme-text-tertiary text-xs">
                    Click the link in your email to sign in. The link expires in 1 hour.
                  </p>
                  <button
                    onClick={handleClose}
                    className="mt-6 px-6 py-2 bg-surface-raised text-theme-text-secondary rounded-lg text-sm hover:bg-surface-interactive transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                /* Form state */
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm text-theme-text-secondary mb-1.5">
                      Email address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      disabled={state === 'loading'}
                      className="w-full bg-surface-raised border border-theme-border-subtle rounded-lg px-4 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 transition-colors disabled:opacity-50"
                    />
                  </div>

                  {state === 'error' && (
                    <p className="text-red-400 text-sm bg-red-500/10 rounded-lg px-3 py-2">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={state === 'loading' || !email.trim()}
                    className="w-full bg-cyan-600 hover:bg-cyan-500 disabled:bg-surface-interactive disabled:text-theme-text-tertiary text-white font-medium py-3 rounded-lg transition-colors"
                  >
                    {state === 'loading' ? 'Sending...' : 'Send Magic Link'}
                  </button>

                  <p className="text-center text-theme-text-muted text-xs">
                    Your cosmic blueprint is saved to your account across all devices.
                  </p>
                </form>
              )}

              {/* Close button */}
              {state !== 'sent' && (
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 text-theme-text-muted hover:text-theme-text-secondary transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
