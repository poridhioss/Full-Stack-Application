const pool = require('../config/database');
const User = require('../models/userModel');

async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    
    await User.createTable();
    
    console.log('Checking database connection...');
    const result = await pool.query('SELECT NOW()');
    console.log('Database connected successfully at:', result.rows[0].now);
    
    const usersCount = await pool.query('SELECT COUNT(*) FROM users');
    console.log(`Current users in database: ${usersCount.rows[0].count}`);
    
    console.log('Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();