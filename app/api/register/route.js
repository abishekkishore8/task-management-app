import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/db';
import { User } from '../../../lib/models';

export async function POST(request) {
  console.log('Registration API called');
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected');

    const body = await request.json();
    console.log('Request body:', body);
    
    const { name, email, password } = body;

    // Validate input
    if (!name || !email || !password) {
      console.log('Validation failed: Missing fields');
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    console.log('Checking for existing user...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);
    console.log('Password hashed');

    console.log('Creating user...');
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    console.log('User created successfully:', user);
    
    return NextResponse.json(
      { message: 'User created successfully', userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}