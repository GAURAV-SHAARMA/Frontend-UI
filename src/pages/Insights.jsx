import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useApp } from "../context/AppContext.jsx";
import { CATEGORIES, MONTHLY_TREND, fmt, fmtK, pct } from "../data/seedData.js";
import Card from "../components/Card.jsx";
import ChartTooltip from "../components/ChartTooltip.jsx";

export default function Insights() {
  const { transactions } = useApp();

  const expense = transactions.filter((t) => t.type === "expense");
  const income = transactions.filter((t) => t.type === "income");
  const totalExp = expense.reduce((s, t) => s + t.amount, 0);
  const totalInc = income.reduce((s, t) => s + t.amount, 0);
  const net = totalInc - totalExp;
  const sr = totalInc ? ((net / totalInc) * 100).toFixed(1) : "0";
  const avgExp = expense.length ? Math.round(totalExp / expense.length) : 0;
  const ratio = totalExp > 0 ? (totalInc / totalExp).toFixed(2) : "∞";

  // Category breakdown
  const catMap = useMemo(() => {
    const map = {};
    expense.forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const topCat = catMap[0];

  // Month-over-month
  const monthMap = useMemo(() => {
    const map = {};
    transactions.forEach((t) => {
      const m = t.date.slice(0, 7);
      if (!map[m]) map[m] = { income: 0, expense: 0 };
      map[m][t.type] += t.amount;
    });
    return map;
  }, [transactions]);

  const months = Object.entries(monthMap).sort((a, b) =>
    a[0].localeCompare(b[0]),
  );
  const lastTwo = months.slice(-2);
  const prevNet = lastTwo[0] ? lastTwo[0][1].income - lastTwo[0][1].expense : 0;
  const currNet = lastTwo[1] ? lastTwo[1][1].income - lastTwo[1][1].expense : 0;
  const mom = prevNet
    ? (((currNet - prevNet) / Math.abs(prevNet)) * 100).toFixed(1)
    : "0";

  const trendData = MONTHLY_TREND.map((d) => ({
    ...d,
    net: d.income - d.expense,
  }));

  const insightCards = [
    {
      icon: "◆",
      title: "Top Spend Category",
      value: topCat
        ? `${CATEGORIES[topCat[0]]?.icon} ${CATEGORIES[topCat[0]]?.label}`
        : "—",
      desc: topCat
        ? `${fmt(topCat[1])} spent — ${pct(topCat[1], totalExp)} of total expenses`
        : "No expense data yet",
      color: "var(--amber)",
    },
    {
      icon: "◎",
      title: "Month-over-Month",
      value: `${parseFloat(mom) >= 0 ? "+" : ""}${mom}%`,
      desc: `Net savings ${parseFloat(mom) >= 0 ? "improved" : "declined"} from ${fmtK(prevNet)} → ${fmtK(currNet)}`,
      color: parseFloat(mom) >= 0 ? "var(--green)" : "var(--red)",
    },
    {
      icon: "◈",
      title: "Savings Rate",
      value: `${sr}%`,
      desc:
        parseFloat(sr) >= 30
          ? "Excellent — above 30% target"
          : parseFloat(sr) >= 20
            ? "Good — aim for 30% for security"
            : "Low — reduce discretionary spend",
      color: parseFloat(sr) >= 20 ? "var(--green)" : "var(--amber)",
    },
    {
      icon: "●",
      title: "Avg. Expense Size",
      value: fmtK(avgExp),
      desc: `Average across ${expense.length} expense transactions`,
      color: "var(--blue)",
    },
    {
      icon: "◆",
      title: "Income / Expense Ratio",
      value: `${ratio}×`,
      desc:
        totalInc > totalExp
          ? `Earning ₹${ratio} for every ₹1 spent — healthy`
          : "Spending exceeds income — review urgently",
      color: totalInc > totalExp ? "var(--green)" : "var(--red)",
    },
    {
      icon: "◉",
      title: "Transaction Count",
      value: String(transactions.length),
      desc: `${income.length} income · ${expense.length} expense records`,
      color: "var(--purple)",
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── Insight KPI cards ── */}
      <div className="insight-grid fade-up">
        {insightCards.map((c, i) => (
          <Card
            key={i}
            className="insight-card"
            hover
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="insight-icon" style={{ color: c.color }}>
              {c.icon}
            </div>
            <div className="insight-title">{c.title}</div>
            <div className="insight-value" style={{ color: c.color }}>
              {c.value}
            </div>
            <div className="insight-desc">{c.desc}</div>
          </Card>
        ))}
      </div>

      {/* ── Category breakdown progress bars ── */}
      <Card className="fade-up stagger-3">
        <div className="panel-header">
          <div>
            <div className="panel-title">Expense Breakdown</div>
            <div className="panel-sub">spending distribution by category</div>
          </div>
        </div>
        <div className="panel-body">
          {catMap.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">◎</div>
              <div className="empty-text">No expense data yet</div>
            </div>
          ) : (
            catMap.slice(0, 8).map(([k, v]) => {
              const cat = CATEGORIES[k] || CATEGORIES.other;
              const w = totalExp ? ((v / totalExp) * 100).toFixed(1) : 0;
              return (
                <div key={k} className="progress-row">
                  <div className="progress-meta">
                    <span className="progress-cat">
                      <span style={{ color: cat.color }}>{cat.icon}</span>
                      {cat.label}
                    </span>
                    <span className="progress-val">
                      {fmt(v)}
                      <span className="progress-pct">({w}%)</span>
                    </span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${w}%`, background: cat.color }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* ── Net savings line chart ── */}
      <Card className="fade-up stagger-4">
        <div className="panel-header">
          <div>
            <div className="panel-title">Net Savings Trend</div>
            <div className="panel-sub">income minus expenses — 6 months</div>
          </div>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--amber)",
              fontWeight: 600,
            }}
          >
            {fmtK(trendData[trendData.length - 1].net)} this month
          </span>
        </div>
        <div className="panel-body">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart
              data={trendData}
              margin={{ top: 5, right: 5, bottom: 0, left: -20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#252529"
                vertical={false}
              />
              <XAxis
                dataKey="m"
                tick={{
                  fontFamily: "IBM Plex Mono",
                  fontSize: 10,
                  fill: "#4A4946",
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{
                  fontFamily: "IBM Plex Mono",
                  fontSize: 10,
                  fill: "#4A4946",
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={fmtK}
              />
              <Tooltip content={<ChartTooltip />} />
              <Line
                type="monotone"
                dataKey="net"
                name="Net Savings"
                stroke="#F5A623"
                strokeWidth={2}
                dot={{ fill: "#F5A623", r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: "#F5A623" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* ── Monthly income vs expense bar ── */}
      <Card className="fade-up stagger-5">
        <div className="panel-header">
          <div>
            <div className="panel-title">Monthly Comparison</div>
            <div className="panel-sub">income vs expense — last 6 months</div>
          </div>
        </div>
        <div className="panel-body">
          <ResponsiveContainer width="100%" height={160}>
            <BarChart
              data={MONTHLY_TREND}
              margin={{ top: 0, right: 5, bottom: 0, left: -20 }}
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#252529"
                vertical={false}
              />
              <XAxis
                dataKey="m"
                tick={{
                  fontFamily: "IBM Plex Mono",
                  fontSize: 10,
                  fill: "#4A4946",
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{
                  fontFamily: "IBM Plex Mono",
                  fontSize: 10,
                  fill: "#4A4946",
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={fmtK}
              />
              <Tooltip content={<ChartTooltip />} />
              <Bar
                dataKey="income"
                name="Income"
                fill="#22C55E"
                opacity={0.85}
                radius={[3, 3, 0, 0]}
              />
              <Bar
                dataKey="expense"
                name="Expense"
                fill="#EF4444"
                opacity={0.85}
                radius={[3, 3, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="chart-legend" style={{ marginTop: 10 }}>
            {[
              { c: "#22C55E", l: "Income" },
              { c: "#EF4444", l: "Expense" },
            ].map((x) => (
              <span key={x.l} className="chart-legend-item">
                <span
                  className="chart-legend-dot"
                  style={{ background: x.c }}
                />
                {x.l}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
