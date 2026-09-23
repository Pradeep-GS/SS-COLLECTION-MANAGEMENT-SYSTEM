require('dotenv').config();
const { connectDB } = require('./db/mongoClient');
const { Staff } = require('./models/Staff');

const readline = require('readline');

async function prompt(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function seed() {
  console.log('\n=== SS Management System — Admin Setup ===\n');

  const connected = await connectDB();
  if (!connected) {
    console.error('❌ Could not connect to MongoDB. Check your MONGODB_URI in .env');
    process.exit(1);
  }

  // Check if admin already exists
  const existing = await Staff.findOne({ role: 'ADMIN' });
  if (existing) {
    console.log(`✅ Admin account already exists: ${existing.email}`);
    console.log('   If you need to reset the password, delete the Admin record from MongoDB and re-run this script.\n');
    process.exit(0);
  }

  const name = await prompt('Enter Admin name (e.g. SS Admin): ');
  const email = await prompt('Enter Admin email (e.g. admin@sstailors.com): ');
  const password = await prompt('Enter Admin password: ');

  if (!name || !email || !password) {
    console.error('❌ Name, email, and password are all required.');
    process.exit(1);
  }

  try {
    const admin = new Staff({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password.trim(), // will be hashed by pre-save hook
      role: 'ADMIN',
      staffType: null,
      isActive: true
    });

    await admin.save();

    console.log(`\n✅ Admin account created successfully!`);
    console.log(`   Name:  ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role:  ADMIN`);
    console.log('\n   You can now login at the SS Management System portal.\n');
  } catch (err) {
    console.error('❌ Failed to create admin:', err.message);
  }

  process.exit(0);
}

seed();
