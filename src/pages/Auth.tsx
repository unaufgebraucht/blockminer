import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { User, Lock, Mail, ArrowRight, Gamepad2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!isLogin) {
      // Registration
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        setLoading(false);
        return;
      }
      if (username.length < 3) {
        toast.error('Username must be at least 3 characters');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const { error } = await signUp(username, email, password);
      if (error) {
        toast.error(error);
      } else {
        toast.success('Account created! Please check your email to verify.');
        setIsLogin(true);
      }
    } else {
      // Login
      const { error } = await signIn(email, password);
      if (error) {
        toast.error(error);
      } else {
        toast.success('Welcome back!');
        navigate('/');
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background bg-grid flex items-center justify-center p-4">
      {/* Floating decoration blocks */}
      <motion.div
        className="absolute top-20 left-20 w-16 h-16"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <img src="/textures/diamond.png" alt="" className="w-full h-full pixel-texture opacity-30" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-20 w-20 h-20"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <img src="/textures/emerald.png" alt="" className="w-full h-full pixel-texture opacity-30" />
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-32 w-14 h-14"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <img src="/textures/gold-block.png" alt="" className="w-full h-full pixel-texture opacity-20" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <Gamepad2 className="w-10 h-10 text-primary" />
            <h1 className="font-pixel text-2xl text-foreground">MINECRATE</h1>
          </motion.div>
          <p className="font-minecraft text-lg text-muted-foreground">
            {isLogin ? 'Welcome back, player!' : 'Join the adventure!'}
          </p>
        </div>

        {/* Auth Card */}
        <div className="game-card p-8">
          {/* Tab Switcher */}
          <div className="flex mb-8 border-4 border-border">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 font-pixel text-sm transition-all ${
                isLogin 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-muted-foreground hover:bg-muted'
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 font-pixel text-sm transition-all ${
                !isLogin 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-secondary text-muted-foreground hover:bg-muted'
              }`}
            >
              REGISTER
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block font-minecraft text-muted-foreground mb-2">
                    USERNAME
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                      className="w-full bg-input border-4 border-border pl-11 pr-4 py-3 font-minecraft text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition-colors"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block font-minecraft text-muted-foreground mb-2">
                EMAIL
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="w-full bg-input border-4 border-border pl-11 pr-4 py-3 font-minecraft text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-minecraft text-muted-foreground mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-input border-4 border-border pl-11 pr-4 py-3 font-minecraft text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block font-minecraft text-muted-foreground mb-2">
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full bg-input border-4 border-border pl-11 pr-4 py-3 font-minecraft text-foreground placeholder:text-muted-foreground focus:border-primary outline-none transition-colors"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mc-btn mc-btn-primary py-4 font-pixel text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'ENTER GAME' : 'CREATE ACCOUNT'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 font-minecraft text-muted-foreground text-sm">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline"
          >
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
