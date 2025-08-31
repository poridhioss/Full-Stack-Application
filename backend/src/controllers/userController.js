const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

const userController = {
  async createUser(req, res) {
    try {
      const { username, email, password, first_name, last_name } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
      }

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ error: 'User with this email already exists' });
      }

      const newUser = await User.create({
        username,
        email,
        password,
        first_name,
        last_name
      });

      const token = generateToken(newUser);

      res.status(201).json({
        message: 'User created successfully',
        user: newUser,
        token
      });
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Username or email already exists' });
      }
      res.status(500).json({ error: 'Failed to create user' });
    }
  },

  async getAllUsers(req, res) {
    try {
      const users = await User.findAll();
      res.json({
        message: 'Users retrieved successfully',
        count: users.length,
        users
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  },

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        message: 'User retrieved successfully',
        user
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  },

  async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, email, first_name, last_name } = req.body;

      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const updatedUser = await User.update(id, {
        username: username || existingUser.username,
        email: email || existingUser.email,
        first_name: first_name !== undefined ? first_name : existingUser.first_name,
        last_name: last_name !== undefined ? last_name : existingUser.last_name
      });

      res.json({
        message: 'User updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Error updating user:', error);
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Username or email already exists' });
      }
      res.status(500).json({ error: 'Failed to update user' });
    }
  },

  async updatePassword(req, res) {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: 'Current password and new password are required' });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const fullUser = await User.findByEmail(user.email);
      const isValidPassword = await User.verifyPassword(currentPassword, fullUser.password);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Current password is incorrect' });
      }

      await User.updatePassword(id, newPassword);

      res.json({
        message: 'Password updated successfully'
      });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ error: 'Failed to update password' });
    }
  },

  async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({ error: 'User not found' });
      }

      const deletedUser = await User.delete(id);

      res.json({
        message: 'User deleted successfully',
        user: deletedUser
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const isValidPassword = await User.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = generateToken(user);

      const { password: _, ...userWithoutPassword } = user;

      res.json({
        message: 'Login successful',
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ error: 'Failed to login' });
    }
  }
};

module.exports = userController;