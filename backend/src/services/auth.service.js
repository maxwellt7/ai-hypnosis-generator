import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
import { AuthenticationError, ConflictError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export class AuthService {
  async register({ email, password, name, phone }) {
    try {
      // Check if user already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        throw new ConflictError('User with this email already exists');
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const { data: user, error: userError } = await supabase
        .from('users')
        .insert({
          email,
          password_hash: passwordHash,
          name,
          phone,
        })
        .select()
        .single();

      if (userError) throw userError;

      // Create profile
      await supabase
        .from('profiles')
        .insert({ user_id: user.id });

      // Create user stats
      await supabase
        .from('user_stats')
        .insert({ user_id: user.id });

      // Get the created profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Generate JWT token
      const token = this.generateToken(user);

      logger.info(`User registered: ${user.email}`);

      return {
        user: {
          ...this.sanitizeUser(user),
          profile: profile || null,
        },
        token,
      };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  async login({ email, password }) {
    try {
      // Get user by email
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (error || !user) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      
      if (!isPasswordValid) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Get profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Generate JWT token
      const token = this.generateToken(user);

      logger.info(`User logged in: ${user.email}`);

      return {
        user: {
          ...this.sanitizeUser(user),
          profile: profile || null,
        },
        token,
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  async getMe(userId) {
    try {
      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !user) {
        throw new AuthenticationError('User not found');
      }

      // Get profile data
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      return {
        ...this.sanitizeUser(user),
        profile: profile || null,
      };
    } catch (error) {
      logger.error('Get user error:', error);
      throw error;
    }
  }

  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Get user
      const { data: user, error } = await supabase
        .from('users')
        .select('password_hash')
        .eq('id', userId)
        .single();

      if (error || !user) {
        throw new AuthenticationError('User not found');
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
      
      if (!isPasswordValid) {
        throw new AuthenticationError('Current password is incorrect');
      }

      // Hash new password
      const newPasswordHash = await bcrypt.hash(newPassword, 10);

      // Update password
      await supabase
        .from('users')
        .update({ password_hash: newPasswordHash })
        .eq('id', userId);

      logger.info(`Password changed for user: ${userId}`);

      return { success: true };
    } catch (error) {
      logger.error('Change password error:', error);
      throw error;
    }
  }

  generateToken(user) {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        isAdmin: user.is_admin || false,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
      }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new AuthenticationError('Invalid token');
    }
  }

  sanitizeUser(user) {
    const { password_hash, ...sanitizedUser } = user;
    return sanitizedUser;
  }
}

export const authService = new AuthService();
export default authService;

