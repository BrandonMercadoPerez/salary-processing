# Salary Processing — Web

A full-featured payroll dashboard built with React and Vite. This is a web implementation of the original [salary-processing](https://github.com/BrandonMercadoPerez/salary-processing) C++ project, porting the same parsing logic and pay-grade rules into an interactive browser-based interface.

---

## Screenshots

> _Add screenshots here_

---

## Overview

The app reads plaintext payroll files and produces a real-time financial dashboard across two screens.

**Screen 1 — Input**
- Drag-and-drop a `.txt` payroll file or paste raw text directly
- Sample data loader for quick testing

**Screen 2 — Dashboard**
- KPI cards: Total Payroll, Total Employees, Departments, Avg Pay per Employee
- Bar chart: payroll broken down by department
- Donut chart: employee distribution across pay grades (F1–F4)
- Top Earners table ranked by pay
- Collapsible department cards with per-employee roster and grade breakdown

---

## Pay Grade Rules

| Grade | Type | Calculation |
|-------|------|-------------|
| F1 | Hourly | `total hours × $12.15` |
| F2 | Salaried | `$500.00 base + (hours over 35) × $18.95` |
| F3 | Commission | `sales amount × rate` · 30 req. hrs if rate ≤ 10%, else 40 |
| F4 | Weekly | `weekday hours (Mon–Fri) × $26.55 + weekend hours (Sat–Sun) × $39.75` |

Time rounding (F1, F2, F4): 1–29 min → 0.5 hr · 30+ min → 1.0 hr

---

## Input Format

```
The IT Department
Bill 8 hours 20 minutes 7hours 8hours 30 minutes 9hrs 10min 57 minutes F1
Betty 8hrs 8hrs 30min 7hrs 5min 8hrs 7hrs 10min F2
Brad 9hrs 8hrs 10hrs 12min 9hrs 4min 8hours 6min 3hrs 24min 1hr 6min F4
The Sales Department
Kyle $24,000 0.105 F3
```

- Lines starting with `The` are department headers
- Last token on any other line is the pay grade (`F1`–`F4`)
- First token is the employee name
- Supports any number of departments, employees, and time entries

---

## Tech Stack

| | |
|---|---|
| **Framework** | [React 18](https://react.dev) |
| **Build tool** | [Vite 6](https://vitejs.dev) |
| **Charts** | [Recharts](https://recharts.org) |
| **Font** | [IBM Plex Mono](https://fonts.google.com/specimen/IBM+Plex+Mono) |

---

## Running Locally

```bash
# 1. Clone the repo
git clone https://github.com/BrandonMercadoPerez/salary-processing-web.git
cd salary-processing-web

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Original C++ Project

This web app is a direct port of the command-line payroll parser written in C++ for a university course:

**[github.com/BrandonMercadoPerez/salary-processing](https://github.com/BrandonMercadoPerez/salary-processing)**

The parsing algorithm — including minute accumulation, rounding logic, and all four pay-grade formulas — matches the original C++ implementation exactly.

---

## Author

**Brandon Mercado Perez**
