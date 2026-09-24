// Ye ek "generic" scraper hai — kaam chalane ke liye.
// Real duniya me har sarkari website ka HTML structure alag hota hai,
// isliye ye sirf ek starting point hai. Jab specific site add karoge,
// tab is file ko copy karke us site ke hisaab se selectors badal dena.

const axios = require("axios");
const cheerio = require("cheerio");
const crypto = require("crypto");

// Kisi text me se age limit dhoondhne ki koshish (basic pattern matching)
function extractAge(text) {
  const match = text.match(/age\s*limit[:\-]?\s*([\d\- to]+years?)/i);
  return match ? match[1].trim() : null;
}

// Fee dhoondhne ki koshish
function extractFee(text) {
  const match = text.match(/(application\s*fee|fee)[:\-]?\s*(rs\.?\s*\d+[^\n.]*)/i);
  return match ? match[2].trim() : null;
}

// Last date dhoondhne ki koshish
function extractLastDate(text) {
  const match = text.match(/(last\s*date|closing\s*date)[:\-]?\s*([\d]{1,2}[\-\/][\d]{1,2}[\-\/][\d]{2,4})/i);
  return match ? match[2].trim() : null;
}

// Title + link se ek unique hash banate hain taaki same job dubara save na ho
function makeHash(title, link) {
  return crypto.createHash("md5").update(title + link).digest("hex");
}

/**
 * source: { name, url, parserType }
 * return: array of job objects (jo DB me save karne layak hain)
 */
async function scrapeGeneric(source) {
  const jobs = [];

  const { data: html } = await axios.get(source.url, {
    timeout: 15000,
    headers: { "User-Agent": "Mozilla/5.0" }, // kuch sites bina user-agent ke block kar deti hain
  });

  const $ = cheerio.load(html);

  // NOTE: Ye selector generic hai — zyada tar sarkari result site "a" tags me
  // job title + link deti hain. Real site ke liye tumhe browser me "Inspect Element"
  // karke sahi selector (class/id) dhoondhna padega aur yahan badalna padega.
  $("a").each((_, el) => {
    const title = $(el).text().trim();
    const link = $(el).attr("href");

    // Sirf wahi links lo jo job jaisi lagti hain (basic keyword filter)
    if (
      title &&
      link &&
      title.length > 15 &&
      /recruit|vacancy|notification|bharti|job/i.test(title)
    ) {
      const fullLink = link.startsWith("http") ? link : new URL(link, source.url).href;
      const surroundingText = $(el).parent().text(); // aas-paas ka text, details dhoondhne ke liye

      jobs.push({
        title,
        sourceSite: source.name,
        sourceUrl: source.url,
        applyLink: fullLink,
        ageLimit: extractAge(surroundingText),
        applicationFee: extractFee(surroundingText),
        importantDates: {
          lastDate: extractLastDate(surroundingText),
        },
        rawDetails: surroundingText.slice(0, 300), // reference ke liye thoda text rakh lo
        uniqueHash: makeHash(title, fullLink),
      });
    }
  });

  return jobs;
}

module.exports = { scrapeGeneric };
