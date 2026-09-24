// Ye wo "sarkari job websites" store karta hai jinko scraper check karega

const mongoose = require("mongoose");

const sourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },   // Jaise "SSC", "UPSC", "Railway RRB"
    url: { type: String, required: true },      // Us website ka link jaha jobs list hoti hain
    // parserType batata hai kaunsa scraping-logic use karna hai (kyunki har site ka HTML alag hota hai)
    // "generic" ek basic parser hai jo kaam chala dega, baad me har site ke liye custom parser likh sakte ho
    parserType: { type: String, default: "generic" },
    isActive: { type: Boolean, default: true },
    lastChecked: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Source || mongoose.model("Source", sourceSchema);
