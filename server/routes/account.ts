import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Import user storage from auth routes
import { users, JWT_SECRET, hashPassword, comparePassword } from "./auth";

// Helper function to verify JWT token and get user ID
function getUserIdFromToken(authHeader: string | undefined): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded.userId;
  } catch {
    return null;
  }
}

// Update user profile
export const updateProfile: RequestHandler = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { name, email } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({ 
        message: 'Name and email are required' 
      });
    }

    // Find user
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is already taken by another user
    const emailExists = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.id !== userId);
    if (emailExists) {
      return res.status(400).json({ 
        message: 'Email address is already in use' 
      });
    }

    // Update user
    users[userIndex].name = name.trim();
    users[userIndex].email = email.toLowerCase().trim();

    // Return updated user data (without password)
    const userResponse = {
      id: users[userIndex].id,
      name: users[userIndex].name,
      email: users[userIndex].email,
    };

    res.json({
      user: userResponse,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Change password
export const changePassword: RequestHandler = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: 'Current password and new password are required' 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'New password must be at least 6 characters long' 
      });
    }

    // Find user
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ 
        message: 'Current password is incorrect' 
      });
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    user.password = hashedNewPassword;

    res.json({
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete account
export const deleteAccount: RequestHandler = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find user index
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove user
    users.splice(userIndex, 1);

    // Also remove all crawlers created by this user
    const { crawlers } = require('./crawlers');
    const userCrawlerIndices = [];
    for (let i = crawlers.length - 1; i >= 0; i--) {
      if (crawlers[i].created_by === userId) {
        userCrawlerIndices.push(i);
      }
    }
    
    // Remove crawlers in reverse order to maintain indices
    userCrawlerIndices.forEach(index => {
      crawlers.splice(index, 1);
    });

    res.json({
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Get account statistics
export const getAccountStats: RequestHandler = async (req, res) => {
  try {
    const userId = getUserIdFromToken(req.headers.authorization);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find user
    const user = users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's crawlers count
    const { crawlers } = require('./crawlers');
    const userCrawlers = crawlers.filter((c: any) => c.created_by === userId);

    const stats = {
      accountCreated: user.createdAt,
      totalCrawlers: userCrawlers.length,
      lastLogin: new Date().toISOString(), // In a real app, this would be tracked
      storageUsed: '0 MB', // Placeholder for future implementation
    };

    res.json(stats);
  } catch (error) {
    console.error('Get account stats error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
