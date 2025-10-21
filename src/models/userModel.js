import pool from '../config/db.js';

export const findUserByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
};

export const findUserById = async (id) => {
  const { rows } = await pool.query('SELECT id, username, email, role, avatar_url, created_at, updated_at FROM users WHERE id = $1', [id]);
  return rows[0];
};

export const createUser = async ({ username, email, passwordHash }) => {
  const { rows } = await pool.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, role, avatar_url, created_at, updated_at',
    [username, email, passwordHash]
  );
  return rows[0];
};
