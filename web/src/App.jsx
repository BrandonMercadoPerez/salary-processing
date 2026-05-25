import { useState, useRef, useCallback } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { parsePayroll, employeeHours } from './parser';

// ── constants & helpers ───────────────────────────────────────────────────────

const SAMPLE = `The IT Department
Bill 8 hours 20 minutes 7hours 8hours 30 minutes 9hrs 10min 57 minutes F1
Betty 8hrs 8hrs 30min 7hrs 5min 8hrs 7hrs 10min F2
Brandon 10hours 5 minutes 9 hours 5 hours 55 minutes 9 hours 5 minutes F2
Brad 9hrs 8hrs 10hrs 12min 9hrs 4min 8hours 6min 3hrs 24min 1hr 6min F4
The Sales Department
Kyle $24,000 0.105 F3
Tyler $18,203 0.085 F3
Konner 8hrs 6hrs 5min 7hrs 6 hrs 9 hrs 8 min F2
Sam $30,011 0.045 F3
Kent 9hrs 8hrs 1min 9 hrs 7hrs 5 min 8 hrs 55min 6min 1hr F4
The Overseas Department
Jim $24,000 0.105 F3
Frank 7 hours 10 minutes 6hours 1 minute 1 hour 50 minutes 8hours 10min 1hour 34 minutes F1
Lester 8hrs 5min 8hrs 30min 7hrs 5min 8hrs 7hrs 10min F2`;

const GRADE_ORDER  = ['F1', 'F2', 'F3', 'F4'];
const GRADE_COLORS = { F1: '#3b82f6', F2: '#f59e0b', F3: '#10b981', F4: '#8b5cf6' };

const currency = (n) =>
  '$' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const currencyK = (n) =>
  n >= 1000 ? '$' + (n / 1000).toFixed(1) + 'k' : '$' + n.toFixed(0);
const hrs = (n) => n.toFixed(2) + ' hrs';
const deptShort = (name) =>
  (name || 'Other').replace(/^The /, '').replace(/ Department$/, '');

// ── shared components ─────────────────────────────────────────────────────────

function TypeBadge({ type }) {
  return <span className={`badge badge-${type.toLowerCase()}`}>{type}</span>;
}

// ── screen 1: input ───────────────────────────────────────────────────────────

function InputScreen({ onSubmit, leaving }) {
  const [text, setText]         = useState('');
  const [fileName, setFileName] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef(null);

  const readFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { setText(e.target.result); setFileName(file.name); };
    reader.readAsText(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    readFile(e.dataTransfer.files[0]);
  }, []);

  const handleDragOver  = (e) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  return (
    <div className={`screen input-screen${leaving ? ' leaving' : ''}`}>
      <div className="input-card">

        <div className="input-logo-row">
          <div className="input-logo">$</div>
          <div>
            <div className="input-title">Salary Processing</div>
            <div className="input-subtitle">Payroll Intelligence Platform · v1.0</div>
          </div>
        </div>

        <div
          className={`drop-zone${dragging ? ' dragging' : ''}${fileName ? ' filled' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileRef.current.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileRef.current.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".txt,text/plain"
            style={{ display: 'none' }}
            onChange={(e) => { readFile(e.target.files[0]); e.target.value = ''; }}
          />
          <div className="drop-icon">
            {fileName ? (
              <svg viewBox="0 0 48 48" fill="none" width="44" height="44">
                <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
                <path d="M16 24 L22 30 L32 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ) : (
              <svg viewBox="0 0 48 48" fill="none" width="44" height="44">
                <rect x="7"  y="30" width="7" height="12" rx="1.5" fill="currentColor" opacity="0.35"/>
                <rect x="20" y="22" width="7" height="20" rx="1.5" fill="currentColor" opacity="0.55"/>
                <rect x="33" y="26" width="7" height="16" rx="1.5" fill="currentColor" opacity="0.35"/>
                <path d="M24 18 L24 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M18 12 L24 6 L30 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
          <div className="drop-text">{fileName ?? 'Drop .txt file here'}</div>
          <div className="drop-sub">
            {fileName ? 'File loaded · click to replace' : 'or click to browse'}
          </div>
        </div>

        <div className="input-divider"><span>or paste raw text</span></div>

        <textarea
          className="raw-textarea"
          value={text}
          onChange={(e) => { setText(e.target.value); setFileName(null); }}
          placeholder={'# Paste payroll data here\n# Lines starting with "The" = department headers\n# Name [data...] F1|F2|F3|F4'}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
        />

        <div className="input-actions">
          <button
            className="btn-ghost"
            onClick={() => { setText(SAMPLE); setFileName('sample.txt'); }}
          >
            Load Sample
          </button>
          {text && (
            <button
              className="btn-ghost"
              onClick={() => { setText(''); setFileName(null); }}
            >
              Clear
            </button>
          )}
          <button
            className="btn-process"
            disabled={!text.trim()}
            onClick={() => onSubmit(text)}
          >
            Process Payroll →
          </button>
        </div>

      </div>
    </div>
  );
}

// ── kpi card ──────────────────────────────────────────────────────────────────

function KPICard({ label, value, accent }) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className={`kpi-value${accent ? ' kpi-accent' : ''}`}>{value}</div>
    </div>
  );
}

// ── bar chart ─────────────────────────────────────────────────────────────────

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tip">
      <div className="ct-label">{label}</div>
      <div className="ct-value">{currency(payload[0].value)}</div>
    </div>
  );
}

function PayrollBarChart({ departments }) {
  const data = departments.map((d) => ({
    name: deptShort(d.name),
    payroll: d.employees.reduce((s, e) => s + e.pay, 0),
  }));
  return (
    <ResponsiveContainer width="100%" height={210}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <XAxis
          dataKey="name"
          tick={{ fill: '#475569', fontSize: 11, fontFamily: 'IBM Plex Mono' }}
          axisLine={{ stroke: '#1e2d47' }}
          tickLine={false}
        />
        <YAxis
          tickFormatter={currencyK}
          tick={{ fill: '#475569', fontSize: 10, fontFamily: 'IBM Plex Mono' }}
          axisLine={false}
          tickLine={false}
          width={52}
        />
        <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(6,182,212,0.06)' }} />
        <Bar dataKey="payroll" fill="#06b6d4" radius={[3, 3, 0, 0]} maxBarSize={72} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ── donut chart ───────────────────────────────────────────────────────────────

function DonutTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tip">
      <div className="ct-label">{payload[0].name}</div>
      <div className="ct-value">{payload[0].value} employee{payload[0].value !== 1 ? 's' : ''}</div>
    </div>
  );
}

function GradeDonut({ departments }) {
  const counts = Object.fromEntries(GRADE_ORDER.map((g) => [g, 0]));
  departments.forEach((d) => d.employees.forEach((e) => counts[e.type]++));
  const data = GRADE_ORDER.map((g) => ({ name: g, value: counts[g] })).filter((d) => d.value > 0);

  return (
    <ResponsiveContainer width="100%" height={210}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="46%"
          innerRadius={58}
          outerRadius={88}
          dataKey="value"
          paddingAngle={3}
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={GRADE_COLORS[entry.name]} />
          ))}
        </Pie>
        <Tooltip content={<DonutTooltip />} />
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(v) => (
            <span style={{ color: '#64748b', fontFamily: 'IBM Plex Mono', fontSize: 11 }}>{v}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

// ── top earners table ─────────────────────────────────────────────────────────

function TopEarners({ departments }) {
  const list = departments
    .flatMap((d) => d.employees.map((e) => ({ ...e, dept: deptShort(d.name) })))
    .sort((a, b) => b.pay - a.pay)
    .slice(0, 8);

  return (
    <table className="earners-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Department</th>
          <th>Grade</th>
          <th className="col-right">Pay</th>
        </tr>
      </thead>
      <tbody>
        {list.map((e, i) => (
          <tr key={i}>
            <td className="rank">{i + 1}</td>
            <td className="earner-name">{e.name}</td>
            <td className="earner-dept">{e.dept}</td>
            <td><TypeBadge type={e.type} /></td>
            <td className="earner-pay col-right">{currency(e.pay)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── department cards ──────────────────────────────────────────────────────────

function computeDeptStats(employees) {
  const byGrade = {};
  for (const g of GRADE_ORDER) {
    const sub = employees.filter((e) => e.type === g);
    byGrade[g] = {
      count: sub.length,
      pay:   sub.reduce((s, e) => s + e.pay, 0),
      hours: sub.reduce((s, e) => s + employeeHours(e), 0),
    };
  }
  const totalPay   = employees.reduce((s, e) => s + e.pay, 0);
  const totalHours = employees.reduce((s, e) => s + employeeHours(e), 0);
  return { totalPay, totalHours, byGrade };
}

function RosterRow({ emp }) {
  const hoursLabel = emp.type === 'F3'
    ? `${emp.requiredHours} req. hrs`
    : hrs(employeeHours(emp));
  return (
    <div className="roster-row">
      <TypeBadge type={emp.type} />
      <span className="roster-name">{emp.name}</span>
      <span className="roster-hrs">{hoursLabel}</span>
      <span className="roster-pay">{currency(emp.pay)}</span>
    </div>
  );
}

function DeptCard({ dept }) {
  const [open, setOpen] = useState(false);
  const { totalPay, totalHours, byGrade } = computeDeptStats(dept.employees);
  const activeGrades = GRADE_ORDER.filter((g) => byGrade[g].count > 0);
  const label    = deptShort(dept.name);
  const empCount = dept.employees.length;

  return (
    <div className="dept-card">
      <button
        className="dept-header-btn"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className={`chevron${open ? ' open' : ''}`}>›</span>
        <div className="dept-info">
          <div className="dept-name">{label}</div>
          <div className="dept-sub">
            {empCount} employee{empCount !== 1 ? 's' : ''} · {hrs(totalHours)}
          </div>
        </div>
        <div className="dept-grades">{activeGrades.map((g) => <TypeBadge key={g} type={g} />)}</div>
        <div className="dept-pay">{currency(totalPay)}</div>
      </button>

      {open && (
        <div className="dept-body">
          <div className="dept-roster">
            {dept.employees.map((emp, i) => <RosterRow key={i} emp={emp} />)}
          </div>
          <div className="dept-breakdown">
            <div className="bd-title">Grade Breakdown</div>
            {GRADE_ORDER.map((g) => (
              <div key={g} className="bd-row">
                <TypeBadge type={g} />
                <span className="bd-count">
                  {byGrade[g].count} employee{byGrade[g].count !== 1 ? 's' : ''}
                </span>
                <span className="bd-hrs">{hrs(byGrade[g].hours)}</span>
                <span className="bd-pay">{currency(byGrade[g].pay)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── screen 2: dashboard ───────────────────────────────────────────────────────

function DashboardScreen({ results, onBack, leaving }) {
  const { departments, errors } = results;
  const allEmps   = departments.flatMap((d) => d.employees);
  const totalPay  = allEmps.reduce((s, e) => s + e.pay, 0);
  const totalEmps = allEmps.length;
  const avgPay    = totalEmps > 0 ? totalPay / totalEmps : 0;

  return (
    <div className={`screen dash-screen${leaving ? ' leaving' : ''}`}>

      <nav className="dash-nav">
        <div className="nav-left">
          <div className="nav-logo">$</div>
          <span className="nav-title">Salary Processing</span>
          <span className="nav-version">v1.0</span>
        </div>
        <div className="nav-right">
          <span className="nav-user">BrandonMercadoPerez</span>
          <button className="btn-back" onClick={onBack}>← New File</button>
        </div>
      </nav>

      <div className="dash-body">

        {errors.length > 0 && (
          <div className="errors-section">
            {errors.map((err, i) => (
              <div key={i} className="error-line">
                <span className="error-prefix">ERR</span>
                <span>Line {err.lineNum}: {err.message}</span>
              </div>
            ))}
          </div>
        )}

        <div className="kpi-grid">
          <KPICard label="Total Payroll"       value={currency(totalPay)} accent />
          <KPICard label="Total Employees"     value={totalEmps} />
          <KPICard label="Departments"         value={departments.length} />
          <KPICard label="Avg Pay / Employee"  value={currency(avgPay)} />
        </div>

        <div className="charts-row">
          <div className="chart-card">
            <div className="chart-title">Payroll by Department</div>
            <PayrollBarChart departments={departments} />
          </div>
          <div className="chart-card chart-donut">
            <div className="chart-title">Grade Distribution</div>
            <GradeDonut departments={departments} />
          </div>
        </div>

        <div className="section-card">
          <div className="section-title">Top Earners</div>
          <TopEarners departments={departments} />
        </div>

        <div className="section-card">
          <div className="section-title">Department Breakdown</div>
          <div className="dept-list">
            {departments.map((dept, i) => <DeptCard key={i} dept={dept} />)}
          </div>
        </div>

      </div>
    </div>
  );
}

// ── main app ──────────────────────────────────────────────────────────────────

export default function App() {
  const [screen,  setScreen]  = useState('input');
  const [results, setResults] = useState(null);
  const [leaving, setLeaving] = useState(false);

  const navigate = (to, payload) => {
    setLeaving(true);
    setTimeout(() => {
      if (payload?.results) setResults(payload.results);
      if (to === 'input') setResults(null);
      setScreen(to);
      setLeaving(false);
    }, 360);
  };

  return (
    <div id="app">
      {screen === 'input'
        ? <InputScreen   onSubmit={(t) => navigate('dashboard', { results: parsePayroll(t) })} leaving={leaving} />
        : <DashboardScreen results={results} onBack={() => navigate('input')} leaving={leaving} />
      }
    </div>
  );
}
