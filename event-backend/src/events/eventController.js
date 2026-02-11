const pool = require("../../db");

exports.list = async (req, res) => {
    try {
        const userId = req.user?.id; // normalement toujours là si route protégée

        const r = await pool.query(
            `
      SELECT 
        e.id, e.title, e.date, e.location, e.owner_id, e.capacity, e.created_at,
        COALESCE(COUNT(er.user_id), 0)::int AS attendees_count,
        CASE WHEN $1::int IS NULL THEN false
             ELSE BOOL_OR(er.user_id = $1::int)
        END AS is_joined
      FROM events e
      LEFT JOIN event_registrations er ON er.event_id = e.id
      GROUP BY e.id
      ORDER BY e.created_at DESC
      `,
            [userId]
        );

        res.json({ events: r.rows });
    } catch (err) {
        console.error("list error", err);
        res.status(500).json({ error: "server error" });
    }
};

exports.create = async (req, res) => {
    try {
        const { title, date, location, capacity } = req.body;
        const ownerId = req.user.id;

        const eventDate = new Date(date);
        if (Number.isNaN(eventDate.getTime())) {
            return res.status(400).json({ error: "Date invalide" });
        }

        if (eventDate <= new Date()) {
            return res.status(400).json({ error: "Impossible de créer un événement dans le passé" });
        }

        const r = await pool.query(
            `INSERT INTO events (title, date, location, capacity, owner_id)
             VALUES ($1, $2, $3, $4, $5)
                 RETURNING id, title, date, location, capacity, owner_id, created_at`,
            [title, date, location, capacity ?? 10, ownerId]
        );

        res.status(201).json({ event: r.rows[0] });
    } catch (err) {
        console.error("create error", err);
        res.status(500).json({ error: "server error" });
    }
};


exports.remove = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const userId = req.user.id;

        const r = await pool.query(
            `DELETE FROM events
             WHERE id = $1 AND owner_id = $2
                 RETURNING id`,
            [id, userId]
        );

        if (r.rowCount === 0) {
            return res.status(403).json({ error: "Not allowed" });
        }

        res.json({ success: true });
    } catch (err) {
        console.error("delete error", err);
        res.status(500).json({ error: "server error" });
    }
};

exports.update = async (req, res) => {
    try {
        const id = Number(req.params.id);
        const userId = req.user.id;
        const { title, date, location, capacity } = req.body;

        if (!title || !date || !location) {
            return res.status(400).json({ error: "Champs manquants" });
        }

        const eventDate = new Date(date);
        if (Number.isNaN(eventDate.getTime())) {
            return res.status(400).json({ error: "Date invalide" });
        }

        if (eventDate <= new Date()) {
            return res.status(400).json({ error: "Impossible de modifier un événement dans le passé" });
        }

        const r = await pool.query(
            `UPDATE events
             SET title = $1,
                 date = $2,
                 location = $3,
                 capacity = $4
             WHERE id = $5 AND owner_id = $6
             RETURNING id, title, date, location, capacity, owner_id, created_at`,
            [title, date, location, capacity ?? 10, id, userId]
        );

        if (r.rowCount === 0) {
            return res.status(403).json({ error: "Not allowed" });
        }

        res.json({ event: r.rows[0] });
    } catch (err) {
        console.error("update error", err);
        res.status(500).json({ error: "server error" });
    }
};
