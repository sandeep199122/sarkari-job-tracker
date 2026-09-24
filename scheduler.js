// Ye file cron job set karti hai jo har X minute me chalke
// saari active "Source" websites check karti hai aur naye jobs DB me daalti hai.
// Naya job milte hi Socket.io se turant frontend ko bhi bata deti hai.

const cron = require("node-cron");
const Source = require("./models/Source");
const Job = require("./models/Job");
const { scrapeGeneric } = require("./scrapers/genericScraper");

// io = socket.io ka instance jo server.js se pass hoga (live push ke liye)
function startScheduler(io) {
  const intervalMinutes = process.env.SCRAPE_INTERVAL_MINUTES || 30;

  // Cron expression: "*/30 * * * *" matlab har 30 minute me
  const cronExpression = `*/${intervalMinutes} * * * *`;

  console.log(`Scheduler shuru: har ${intervalMinutes} minute me sources check honge`);

  cron.schedule(cronExpression, async () => {
    await checkAllSources(io);
  });

  // Server start hote hi ek baar turant bhi check kar lo (test ke liye helpful)
  checkAllSources(io);
}

async function checkAllSources(io) {
  const sources = await Source.find({ isActive: true });

  for (const source of sources) {
    try {
      console.log(`Checking: ${source.name} (${source.url})`);
      const scrapedJobs = await scrapeGeneric(source);

      for (const jobData of scrapedJobs) {
        // uniqueHash se check karo ki ye job pehle se DB me hai ya nahi
        const exists = await Job.findOne({ uniqueHash: jobData.uniqueHash });

        if (!exists) {
          const newJob = await Job.create(jobData);
          console.log(`Naya job mila: ${newJob.title}`);

          // Yahi wo line hai jo frontend ko REAL-TIME update bhejti hai
          io.emit("newJob", newJob);
        }
      }

      source.lastChecked = new Date();
      await source.save();
    } catch (err) {
      // Ek source fail ho jaaye to baaki sources par asar nahi padna chahiye
      console.error(`Error checking ${source.name}:`, err.message);
    }
  }
}

module.exports = { startScheduler, checkAllSources };
