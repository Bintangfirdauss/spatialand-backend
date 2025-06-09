const express = require('express');
const cors = require('cors');
const session = require('express-session');
const pool = require('./db');

const app = express();

app.use(cors({
  origin: ['http://localhost:5500', 'https://bintangfirdauss.github.io/SpatiaLand/'],
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: 'rahasia_anda',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,         // true jika pakai HTTPS
    httpOnly: true,
    sameSite: 'none'      // agar bisa lintas domain (vercel → railway)
  }
}));

// REGISTRASI
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {
    const existing = await pool.query('SELECT * FROM "user" WHERE username = $1', [username]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Username sudah terdaftar' });
    }

    await pool.query('INSERT INTO "user" (username, password) VALUES ($1, $2)', [username, password]);
    res.status(201).json({ message: 'Registrasi berhasil' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM "user" WHERE username = $1 AND password = $2', [username, password]);
    if (result.rows.length > 0) {
      req.session.user = { username }; // Simpan ke session
      res.json({ success: true, message: 'Login berhasil' });
    } else {
      res.status(401).json({ success: false, message: 'Username atau password salah' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CEK SESSION (opsional)
app.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

// LOGOUT
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ error: 'Gagal logout' });
    res.clearCookie('connect.sid');
    res.json({ success: true });
  });
});

app.listen(3000, () => {
  console.log('Server berjalan di http://localhost:3000');
});
