# FinFlow — Personal Finance Dashboard





---

## Project Overview

**FinFlow** is a clean, modern personal finance dashboard that lets users track income and expenses, explore transactions, understand spending patterns, and simulate UPI payment logging — all in one polished interface.

Built entirely on the frontend with React + Vite + Tailwind CSS, using mock data with full localStorage persistence. No backend required.

---

## Assignment Requirements Coverage

| Requirement | Status | Details |
|---|---|---|
| Summary cards (Balance, Income, Expenses) |  | With month-over-month % trend arrows |
| Time-based visualization | | Area chart — running balance over time |
| Categorical visualization |  | Donut chart — spending by category |
| Transactions list (date, amount, category, type) |  | Table on desktop, cards on mobile |
| Filtering |  | Filter by All / Income / Expense |
| Sorting and Search |  | Sort by date or amount, real-time search |
| Role-Based UI (Viewer / Admin) |  | Dropdown switcher, CRUD gated to Admin only |
| Insights — highest spending category | | Dynamically calculated from live data |
| Insights — monthly comparison |  | Bar chart + 5 smart insight cards |
| State management |  | Context API — transactions, filters, role, theme |
| Responsive design | | Mobile drawer + desktop sidebar |
| Empty / no-data states |  | Illustrated empty states throughout |
| Dark mode (optional) |  | Toggle in sidebar, persisted in localStorage |
| Data persistence (optional) |  | Transactions, role, and theme saved in localStorage |
| Animations / transitions (optional) |  | Staggered CSS animations on every page |

---

## Features

### Authentication
- Email and password login with show/hide toggle and validation
- Google Sign-In button (simulated SSO — auto-logs in as Aditi)
- Demo quick-fill button — one click fills credentials
- Two demo accounts: Aditi (Admin) and Rohan (Viewer)
- Session persisted in localStorage — stays logged in on refresh

### Dashboard Overview
- Time-of-day personalized greeting: "Good morning, Aditi"
- Three stat cards: Total Balance, Total Income, Total Expenses — each with month-over-month % trend
- Balance Trend area chart (Recharts) — running balance over all transactions
- Spending by Category donut chart with color-coded legend
- Recent Transactions — latest 5 with a link to the full list

### Transactions
- Real-time search by description or category
- Filter toggle: All / Income / Expense
- Sort by date (newest or oldest) and amount (high or low)
- Admin mode: Add, Edit, Delete with modal form and field validation
- Viewer mode: Read-only, all mutation buttons hidden
- Responsive — table on desktop, stacked cards on mobile
- Graceful empty state when no results match filters

### Insights (All dynamically calculated)
- Highest spending category this month
- Expense change percentage vs last month
- Savings improvement or decline vs last month
- Food and Dining change percentage as a common variable expense
- Savings rate vs the recommended 20% benchmark
- Category Comparison Bar Chart — last month vs this month side by side
- Category breakdown with animated progress bars

### UPI Payments (Bonus Feature)
**Pay via UPI tab:** Enter UPI ID, amount, and category — confirmation screen — auto-logged to dashboard on confirm.

**Import from SMS tab:** Paste any Indian bank UPI SMS. The smart parser extracts amount, merchant name, category, and date. One click adds it to transactions. Supports HDFC, SBI, ICICI, and Axis Bank formats. Recognises 40+ merchants including Zomato, Uber, Netflix, Amazon, IRCTC, Apollo, and Zerodha.

### Profile
- Editable display name and UPI ID management
- Link and unlink UPI apps: GPay, PhonePe, Paytm, Amazon Pay, BHIM, CRED
- Sign out button

---

## Tech Stack

| Tool | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI framework — functional components and hooks |
| Vite | 5.4.11 | Build tool and HMR dev server |
| Tailwind CSS | 3.4.15 | Utility-first styling with dark mode support |
| Recharts | 2.13.3 | AreaChart, PieChart, BarChart |
| Lucide React | 0.460.0 | Icon library |
| date-fns | 2.30.0 | Date parsing, formatting, and comparison |
| Context API | built-in | Global state — no extra library needed |

---

## Folder Structure

```
finance-dashboard/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── .nvmrc
├── .npmrc
├── package.json
└── src/
    ├── App.jsx                     # Root layout with auth gate
    ├── main.jsx                    # Entry point
    ├── index.css                   # Tailwind base, global styles, animations
    ├── context/
    │   ├── AuthContext.jsx         # Login, Google SSO, UPI linking state
    │   └── FinanceContext.jsx      # Transactions, filters, role, dark mode
    ├── data/
    │   └── transactions.js         # 35 seed transactions, categories, colors
    ├── utils/
    │   ├── helpers.js              # formatCurrency, date utils, stat calculators
    │   └── upiParser.js            # SMS parser with regex patterns and merchant map
    ├── components/
    │   ├── Sidebar.jsx             # Desktop nav, role switcher, dark mode toggle
    │   ├── MobileHeader.jsx        # Mobile top bar and slide-in drawer
    │   ├── StatCard.jsx            # Reusable KPI card with trend indicator
    │   ├── BalanceChart.jsx        # Area chart for balance over time
    │   ├── SpendingChart.jsx       # Donut chart for category breakdown
    │   ├── RecentTransactions.jsx  # Mini transaction feed on dashboard
    │   ├── TransactionTable.jsx    # Full table on desktop, cards on mobile
    │   └── TransactionModal.jsx    # Add and Edit modal with validation
    └── pages/
        ├── Login.jsx               # Auth page — email, password, Google, demo
        ├── Dashboard.jsx           # Overview with charts and stat cards
        ├── Transactions.jsx        # Full transaction list with filters
        ├── Insights.jsx            # Smart analytics, bar chart, breakdown
        ├── UpiPage.jsx             # Pay via UPI and SMS import
        └── Profile.jsx             # User profile and UPI app linking
```

---

## Setup Instructions

### Prerequisites

- Node.js v18 or higher — check with `node -v`
- npm v9 or higher — check with `npm -v`

### Step 1 — Extract and navigate

```bash
unzip finflow-dashboard.zip
cd finance-dashboard
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Start the dev server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

### Step 4 — Login with demo credentials

| Field | Value |
|---|---|
| Email | aditi@finflow.app |
| Password | demo123 |

You can also click the **Fill demo credentials** button on the login page, then click **Sign In**. Or use **Continue with Google** to skip the form entirely.

### Step 5 — Build for production (optional)

```bash
npm run build
npm run preview
```

---

## Deploying to Vercel

1. Push all project files to a GitHub repository
2. Go to vercel.com and import the repository
3. Vercel will auto-detect the Vite framework
4. Set Node.js version to **18.x** in Settings → General before deploying
5. Click Deploy — the `vercel.json` handles all routing automatically

---

## Assumptions

1. **Date context** — Seed data spans March and April 2025. Insights calculate against the current system month, so month-over-month comparisons reference the two most recent months in the data.
2. **Currency** — All values are in Indian Rupees, formatted with `Intl.NumberFormat('en-IN')`.
3. **No backend** — All data lives in localStorage. A real product would use a REST or GraphQL API.
4. **Authentication** — Simulated on the frontend. Credentials are checked against hardcoded demo users with no real auth server.
5. **UPI sync** — GPay, PhonePe, and Paytm have no public APIs. Integration is simulated via an SMS parser and a manual pay flow that auto-logs transactions to the dashboard.
6. **Fonts** — Google Fonts (Syne and DM Mono) require an internet connection on first load and fall back to system sans-serif.
7. **Roles** — Stored in localStorage. In a real product this would come from a JWT or backend session.

---

## Design Decisions

- **Syne and DM Mono typography** — distinctive, non-generic FinTech feel. All numbers use monospace so columns always align.
- **Brand green #22c55e** — universally associated with money, growth, and positive outcomes.
- **Terminal-style login** — dark background with scrolling ticker tape, outline text, and monospace inputs. Intentionally different from generic SaaS login screens.
- Cards use soft shadows, rounded corners, and subtle hover lifts — approachable but polished.
- Category colors are semantically consistent across all charts and badges throughout the app.
- Animations are staggered with animation-delay — feels deliberate and crafted, not instant or jarring.
- Mobile-first: the sidebar collapses to a drawer and transaction tables become card stacks on small screens.

---

## Future Improvements

- Real authentication using Firebase or Supabase with persistent multi-user data
- Budget goals per category with over-budget alerts
- Export transactions to CSV or PDF
- Recurring transaction flagging with automatic monthly entries
- PWA support for offline use and mobile installation
- Real UPI webhook integration if UPI apps ever open their APIs
- Bank statement PDF import using pdf.js
- Multi-currency support with live exchange rates

---

