// Jobs se related API endpoints

const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

// GET /api/jobs -> sab jobs list karo, sabse naya sabse upar
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 }).limit(200);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/jobs/search?q=ssc -> title me keyword search
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    const jobs = await Job.find({ title: { $regex: q, $options: "i" } }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
