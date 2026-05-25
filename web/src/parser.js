// Payroll parser — three rules only:
//   1. Line starting with "The " → department header
//   2. Last token of any other line → pay grade (F1–F4)
//   3. First token → employee name; everything between is pay data
//
// Scales to any number of departments, employees, or time entries.
// Time tokens: "8hrs"/"8 hours"/"8hours", "30min"/"30 minutes"/"30min"

const RATE_F1       = 12.15;
const RATE_F2_BASE  = 500.00;
const RATE_F2_OT    = 18.95;
const F2_OT_THRESH  = 35;
const RATE_F4_WKDAY = 26.55;
const RATE_F4_WKEND = 39.75;

const HR_RE  = /^(\d+(?:\.\d+)?)(hours?|hrs?)$/i;
const MIN_RE = /^(\d+(?:\.\d+)?)(minutes?|mins?)$/i;

// 1–29 min → 0.5 hr, 30+ min → 1.0 hr, 0 → 0  (matches C++ convertMinutesToHours)
function roundMins(m) {
  if (m <= 0) return 0;
  return m < 30 ? 0.5 : 1.0;
}

// Convert a token array into [{v, isMin}] components.
// Handles combined tokens ("8hrs", "30min") and split pairs ("8 hours", "30 minutes").
function timeComponents(tokens) {
  const out = [];
  let i = 0;
  while (i < tokens.length) {
    let m;
    if ((m = tokens[i].match(HR_RE)))  { out.push({ v: parseFloat(m[1]), isMin: false }); i++; continue; }
    if ((m = tokens[i].match(MIN_RE))) { out.push({ v: parseFloat(m[1]), isMin: true  }); i++; continue; }
    const n = parseFloat(tokens[i]);
    if (!isNaN(n) && i + 1 < tokens.length) {
      const u = tokens[i + 1].toLowerCase();
      if (/^(hours?|hrs?)$/.test(u))   { out.push({ v: n, isMin: false }); i += 2; continue; }
      if (/^(minutes?|mins?)$/.test(u)) { out.push({ v: n, isMin: true  }); i += 2; continue; }
    }
    i++;
  }
  return out;
}

// F1/F2: accumulate ALL hours and ALL minutes separately, then round once at the end.
// This matches C++ processF1F2 exactly — avoids per-entry rounding overcounts.
function f1f2Hours(dataTokens) {
  const comps = timeComponents(dataTokens);
  if (!comps.length) throw new Error('No time entries found');
  let h = 0, m = 0;
  for (const c of comps) c.isMin ? (m += c.v) : (h += c.v);
  h += Math.floor(m / 60);
  h += roundMins(m % 60);
  return h;
}

// F4: pair each hours token with the immediately following minutes token (one entry per day).
// Returns an array of per-day hours — any length, no minimum required.
function f4Days(dataTokens) {
  const comps = timeComponents(dataTokens);
  const days = [];
  let i = 0;
  while (i < comps.length) {
    const c = comps[i];
    if (!c.isMin) {
      if (i + 1 < comps.length && comps[i + 1].isMin) {
        days.push(c.v + roundMins(comps[i + 1].v)); i += 2;
      } else {
        days.push(c.v); i++;
      }
    } else {
      days.push(roundMins(c.v)); i++;
    }
  }
  return days;
}

// F3: scan for $Amount then the next bare number as commission rate
function f3Data(dataTokens) {
  let sales = null, rate = null;
  for (const t of dataTokens) {
    if (sales === null && t.startsWith('$')) {
      const n = parseFloat(t.slice(1).replace(/,/g, ''));
      if (!isNaN(n)) { sales = n; continue; }
    }
    if (sales !== null && rate === null) {
      const n = parseFloat(t.replace(/,/g, ''));
      if (!isNaN(n)) rate = n;
    }
  }
  if (sales === null) throw new Error('Missing sales amount (expected $Amount)');
  if (rate  === null) throw new Error('Missing commission rate after sales amount');
  return { sales, rate };
}

// Parse one employee line → employee object, or null if not a valid grade line.
function parseLine(line) {
  const tokens = line.trim().split(/\s+/);
  if (tokens.length < 2) return null;

  const grade = tokens[tokens.length - 1].toUpperCase();
  if (!['F1', 'F2', 'F3', 'F4'].includes(grade)) return null;

  const name       = tokens[0];
  const dataTokens = tokens.slice(1, -1);

  switch (grade) {
    case 'F1': {
      const totalHours = f1f2Hours(dataTokens);
      return { type: 'F1', name, totalHours, pay: totalHours * RATE_F1 };
    }
    case 'F2': {
      const totalHours = f1f2Hours(dataTokens);
      const ot  = Math.max(0, totalHours - F2_OT_THRESH);
      return { type: 'F2', name, totalHours, overtimeHours: ot, pay: RATE_F2_BASE + ot * RATE_F2_OT };
    }
    case 'F3': {
      const { sales, rate } = f3Data(dataTokens);
      const requiredHours = rate <= 0.10 ? 30 : 40;
      return { type: 'F3', name, sales, rate, requiredHours, pay: sales * rate };
    }
    case 'F4': {
      const days        = f4Days(dataTokens);
      const weekdayHours = days.slice(0, 5).reduce((a, b) => a + b, 0);
      const weekendHours = days.slice(5, 7).reduce((a, b) => a + b, 0);
      return { type: 'F4', name, days, weekdayHours, weekendHours,
               pay: weekdayHours * RATE_F4_WKDAY + weekendHours * RATE_F4_WKEND };
    }
  }
}

// ── public API ────────────────────────────────────────────────────────────────

export function employeeHours(emp) {
  switch (emp.type) {
    case 'F1': return emp.totalHours;
    case 'F2': return emp.totalHours;
    case 'F3': return emp.requiredHours;
    case 'F4': return emp.weekdayHours + emp.weekendHours;
    default:   return 0;
  }
}

export function parsePayroll(text) {
  const departments = [];
  const errors      = [];
  let   currentDept = null;

  text.split('\n').forEach((raw, idx) => {
    const line = raw.trim();
    if (!line || line.startsWith('#')) return;

    // Rule 1: department header
    if (line.startsWith('The ')) {
      currentDept = { name: line, employees: [] };
      departments.push(currentDept);
      return;
    }

    // Rules 2 & 3: employee line
    try {
      const emp = parseLine(line);
      if (emp) {
        if (!currentDept) {
          currentDept = { name: null, employees: [] };
          departments.push(currentDept);
        }
        currentDept.employees.push(emp);
      }
      // Lines with no F1–F4 grade that don't start with "The " are silently skipped
    } catch (err) {
      errors.push({ lineNum: idx + 1, raw, message: err.message });
    }
  });

  return { departments: departments.filter(d => d.employees.length > 0), errors };
}
