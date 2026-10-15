import React, { useState, useEffect } from 'react';
import { Shield, Lock, AlertCircle, ArrowLeft, CheckCircle2, KeyRound, UserCheck, X } from 'lucide-react';
import { verifyGoogleAuth, verifyAdminPin, setAdminToken, fetchAuthStatus } from '../services/api.js';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState<'google' | 'pin'>('google');
  const [googleEmail, setGoogleEmail] = useState('');
  const [verifiedGoogleUser, setVerifiedGoogleUser] = useState<any>(null);
  const [pin, setPin] = useState(['', '', '', '', '', '']); // up to 6 digits, accepts 4 to 6
  const [pinValue, setPinValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setStep('google');
      setPinValue('');
      loadAuthStatus();
    }
  }, [isOpen]);

  const loadAuthStatus = async () => {
    try {
      const status = await fetchAuthStatus();
      setAuthStatus(status);
      if (status.authorizedEmailFull) {
        setGoogleEmail(status.authorizedEmailFull);
      }
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  // Step 2: Google Authentication Submission
  const handleGoogleAuth = async (emailToVerify?: string) => {
    const targetEmail = (emailToVerify || googleEmail).trim();
    if (!targetEmail) {
      setError('Please provide your Google email address.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await verifyGoogleAuth(targetEmail, 'Zohair (Admin)', '');
      setVerifiedGoogleUser(res.user);
      setStep('pin');
    } catch (err: any) {
      setError(err.message || 'Authentication failed: You do not have permission to access this area.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: PIN Submission
  const handlePinSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanedPin = pinValue.trim();
    if (cleanedPin.length < 4) {
      setError('Please enter your 4-digit or 6-digit administrator PIN.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await verifyAdminPin(cleanedPin);
      setAdminToken(res.token);
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Invalid PIN entered.');
      // Refresh status for lockout updates
      loadAuthStatus();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md bg-[#0d111a] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5500] to-[#00E5FF] p-[1.5px]">
            <div className="w-full h-full bg-[#0d111a] rounded-[10px] flex items-center justify-center text-[#00E5FF]">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-display">Administrator Portal</h3>
            <p className="text-xs text-neutral-400">Two-factor authenticated identity verification</p>
          </div>
        </div>

        {/* Error Notice */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-red-200 mb-0.5">Authentication Issue</div>
              <div>{error}</div>
            </div>
          </div>
        )}

        {/* Security Lockout Banner if active */}
        {authStatus?.locked && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-amber-200">Security Cooldown Active</div>
              <div>Too many attempts. Locked for {authStatus.lockoutSeconds} seconds.</div>
            </div>
          </div>
        )}

        {/* ================= STEP 1: GOOGLE OAUTH ================= */}
        {step === 'google' && (
          <div className="space-y-5">
            <div className="text-xs text-neutral-300 bg-white/5 p-3.5 rounded-xl border border-white/5 leading-relaxed">
              <span className="text-white font-semibold block mb-1">Step 1 of 2: Google Identity</span>
              Only the authorized administrator account ({authStatus?.authorizedEmailHint || 'registered email'}) is granted system access.
            </div>

            {/* One-Click Google OAuth button for authorized account */}
            <button
              onClick={() => handleGoogleAuth(authStatus?.authorizedEmailFull || googleEmail)}
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 font-semibold text-sm flex items-center justify-center gap-3 shadow-lg transition-all active:scale-98 cursor-pointer disabled:opacity-50"
            >
              {/* Google G Logo */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                Or Verify Specific Account
              </span>
              <div className="flex-grow border-t border-white/10"></div>
            </div>

            {/* Explicit email input for validation */}
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                Google Account Email
              </label>
              <input
                type="email"
                placeholder="name@gmail.com"
                value={googleEmail}
                onChange={(e) => setGoogleEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-neutral-900 border border-white/10 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#00E5FF] transition-colors"
              />
            </div>

            <button
              onClick={() => handleGoogleAuth()}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs flex items-center justify-center gap-2 border border-white/10 transition-all cursor-pointer disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4 text-[#00E5FF]" />
              <span>Verify Google Permissions</span>
            </button>
          </div>
        )}

        {/* ================= STEP 2: ADMIN PIN ================= */}
        {step === 'pin' && (
          <form onSubmit={handlePinSubmit} className="space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <button
                type="button"
                onClick={() => setStep('google')}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Google Verified</span>
              </div>
            </div>

            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-2xl bg-[#FF5500]/10 border border-[#FF5500]/20 flex items-center justify-center text-[#FF5500] mx-auto mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white mb-1">Enter Admin PIN</h4>
              <p className="text-xs text-neutral-400">
                Enter your secure 4-digit or 6-digit administrator passcode
              </p>
            </div>

            <div>
              <input
                type="password"
                maxLength={6}
                autoFocus
                placeholder="••••"
                value={pinValue}
                onChange={(e) => setPinValue(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full text-center tracking-[0.6em] text-2xl font-mono py-3.5 px-4 rounded-xl bg-neutral-900 border border-white/15 text-white focus:outline-none focus:border-[#FF5500] transition-colors"
              />
              <div className="text-[11px] text-neutral-500 text-center mt-2">
                Protected by server-side rate limiting and brute-force lockout
              </div>
            </div>

            <button
              id="submit-admin-pin-btn"
              type="submit"
              disabled={loading || pinValue.length < 4}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF5500] to-[#ff7700] hover:from-[#ff6611] hover:to-[#ff8822] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#FF5500]/25 transition-all active:scale-98 disabled:opacity-40 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Unlock Admin Dashboard</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
