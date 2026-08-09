# DSE CAP Round II Vacancy Portal (2026-2027)

A modern, fast, responsive web application designed to search, filter, and analyze Direct Second Year Engineering (DSE) CAP Round II Provisional Vacancies across Maharashtra colleges.

## Features

- **⚡ Fast Client-Side Search**: Live search across 2,171+ courses by Institute Code, College Name, Choice Code, Branch, or City.
- **🎯 Multi-Filter Engine**: Filter by Region/City, Institute Type (Government, Autonomous, Un-Aided, Minority), Seat Availability, and Quick Branch Pills (CS/IT, ENTC, Civil, Mech, Electrical, Chemical).
- **📋 One-Click Choice Code Copy**: Click to copy any 10-digit Choice Code instantly with visual toast feedback.
- **📊 Complete Seat Matrix Modal**: View full category-wise seat breakdowns (OPEN, SC, ST, VJ/DT, NTB, NTC, NTD, OBC, SEBC, Minority, PWD, DEF, EWS, Orphan).
- **📥 CSV Export**: Export any filtered selection directly into a CSV file.
- **🌙 Dark / Light Theme**: Built-in toggle with persistent theme preference.
- **💰 Integrated Banner Ad Slots**: Includes configured responsive ad banner containers (728x90, 468x60, 320x50, 300x250, 160x600, 160x300).

---

## 🚀 How to Upload & Host on GitHub Pages

Follow these simple steps to publish this website to GitHub Pages:

### Step 1: Create a New GitHub Repository
1. Go to [GitHub.com](https://github.com) and click **New Repository**.
2. Name your repository (e.g. `dse-cap2-vacancy-portal`).
3. Set visibility to **Public**.
4. Do NOT check "Initialize with a README" (since this project already includes one).
5. Click **Create Repository**.

### Step 2: Push Local Files to GitHub
Open your terminal inside this folder (`d:\College\Temp\dse-cap2-vacancy-portal`) and run:

```bash
git init
git add .
git commit -m "Initial commit - DSE CAP Round II Vacancy Portal"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dse-cap2-vacancy-portal.git
git push -u origin main
```

*(Replace `YOUR_USERNAME` with your GitHub username)*.

### Step 3: Enable GitHub Pages
1. Go to your repository settings on GitHub: `Settings > Pages`.
2. Under **Build and deployment > Source**, choose **Deploy from a branch**.
3. Under **Branch**, select `main` branch and `/ (root)` folder.
4. Click **Save**.
5. Within 1-2 minutes, your website will be live at `https://YOUR_USERNAME.github.io/dse-cap2-vacancy-portal/`!

---

## Technical Stack

- **HTML5 & CSS3**: Pure custom modern design system with CSS custom variables, glassmorphism, and smooth transitions.
- **Vanilla JavaScript (ES6+)**: Zero framework overhead for instant page loads.
- **Data Source**: Embedded static dataset parsed directly from official DSE CAP Round II vacancy publication (`2,171` courses).
