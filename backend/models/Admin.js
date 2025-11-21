/**
 * Admin Model
 * Stores admin user credentials in MongoDB
 */

import bcrypt from 'bcryptjs';

/**
 * Admin Schema
 * {
 *   _id: ObjectId,
 *   username: string (unique),
 *   password: string (hashed),
 *   email: string,
 *   role: string (default: 'admin'),
 *   createdAt: Date,
 *   updatedAt: Date,
 *   lastLoginAt: Date
 * }
 */

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare password with hashed password
 */
export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

/**
 * Create a new admin
 */
export async function createAdmin(db, { username, password, email, role = 'admin' }) {
  const adminsCollection = db.collection('admins');
  
  // Check if admin already exists
  const existingAdmin = await adminsCollection.findOne({ username });
  if (existingAdmin) {
    throw new Error('Admin username already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create admin document
  const adminData = {
    username,
    password: hashedPassword,
    email: email || '',
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: null,
  };

  const result = await adminsCollection.insertOne(adminData);
  
  // Return admin without password
  const { password: _, ...adminWithoutPassword } = adminData;
  return {
    _id: result.insertedId,
    ...adminWithoutPassword,
  };
}

/**
 * Find admin by username
 */
export async function findAdminByUsername(db, username) {
  const adminsCollection = db.collection('admins');
  return adminsCollection.findOne({ username });
}

/**
 * Verify admin credentials
 */
export async function verifyAdminCredentials(db, username, password) {
  const admin = await findAdminByUsername(db, username);
  
  if (!admin) {
    return { success: false, error: 'Admin not found' };
  }

  const isMatch = await comparePassword(password, admin.password);
  
  if (!isMatch) {
    return { success: false, error: 'Invalid password' };
  }

  // Update last login time
  const adminsCollection = db.collection('admins');
  await adminsCollection.updateOne(
    { _id: admin._id },
    { 
      $set: { 
        lastLoginAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } 
    }
  );

  // Return admin without password
  const { password: _, ...adminWithoutPassword } = admin;
  return { 
    success: true, 
    admin: {
      ...adminWithoutPassword,
      _id: admin._id.toString(),
    }
  };
}

/**
 * Initialize default admin if no admins exist
 */
export async function initializeDefaultAdmin(db) {
  const adminsCollection = db.collection('admins');
  
  // Check if any admin exists
  const adminCount = await adminsCollection.countDocuments();
  
  if (adminCount === 0) {
    console.log('No admin found. Creating default admin...');
    
    // Get credentials from environment or use defaults
    const defaultUsername = process.env.ADMIN_USERNAME || 'admin';
    const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const defaultEmail = process.env.ADMIN_EMAIL || 'admin@geeta-olympiad.com';
    
    try {
      const admin = await createAdmin(db, {
        username: defaultUsername,
        password: defaultPassword,
        email: defaultEmail,
        role: 'super_admin',
      });
      
      console.log('✅ Default admin created successfully');
      console.log(`   Username: ${defaultUsername}`);
      console.log(`   Password: ${defaultPassword}`);
      console.log('   ⚠️  Please change the default password after first login!');
      
      return admin;
    } catch (error) {
      console.error('❌ Failed to create default admin:', error.message);
      throw error;
    }
  }
  
  return null;
}

/**
 * Update admin password
 */
export async function updateAdminPassword(db, adminId, newPassword) {
  const adminsCollection = db.collection('admins');
  const hashedPassword = await hashPassword(newPassword);
  
  await adminsCollection.updateOne(
    { _id: adminId },
    { 
      $set: { 
        password: hashedPassword,
        updatedAt: new Date().toISOString(),
      } 
    }
  );
}

/**
 * Get all admins (without passwords)
 */
export async function getAllAdmins(db) {
  const adminsCollection = db.collection('admins');
  const admins = await adminsCollection.find({}).toArray();
  
  return admins.map(admin => {
    const { password, ...adminWithoutPassword } = admin;
    return {
      ...adminWithoutPassword,
      _id: admin._id.toString(),
    };
  });
}

