import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

// simple validators
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isValidPassword = (pw) => typeof pw === 'string' && pw.length >= 6;

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: 'username, email and password are required' });

    if (!isValidEmail(email))
      return res.status(400).json({ message: 'Invalid email format' });

    if (!isValidPassword(password))
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    // check duplicates
    const { rows: emailRows } = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (emailRows.length) return res.status(409).json({ message: 'Email already registered' });

    const { rows: usernameRows } = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (usernameRows.length) return res.status(409).json({ message: 'Username already taken' });

    const hashed = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, role, avatar_url, created_at';
    const { rows } = await pool.query(query, [username, email, hashed]);

    res.status(201).json({ message: 'User registered', user: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error registering user', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    // sign token with id, email, role
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '2h' });

    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};
