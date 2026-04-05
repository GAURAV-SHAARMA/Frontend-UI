import { useMemo } from 'react'
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line,
} from 'recharts'
import { useApp } from '../context/AppContext.jsx'
import { CATEGORIES, MONTHLY_TREND, fmt, fmtK, pct } from '../data/seedData.js'
import StatCard from '../components/StatCard.jsx'
import Card from '../components/Card.jsx'
import ChartTooltip from '../components/ChartTooltip.jsx'

export default function Overview() {
  const { transactions } = useApp()

  const income  = transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = income - expense
  const savingsRate = income ? ((balance / income) * 100).toFixed(1) : '0'

  const catBreakdown = useMemo(() => {
    const map = {}
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount })
    return Object.entries(map)
      .map(([k, v]) => ({
        name:  CATEGORIES[k]?.label || k,
        value: v,
        color: CATEGORIES[k]?.color || '#8B8984',
        key:   k,
      }))
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  const trendData = MONTHLY_TREND.map((d) => ({ ...d, net: d.income - d.expense }))
  const thisMonth = MONTHLY_TREND[MONTHLY_TREND.length - 1]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── KPI Cards ── */}
      <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
        <StatCard
          label="Net Balance" value={fmtK(balance)} icon="◆" accent="var(--amber)"
          sub="of all time" trend={12.4} delay="stagger-1"
        />
        <StatCard
          label="Total Income" value={fmtK(income)} icon="↑" accent="var(--green)"
          sub="across all records" trend={8.1} delay="stagger-2"
        />
        <StatCard
          label="Total Expenses" value={fmtK(expense)} icon="↓" accent="var(--red)"
          sub="across all records" trend={-4.2} delay="stagger-3"
        />
        <StatCard
          label="Savings Rate" value={`${savingsRate}%`} icon="◎" accent="var(--blue)"
          sub="of income retained" delay="stagger-4"
        />
      </div>

      {/* ── Area + Pie row ── */}
      <div className="charts-split" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 14 }}>

        {/* Area Chart */}
        <Card className="fade-up stagger-2">
          <div className="panel-header">
            <div>
              <div className="panel-title">Monthly Cash Flow</div>
              <div className="panel-sub">income · expense · 6 months</div>
            </div>
          </div>
          <div className="panel-body">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={trendData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22C55E" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#EF4444" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#252529" vertical={false} />
                <XAxis dataKey="m" tick={{ fontFamily: 'IBM Plex Mono', fontSize: 10, fill: '#4A4946' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontFamily: 'IBM Plex Mono', fontSize: 10, fill: '#4A4946' }} axisLine={false} tickLine={false} tickFormatter={fmtK} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="income"  name="Income"  stroke="#22C55E" fill="url(#gradIncome)"  strokeWidth={2} />
                <Area type="monotone" dataKey="expense" name="Expense" stroke="#EF4444" fill="url(#gradExpense)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="chart-legend">
              {[{ c: '#22C55E', l: 'Income' }, { c: '#EF4444', l: 'Expense' }].map((x) => (
                <span key={x.l} className="chart-legend-item">
                  <span className="chart-legend-dot" style={{ background: x.c }} />
                  {x.l}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Donut Pie */}
        <Card className="fade-up stagger-3">
          <div className="panel-header">
            <div>
              <div className="panel-title">Spend Mix</div>
              <div className="panel-sub">by category</div>
            </div>
          </div>
          <div style={{ padding: '14px 20px 16px' }}>
            {catBreakdown.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={130}>
                  <PieChart>
                    <Pie
                      data={catBreakdown}
                      cx="50%" cy="50%"
                      outerRadius={55} innerRadius={30}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {catBreakdown.map((c, i) => (
                        <Cell key={i} fill={c.color} opacity={0.85} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => fmtK(v)}
                      contentStyle={{
                        background: 'var(--surface-hi)',
                        border: '1px solid var(--border-hi)',
                        borderRadius: 6,
                        fontFamily: 'IBM Plex Mono',
                        fontSize: 11,
                        color: 'var(--text)',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
                  {catBreakdown.slice(0, 5).map((c, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: c.color, flexShrink: 0 }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-sub)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.name}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text)', fontWeight: 500 }}>
                        {pct(c.value, expense)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">◎</div>
                <div className="empty-text">No expense data</div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* ── Bar chart ── */}
      <Card className="fade-up stagger-4">
        <div className="panel-header">
          <div>
            <div className="panel-title">Income vs Expense</div>
            <div className="panel-sub">grouped monthly comparison</div>
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--amber)', fontWeight: 600 }}>
            {fmtK(thisMonth.income - thisMonth.expense)} net this month
          </span>
        </div>
        <div className="panel-body">
          <ResponsiveContainer width="100%" height={130}>
            <BarChart data={MONTHLY_TREND} margin={{ top: 0, right: 5, bottom: 0, left: -20 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252529" vertical={false} />
              <XAxis dataKey="m" tick={{ fontFamily: 'IBM Plex Mono', fontSize: 10, fill: '#4A4946' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'IBM Plex Mono', fontSize: 10, fill: '#4A4946' }} axisLine={false} tickLine={false} tickFormatter={fmtK} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="income"  name="Income"  fill="#22C55E" opacity={0.85} radius={[3, 3, 0, 0]} />
              <Bar dataKey="expense" name="Expense" fill="#EF4444" opacity={0.85} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="chart-legend">
            {[{ c: '#22C55E', l: 'Income' }, { c: '#EF4444', l: 'Expense' }].map((x) => (
              <span key={x.l} className="chart-legend-item">
                <span className="chart-legend-dot" style={{ background: x.c }} />
                {x.l}
              </span>
            ))}
          </div>
        </div>
      </Card>

      {/* ── Net savings line trend ── */}
      <Card className="fade-up stagger-5">
        <div className="panel-header">
          <div>
            <div className="panel-title">Net Savings Trend</div>
            <div className="panel-sub">income − expenses per month</div>
          </div>
        </div>
        <div className="panel-body">
          <ResponsiveContainer width="100%" height={110}>
            <LineChart data={trendData} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#252529" vertical={false} />
              <XAxis dataKey="m" tick={{ fontFamily: 'IBM Plex Mono', fontSize: 10, fill: '#4A4946' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontFamily: 'IBM Plex Mono', fontSize: 10, fill: '#4A4946' }} axisLine={false} tickLine={false} tickFormatter={fmtK} />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone" dataKey="net" name="Net Savings"
                stroke="#F5A623" strokeWidth={2}
                dot={{ fill: '#F5A623', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#F5A623' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

    </div>
  )
}
