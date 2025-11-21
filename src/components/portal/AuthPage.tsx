import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { toast } from 'sonner';
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
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [authMode, setAuthMode] = useState<'login' | 'register'>(mode);
  
  // Email and phone
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailOTP, setEmailOTP] = useState('');
  const [phoneOTP, setPhoneOTP] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminMode, setAdminMode] = useState<'login' | 'register'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSentTo, setOtpSentTo] = useState<{ email: boolean; phone: boolean }>({ email: false, phone: false });

  // Send OTP to email and/or phone based on what user provided
  const handleSendOTP = async () => {
    // Prevent double-click
    if (loading) return;
    
    // For LOGIN: At least one field required
    // For REGISTRATION: Both fields required
    if (authMode === 'register') {
      if (!email || !phone) {
        toast.error('Please provide both email and phone number for registration');
        return;
      }
    } else {
      // Login mode: at least one required
      if (!email && !phone) {
        toast.error('Please enter either email or phone number');
        return;
      }
    }

    // Validate email format if provided
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        toast.error('Please enter a valid email address');
        return;
      }
    }

    // Validate phone format if provided
    if (phone && phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }

    const formattedPhone = phone ? (phone.startsWith('+') ? phone : `+91${phone}`) : '';

    // For LOGIN: Check if user exists
    if (authMode === 'login') {
      try {
        const checkResponse = await fetch(`${API_BASE_URL}/users/check-exists`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, phone: formattedPhone }),
        });
        
        if (!checkResponse.ok) {
          toast.error('No account found. Please register first.');
          return;
        }
      } catch (err) {
        console.error('Error checking user existence:', err);
        // Don't block login if check fails - let Supabase handle it
        console.warn('Proceeding with OTP send despite check failure');
      }
    }

    // For REGISTRATION: Check if user already exists (prevent duplicate registration)
    if (authMode === 'register') {
      try {
        const checkResponse = await fetch(`${API_BASE_URL}/users/check-exists`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, phone: formattedPhone }),
        });
        
        if (checkResponse.ok) {
          // User already exists
          const data = await checkResponse.json();
          const field = data.matchedField || 'email or phone';
          toast.error(`Account already exists with this ${field}. Please login instead.`, {
            duration: 5000,
          });
          // Switch to login mode
          setAuthMode('login');
          return;
        }
      } catch (err) {
        // If 404, user doesn't exist - this is good for registration
        console.warn('User check failed, proceeding with registration');
      }
    }

    setLoading(true);
    const sentTo = { email: false, phone: false };
    
    try {
      // For REGISTRATION: Store pending registration in MongoDB BEFORE sending OTP
      if (authMode === 'register' && email && phone) {
        try {
          const response = await fetch(`${API_BASE_URL}/pending-registrations/store`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, phone: formattedPhone }),
          });
          
          if (!response.ok) {
            console.error('Failed to store pending registration');
          }
        } catch (err) {
          console.error('Error storing pending registration:', err);
          // Don't block registration if this fails
        }
      }
      
      // Send OTP to email (if provided)
      if (email) {
        try {
          const { error: emailError } = await supabase.auth.signInWithOtp({
            email,
            options: {
              shouldCreateUser: authMode === 'register',
              data: authMode === 'register' ? {
                registration_email: email,
                registration_phone: formattedPhone,
              } : undefined,
            },
          });

          if (emailError) {
            console.error('Email OTP error:', emailError);
            toast.error(`Failed to send OTP to email: ${emailError.message}`);
          } else {
            sentTo.email = true;
          }
        } catch (emailErr) {
          console.error('Email OTP exception:', emailErr);
          toast.error('Failed to send OTP to email');
        }
      }

      // Send OTP to phone (if provided)
      if (phone) {
        try {
          const { error: phoneError } = await supabase.auth.signInWithOtp({
            phone: formattedPhone,
            options: {
              shouldCreateUser: authMode === 'register',
              data: authMode === 'register' ? {
                registration_email: email,
                registration_phone: formattedPhone,
              } : undefined,
            },
          });

          if (phoneError) {
            console.error('Phone OTP error:', phoneError);
            toast.error(`Failed to send OTP to phone: ${phoneError.message}`);
          } else {
            sentTo.phone = true;
          }
        } catch (phoneErr) {
          console.error('Phone OTP exception:', phoneErr);
          toast.error('Failed to send OTP to phone');
        }
      }

      setOtpSentTo(sentTo);

      // Check if at least one OTP was sent successfully
      if (sentTo.email || sentTo.phone) {
        const methods: string[] = [];
        if (sentTo.email) methods.push('email');
        if (sentTo.phone) methods.push('phone');
        toast.success(`OTP sent to your ${methods.join(' and ')}!`);
        setStep('otp');
      } else {
        toast.error('Failed to send OTP to both email and phone. Please try again.');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // NEW: Verify OTP from EITHER email or phone
  const handleVerifyOTP = async () => {
    // Check if at least one OTP is entered
    if (!emailOTP && !phoneOTP) {
      toast.error('Please enter OTP from either email or phone');
      return;
    }

    setLoading(true);
    
    try {
      let success = false;
      let verificationType: 'email' | 'phone' | null = null;
      
      // Try email OTP first if provided and email OTP was sent
      if (emailOTP && otpSentTo.email) {
        success = await login(email, emailOTP);
        if (success) {
          verificationType = 'email';
        }
      }
      
      // Try phone OTP if email failed or not provided, and phone OTP was sent
      if (!success && phoneOTP && otpSentTo.phone) {
        const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`;
        success = await loginWithPhone(formattedPhone, phoneOTP);
        if (success) {
          verificationType = 'phone';
        }
      }
      
      if (success) {
        toast.success(`Login successful! Verified with ${verificationType}`);
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
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
    // Validation
    if (!username || !adminEmail || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/admin-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          email: adminEmail,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Admin registered successfully! You can now login.');
        // Switch to login mode
        setAdminMode('login');
        setPassword('');
        setConfirmPassword('');
        setAdminEmail('');
      } else {
        toast.error(data.error || 'Registration failed');
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

      <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as 'user' | 'admin')}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="user">User {authMode === 'register' ? 'Registration' : 'Login'}</TabsTrigger>
          <TabsTrigger value="admin">Admin Login</TabsTrigger>
        </TabsList>

        <TabsContent value="user" className="space-y-4">
          {/* Show email and/or phone fields based on mode */}
          {step === 'input' && (
            <div className="space-y-4">
              {/* Mode switcher */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant={authMode === 'login' ? 'default' : 'outline'}
                  onClick={() => setAuthMode('login')}
                  className="flex-1"
                >
                  Login
                </Button>
                <Button
                  variant={authMode === 'register' ? 'default' : 'outline'}
                  onClick={() => setAuthMode('register')}
                  className="flex-1"
                >
                  Register
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {t('email')} {authMode === 'register' ? '*' : '(optional)'}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required={authMode === 'register'}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {t('phone')} {authMode === 'register' ? '*' : '(optional)'}
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendOTP()}
                  required={authMode === 'register'}
                />
              </div>

              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  {authMode === 'register' 
                    ? '📧 OTP will be sent to both email and phone. You can verify with either.'
                    : '🔐 Enter either email or phone to login. OTP will be sent to verify.'}
                </p>
              </div>
              
              <Button
                type="button"
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full rounded-[25px] hover:opacity-90 transition-opacity"
                style={{ backgroundColor: loading ? '#999' : '#D55328' }}
              >
                {loading ? t('loading') : (authMode === 'register' ? 'Send OTP to Register' : 'Send OTP to Login')}
              </Button>
            </div>
          )}

          {/* NEW: Single OTP field - user enters either email or phone OTP */}
          {step === 'otp' && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800 font-medium">
                  ✨ Enter OTP from either email or phone to verify
                </p>
                <div className="flex gap-2 mt-2 text-xs">
                  {otpSentTo.email && (
                    <span className="flex items-center gap-1 text-green-700">
                      <Mail className="w-3 h-3" /> Email ✅
                    </span>
                  )}
                  {otpSentTo.phone && (
                    <span className="flex items-center gap-1 text-green-700">
                      <Phone className="w-3 h-3" /> Phone ✅
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp" className="flex items-center gap-2">
                  Enter OTP (from email or phone)
                </Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter OTP"
                  value={emailOTP || phoneOTP}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Set to emailOTP by default, will try both in verification
                    setEmailOTP(value);
                    setPhoneOTP(value);
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerifyOTP()}
                  className="text-center text-2xl tracking-widest font-mono"
                />
                <p className="text-xs text-gray-500 text-center">
                  Email OTP is 8 digits, Phone OTP is 6 digits
                </p>
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
                onClick={() => {
                  setStep('input');
                  setEmailOTP('');
                  setPhoneOTP('');
                }}
                className="w-full rounded-[25px]"
              >
                {t('back')}
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="admin" className="space-y-4">
          {/* Admin Mode Switcher */}
          <div className="flex gap-2 mb-4">
            <Button
              variant={adminMode === 'login' ? 'default' : 'outline'}
              onClick={() => setAdminMode('login')}
              className="flex-1 rounded-[25px]"
              style={{ backgroundColor: adminMode === 'login' ? '#D55328' : 'transparent' }}
            >
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
              
              <div className="space-y-2 relative">
                <Label htmlFor="password">{t('password')}</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                <Label htmlFor="admin-username">{t('username')} *</Label>
                <Input
                  id="admin-username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-email">Email *</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@example.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2 relative">
                <Label htmlFor="admin-password">{t('password')} *</Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2 relative">
                <Label htmlFor="admin-confirm-password">Confirm Password *</Label>
                <div className="relative">
                  <Input
                    id="admin-confirm-password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAdminRegister()}
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                {loading ? 'Registering...' : 'Register Admin'}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
