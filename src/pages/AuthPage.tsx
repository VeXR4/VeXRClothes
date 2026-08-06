import { useState } from 'react';
import { Mail, Lock, Phone, User, ArrowLeft } from 'lucide-react';
import Button from '@/components/Button';
import Logo from '@/components/Logo';
import { useAuth } from '@/lib/auth';
import { navigate, useRoute } from '@/lib/router';

export default function AuthPage() {
  const { signInWithEmail, signUpWithEmail, signInWithPhone, user } = useAuth();
  const route = useRoute();
  const redirect = route.query.get('redirect') || '/account';

  const [mode, setMode] = useState<'login' | 'register' | 'phone'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate(redirect);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    let res;
    if (mode === 'login') {
      res = await signInWithEmail(email, password);
    } else if (mode === 'register') {
      res = await signUpWithEmail(email, password, fullName);
    } else {
      res = await signInWithPhone(phone);
    }
    setLoading(false);
    setMsg({ ok: res.ok, text: res.message });
    if (res.ok && mode === 'login') {
      setTimeout(() => navigate(redirect), 300);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-20 pb-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo />
          <p className="text-xs tracking-[0.3em] text-sand-500">پوشاک وکس آر</p>
        </div>

        <div className="rounded-sm border border-ink-900/10 bg-cream p-6 sm:p-8">
          <div className="mb-6 flex border-b border-ink-900/10">
            {([
              { id: 'login', label: 'ورود' },
              { id: 'register', label: 'ثبت‌نام' },
              { id: 'phone', label: 'شماره موبایل' },
            ] as const).map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setMode(tab.id); setMsg(null); }}
                className={`flex-1 border-b-2 py-3 text-sm font-medium transition-colors ${
                  mode === tab.id ? 'border-ink-900 text-ink-900' : 'border-transparent text-ink-400 hover:text-ink-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <InputField icon={<User size={16} strokeWidth={1.5} />} label="نام و نام خانوادگی" value={fullName} onChange={setFullName} />
            )}
            {mode === 'phone' ? (
              <InputField icon={<Phone size={16} strokeWidth={1.5} />} label="شماره موبایل" value={phone} onChange={setPhone} type="tel" placeholder="09xxxxxxxxx" />
            ) : (
              <>
                <InputField icon={<Mail size={16} strokeWidth={1.5} />} label="ایمیل" value={email} onChange={setEmail} type="email" />
                <InputField icon={<Lock size={16} strokeWidth={1.5} />} label="رمز عبور" value={password} onChange={setPassword} type="password" />
              </>
            )}

            {msg && <p className={`text-xs ${msg.ok ? 'text-success' : 'text-error'}`}>{msg.text}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'در حال پردازش...' : mode === 'login' ? 'ورود' : mode === 'register' ? 'ثبت‌نام' : 'ارسال کد'}
              <ArrowLeft size={16} strokeWidth={1.5} />
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-ink-400">
            با ورود یا ثبت‌نام، شرایط استفاده از وکس آر را می‌پذیرید.
          </p>
        </div>

        <button onClick={() => navigate('/')} className="mt-6 w-full text-center text-sm text-ink-500 hover:text-ink-900">
          بازگشت به خانه
        </button>
      </div>
    </div>
  );
}

function InputField({
  icon, label, value, onChange, type = 'text', placeholder,
}: {
  icon: React.ReactNode; label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-ink-700">{label}</label>
      <div className="relative">
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-sm border border-ink-900/15 py-2.5 pr-10 pl-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-ink-900 focus:outline-none"
        />
      </div>
    </div>
  );
}
