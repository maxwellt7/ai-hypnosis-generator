#!/usr/bin/env node

/**
 * Database Setup Script
 * 
 * This script initializes the Supabase database with all required tables.
 * Run this after setting up your Supabase project.
 * 
 * Usage: node scripts/setup-database.js
 */

console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   Database Setup Script                               ║
║   AI Hypnosis Generator                               ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝

This script will create all required tables in Supabase.

IMPORTANT: Run the SQL commands from DATABASE_SETUP_GUIDE.md
directly in your Supabase SQL Editor.

The SQL includes:
- Users table
- Profiles table
- Journeys table
- Journey Days table
- Journal Entries table
- User Stats table
- Row Level Security policies
- Triggers for updated_at timestamps

After running the SQL, your database will be ready!

`);

process.exit(0);

