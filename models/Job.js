// Ye batata hai ki ek "job" record me kya-kya data save hoga

const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },          // Job ka naam, jaise "SSC CGL 2026"
    sourceSite: { type: String, required: true },      // Kis website se aaya (jaise "SSC Official")
    sourceUrl: { type: String, required: true },       // Original page ka link jahan se scrape hua
    applyLink: { type: String },                        // Apply karne ka direct link
    ageLimit: { type: String },                         // Jaise "18-27 years"
    applicationFee: { type: String },                    // Jaise "General: Rs 100, SC/ST: Free"
    importantDates: {
      startDate: { type: String },                       // Application start date
      lastDate: { type: String },                         // Application last date
      examDate: { type: String },                          // Exam date (agar mile to)
    },
    rawDetails: { type: String },                        // Extra text jo automatically nahi pehchaana gaya, sirf reference ke liye
    uniqueHash: { type: String, required: true, unique: true }, // Duplicate check ke liye (title+link se banega)
  },
  { timestamps: true } // createdAt / updatedAt apne aap add ho jayega
);

module.exports = mongoose.models.Job || mongoose.model("Job", jobSchema);
