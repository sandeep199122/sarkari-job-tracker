# Sarkari Job Tracker

Backend me sarkari job website ka link daalo → scraper automatically check karta rahega →
naya job milte hi frontend par LIVE (bina refresh) dikh jayega, saath me age limit, fee, last date, apply link.

## Folder samajh

```
sarkari-job-tracker/
├── server.js          → Main file, sab yahi se start hota hai
├── scheduler.js        → Har X minute me sources check karta hai (cron job)
├── models/
│   ├── Job.js           → Job ka data-structure (DB schema)
│   └── Source.js         → Website links ka data-structure
├── scrapers/
│   └── genericScraper.js → Website se data nikalne wala code
├── routes/
│   ├── jobs.js            → /api/jobs endpoints
│   └── sources.js          → /api/sources endpoints (link add/remove)
└── public/
    └── index.html            → Frontend (live job list)
```

## Local par chalane ke steps

1. **Node.js install karo** (agar nahi hai): https://nodejs.org

2. **MongoDB chahiye.** Do options:
   - Local install: https://www.mongodb.com/try/download/community
   - Ya free cloud DB (aasan hai): https://www.mongodb.com/cloud/atlas — account banao, ek free cluster banao, "Connect" se connection string copy karo

3. **Dependencies install karo:**
   ```
   cd sarkari-job-tracker
   npm install
   ```

4. **.env file banao:**
   ```
   cp .env.example .env
   ```
   Fir `.env` file kholke `MONGO_URI` me apni MongoDB connection string daal do.

5. **Server chalao:**
   ```
   npm start
   ```
   Browser me kholo: `http://localhost:5000`

6. **Ek sarkari website add karo (test ke liye):**
   Terminal/Postman se ye request bhejo:
   ```
   POST http://localhost:5000/api/sources
   Body (JSON): { "name": "SSC", "url": "https://ssc.nic.in/Portal/Notices" }
   ```
   Ya simple curl se:
   ```
   curl -X POST http://localhost:5000/api/sources \
     -H "Content-Type: application/json" \
     -d '{"name":"SSC","url":"https://ssc.nic.in/Portal/Notices"}'
   ```

7. Scraper apne aap chalega (har 30 min me, `.env` me `SCRAPE_INTERVAL_MINUTES` se badal sakte ho).
   Turant test karne ke liye:
   ```
   curl -X POST http://localhost:5000/api/sources/check-now
   ```

## Zaroori baat: har website ka scraper alag likhna padega

`scrapers/genericScraper.js` ek basic/generic scraper hai jo kaam chala dega lekin
har sarkari website ka HTML structure alag hota hai. Best results ke liye:

1. Us website ko browser me kholo
2. Job listing wale part par right-click → "Inspect" karo
3. Dekho job title/link kis HTML tag/class me hai
4. `genericScraper.js` ko copy karke us site ke liye custom selector daal do
5. `models/Source.js` me `parserType` field se decide kar sakte ho kaunsa parser use karna hai

## Server par live daalne ke steps (deploy)

Sabse aasan free option: **Render.com**

1. Is project ko GitHub par push karo
2. https://render.com par account banao → "New Web Service" → apna GitHub repo select karo
3. Build command: `npm install`
4. Start command: `npm start`
5. Environment variables me `MONGO_URI`, `SCRAPE_INTERVAL_MINUTES` daal do (MongoDB Atlas wali connection string)
6. Deploy dabao — kuch minute me live ho jayega, ek public URL milega jo turant kaam karega

Railway.app par bhi bilkul same tarike se ho jata hai.

## Baad me mobile app banane ke liye

Backend already ek REST API hai (`/api/jobs`, `/api/sources`) + Socket.io real-time events.
Isliye React Native ya Flutter app banate waqt bas yahi APIs call karni hongi — backend ko
dobara likhna nahi padega.

## Aage kya improve kar sakte ho

- Har website ke liye custom scraper (accuracy zyada badhega)
- Users ko email/push notification bhejna jab unke interest ka job aaye
- Admin panel UI (abhi API se hi add/remove hota hai)
- PDF notifications se text extract karna (`pdf-parse` package se)
