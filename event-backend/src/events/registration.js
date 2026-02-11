const pool = require("../../db");

exports.join = async (req, res) => {
    const eventId = Number(req.params.id);
    const userId = Number(req.user.id);

    try {
        await pool.query("BEGIN");

        // lock la ligne event pour éviter race condition sur capacity
        const ev = await pool.query(
            `SELECT id, date, capacity
       FROM events
       WHERE id = $1
       FOR UPDATE`,
            [eventId]
        );

        if (ev.rowCount === 0) {
            await pool.query("ROLLBACK");
            return res.status(404).json({ error: "Event not found" });
        }

        const { date, capacity } = ev.rows[0];

        // bloque si passé
        const now = new Date();
        if (new Date(date) <= now) {
            await pool.query("ROLLBACK");
            return res.status(400).json({ error: "Event is in the past" });
        }

        // déjà inscrit ?
        const already = await pool.query(
            `SELECT 1 FROM event_registrations WHERE event_id=$1 AND user_id=$2`,
            [eventId, userId]
        );
        if (already.rowCount > 0) {
            await pool.query("ROLLBACK");
            return res.status(409).json({ error: "Already joined" });
        }

        // combien d'inscrits ?
        const count = await pool.query(
            `SELECT COUNT(*)::int AS c FROM event_registrations WHERE event_id=$1`,
            [eventId]
        );
        const attendees = count.rows[0].c;

        if (attendees >= capacity) {
            await pool.query("ROLLBACK");
            return res.status(409).json({ error: "Event is full" });
        }

        // insert inscription
        await pool.query(
            `INSERT INTO event_registrations (event_id, user_id) VALUES ($1, $2)`,
            [eventId, userId]
        );

        // renvoyer nouveau count
        const newCount = attendees + 1;

        await pool.query("COMMIT");
        return res.status(201).json({
            success: true,
            attendees_count: newCount,
            is_joined: true,
        });
    } catch (err) {
        await pool.query("ROLLBACK");
        console.error("join error", err);
        res.status(500).json({ error: "server error" });
    }
};

exports.leave = async (req, res) => {
    const eventId = Number(req.params.id);
    const userId = Number(req.user.id);

    try {
        const r = await pool.query(
            `DELETE FROM event_registrations
       WHERE event_id = $1 AND user_id = $2
       RETURNING user_id`,
            [eventId, userId]
        );

        if (r.rowCount === 0) {
            return res.status(409).json({ error: "Not joined" });
        }

        const count = await pool.query(
            `SELECT COUNT(*)::int AS c FROM event_registrations WHERE event_id=$1`,
            [eventId]
        );

        res.json({
            success: true,
            attendees_count: count.rows[0].c,
            is_joined: false,
        });
    } catch (err) {
        console.error("leave error", err);
        res.status(500).json({ error: "server error" });
    }
};

