import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner@2.0.3';
import { Mail, Phone, KeyRound } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

interface AuthPageProps {
  mode?: 'login' | 'register';
}

export function AuthPage({ mode = 'login' }: AuthPageProps) {
  const { sendOTP, login, loginWithPhone, loginAsAdmin, language } = useApp();
  const t = useTranslation(language);
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('phone');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
        let success = false;
        let emailTO = email;
        let phoneTO = phone;
      
        success = await sendOTP(emailTO, phoneTO);
        if (success) {
          toast.success('OTP sent!');
          setStep('otp');
        } else {
          toast.error('Failed to send OTP. Please try again.');
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

  return (
    <div className="w-full p-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl text-[#822A12] mb-2">Geeta Olympiad</h1>
        <p className="text-[#D55328]">
          {mode === 'register' ? t('register') || 'Register' : t('signIn')}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v:any) => setActiveTab(v as 'user' | 'admin')}>
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
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                />
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
          </TabsContent>
        </Tabs>
    </div>
  );
}
