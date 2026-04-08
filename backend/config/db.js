const { Pool } = require('pg');

let cached = global.jobTrackerPg;

if (!cached) {
  cached = global.jobTrackerPg = {
    pool: null,
    connectPromise: null,
    connected: false
  };
}

const schemaSql = `
  CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  CREATE TABLE IF NOT EXISTS job_applications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    link TEXT NOT NULL DEFAULT '',
    location VARCHAR(100) NOT NULL DEFAULT '',
    applied_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'Applied',
    notes TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT job_applications_status_check
      CHECK (status IN ('Applied', 'OA', 'Interview', 'Offer', 'Rejected'))
  );

  CREATE TABLE IF NOT EXISTS interviews (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL REFERENCES job_applications(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    time VARCHAR(50) NOT NULL DEFAULT '',
    meeting_link TEXT NOT NULL DEFAULT '',
    location VARCHAR(255) NOT NULL DEFAULT '',
    interviewer VARCHAR(255) NOT NULL DEFAULT '',
    notes TEXT NOT NULL DEFAULT '',
    reminder_sent BOOLEAN NOT NULL DEFAULT FALSE,
    reminder_sent_date TIMESTAMPTZ NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT interviews_type_check
      CHECK (type IN ('Phone Screen', 'Technical', 'Onsite', 'System Design', 'HR', 'Other'))
  );

  CREATE INDEX IF NOT EXISTS idx_job_applications_user_created_at
    ON job_applications(user_id, created_at DESC);
  CREATE INDEX IF NOT EXISTS idx_job_applications_user_status
    ON job_applications(user_id, status);
  CREATE INDEX IF NOT EXISTS idx_interviews_user_date
    ON interviews(user_id, date);
  CREATE INDEX IF NOT EXISTS idx_interviews_date
    ON interviews(date);

  ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS reached_oa BOOLEAN DEFAULT FALSE;
  ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS reached_interview BOOLEAN DEFAULT FALSE;
`;

const getConnectionString = () =>
  process.env.DATABASE_URL ||
  process.env.SUPABASE_DB_URL ||
  process.env.POSTGRES_URL;

const createPool = () => {
  const connectionString = getConnectionString();

  if (!connectionString) {
    throw new Error('Database URL is missing. Set DATABASE_URL (or SUPABASE_DB_URL / POSTGRES_URL) in environment variables.');
  }

  if (connectionString.includes('[YOUR-PASSWORD]')) {
    throw new Error('DATABASE_URL still contains [YOUR-PASSWORD]. Replace it with your real Supabase database password.');
  }

  const pool = new Pool({
    connectionString,
    ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
    max: Number(process.env.DB_POOL_MAX || 10),
    idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS || 30000),
    connectionTimeoutMillis: Number(process.env.DB_CONNECT_TIMEOUT_MS || 15000)
  });

  pool.on('error', (error) => {
    cached.connected = false;
    console.error(`Database pool error: ${error.message}`);
  });

  return pool;
};

const initializeSchema = async (pool) => {
  await pool.query(schemaSql);
};

const connectDB = async () => {
  if (cached.pool && cached.connected) {
    return cached.pool;
  }

  if (!cached.connectPromise) {
    cached.connectPromise = (async () => {
      const pool = cached.pool || createPool();
      cached.pool = pool;

      await pool.query('SELECT 1');
      await initializeSchema(pool);

      cached.connected = true;
      console.log('Database connected successfully');

      return pool;
    })();
  }

  try {
    return await cached.connectPromise;
  } catch (error) {
    cached.connected = false;
    cached.connectPromise = null;
    console.error(`Database connection failed: ${error.message}`);
    throw error;
  }
};

const query = async (text, params = []) => {
  const pool = await connectDB();
  return pool.query(text, params);
};

const isDbConnected = () => cached.connected;

module.exports = connectDB;
module.exports.query = query;
module.exports.isDbConnected = isDbConnected;
