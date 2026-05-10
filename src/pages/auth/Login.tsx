import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('alex@traveloop.com');
  const [password, setPassword] = useState('password123');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = login(email, password);
    if (ok) {
      navigate('/dashboard');
    } else {
      setError('Invalid email or password. Try: alex@traveloop.com / password123');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&auto=format&fit=crop"
          alt="Travel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#012f61]/90 via-[#0d61a3]/80 to-[#00b4d8]/70" />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b6b] to-[#ffb347] flex items-center justify-center">
              <Globe size={22} />
            </div>
            <span className="text-2xl font-bold">Traveloop</span>
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Plan your perfect<br />journey, effortlessly.
            </h2>
            <p className="text-white/75 text-lg mb-8">
              Build multi-city itineraries, track budgets, discover activities, and share your adventures.
            </p>
            <div className="flex flex-col gap-3">
              {['Multi-city itinerary builder', 'Budget & cost breakdown', 'Activity discovery', 'Share trips publicly'].map(f => (
                <div key={f} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#ff6b6b]/90 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </div>
                  <span className="text-white/85 text-sm">{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60'].map((src, i) => (
                <img key={i} src={src} className="w-9 h-9 rounded-full border-2 border-white object-cover" alt="" />
              ))}
            </div>
            <p className="text-white/70 text-sm">Join <strong className="text-white">12,000+</strong> travelers already planning smarter</p>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#f8fafc]">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d61a3] to-[#00b4d8] flex items-center justify-center">
              <Globe size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-[#1e293b]">Traveloop</span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-[#e2e8f0] p-8" style={{ animation: 'slideUp 0.4s ease-out' }}>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[#1e293b] mb-1">Welcome back!</h1>
              <p className="text-[#64748b] text-sm">Sign in to continue planning your adventures.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                icon={<Mail size={16} />}
              />
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                icon={<Lock size={16} />}
                iconRight={
                  <button type="button" onClick={() => setShowPass(v => !v)} className="cursor-pointer">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />
              <div className="flex justify-end">
                <button type="button" className="text-sm text-[#0d61a3] hover:underline font-medium">
                  Forgot password?
                </button>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <Button type="submit" fullWidth size="lg" loading={loading} iconRight={<ArrowRight size={16} />}>
                Sign In
              </Button>
            </form>

            <div className="mt-4 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e2e8f0]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs text-[#94a3b8] font-medium">or try demo</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setEmail('alex@traveloop.com'); setPassword('password123'); }}
                className="text-xs border border-[#e2e8f0] rounded-xl p-2.5 hover:bg-[#f1f5f9] transition-colors text-[#64748b] font-medium"
              >
                Demo User
              </button>
              <button
                type="button"
                onClick={() => { setEmail('admin@traveloop.com'); setPassword('admin123'); }}
                className="text-xs border border-[#e2e8f0] rounded-xl p-2.5 hover:bg-[#f1f5f9] transition-colors text-[#64748b] font-medium"
              >
                Admin Demo
              </button>
            </div>

            <p className="mt-6 text-center text-sm text-[#64748b]">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#0d61a3] font-semibold hover:underline">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
