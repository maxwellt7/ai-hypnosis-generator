import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase.js';
import { config } from '../config/env.js';

export class AuthService {
  async register({ email, password, name }) {
    // Check if user exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      throw new Error('User already exists');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const { data: user, error } = await supabase
      .from('users')
      .insert({ 
        email, 
        password_hash: passwordHash, 
        name 
      })
      .select()
      .single();

    if (error) throw error;

    // Create profile
    await supabase
      .from('profiles')
      .insert({ user_id: user.id });

    // Create stats
    await supabase
      .from('user_stats')
      .insert({ user_id: user.id });

    // Generate token
    const token = this.generateToken(user);

    return { user: this.sanitizeUser(user), token };
  }

  async login({ email, password }) {
    // Get user
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // Generate token
    const token = this.generateToken(user);

    return { user: this.sanitizeUser(user), token };
  }

  generateToken(user) {
    return jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        isAdmin: user.is_admin || false
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, config.jwt.secret);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  sanitizeUser(user) {
    const { password_hash, ...sanitized } = user;
    return sanitized;
  }

  async getUserById(userId) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return this.sanitizeUser(user);
  }
}

export const authService = new AuthService();

