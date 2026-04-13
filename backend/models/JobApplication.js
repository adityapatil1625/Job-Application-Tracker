const { query } = require('../config/db');

const SORT_COLUMNS = {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  appliedDate: 'applied_date',
  company: 'company',
  role: 'role',
  status: 'status',
  location: 'location',
  workMode: 'work_mode'
};

const serializeJob = (row) => {
  if (!row) {
    return null;
  }

  return {
    _id: String(row.id),
    userId: String(row.user_id),
    company: row.company,
    role: row.role,
    link: row.link,
    location: row.location,
    workMode: row.work_mode,
    appliedDate: row.applied_date,
    status: row.status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

const toDbId = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) ? parsed : null;
};

class JobApplication {
  static async create({ userId, company, role, link = '', location = '', workMode = '', appliedDate, status = 'Applied', notes = '' }) {
    let reachedOa = false;
    let reachedInterview = false;
    if (['OA', 'Interview', 'Offer'].includes(status)) reachedOa = true;
    if (['Interview', 'Offer'].includes(status)) reachedInterview = true;

    const { rows } = await query(
      `
        INSERT INTO job_applications (user_id, company, role, link, location, work_mode, applied_date, status, notes, reached_oa, reached_interview)
        VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7, NOW()), $8, $9, $10, $11)
        RETURNING *
      `,
      [toDbId(userId), company.trim(), role.trim(), link || '', location || '', workMode || '', appliedDate || null, status || 'Applied', notes || '', reachedOa, reachedInterview]
    );

    return serializeJob(rows[0]);
  }

  static async findById(id) {
    const dbId = toDbId(id);
    if (!dbId) {
      return null;
    }

    const { rows } = await query(
      'SELECT * FROM job_applications WHERE id = $1 LIMIT 1',
      [dbId]
    );

    return serializeJob(rows[0]);
  }

  static async find(queryOptions = {}, options = {}) {
    const filters = [];
    const values = [];

    if (queryOptions.userId) {
      values.push(toDbId(queryOptions.userId));
      filters.push(`user_id = $${values.length}`);
    }

    if (queryOptions.status && queryOptions.status !== 'all') {
      values.push(queryOptions.status);
      filters.push(`status = $${values.length}`);
    }

    if (queryOptions.workMode && queryOptions.workMode !== 'all') {
      values.push(queryOptions.workMode);
      filters.push(`work_mode = $${values.length}`);
    }

    if (queryOptions.search) {
      values.push(`%${queryOptions.search}%`);
      filters.push(`(company ILIKE $${values.length} OR role ILIKE $${values.length})`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const sortColumn = SORT_COLUMNS[options.sortBy] || SORT_COLUMNS.createdAt;
    const sortOrder = options.order === 'asc' ? 'ASC' : 'DESC';

    const { rows } = await query(
      `SELECT * FROM job_applications ${whereClause} ORDER BY ${sortColumn} ${sortOrder}`,
      values
    );

    return rows.map(serializeJob);
  }

  static async findByIdAndUpdate(id, updates = {}) {
    const dbId = toDbId(id);
    if (!dbId) {
      return null;
    }

    const fields = [];
    const values = [];
    const mapping = {
      company: 'company',
      role: 'role',
      link: 'link',
      location: 'location',
      workMode: 'work_mode',
      appliedDate: 'applied_date',
      status: 'status',
      notes: 'notes'
    };

    Object.entries(mapping).forEach(([inputKey, column]) => {
      if (Object.prototype.hasOwnProperty.call(updates, inputKey)) {
        values.push(updates[inputKey]);
        fields.push(`${column} = $${values.length}`);
      }
    });

    if (updates.status) {
      if (['OA', 'Interview', 'Offer'].includes(updates.status)) {
        values.push(true);
        fields.push(`reached_oa = $${values.length}`);
      }
      if (['Interview', 'Offer'].includes(updates.status)) {
        values.push(true);
        fields.push(`reached_interview = $${values.length}`);
      }
    }

    if (!fields.length) {
      return this.findById(id);
    }

    values.push(dbId);

    const { rows } = await query(
      `
        UPDATE job_applications
        SET ${fields.join(', ')}, updated_at = NOW()
        WHERE id = $${values.length}
        RETURNING *
      `,
      values
    );

    return serializeJob(rows[0]);
  }

  static async deleteById(id) {
    const dbId = toDbId(id);
    if (!dbId) {
      return false;
    }

    const result = await query(
      'DELETE FROM job_applications WHERE id = $1',
      [dbId]
    );

    return result.rowCount > 0;
  }

  static async insertMany(jobs = []) {
    const inserted = [];

    for (const job of jobs) {
      const created = await this.create(job);
      inserted.push(created);
    }

    return inserted;
  }

  static async getStatsByUser(userId) {
    const { rows } = await query(
      `
        SELECT 
          COALESCE(COUNT(*)::int, 0) as "total",
          COALESCE(COUNT(*) FILTER (WHERE status = 'Applied')::int, 0) as "Applied",
          COALESCE(COUNT(*) FILTER (WHERE reached_oa = true OR status IN ('OA', 'Interview', 'Offer'))::int, 0) as "OA",
          COALESCE(COUNT(*) FILTER (WHERE reached_interview = true OR status IN ('Interview', 'Offer'))::int, 0) as "Interview",
          COALESCE(COUNT(*) FILTER (WHERE status = 'Offer')::int, 0) as "Offer",
          COALESCE(COUNT(*) FILTER (WHERE status = 'Rejected')::int, 0) as "Rejected"
        FROM job_applications
        WHERE user_id = $1
      `,
      [toDbId(userId)]
    );

    const statsObject = rows[0] || {
      total: 0,
      Applied: 0,
      OA: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0
    };

    return statsObject;
  }
}

module.exports = JobApplication;
