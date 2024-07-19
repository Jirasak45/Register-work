const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const dayjs = require('dayjs');
const cors = require('cors'); // Import cors

const app = express();
const port = 5000;

// Set up CORS
app.use(cors({
  origin: 'http://localhost:5173'
}));

// Set up MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'registerdata',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database.');
});

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Handle form submission
app.post('/submit', upload.single('file'), (req, res) => {
  const { name, position, birthDate, gpa, address, contactNumber } = req.body;
  const file = req.file ? req.file.filename : null;

  // Convert birthDate to YYYY-MM-DD format
  const birthday = dayjs(birthDate).format('YYYY-MM-DD');

  // Save data to MySQL
  const query = 'INSERT INTO userdata (name, position, birthday, grade, address, numberphone, uploadfile) VALUES (?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [name, position, birthday, gpa, address, contactNumber, file], (err, result) => {
    if (err) {
      console.error('Error inserting data into the database:', err);
      res.status(500).send('Error saving data');
      return;
    }
    res.status(200).send('Form submitted successfully');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
