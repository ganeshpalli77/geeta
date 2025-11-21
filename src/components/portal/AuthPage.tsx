import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner@2.0.3';
import { Mail, Phone, KeyRound, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import { API_BASE_URL } from '../../utils/config';

interface AuthPageProps {
  mode?: 'login' | 'register';
}

export function AuthPage({ mode = 'login' }: AuthPageProps) {
  const { login, loginWithPhone, loginAsAdmin, language } = useApp();
  const t = useTranslation(language);
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('phone');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [adminMode, setAdminMode] = useState<'login' | 'register'>('login');
  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendOTP = async () => {
    if (loginMethod === 'email' && !email) {
      toast.error('Please enter your email');
      return;
    }
    if (loginMethod === 'phone' && !phone) {
      toast.error('Please enter your phone number');
      return;
    }

    setLoading(true);
    
    try {
      if (loginMethod === 'email') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: true,
          },
        });

        if (error) {
          toast.error(error.message || 'Failed to send OTP');
          setLoading(false);
          return;
        }

        toast.success('OTP sent to your email!');
        setStep('otp');
      } else {
        const { error } = await supabase.auth.signInWithOtp({
          phone,
          options: {
            shouldCreateUser: true,
          },
        });

        if (error) {
          toast.error(error.message || 'Failed to send OTP');
          setLoading(false);
          return;
        }

        toast.success('OTP sent to your phone!');
        setStep('otp');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    
    try {
      let success = false;
      
      if (loginMethod === 'email') {
        success = await login(email, otp);
      } else {
        success = await loginWithPhone(phone, otp);
      }
      
      if (success) {
        toast.success('Login successful!');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    if (!username || !password) {
      toast.error('Please enter username and password');
      return;
    }

    setLoading(true);
    
    try {
      const success = await loginAsAdmin(username, password);
      
      if (success) {
        toast.success('Admin login successful!');
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminRegister = async () => {
    if (!username || !password) {
      toast.error('Please enter username and password');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin-register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          email: adminEmail,
          role: 'admin',
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success('Admin registered successfully! You can now login.');
        setAdminMode('login');
        setPassword('');
        setConfirmPassword('');
        setAdminEmail('');
      } else {
        toast.error(data.error || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Admin registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl text-[#822A12] mb-2">Geeta Olympiad</h1>
        <p className="text-[#D55328]">
          {mode === 'register' ? t('register') || 'Register' : t('signIn')}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'user' | 'admin')}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="user">User {mode === 'register' ? 'Registration' : 'Login'}</TabsTrigger>
          <TabsTrigger value="admin">Admin Login</TabsTrigger>
        </TabsList>

        <TabsContent value="user" className="space-y-4">
          {/* Note about SMS requiring Twilio setup */}
          <div className="flex gap-2 mb-4">
              <Button
                variant={loginMethod === 'phone' ? 'default' : 'outline'}
                onClick={() => {
                  setLoginMethod('phone');
                  setStep('input');
                }}
                className="flex-1 rounded-[25px]"
                style={{ backgroundColor: loginMethod === 'phone' ? '#D55328' : 'transparent' }}
              >
                <Phone className="w-4 h-4 mr-2" />
                {t('phone')}
              </Button>
              <Button
                variant={loginMethod === 'email' ? 'default' : 'outline'}
                onClick={() => {
                  setLoginMethod('email');
                  setStep('input');
                }}
                className="flex-1 rounded-[25px]"
                style={{ backgroundColor: loginMethod === 'email' ? '#D55328' : 'transparent' }}
              >
                <Mail className="w-4 h-4 mr-2" />
                {t('email')}
              </Button>
            </div>

            {step === 'input' && (
              <div className="space-y-4">
                {loginMethod === 'email' ? (
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('phone')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 1234567890"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
                    />
                  </div>
                )}
                
                <Button
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="w-full rounded-[25px]"
                  style={{ backgroundColor: '#D55328' }}
                >
                  {loading ? t('loading') : t('sendOTP')}
                </Button>
              </div>
            )}

            {step === 'otp' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">{t('enterOTP')}</Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder=""
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={10}
                    onKeyPress={(e) => e.key === 'Enter' && handleVerifyOTP()}
                  />
                </div>
                
                <Button
                  onClick={handleVerifyOTP}
                  disabled={loading}
                  className="w-full rounded-[25px]"
                  style={{ backgroundColor: '#D55328' }}
                >
                  {loading ? t('loading') : t('verifyOTP')}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setStep('input')}
                  className="w-full rounded-[25px]"
                >
                  {t('back')}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="admin" className="space-y-4">
            {/* Admin Login/Register Toggle */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={adminMode === 'login' ? 'default' : 'outline'}
                onClick={() => setAdminMode('login')}
                className="flex-1 rounded-[25px]"
                style={{ backgroundColor: adminMode === 'login' ? '#D55328' : 'transparent' }}
              >
                <KeyRound className="w-4 h-4 mr-2" />
                Admin Login
              </Button>
              <Button
                variant={adminMode === 'register' ? 'default' : 'outline'}
                onClick={() => setAdminMode('register')}
                className="flex-1 rounded-[25px]"
                style={{ backgroundColor: adminMode === 'register' ? '#D55328' : 'transparent' }}
              >
                Admin Register
              </Button>
            </div>

            {adminMode === 'login' ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">{t('username')}</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">{t('password')}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢‚Ä¢"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <Button
                  onClick={handleAdminLogin}
                  disabled={loading}
                  className="w-full rounded-[25px]"
                  style={{ backgroundColor: '#D55328' }}
                >
                  <KeyRound className="w-4 h-4 mr-2" />
                  {loading ? t('loading') : t('login')}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-username">{t('username')}</Label>
                  <Input
                    id="reg-username"
                    type="text"
                    placeholder="Enter admin username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="admin-email">{t('email')} (Optional)</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reg-password">{t('password')}</Label>
                  <div className="relative">
                    <Input
                      id="reg-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password (min 6 chars)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAdminRegister()}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <Button
                  onClick={handleAdminRegister}
                  disabled={loading}
                  className="w-full rounded-[25px]"
                  style={{ backgroundColor: '#D55328' }}
                >
                  <KeyRound className="w-4 h-4 mr-2" />
                  {loading ? t('loading') : 'Register Admin'}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Already have an account?{' '}
                  <button
                    onClick={() => setAdminMode('login')}
                    className="text-[#D55328] font-semibold hover:underline"
                  >
                    Login here
                  </button>
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
    </div>
  );
}
