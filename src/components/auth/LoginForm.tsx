import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { User, Lock, Mail, GraduationCap, Github, Linkedin, Facebook, Globe, LogIn, UserPlus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const LoginForm = () => {
  const [isActive, setIsActive] = useState(false);

  // State for Sign Up form inputs
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // State for Sign In form inputs
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Local state for feedback messages
  const [localSignInMessage, setLocalSignInMessage] = useState('');

  // Get auth store state and actions
  const { signIn, signUp, loading, error, user } = useAuthStore();

  // Basic validation helpers
  const validateEmail = (email: string): boolean => {
    return /\S+@\S+\.\S+/.test(email);
  };

  // Handle Sign Up form submission
  const handleSignUpSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLocalSignInMessage('');
    if (!signUpName.trim()) {
      setLocalSignInMessage('Name is required.');
      return;
    }
    if (!validateEmail(signUpEmail)) {
      setLocalSignInMessage('Please enter a valid email.');
      return;
    }
    if (signUpPassword.length < 6) {
      setLocalSignInMessage('Password must be at least 6 characters.');
      return;
    }
    try {
      await signUp(signUpName, signUpEmail, signUpPassword);
      setLocalSignInMessage('Sign Up successful!');
      setSignUpName('');
      setSignUpEmail('');
      setSignUpPassword('');
    } catch (err) {
      setLocalSignInMessage((err as Error).message || 'Sign Up failed');
    }
  };

  // Handle Sign In form submission
  const handleSignInSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLocalSignInMessage('');
    if (!validateEmail(signInEmail)) {
      setLocalSignInMessage('Please enter a valid email.');
      return;
    }
    if (signInPassword.length < 6) {
      setLocalSignInMessage('Password must be at least 6 characters.');
      return;
    }
    await signIn(signInEmail, signInPassword);
  };

  // Clear inputs on successful login
  useEffect(() => {
    if (user) {
      setSignInEmail('');
      setSignInPassword('');
      setLocalSignInMessage('');
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-300 to-blue-200 flex items-center justify-center font-montserrat">
      <div
        id="container"
        className={`bg-white rounded-[30px] shadow-[0_5px_15px_rgba(0,0,0,0.35)] relative overflow-hidden w-[768px] max-w-full min-h-[480px] transition-all duration-600 ease-in-out transform ${
          isActive ? 'active' : ''
        }`}
      >
        {/* Sign In Form */}
        <div
          className={`form-container sign-in absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 z-20 ${
            isActive ? 'translate-x-full' : 'translate-x-0'
          }`}
        >
          <form className="bg-white flex flex-col items-center justify-center px-10 h-full" onSubmit={handleSignInSubmit}>
            <h1 className="text-2xl font-semibold mb-4">Sign In</h1>
            <div className="my-5 flex justify-center space-x-3">
              <a href="#" aria-label="Google" className="border border-gray-300 rounded-[20%] flex justify-center items-center w-10 h-10 hover:bg-gray-50 transition-colors">
                <Globe className="text-gray-600" size={20} />
              </a>
              <a href="#" aria-label="Facebook" className="border border-gray-300 rounded-[20%] flex justify-center items-center w-10 h-10 hover:bg-gray-50 transition-colors">
                <Facebook className="text-gray-600" size={20} />
              </a>
              <a href="#" aria-label="Github" className="border border-gray-300 rounded-[20%] flex justify-center items-center w-10 h-10 hover:bg-gray-50 transition-colors">
                <Github className="text-gray-600" size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="border border-gray-300 rounded-[20%] flex justify-center items-center w-10 h-10 hover:bg-gray-50 transition-colors">
                <Linkedin className="text-gray-600" size={20} />
              </a>
            </div>
            <span className="text-xs text-gray-500">or use your email and password</span>
            <div className="flex items-center bg-[#eeeeee] my-2 px-4 py-2 rounded-lg w-full">
              <Mail className="mr-2 text-gray-600" size={16} />
              <input
                type="email"
                placeholder="Email"
                autoComplete="username"
                value={signInEmail}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSignInEmail(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-[13px]"
              />
            </div>
            <div className="flex items-center bg-[#eeeeee] my-2 px-4 py-2 rounded-lg w-full">
              <Lock className="mr-2 text-gray-600" size={16} />
              <input
                type="password"
                placeholder="Password"
                autoComplete="current-password"
                value={signInPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSignInPassword(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-[13px]"
              />
            </div>
            <a href="#" className="text-[13px] text-gray-800 no-underline my-4 block hover:text-gray-700 transition-colors">
              Forgot your password?
            </a>
            {(localSignInMessage || error) && (
              <p className="text-red-600 text-sm">{localSignInMessage || error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="bg-[#512da8] text-white text-[12px] py-2 px-[45px] border border-transparent rounded-[8px] font-semibold tracking-wide uppercase mt-2 cursor-pointer flex items-center justify-center gap-2 hover:bg-[#5c6bc0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="w-4 h-4" />
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Sign Up Form */}
        <div
          className={`form-container sign-up absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-1/2 ${
            isActive ? 'translate-x-full opacity-100 z-50 animate-move' : 'opacity-0 z-10'
          }`}
        >
          <form className="bg-white flex flex-col items-center justify-center px-10 h-full" onSubmit={handleSignUpSubmit}>
            <h1 className="text-2xl font-semibold mb-4">Create Account</h1>
            <div className="my-5 flex justify-center space-x-3">
              <a href="#" aria-label="Google" className="border border-gray-300 rounded-[20%] flex justify-center items-center w-10 h-10 hover:bg-gray-50 transition-colors">
                <Globe className="text-gray-600" size={20} />
              </a>
              <a href="#" aria-label="Facebook" className="border border-gray-300 rounded-[20%] flex justify-center items-center w-10 h-10 hover:bg-gray-50 transition-colors">
                <Facebook className="text-gray-600" size={20} />
              </a>
              <a href="#" aria-label="Github" className="border border-gray-300 rounded-[20%] flex justify-center items-center w-10 h-10 hover:bg-gray-50 transition-colors">
                <Github className="text-gray-600" size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="border border-gray-300 rounded-[20%] flex justify-center items-center w-10 h-10 hover:bg-gray-50 transition-colors">
                <Linkedin className="text-gray-600" size={20} />
              </a>
            </div>
            <span className="text-xs text-gray-500">or use your email for registration</span>
            <div className="flex items-center bg-[#eeeeee] my-2 px-4 py-2 rounded-lg w-full">
              <User className="mr-2 text-gray-600" size={16} />
              <input
                type="text"
                placeholder="Name"
                value={signUpName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSignUpName(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-[13px]"
              />
            </div>
            <div className="flex items-center bg-[#eeeeee] my-2 px-4 py-2 rounded-lg w-full">
              <Mail className="mr-2 text-gray-600" size={16} />
              <input
                type="email"
                placeholder="Email"
                value={signUpEmail}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSignUpEmail(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-[13px]"
              />
            </div>
            <div className="flex items-center bg-[#eeeeee] my-2 px-4 py-2 rounded-lg w-full">
              <Lock className="mr-2 text-gray-600" size={16} />
              <input
                type="password"
                placeholder="Password"
                value={signUpPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSignUpPassword(e.target.value)}
                className="bg-transparent border-none outline-none w-full text-[13px]"
              />
            </div>
            {localSignInMessage && <p className="text-red-600 text-sm">{localSignInMessage}</p>}
            <button
              type="submit"
              className="bg-[#512da8] text-white text-[12px] py-2 px-[45px] border border-transparent rounded-[8px] font-semibold tracking-wide uppercase mt-2 cursor-pointer flex items-center justify-center gap-2 hover:bg-[#5c6bc0] transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </button>
          </form>
        </div>

        {/* Toggle Container */}
        <div
          className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out rounded-[150px_0_0_100px] z-[1000] cursor-pointer ${
            isActive ? '-translate-x-full rounded-[0_150px_100px_0]' : 'translate-x-0 rounded-[150px_0_0_100px]'
          }`}
          onClick={() => setIsActive(!isActive)}
        >
          <div
            className={`bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white relative left-[-100%] h-full w-[200%] transform transition-transform duration-700 ease-in-out ${
              isActive ? 'translate-x-1/2' : 'translate-x-0'
            }`}
          >
            <div
              className={`absolute w-1/2 h-full flex flex-col items-center justify-center px-7 text-center top-0 transition-transform duration-700 ease-in-out transform ${
                isActive ? 'translate-x-0' : '-translate-x-[200%]'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-4 mb-8">
                <GraduationCap className="text-gray-100" size={48} />
                <div className="text-3xl font-extrabold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                  EduErp
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-3">Welcome Back!</h1>
              <p className="text-sm leading-5 tracking-wide mb-5 text-gray-300">Enter your personal details to use all of site features</p>
              <button
                className="bg-transparent border border-white text-white text-xs py-2 px-11 rounded-lg font-semibold tracking-wide uppercase cursor-pointer hover:bg-white hover:text-purple-700 transition-colors flex items-center justify-center gap-2"
                id="login"
                style={{ minWidth: '120px' }}
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </button>
            </div>
            <div
              className={`absolute right-0 w-1/2 h-full flex flex-col items-center justify-center px-7 text-center top-0 transition-all duration-600 ease-in-out transform ${
                isActive ? 'translate-x-[200%]' : 'translate-x-0'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-4 mb-8">
                <GraduationCap className="text-gray-100" size={48} />
                <div className="text-3xl font-extrabold bg-gradient-to-r from-gray-100 to-gray-300 bg-clip-text text-transparent">
                  EduErp
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-3">Hello, Friend!</h1>
              <p className="text-sm leading-5 tracking-wide mb-5 text-gray-300">Register with your personal details to use all of site features</p>
              <button
                className="bg-transparent border border-white text-white text-xs py-2 px-11 rounded-lg font-semibold tracking-wide uppercase cursor-pointer hover:bg-white hover:text-purple-700 transition-colors flex items-center justify-center gap-2"
                id="register"
                style={{ minWidth: '120px' }}
              >
                <UserPlus className="w-4 h-4" />
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
