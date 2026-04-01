const { query } = require('../config/db');

const toDbId = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) ? parsed : null;
};

const serializeJobRef = (row) => {
  if (!row.job_ref_id) {
    return row.job_id ? String(row.job_id) : null;
  }

  return {
    _id: String(row.job_ref_id),
    userId: String(row.job_ref_user_id),
    company: row.job_company,
    role: row.job_role,
    link: row.job_link,
    location: row.job_location,
    appliedDate: row.job_applied_date,
    status: row.job_status,
    notes: row.job_notes,
    createdAt: row.job_created_at,
    updatedAt: row.job_updated_at
  };
};

const serializeInterview = (row) => {
  if (!row) {
    return null;
  }

  return {
    _id: String(row.id),
    jobId: serializeJobRef(row),
    userId: String(row.user_id),
    company: row.company,
    role: row.role,
    type: row.type,
    date: row.date,
    time: row.time,
    meetingLink: row.meeting_link,
    location: row.location,
    interviewer: row.interviewer,
    notes: row.notes,
    reminderSent: row.reminder_sent,
    reminderSentDate: row.reminder_sent_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
};

const baseSelect = `
  SELECT
    i.*,
    j.id AS job_ref_id,
    j.user_id AS job_ref_user_id,
    j.company AS job_company,
    j.role AS job_role,
    j.link AS job_link,
    j.location AS job_location,
    j.applied_date AS job_applied_date,
    j.status AS job_status,
    j.notes AS job_notes,
    j.created_at AS job_created_at,
    j.updated_at AS job_updated_at
  FROM interviews i
  LEFT JOIN job_applications j ON j.id = i.job_id
`;

class Interview {
  static async create({ jobId, userId, company, role, type, date, time = '', meetingLink = '', location = '', interviewer = '', notes = '' }) {
    const { rows } = await query(
      `
        INSERT INTO interviews (job_id, user_id, company, role, type, date, time, meeting_link, location, interviewer, notes)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `,
      [toDbId(jobId), toDbId(userId), company, role, type, date, time || '', meetingLink || '', location || '', interviewer || '', notes || '']
    );

    return serializeInterview(rows[0]);
  }

  static async findById(id) {
    const dbId = toDbId(id);
    if (!dbId) {
      return null;
    }

    const { rows } = await query(
      `${baseSelect} WHERE i.id = $1 LIMIT 1`,
      [dbId]
    );

    return serializeInterview(rows[0]);
  }

  static async findByUser(userId, options = {}) {
    const values = [toDbId(userId)];
    const filters = ['i.user_id = $1'];

    if (options.upcoming) {
      values.push(new Date());
      filters.push(`i.date >= $${values.length}`);
    }

    let sql = `${baseSelect} WHERE ${filters.join(' AND ')} ORDER BY i.date ASC`;

    if (options.limit) {
      values.push(options.limit);
      sql += ` LIMIT $${values.length}`;
    }

    const { rows } = await query(sql, values);
    return rows.map(serializeInterview);
  }

  static async findByIdAndUpdate(id, updates = {}) {
    const dbId = toDbId(id);
    if (!dbId) {
      return null;
    }

    const fields = [];
    const values = [];
    const mapping = {
      jobId: 'job_id',
      type: 'type',
      date: 'date',
      time: 'time',
      meetingLink: 'meeting_link',
      location: 'location',
      interviewer: 'interviewer',
      notes: 'notes',
      company: 'company',
      role: 'role'
    };

    Object.entries(mapping).forEach(([inputKey, column]) => {
      if (Object.prototype.hasOwnProperty.call(updates, inputKey)) {
        const value = inputKey === 'jobId' ? toDbId(updates[inputKey]) : updates[inputKey];
        values.push(value);
        fields.push(`${column} = $${values.length}`);
      }
    });

    if (!fields.length) {
      return this.findById(id);
    }

    values.push(dbId);

    const { rows } = await query(
      `
        UPDATE interviews
        SET ${fields.join(', ')}, updated_at = NOW()
        WHERE id = $${values.length}
        RETURNING *
      `,
      values
    );

    if (!rows[0]) {
      return null;
    }

    return this.findById(rows[0].id);
  }

  static async deleteById(id) {
    const dbId = toDbId(id);
    if (!dbId) {
      return false;
    }

    const result = await query(
      'DELETE FROM interviews WHERE id = $1',
      [dbId]
    );

    return result.rowCount > 0;
  }
}

module.exports = Interview;
