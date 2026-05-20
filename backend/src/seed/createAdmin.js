import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { User } from '../models/User.js';

async function run() {
  const email = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@taskflow.app';
  const password = process.argv[3] || process.env.ADMIN_PASSWORD || 'Password123!';
  const name = process.argv[4] || process.env.ADMIN_NAME || 'Workspace Admin';

  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) {
    existing.role = 'admin';
    if (password) existing.password = password;
    if (name) existing.name = name;
    await existing.save();
    console.log(`Promoted existing user to admin: ${email}`);
  } else {
    await User.create({
      name,
      email,
      password,
      role: 'admin',
      title: 'Workspace Owner',
      skills: ['Operations', 'Team Management']
    });
    console.log(`Created admin user: ${email}`);
  }

  await mongoose.disconnect();
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
