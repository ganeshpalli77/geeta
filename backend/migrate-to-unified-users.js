/**
 * Migration Script: Merge email_users and phone_users into unified users collection
 * 
 * This script migrates existing users from separate email_users and phone_users collections
 * into a single unified users collection with both email and phone fields.
 * 
 * Run this script once after deploying the new authentication system.
 */

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb+srv://admin:admin123@cluster0.ixnaagr.mongodb.net/geeta-olympiad?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(uri);

async function migrateUsers() {
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');

    const db = client.db('geeta-olympiad');
    const usersCollection = db.collection('users');
    const emailUsersCollection = db.collection('email_users');
    const phoneUsersCollection = db.collection('phone_users');
    const profilesCollection = db.collection('profiles');

    // Get all existing users
    const existingUsers = await usersCollection.find({}).toArray();
    const emailUsers = await emailUsersCollection.find({}).toArray();
    const phoneUsers = await phoneUsersCollection.find({}).toArray();

    console.log(`\n📊 Current state:`);
    console.log(`   - Users collection: ${existingUsers.length} documents`);
    console.log(`   - Email users collection: ${emailUsers.length} documents`);
    console.log(`   - Phone users collection: ${phoneUsers.length} documents`);

    let migrated = 0;
    let updated = 0;
    let skipped = 0;

    // Create a map of existing users by email and phone for quick lookup
    const usersByEmail = new Map();
    const usersByPhone = new Map();
    
    for (const user of existingUsers) {
      if (user.email) usersByEmail.set(user.email, user);
      if (user.phone) usersByPhone.set(user.phone, user);
    }

    console.log('\n🔄 Starting migration...\n');

    // Process email users
    for (const emailUser of emailUsers) {
      const email = emailUser.email;
      const userId = emailUser._id.toString();

      // Check if this email already exists in users collection
      const existingUser = usersByEmail.get(email);

      if (existingUser) {
        // User exists - update if needed
        if (!existingUser.emailVerified) {
          await usersCollection.updateOne(
            { _id: existingUser._id },
            { 
              $set: { 
                emailVerified: true,
                registeredAt: emailUser.registeredAt,
                lastLogin: emailUser.lastLogin || null,
                updatedAt: new Date()
              } 
            }
          );
          updated++;
          console.log(`✏️  Updated existing user: ${email}`);
        } else {
          skipped++;
          console.log(`⏭️  Skipped (already migrated): ${email}`);
        }
      } else {
        // New user - need to find if they have a phone number
        // Check profiles to find associated phone user
        const profiles = await profilesCollection.find({ userId: userId }).toArray();
        let phoneNumber = null;

        if (profiles.length > 0) {
          // Try to find phone users that might belong to this user
          for (const phoneUser of phoneUsers) {
            const phoneProfiles = await profilesCollection.find({ 
              userId: phoneUser._id.toString() 
            }).toArray();
            
            // If any profile names match, assume it's the same user
            const matchingProfile = phoneProfiles.find(pp => 
              profiles.some(p => p.name === pp.name || p.prn === pp.prn)
            );
            
            if (matchingProfile) {
              phoneNumber = phoneUser.phone;
              break;
            }
          }
        }

        // Create new unified user
        const newUser = {
          userId: userId,
          email: email,
          phone: phoneNumber || '',
          emailVerified: true,
          phoneVerified: !!phoneNumber,
          verifiedWith: 'email',
          registeredAt: emailUser.registeredAt,
          lastLogin: emailUser.lastLogin || null,
          createdAt: emailUser.registeredAt,
          updatedAt: new Date()
        };

        await usersCollection.insertOne(newUser);
        migrated++;
        console.log(`➕ Created new user: ${email}${phoneNumber ? ` + ${phoneNumber}` : ''}`);
      }
    }

    // Process phone users that weren't matched with email users
    for (const phoneUser of phoneUsers) {
      const phone = phoneUser.phone;
      const userId = phoneUser._id.toString();

      // Check if this phone already exists in users collection
      const existingUser = usersByPhone.get(phone);

      if (existingUser) {
        // User exists - update phone verification if needed
        if (!existingUser.phoneVerified) {
          await usersCollection.updateOne(
            { _id: existingUser._id },
            { 
              $set: { 
                phoneVerified: true,
                lastLogin: phoneUser.lastLogin || existingUser.lastLogin,
                updatedAt: new Date()
              } 
            }
          );
          updated++;
          console.log(`✏️  Updated existing user: ${phone}`);
        } else {
          skipped++;
          console.log(`⏭️  Skipped (already migrated): ${phone}`);
        }
      } else {
        // Check if this phone user has an email (shouldn't happen, but check anyway)
        const profiles = await profilesCollection.find({ userId: userId }).toArray();
        let emailAddress = null;

        if (profiles.length > 0) {
          // Try to find email users that might belong to this user
          for (const emailUser of emailUsers) {
            const emailProfiles = await profilesCollection.find({ 
              userId: emailUser._id.toString() 
            }).toArray();
            
            const matchingProfile = emailProfiles.find(ep => 
              profiles.some(p => p.name === ep.name || p.prn === ep.prn)
            );
            
            if (matchingProfile) {
              emailAddress = emailUser.email;
              break;
            }
          }
        }

        // Only create if no email was found (otherwise would be duplicate)
        if (!emailAddress) {
          const newUser = {
            userId: userId,
            email: '',
            phone: phone,
            emailVerified: false,
            phoneVerified: true,
            verifiedWith: 'phone',
            registeredAt: phoneUser.registeredAt,
            lastLogin: phoneUser.lastLogin || null,
            createdAt: phoneUser.registeredAt,
            updatedAt: new Date()
          };

          await usersCollection.insertOne(newUser);
          migrated++;
          console.log(`➕ Created new user: ${phone}`);
        } else {
          skipped++;
          console.log(`⏭️  Skipped (matched with email): ${phone}`);
        }
      }
    }

    console.log(`\n✅ Migration completed!`);
    console.log(`   - New users created: ${migrated}`);
    console.log(`   - Existing users updated: ${updated}`);
    console.log(`   - Users skipped: ${skipped}`);

    // Final count
    const finalCount = await usersCollection.countDocuments({});
    console.log(`\n📊 Final state:`);
    console.log(`   - Total users in unified collection: ${finalCount}`);

    console.log(`\n⚠️  Note: email_users and phone_users collections are NOT deleted.`);
    console.log(`   You can manually delete them after verifying the migration.`);
    console.log(`   To delete: db.email_users.drop() and db.phone_users.drop()`);

  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  } finally {
    await client.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run migration
console.log('🚀 Starting MongoDB User Migration...\n');
migrateUsers()
  .then(() => {
    console.log('\n✨ Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  });
