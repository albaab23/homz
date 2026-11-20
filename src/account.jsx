import './account.css';
import { useState, useEffect } from 'react';
import { supabase } from './supabaseclient'; // تأكد من اسم الملف عندك

function Account() {
  // ===== 1) المتغيرات (الحالة) =====
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [user, setUser] = useState(null);
  const [isSignup, setIsSignup] = useState(false);

  // ===== 2) التأكد إذا في مستخدم مسجل دخول =====
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // ===== 3) إنشاء حساب =====
  const handlesignup = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (!email || !password) {
      setIsError(true);
      setMessage('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    if (password.length < 6) {
      setIsError(true);
      setMessage('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (error) {
      setIsError(true);
      setMessage(error.message);
    } else {
      setIsError(false);
      setMessage('تم إنشاء الحساب بنجاح، يرجى التحقق من بريدك الإلكتروني لتأكيد الحساب');
    }
  };

  // ===== 4) تسجيل الدخول =====
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);

    if (!email || !password) {
      setIsError(true);
      setMessage('يرجى إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setIsError(true);
      setMessage('صيغة البريد الإلكتروني غير صحيحة');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      setIsError(true);
      if (error.message === 'Invalid login credentials') {
        setMessage('البريد أو كلمة المرور غير صحيحة');
      } else if (error.message === 'Email not confirmed') {
        setMessage('يرجى تأكيد بريدك الإلكتروني أولاً');
      } else {
        setMessage('حدث خطأ، حاول مرة أخرى');
      }
    }
  };

  // ===== 5) إذا المستخدم مسجل دخول: اعرض الترحيب =====
  if (user) {
    return (
      <main className="accountPage">
        <section className="account accountSignedIn">
          <span className="accountEyebrow">حسابك في هومز</span>
          <h1>أهلاً بك</h1>
          <p className="accountDescription">{user.email}</p>
          <button type="button" onClick={() => supabase.auth.signOut()}>تسجيل الخروج</button>
        </section>
      </main>
    );
  }

  // ===== 6) وإلا اعرض الفورم =====
  return (
    <main className="accountPage">
      <div className="accountIntro">
        <span className="accountEyebrow">مرحباً بك في هومز</span>
        <h1>{isSignup ? 'أنشئ حسابك' : 'سجّل الدخول'}</h1>
        <p>سجّل الدخول لمتابعة تجربتك والتعرّف على جديدنا.</p>
      </div>
      {message && (
        <p className={`accountMessage${isError ? ' isError' : ''}`} role="status">{message}</p>
      )}
      <form className="account" onSubmit={isSignup ? handlesignup : handleLogin}>
        <label htmlFor="email">البريد الإلكتروني</label>
        <input
          type="email"
          id="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="password">كلمة المرور</label>
        <input
          type="password"
          id="password"
          autoComplete={isSignup ? 'new-password' : 'current-password'}
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'جارٍ التحقق...' : isSignup ? 'إنشاء حساب' : 'تسجيل الدخول'}
        </button>
        <p className="accountSwitch">
          {isSignup ? 'لديك حساب؟' : 'ليس لديك حساب؟'}{' '}
          <button
            type="button"
            onClick={() => { setIsSignup(!isSignup); setMessage(''); }}
          >
            {isSignup ? 'سجّل الدخول' : 'أنشئ حساباً'}
          </button>
        </p>
      </form>
    </main>
  );
}

export default Account;