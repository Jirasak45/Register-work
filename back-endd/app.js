const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const dayjs = require('dayjs');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const port = 5000;

// Set up CORS
app.use(cors({
  origin: "*"
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



const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'torjirasak45@gmail.com',
    pass: 'zktn ugzj wuyd yyid'
  },
  tls: {
    rejectUnauthorized: false
  }
});


app.post('/submit', upload.single('file'), (req, res) => {
  const { name, position, birthDate, gpa, address, contactNumber, email } = req.body;
  const file = req.file ? req.file.filename : null;

  // Convert birthDate to YYYY-MM-DD format
  const birthday = dayjs(birthDate).format('YYYY-MM-DD');

  // Save data to MySQL
  const query = 'INSERT INTO userdata (name, position, birthday, grade, address, numberphone, uploadfile, email) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(query, [name, position, birthday, gpa, address, contactNumber, file, email], (err, result) => {
    if (err) {
      console.error('Error inserting data into the database:', err);
      res.status(500).send('Error saving data');
      return;
    }

    // Send confirmation email
    const mailOptions = {
      from: 'torjirasak45@gmail.com',
      to: email,
      subject: '🎉 ขอบคุณที่ลงทะเบียนสมัครเป็นนักศึกษาฝึกงานกับเรา! 🎉',
      html: `
        <div style="font-family: 'Sarabun', sans-serif; color: #333;">
          <h2>สวัสดีคุณ ${name} 👋</h2>
          <p>ขอบคุณที่ลงทะเบียนกับเรา! 🙏 เรามีความยินดีที่จะแจ้งให้ทราบว่า:</p>
          <ul>
            <li>✅ การลงทะเบียนสมัครฝึกงานของคุณเสร็จสมบูรณ์แล้ว</li>
            <li>📋 ข้อมูลของคุณได้ถูกบันทึกเข้าระบบเรียบร้อยแล้ว</li>
            <li>🔐 ข้อมูลของคุณจะถูกเก็บรักษาอย่างปลอดภัย</li>
          </ul>
          <p>หากคุณมีคำถามหรือต้องการความช่วยเหลือใดๆ โปรดติดต่อมาทางอีเมลช่องทางนี้ 📞</p>
          <p>เราหวังว่าคุณจะได้เข้าร่วมการทำงานกับเรา! 😊</p>
          <br>
          <p>ด้วยความปรารถนาดี,</p>
          <p><strong>ทีมงานของเรา</strong> 🏢</p>
        </div>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email: ', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(200).send('Form submitted successfully and confirmation email sent');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
