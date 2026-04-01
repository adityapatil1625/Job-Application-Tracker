const bcrypt = require('bcryptjs');
const { query } = require('../config/db');

const serializeUser = (row, options = {}) => {
  if (!row) {
    return null;
  }

  const user = {
    _id: String(row.id),
    name: row.name,
    email: row.email,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };

  if (options.includePassword) {
    user.password = row.password;
  }

  return user;
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const toDbId = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) ? parsed : null;
};

class User {
  static async create({ name, email, password }) {
    const hashedPassword = await hashPassword(password);
    const normalizedEmail = email.trim().toLowerCase();

    const { rows } = await query(
      `
        INSERT INTO users (name, email, password)
        VALUES ($1, $2, $3)
        RETURNING id, name, email, created_at, updated_at
      `,
      [name.trim(), normalizedEmail, hashedPassword]
    );

    return serializeUser(rows[0]);
  }

  static async findOne(criteria = {}, options = {}) {
    if (criteria.email) {
      return this.findByEmail(criteria.email, options);
    }

    return null;
  }

  static async findByEmail(email, options = {}) {
    const { rows } = await query(
      `
        SELECT id, name, email, password, created_at, updated_at
        FROM users
        WHERE email = $1
        LIMIT 1
      `,
      [email.trim().toLowerCase()]
    );

    return serializeUser(rows[0], { includePassword: options.includePassword });
  }

  static async findById(id, options = {}) {
    const dbId = toDbId(id);
    if (!dbId) {
      return null;
    }

    const { rows } = await query(
      `
        SELECT id, name, email, password, created_at, updated_at
        FROM users
        WHERE id = $1
        LIMIT 1
      `,
      [dbId]
    );

    return serializeUser(rows[0], { includePassword: options.includePassword });
  }

  static async matchPassword(enteredPassword, hashedPassword) {
    return bcrypt.compare(enteredPassword, hashedPassword);
  }
}

module.exports = User;
