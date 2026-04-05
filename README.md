# FinFlow — Personal Finance Dashboard

> Built by **Aditi Joshi** · Frontend Developer Intern Assignment · April 2026

![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38BDF8?logo=tailwindcss&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-2-22c55e)

---

## 📌 Project Overview

**FinFlow** is a clean, modern personal finance dashboard that lets users track income and expenses, explore transactions, understand spending patterns, and simulate UPI payment logging — all in one polished interface.

Built entirely on the frontend with React + Vite + Tailwind CSS, it uses mock data with full `localStorage` persistence. No backend required.

---

## ✅ Assignment Requirements Coverage

| Requirement | Status | Details |
|---|---|---|
| Summary cards (Balance, Income, Expenses) | ✅ | With month-over-month % trend arrows |
| Time-based visualization | ✅ | Area chart — running balance over time |
| Categorical visualization | ✅ | Donut chart — spending by category |
| Transactions list (date, amount, category, type) | ✅ | Table on desktop, cards on mobile |
| Filtering | ✅ | Filter by All / Income / Expense |
| Sorting and Search | ✅ | Sort by date/amount, real-time search |
| Role-Based UI (Viewer / Admin) | ✅ | Dropdown switcher, CRUD gated to Admin |
| Insights — highest spending category | ✅ | Dynamically calculated from data |
| Insights — monthly comparison | ✅ | Bar chart + 5 smart insight cards |
| State management | ✅ | Context API — transactions, filters, role, theme |
| Responsive design | ✅ | Mobile drawer + desktop sidebar |
| Empty / no-data states | ✅ | Illustrated empty states throughout |
| Dark mode (optional) | ✅ | Toggle in sidebar, persisted in localStorage |
| Data persistence (optional) | ✅ | Transactions, role, theme all in localStorage |
| Animations / transitions (optional) | ✅ | Staggered CSS animations on every page |

---

## ✨ Features

### 🔐 Authentication
- Email + Password login with show/hide toggle and validation
- Google Sign-In button (simulated SSO — auto-logs in as Aditi)
- Demo quick-fill button — one click fills credentials
- Two demo accounts: **Aditi (Admin)** and **Rohan (Viewer)**
- Session persisted in localStorage — stays logged in on refresh

### 📊 Dashboard Overview
- Time-of-day personalized greeting: *"Good morning, Aditi 👋"*
- Three stat cards: Total Balance, Total Income, Total Expenses — each with month-over-month % trend
- Balance Trend area chart (Recharts) — running balance over all transactions
- Spending by Category donut chart with color-coded legend
- Recent Transactions — latest 5 with link to full list

### 💳 Transactions
- Real-time search by description or category
- Filter toggle: All / Income / Expense
- Sort: Date (newest/oldest), Amount (high/low)
- Admin: Add, Edit, Delete with modal form + field validation
- Viewer: Read-only, all mutation buttons hidden
- Responsive — table on desktop, stacked cards on mobile
- Graceful empty state when no results match

### 💡 Insights (All dynamically calculated)
- Highest spending category this month
- Expense change % vs last month
- Savings improvement or decline vs last month
- Food and Dining change % (common variable expense)
- Savings rate vs the recommended 20% benchmark
- Category Comparison Bar Chart — last month vs this month
- Category breakdown with animated progress bars

### 💸 UPI Payments (Bonus)
**Pay via UPI tab:** Enter UPI ID + amount + category → confirmation screen → auto-logged to dashboard

**Import from SMS tab:** Paste any Indian bank UPI SMS → smart parser extracts amount, merchant, category, date → one click adds to transactions. Supports HDFC, SBI, ICICI, Axis formats. Recognises 40+ merchants including Zomato, Uber, Netflix, Amazon, IRCTC, Apollo, Zerodha.

### 👤 Profile
- Editable display name, UPI IDs management
- Link / unlink UPI apps: GPay, PhonePe, Paytm, Amazon Pay, BHIM, CRED
- Sign out

---

## 🛠 Tech Stack

| Tool | Purpose |
|---|---|
| React 18 | UI framework — functional components + hooks |
| Vite 6 | Build tool and HMR dev server |
| Tailwind CSS 3 | Utility-first styling with dark mode |
| Recharts 2 | AreaChart, PieChart, BarChart |
| Lucide React | Icon library |
| date-fns 4 | Date parsing, formatting, comparison |
| Context API | Global state — no extra library needed |

---

## 📁 Folder Structure

```
finance-dashboard/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── App.jsx                     # Root — auth gate + layout
    ├── main.jsx                    # Entry point
    ├── index.css                   # Tailwind base + global styles + animations
    ├── context/
    │   ├── AuthContext.jsx         # Login, Google SSO, UPI linking
    │   └── FinanceContext.jsx      # Transactions, filters, role, dark mode
    ├── data/
    │   └── transactions.js         # 35 seed transactions, categories, colors
    ├── utils/
    │   ├── helpers.js              # formatCurrency, date utils, stat calculators
    │   └── upiParser.js            # SMS parser — regex patterns + merchant map
    ├── components/
    │   ├── Sidebar.jsx             # Desktop nav, role switcher, dark mode
    │   ├── MobileHeader.jsx        # Mobile top bar + slide-in drawer
    │   ├── StatCard.jsx            # Reusable KPI card with trend indicator
    │   ├── BalanceChart.jsx        # Area chart — balance over time
    │   ├── SpendingChart.jsx       # Donut chart — category breakdown
    │   ├── RecentTransactions.jsx  # Mini feed for dashboard
    │   ├── TransactionTable.jsx    # Full table (desktop) + cards (mobile)
    │   └── TransactionModal.jsx    # Add/Edit modal with validation
    └── pages/
        ├── Login.jsx               # Auth page — email/password + Google + demo
        ├── Dashboard.jsx           # Overview with charts and stats
        ├── Transactions.jsx        # Full transaction list with filters
        ├── Insights.jsx            # Smart analytics + bar chart + breakdown
        ├── UpiPage.jsx             # Pay via UPI + SMS import
        └── Profile.jsx             # User profile + UPI app linking
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18 or higher — check with `node -v`
- npm v9 or higher — check with `npm -v`

### 1. Extract and navigate

```bash
unzip finflow-dashboard.zip
cd finance-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start dev server

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

### 4. Login

| Field | Value |
|---|---|
| Email | `aditi@finflow.app` |
| Password | `demo123` |

Or click **"Fill demo credentials"** → **Sign In**. Or use **Continue with Google**.

### 5. Build for production (optional)

```bash
npm run build
npm run preview
```

---

## 📝 Assumptions

1. **Date context**: Seed data spans March–April 2025. Insights calculate against the current system month, so month-over-month comparisons reference the two most recent months of data.
2. **Currency**: All values in Indian Rupees (₹), formatted with `Intl.NumberFormat('en-IN')`.
3. **No backend**: All data lives in `localStorage`. A real product would call a REST or GraphQL API.
4. **Authentication**: Simulated — credentials checked against hardcoded demo users, no real auth server.
5. **UPI sync**: GPay/PhonePe/Paytm have no public APIs. Integration is simulated via an SMS parser + manual pay flow that auto-logs transactions.
6. **Fonts**: Google Fonts (Syne + DM Mono) — requires internet on first load.
7. **Roles**: Stored in localStorage. In production this would come from a JWT or session.

---

## 🎨 Design Decisions

- **Syne + DM Mono typography** — distinctive, non-generic FinTech feel. Numbers always mono so columns align.
- **Brand green `#22c55e`** — universally associated with money, growth, positivity.
- **Dark panel / light form** split layout on login — visually striking and professional.
- Cards use soft shadows, 2xl radius, and subtle hover lifts — approachable but polished.
- Category colors are semantically consistent across all charts and badges.
- Animations are staggered with `animation-delay` — feels deliberate, not jarring.
- Mobile-first: sidebar collapses to a drawer, tables become card stacks.

---

## 🔮 Future Improvements

- Real authentication (Firebase / Supabase)
- Budget goals per category with over-budget alerts
- Export transactions to CSV or PDF
- Recurring transaction flagging
- PWA with offline support
- Real UPI webhook if APIs become available
- Bank statement PDF import
- Multi-currency support

---

## 👩‍💻 Author

**Aditi Joshi** · `aditihjoshi18@gmail.com`  
Assignment: Finance Dashboard UI · Frontend Developer Intern · April 2026
