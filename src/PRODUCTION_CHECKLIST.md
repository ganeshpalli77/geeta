# Production Deployment Checklist

## ✅ Pre-Deployment Verification

### Authentication Configuration
- [x] `AUTH_MODE` set to `'supabase'` in `/utils/config.ts`
- [ ] Supabase phone provider enabled and configured
- [ ] Supabase email provider enabled and tested
- [ ] Auth Hooks properly configured (no authorization token errors)
- [ ] Test OTP flow for both phone and email

### Security
- [ ] **CRITICAL:** Change admin credentials in `/utils/adminConfig.ts`
  - Default: `admin` / `GeetaOlympiad@2025!`
  - Change to unique, secure credentials
  - See `/GITIGNORE_RECOMMENDATIONS.md` for security best practices
- [ ] Enable Row Level Security (RLS) in Supabase
- [ ] Configure proper CORS in Supabase
- [ ] Review and secure all API endpoints
- [ ] Set up rate limiting in Supabase

### Supabase Configuration
- [ ] Phone provider configured (Twilio/Messagebird)
- [ ] SMS quota and billing set up
- [ ] Email templates customized
- [ ] Database backups enabled
- [ ] Monitor usage limits
- [ ] Set up alerts for quota limits

### Testing
- [ ] Test complete registration flow (phone)
- [ ] Test complete registration flow (email)
- [ ] Test profile creation
- [ ] Test all quiz types (practice, quiz1, quiz2, quiz3)
- [ ] Test event submissions (video, slogan)
- [ ] Test image puzzle collection
- [ ] Test leaderboard
- [ ] Test admin panel login
- [ ] Test admin review functionality
- [ ] Mobile responsiveness testing
- [ ] Cross-browser testing

### UI Cleanup
- [x] All "demo" messages removed from UI
- [x] All "mock" references removed from user-facing text
- [x] Practice quiz properly labeled
- [x] Admin login hints removed

### Data
- [ ] Initialize quiz questions in production database
- [ ] Set up quiz unlock dates
- [ ] Configure event dates and deadlines
- [ ] Set up proper scoring thresholds

### Performance
- [ ] Test with realistic data load
- [ ] Monitor Supabase performance
- [ ] Check image loading performance
- [ ] Optimize bundle size if needed

### Monitoring
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure Supabase logs monitoring
- [ ] Set up uptime monitoring
- [ ] Create analytics dashboard

## 🔧 Required Configuration Changes

### Admin Credentials

Edit `/utils/adminConfig.ts`:

```typescript
export const ADMIN_CONFIG = {
  username: 'your_admin_username',  // CHANGE THIS!
  password: 'your_secure_password_here',  // CHANGE THIS!
};
```

**Security:**
- See `/GITIGNORE_RECOMMENDATIONS.md` for best practices
- Do NOT commit production credentials to git
- Use strong, unique passwords (12+ characters)

### Supabase Configuration

Already configured in `/utils/config.ts`:
- URL: https://kiaozqbwolqauxjmwlks.supabase.co
- Anon Key: (already set)

No environment variables needed for frontend-only deployment.

## 📝 Post-Deployment

### Immediate Actions
- [ ] Test OTP flow with real phone numbers
- [ ] Test email OTP delivery
- [ ] Monitor Supabase logs for errors
- [ ] Check SMS delivery rates
- [ ] Monitor error rates

### First 24 Hours
- [ ] Monitor user registration
- [ ] Check for authentication errors
- [ ] Monitor quiz submission
- [ ] Check leaderboard updates
- [ ] Monitor database usage

### Ongoing
- [ ] Daily check of Supabase logs
- [ ] Weekly review of user activity
- [ ] Monitor SMS/email costs
- [ ] Review admin actions
- [ ] Check for abuse/spam

## 🚨 Common Issues & Solutions

### Issue: OTP Not Received
**Solutions:**
1. Check Supabase logs for delivery errors
2. Verify phone provider credentials
3. Check phone number format (+91 prefix)
4. Verify SMS provider quota not exceeded
5. Try email OTP as alternative

### Issue: "Hook requires authorization token"
**Solutions:**
1. Check Auth Hook configuration in Supabase
2. Ensure hook doesn't require additional auth
3. Review Supabase auth logs
4. Test with email OTP first

### Issue: Phone Provider Disabled
**Solutions:**
1. Enable phone provider in Supabase Dashboard
2. Configure SMS service (Twilio recommended)
3. Add provider API credentials
4. Test with small number first

### Issue: Admin Can't Login
**Solutions:**
1. Verify credentials match `/utils/config.ts`
2. Check if environment variables are set
3. Clear browser cache/session
4. Check browser console for errors

## 📊 Monitoring Dashboard

Set up monitoring for:
- **User Metrics:** Registrations, logins, active users
- **Quiz Metrics:** Attempts, completion rate, average scores
- **Event Metrics:** Submissions, approval rate
- **System Metrics:** API response times, error rates, uptime
- **Cost Metrics:** SMS costs, Supabase usage, bandwidth

## 🔐 Security Hardening

### Supabase Security
1. Enable RLS on all tables
2. Create policies for user data access
3. Limit admin access to specific IPs (optional)
4. Enable 2FA for Supabase dashboard
5. Regular security audits

### Application Security
1. Sanitize user inputs
2. Validate all form data
3. Rate limit API calls
4. Implement CAPTCHA for registration (if spam occurs)
5. Monitor for suspicious activity

## 📞 Support Contacts

Ensure these are set up:
- [ ] Support email address
- [ ] Admin contact information
- [ ] Emergency escalation process
- [ ] Supabase support access
- [ ] SMS provider support contact

## 🎯 Success Criteria

Your deployment is successful when:
- ✅ Users can register via phone/email OTP
- ✅ Users can create profiles
- ✅ Users can take quizzes
- ✅ Leaderboard updates correctly
- ✅ Admin can review submissions
- ✅ No authentication errors in logs
- ✅ SMS/Email delivery > 95%
- ✅ Page load time < 3 seconds

## 📋 Rollback Plan

If critical issues occur:
1. Switch `AUTH_MODE` back to `'mock'` temporarily
2. Deploy rollback version
3. Investigate issues in Supabase logs
4. Fix and test in staging
5. Re-deploy when ready

## 🎓 Training

Ensure admins know:
- How to review submissions
- How to assign scores
- How to monitor users
- How to handle support requests
- How to check logs
- Emergency procedures

---

**Last Updated:** [Update this date when deploying]

**Deployed By:** [Your name]

**Production URL:** [Your production URL]
