# Finova — Finance Terminal

A Bloomberg Terminal × Brutalist Editorial finance dashboard built with React + Recharts.

## Tech Stack

- **React 18** — UI framework
- **Vite** — build tool & dev server
- **Recharts** — charts (AreaChart, BarChart, LineChart, PieChart)
- **CSS Variables** — theming (no Tailwind, no CSS-in-JS)
- **localStorage** — data persistence across sessions

## Fonts

- **Syne** — headings (geometric, editorial weight)
- **IBM Plex Mono** — all financial data & labels
- **DM Sans** — body / UI text

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

## Build for production

```bash
npm run build
npm run preview
```

---

## File Structure

```
src/
├── main.jsx                  # Entry point
├── App.jsx                   # Root component + page router
├── index.css                 # All global styles + design tokens
│
├── context/
│   └── AppContext.jsx        # Global state (transactions, role, toast)
│
├── data/
│   └── seedData.js           # Mock data, CATEGORIES map, utility formatters
│
├── components/
│   ├── Sidebar.jsx           # Left nav, quick stats, role switcher
│   ├── Topbar.jsx            # Page title, export buttons, role chip
│   ├── StatCard.jsx          # KPI summary card with accent bar
│   ├── Card.jsx              # Base card primitive
│   ├── Badge.jsx             # Colored label badge
│   ├── Btn.jsx               # Button (primary / ghost / danger / sm)
│   ├── Toast.jsx             # Bottom-right notification
│   ├── TxModal.jsx           # Add / Edit transaction modal
│   └── ChartTooltip.jsx      # Custom Recharts tooltip
│
└── pages/
    ├── Overview.jsx          # Dashboard: KPIs, Area chart, Pie, Bar, Line
    ├── Transactions.jsx      # Table with search, filter, sort, CRUD
    └── Insights.jsx          # Analysis: insight cards, progress bars, charts
```

---

## Features

### Dashboard (Overview)
- 4 KPI stat cards: Net Balance, Total Income, Total Expenses, Savings Rate
- Area chart — income vs expense over 6 months
- Donut/Pie chart — expense breakdown by category with legend
- Grouped bar chart — monthly income vs expense comparison
- Line chart — net savings trend

### Transactions
- Full table with date, description, category, type, amount
- Real-time search by name
- Filter by type (income / expense) and category
- Sort by date, amount, or name (toggle ascending / descending)
- Admin: Add, Edit, Delete transactions via modal
- Empty state when no results match

### Insights
- 6 insight cards: top category, MoM change, savings rate, avg expense, income/expense ratio, tx count
- Category expense progress bars with percentages
- Net savings line chart
- Monthly income vs expense bar chart

### Role-Based UI
| Feature            | Admin | Viewer |
|--------------------|-------|--------|
| View data          | ✓     | ✓      |
| Add transaction    | ✓     | ✗      |
| Edit transaction   | ✓     | ✗      |
| Delete transaction | ✓     | ✗      |
| Export CSV/JSON    | ✓     | ✓      |

Switch roles via the sidebar dropdown. UI updates instantly with no page reload.

### Data Persistence
All transactions are saved to `localStorage` automatically. Data survives page refreshes. Seeded with 24 mock transactions across 3 months.

### Export
- **CSV** — all transaction fields as comma-separated values
- **JSON** — full transaction array as pretty-printed JSON

Both download instantly from the top bar.

---

## Design Decisions

**Aesthetic:** Bloomberg Terminal meets Brutalist Editorial. Dense, data-forward, professional. No purple gradients. No rounded everything. No Inter font.

**State:** React Context + useState. Simple and clean for this scope — no Redux/Zustand overhead needed.

**Charts:** Recharts with custom tooltips and no default legends (replaced with custom HTML legends for better control).

**Responsiveness:** CSS media queries, collapsible sidebar on mobile (hamburger toggle), responsive grids with `auto-fit`.



## Live Demo

https://finova-frontend-gaurav.vercel.app/