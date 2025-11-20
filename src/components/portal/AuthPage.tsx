import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { toast } from 'sonner@2.0.3';
import { supabase } from '../../utils/supabaseClient';

interface AuthPageProps {
  mode?: 'login' | 'register';
  onSwitchMode?: (mode: 'login' | 'register') => void;
}

export function AuthPage({ mode = 'login', onSwitchMode }: AuthPageProps) {
  const { login, loginWithPhone, language } = useApp();
  const t = useTranslation(language);
  const [step, setStep] = useState<'input' | 'otp'>('input');
  
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const resolveLoginMethod = () => {
    if (mode === 'register') {
      if (email) return 'email';
      return 'phone';
    }
    return 'phone';
  };

  const handleSendOTP = async () => {
    const activeMethod = resolveLoginMethod();

    if (activeMethod === 'email' && !email) {
      toast.error('Please enter your email');
      return;
    }
    if (activeMethod === 'phone' && !phone) {
      toast.error('Please enter your phone number');
      return;
    }

    setLoading(true);
    
    try {
      if (activeMethod === 'email') {
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
      const activeMethod = resolveLoginMethod();
      
      if (activeMethod === 'email') {
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

  if (mode === 'register') {
    return (
      <div className="w-full p-6">
        <div className="text-center mb-6">
          <h1 className="text-3xl text-[#822A12] mb-2">Geeta Olympiad</h1>
          <p className="text-[#D55328]">{t('register') || 'Register'}</p>
        </div>

        {step === 'input' ? (
          <div className="space-y-4">
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

            <Button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full rounded-[25px]"
              style={{ backgroundColor: '#D55328' }}
            >
              {loading ? t('loading') : t('sendOTP')}
            </Button>
          </div>
        ) : (
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

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{' '}
          <button
            type="button"
            className="text-[#D55328] font-semibold underline-offset-2 hover:underline"
            onClick={() => onSwitchMode?.('login')}
          >
            Login
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="w-full p-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl text-[#822A12] mb-2">Geeta Olympiad</h1>
        <p className="text-[#D55328]">{t('signIn')}</p>
      </div>

      {step === 'input' ? (
        <div className="space-y-4">
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

          <Button
            onClick={handleSendOTP}
            disabled={loading}
            className="w-full rounded-[25px]"
            style={{ backgroundColor: '#D55328' }}
          >
            {loading ? t('loading') : t('sendOTP')}
          </Button>
        </div>
      ) : (
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

      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{' '}
        <button
          type="button"
          className="text-[#D55328] font-semibold underline-offset-2 hover:underline"
          onClick={() => onSwitchMode?.('register')}
        >
          Register
        </button>
        .
      </p>
    </div>
  );
}
