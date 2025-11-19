/**
 * Admin Configuration
 * 
 * SECURITY NOTICE:
 * - Change these credentials before deploying to production
 * - Do NOT commit production credentials to version control
 * - Consider adding this file to .gitignore for production deployments
 */

export const ADMIN_CONFIG = {
  /**
   * Admin username
   * Change this to a unique username for production
   */
  username: 'admin',

  /**
   * Admin password
   * CRITICAL: Change this to a strong, unique password
   * 
   * Password Requirements (recommended):
   * - At least 12 characters
   * - Mix of uppercase and lowercase letters
   * - Include numbers and special characters
   * - Not a common word or phrase
   */
  password: 'GeetaOlympiad@2025!',
};

/**
 * To use custom credentials in production:
 * 
 * Option 1: Edit this file directly (not recommended for version control)
 * - Change the username and password above
 * - Do NOT commit to git
 * 
 * Option 2: Create a local override file (recommended)
 * - Create utils/adminConfig.local.ts
 * - Export ADMIN_CONFIG with your credentials
 * - Add *.local.ts to .gitignore
 * 
 * Option 3: Build-time configuration
 * - Set up your build system to inject credentials
 * - Use different builds for development and production
 */
