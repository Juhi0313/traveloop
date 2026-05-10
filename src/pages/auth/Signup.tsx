import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuthStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Full name is required.';
    if (!email.includes('@')) e.email = 'Enter a valid email address.';
    if (password.length < 6) e.password = 'Password must be at least 6 characters.';
    return e;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const ok = signup(name, email, password);
    if (ok) {
      navigate('/dashboard');
    } else {
      setErrors({ email: 'An account with this email already exists.' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&auto=format&fit=crop"
          alt="Travel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#012f61]/90 via-[#0d61a3]/80 to-[#00b4d8]/70" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff6b6b] to-[#ffb347] flex items-center justify-center">
              <Globe size={22} />
            </div>
            <span className="text-2xl font-bold">Traveloop</span>
          </div>
          <h2 className="text-4xl font-bold mb-4">Start your journey today.</h2>
          <p className="text-white/75 text-lg mb-10">Create a free account and begin planning your dream trip in minutes.</p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: '12K+', desc: 'Active travelers' },
              { label: '50K+', desc: 'Trips planned' },
              { label: '150+', desc: 'Cities covered' },
              { label: '4.9★', desc: 'User rating' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold">{s.label}</div>
                <div className="text-white/70 text-sm">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[#f8fafc]">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0d61a3] to-[#00b4d8] flex items-center justify-center">
              <Globe size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-[#1e293b]">Traveloop</span>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-[#e2e8f0] p-8" style={{ animation: 'slideUp 0.4s ease-out' }}>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-[#1e293b] mb-1">Create your account</h1>
              <p className="text-[#64748b] text-sm">Free forever. No credit card required.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                label="Full name"
                type="text"
                placeholder="Jane Smith"
                value={name}
                onChange={e => setName(e.target.value)}
                error={errors.name}
                icon={<User size={16} />}
              />
              <Input
                label="Email address"
                type="email"
                placeholder="jane@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                error={errors.email}
                icon={<Mail size={16} />}
              />
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                error={errors.password}
                icon={<Lock size={16} />}
                iconRight={
                  <button type="button" onClick={() => setShowPass(v => !v)} className="cursor-pointer">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
              />

              <p className="text-xs text-[#94a3b8]">
                By signing up you agree to our{' '}
                <span className="text-[#0d61a3] cursor-pointer hover:underline">Terms of Service</span>
                {' '}and{' '}
                <span className="text-[#0d61a3] cursor-pointer hover:underline">Privacy Policy</span>.
              </p>

              <Button type="submit" fullWidth size="lg" loading={loading} iconRight={<ArrowRight size={16} />}>
                Create Account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-[#64748b]">
              Already have an account?{' '}
              <Link to="/login" className="text-[#0d61a3] font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
