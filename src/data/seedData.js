// ─── CATEGORIES ─────────────────────────────────────────────────────────────
export const CATEGORIES = {
  salary:        { label: 'Salary',        icon: '◈', color: '#22C55E' },
  freelance:     { label: 'Freelance',     icon: '◉', color: '#3B82F6' },
  investment:    { label: 'Investment',    icon: '◆', color: '#F5A623' },
  rent:          { label: 'Rent',          icon: '⬡', color: '#EF4444' },
  food:          { label: 'Food',          icon: '●', color: '#F97316' },
  transport:     { label: 'Transport',     icon: '◎', color: '#A855F7' },
  utilities:     { label: 'Utilities',     icon: '◈', color: '#06B6D4' },
  shopping:      { label: 'Shopping',      icon: '◉', color: '#EC4899' },
  health:        { label: 'Health',        icon: '◆', color: '#10B981' },
  entertainment: { label: 'Entertainment', icon: '◈', color: '#F59E0B' },
  other:         { label: 'Other',         icon: '●', color: '#8B8984' },
}

// ─── SEED TRANSACTIONS ───────────────────────────────────────────────────────
export const SEED_TRANSACTIONS = [
  { id: 1,  name: 'Monthly Salary',     type: 'income',  category: 'salary',        amount: 85000, date: '2025-03-01', note: 'March credit' },
  { id: 2,  name: 'Apartment Rent',     type: 'expense', category: 'rent',          amount: 18000, date: '2025-03-03', note: '' },
  { id: 3,  name: 'Freelance Project',  type: 'income',  category: 'freelance',     amount: 22000, date: '2025-03-05', note: 'Website redesign' },
  { id: 4,  name: 'Grocery Shopping',   type: 'expense', category: 'food',          amount: 4200,  date: '2025-03-07', note: 'Monthly groceries' },
  { id: 5,  name: 'Uber Rides',         type: 'expense', category: 'transport',     amount: 1800,  date: '2025-03-09', note: '' },
  { id: 6,  name: 'Netflix & Spotify',  type: 'expense', category: 'entertainment', amount: 1100,  date: '2025-03-10', note: 'Subscriptions' },
  { id: 7,  name: 'Dividend Income',    type: 'income',  category: 'investment',    amount: 5400,  date: '2025-03-12', note: 'Q1 dividend' },
  { id: 8,  name: 'Electricity Bill',   type: 'expense', category: 'utilities',     amount: 2300,  date: '2025-03-14', note: '' },
  { id: 9,  name: 'Online Shopping',    type: 'expense', category: 'shopping',      amount: 6700,  date: '2025-03-16', note: 'Clothes & gadgets' },
  { id: 10, name: 'Doctor Visit',       type: 'expense', category: 'health',        amount: 1500,  date: '2025-03-18', note: 'Checkup' },
  { id: 11, name: 'Monthly Salary',     type: 'income',  category: 'salary',        amount: 85000, date: '2025-02-01', note: 'February salary' },
  { id: 12, name: 'Apartment Rent',     type: 'expense', category: 'rent',          amount: 18000, date: '2025-02-03', note: '' },
  { id: 13, name: 'Freelance Project',  type: 'income',  category: 'freelance',     amount: 15000, date: '2025-02-10', note: 'App UI design' },
  { id: 14, name: 'Grocery Shopping',   type: 'expense', category: 'food',          amount: 3800,  date: '2025-02-12', note: '' },
  { id: 15, name: 'Weekend Dining',     type: 'expense', category: 'food',          amount: 2100,  date: '2025-02-15', note: '' },
  { id: 16, name: 'SIP Investment',     type: 'expense', category: 'investment',    amount: 10000, date: '2025-02-20', note: 'Mutual fund SIP' },
  { id: 17, name: 'Side Project Rev',   type: 'income',  category: 'other',         amount: 8000,  date: '2025-02-22', note: '' },
  { id: 18, name: 'Shopping',           type: 'expense', category: 'shopping',      amount: 4300,  date: '2025-02-25', note: 'Amazon order' },
  { id: 19, name: 'Monthly Salary',     type: 'income',  category: 'salary',        amount: 85000, date: '2025-01-01', note: 'January salary' },
  { id: 20, name: 'New Laptop',         type: 'expense', category: 'shopping',      amount: 55000, date: '2025-01-05', note: 'MacBook Pro' },
  { id: 21, name: 'Apartment Rent',     type: 'expense', category: 'rent',          amount: 18000, date: '2025-01-06', note: '' },
  { id: 22, name: 'Gym Membership',     type: 'expense', category: 'health',        amount: 2500,  date: '2025-01-10', note: 'Annual membership' },
  { id: 23, name: 'Freelance Work',     type: 'income',  category: 'freelance',     amount: 18000, date: '2025-01-15', note: '' },
  { id: 24, name: 'Utilities Bundle',   type: 'expense', category: 'utilities',     amount: 3100,  date: '2025-01-18', note: '' },
]

// ─── MONTHLY TREND (last 6 months, for charts) ───────────────────────────────
export const MONTHLY_TREND = [
  { m: 'Oct', income: 92000,  expense: 41000 },
  { m: 'Nov', income: 88000,  expense: 38000 },
  { m: 'Dec', income: 110000, expense: 67000 },
  { m: 'Jan', income: 103000, expense: 78600 },
  { m: 'Feb', income: 108000, expense: 38200 },
  { m: 'Mar', income: 112400, expense: 35600 },
]

// ─── UTILS ───────────────────────────────────────────────────────────────────
export const fmt  = (n) => '₹' + Math.abs(n).toLocaleString('en-IN')
export const fmtK = (n) =>
  n >= 100000 ? '₹' + (n / 100000).toFixed(1) + 'L'
  : n >= 1000  ? '₹' + (n / 1000).toFixed(1) + 'K'
  : '₹' + n
export const pct  = (a, b) => (b ? ((a / b) * 100).toFixed(1) : '0') + '%'
