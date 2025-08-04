const express = require('express');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const UPLOADS_DIR = path.join(__dirname, '../uploads');

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.user = decoded;
    next();
  });
}

// Serve uploaded videos
router.use('/files', express.static(UPLOADS_DIR));

router.get('/', verifyToken, async (req, res) => {
  if (req.user.role === 'admin') {
    const { rows } = await pool.query(`
      SELECT v.*, u.username AS uploaded_by_name
      FROM videos v JOIN users u ON v.uploaded_by = u.id
    `);
    return res.json(rows);
  }

  const { rows } = await pool.query(`
    SELECT v.*, u.username AS uploaded_by_name
    FROM videos v JOIN users u ON v.uploaded_by = u.id
    WHERE topic = ANY($1::text[])
  `, [req.user.assigned_topics]);

  res.json(rows);
});


router.post('/upload', verifyToken, upload.single('video'), async (req, res) => {
  const { title, description, topic } = req.body;
  const role = req.user.role;

  // Admin can upload to any topic
  if (role !== 'admin') {
    if (!req.user.assigned_topics.includes(topic)) {
      return res.status(403).json({ message: 'Unauthorized topic' });
    }
  }

  const videoUrl = `http://localhost:5000/api/videos/files/${req.file.filename}`;

  await pool.query(
    `INSERT INTO videos (title, description, topic, video_url, uploaded_by)
     VALUES ($1, $2, $3, $4, $5)`,
    [title, description, topic, videoUrl, req.user.id]
  );

  res.json({ message: 'Video uploaded successfully', videoUrl });
});

router.delete('/:id', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  const { id } = req.params;

  // Optional: Delete actual file from disk
  const result = await pool.query('SELECT video_url FROM videos WHERE id = $1', [id]);
  if (result.rows.length) {
    const filePath = result.rows[0].video_url.split('/files/')[1];
    const fs = require('fs');
    const path = require('path');
    fs.unlink(path.join(__dirname, '../uploads/', filePath), err => {
      if (err) console.error('Failed to delete file:', err);
    });
  }

  await pool.query('DELETE FROM videos WHERE id = $1', [id]);
  res.json({ message: 'Video deleted' });
});


module.exports = router;
