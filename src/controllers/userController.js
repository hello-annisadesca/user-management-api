import pool from '../config/db.js';
import cloudinary from '../config/cloudinary.js';
import streamifier from 'streamifier';

// GET all users (public data only)
export const getUsers = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, username, email, role, avatar_url, created_at, updated_at FROM users ORDER BY id');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// GET single user by id (protected)
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT id, username, email, role, avatar_url, created_at, updated_at FROM users WHERE id = $1', [id]);
    if (!rows.length) return res.status(404).json({ message: 'User not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch user', error: err.message });
  }
};

// Update profile - only owner allowed
export const updateUser = async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    const authUserId = Number(req.user.id);
    if (authUserId !== targetId) return res.status(403).json({ message: 'You can only edit your own profile' });

    const { username, email, password } = req.body;

    // minimal validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: 'Invalid email' });
    if (password && password.length < 6) return res.status(400).json({ message: 'Password must be >= 6 chars' });

    // build dynamic query
    const fields = [];
    const values = [];
    let idx = 1;

    if (username) { fields.push(`username = $${idx++}`); values.push(username); }
    if (email) { fields.push(`email = $${idx++}`); values.push(email); }
    if (password) {
      const bcrypt = await import('bcryptjs');
      const hash = await bcrypt.default.hash(password, 10);
      fields.push(`password = $${idx++}`); values.push(hash);
    }

    if (fields.length === 0) return res.status(400).json({ message: 'No fields to update' });

    // always update updated_at
    fields.push(`updated_at = NOW()`);

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING id, username, email, role, avatar_url, created_at, updated_at`;
    values.push(targetId);

    const { rows } = await pool.query(query, values);
    res.json({ message: 'Profile updated', user: rows[0] });
  } catch (err) {
    console.error(err);
    // handle unique violation codes
    if (err.code === '23505') {
      return res.status(409).json({ message: 'Username or email already exists' });
    }
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// Delete user - only owner allowed
export const deleteUser = async (req, res) => {
  try {
    const targetId = Number(req.params.id);
    const authUserId = Number(req.user.id);
    if (authUserId !== targetId) return res.status(403).json({ message: 'You can only delete your own account' });

    await pool.query('DELETE FROM users WHERE id = $1', [targetId]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
};

// Upload avatar to Cloudinary and save secure_url to avatar_url for the authenticated user
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const uploadStream = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'avatars', resource_type: 'image' },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });

    const result = await uploadStream();
    const { id } = req.user;

    await pool.query('UPDATE users SET avatar_url = $1, updated_at = NOW() WHERE id = $2', [result.secure_url, id]);

    res.json({ message: 'Avatar uploaded', url: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};
