
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();


app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Job Application Tracker API is running');
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`Visit: http://localhost:${PORT}`);
});