import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// In-memory user storage (replace with database in production)
interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export const users: User[] = [];

// Initialize demo user on startup
async function initDemoUser() {
  const demoPassword = await hashPassword('demo123');
  const demoUser: User = {
    id: 'demo-user-123',
    name: 'Demo User',
    email: 'demo@aiscraper.com',
    password: demoPassword,
    createdAt: new Date('2024-01-01')
  };

  // Only add if not already exists
  if (!users.find(u => u.email === demoUser.email)) {
    users.push(demoUser);
  }
}

// Initialize demo user
initDemoUser().catch(console.error);
export const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Helper function to generate JWT token
function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

// Helper function to hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

// Helper function to compare password
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Register endpoint
export const handleRegister: RequestHandler = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Name, email, and password are required' 
      });
    }

    if (password.length < 8) {
      return res.status(400).json({ 
        message: 'Password must be at least 8 characters long' 
      });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date(),
    };

    users.push(newUser);

    // Generate token
    const token = generateToken(newUser.id);

    // Return user data (without password) and token
    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    res.status(201).json({
      user: userResponse,
      token,
      message: 'User created successfully',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Login endpoint
export const handleLogin: RequestHandler = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Return user data (without password) and token
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    res.json({
      user: userResponse,
      token,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Internal server error' 
    });
  }
};

// Verify token endpoint
export const handleVerify: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ 
        message: 'No token provided' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // Find user
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found' 
      });
    }

    // Return user data (without password)
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ 
      message: 'Invalid token' 
    });
  }
};

// Get user profile endpoint
export const handleProfile: RequestHandler = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ 
        message: 'No token provided' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // Find user
    const user = users.find(u => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({ 
        message: 'User not found' 
      });
    }

    // Return user data (without password)
    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };

    res.json(userResponse);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(401).json({ 
      message: 'Invalid token' 
    });
  }
};
