// server.js - Final NEET Prediction Backend (ready to deploy)
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Detailed marks vs rank range (NEET 2024) with +8% adjustment for NEET 2025
const marksRankMap = [
  { min: 720, max: 715, rank: 10 },
  { min: 714, max: 710, rank: 50 },
  { min: 709, max: 700, rank: 200 },
  { min: 699, max: 690, rank: 512 },
  { min: 689, max: 680, rank: 971 },
  { min: 679, max: 670, rank: 1701 },
  { min: 669, max: 660, rank: 2751 },
  { min: 659, max: 650, rank: 4163 },
  { min: 649, max: 640, rank: 6061 },
  { min: 639, max: 630, rank: 8522 },
  { min: 629, max: 620, rank: 11463 },
  { min: 619, max: 610, rank: 15057 },
  { min: 609, max: 590, rank: 23731 },
  { min: 589, max: 580, rank: 28745 },
  { min: 579, max: 570, rank: 34361 },
  { min: 569, max: 560, rank: 40257 },
  { min: 559, max: 550, rank: 46767 },
  { min: 549, max: 540, rank: 53542 },
  { min: 539, max: 530, rank: 60853 },
  { min: 529, max: 450, rank: 125747 },
  { min: 449, max: 400, rank: 177800 },
  { min: 399, max: 350, rank: 241657 },
  { min: 349, max: 300, rank: 320666 },
  { min: 299, max: 250, rank: 417675 },
  { min: 249, max: 200, rank: 540347 },
  { min: 199, max: 150, rank: 710354 },
  { min: 149, max: 100, rank: 990231 },
  { min: 99, max: 50, rank: 1460741 },
  { min: 49, max: 0, rank: 1750199 }
];

// Sample colleges with detailed cutoffs (category-wise)
const colleges = [
  {
    name: "AIIMS Delhi",
    categoryCutoff: {
      general: 50,
      ews: 214,
      obc: 186,
      sc: 647,
      st: 1150
    }
  },
  {
    name: "Maulana Azad Medical College",
    categoryCutoff: {
      general: 120,
      ews: 600,
      obc: 500,
      sc: 1800,
      st: 3000
    }
  },
  {
    name: "KGMU Lucknow",
    categoryCutoff: {
      general: 600,
      ews: 1300,
      obc: 1800,
      sc: 4200,
      st: 6500
    }
  },
  {
    name: "Government Medical College Jaipur",
    categoryCutoff: {
      general: 1200,
      ews: 2200,
      obc: 2500,
      sc: 5200,
      st: 8200
    }
  },
  {
    name: "Any Govt. MBBS Seat (India)",
    categoryCutoff: {
      general: 50000,
      ews: 80000,
      obc: 90000,
      sc: 140000,
      st: 180000
    }
  }
];

function estimateRank(marks) {
  for (let range of marksRankMap) {
    if (marks <= range.min && marks >= range.max) {
      return Math.round(range.rank * 1.08); // Add 8% for 2025 inflation
    }
  }
  return 1750199;
}

app.post('/predict', (req, res) => {
  const { score, category } = req.body;
  if (!score || !category) return res.status(400).json({ error: 'Missing score or category' });

  const marks = parseInt(score);
  const userRank = estimateRank(marks);

  const matchedColleges = colleges.filter(c => {
    return c.categoryCutoff[category] && userRank <= c.categoryCutoff[category];
  });

  const predictions = matchedColleges.map(c => ({
    college: c.name,
    estimatedRank: userRank,
    category
  }));

  res.json({ rank: userRank, predictions });
});

app.listen(PORT, () => console.log(`✅ NEET Predictor API running on port ${PORT}`));
