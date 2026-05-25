# Salary Processing

## Project Overview

This is a beginner C++ console application built for **Lab 8** of an introductory programming course (COSC 1463 — Fundamentals of Programming I). The program reads payroll data from a plaintext file, parses each employee's time entries and pay information, and computes their salary based on one of four pay grade formulas. Results are printed to the terminal in a formatted department-by-department summary.

The project intentionally avoids advanced C++ features — no STL vectors, no `istringstream`, no dynamic data structures. Every parsing step is done manually using `string::find`, `string::substr`, `string::erase`, and `stoi`/`stod`. This constraint is deliberate: it keeps the code aligned with the course learning objectives and demonstrates that complex data processing can be achieved with only fundamental language concepts.

---

## Learning Objectives

- **File input** — opening and reading a text file line-by-line with `ifstream` and `getline`
- **Conditional logic** — branching on pay grade identifiers (F1–F4) and department header detection
- **String parsing** — manually scanning strings for character landmarks (`h`, `m`, `$`, spaces) to extract numeric values without library helpers
- **Pay calculation rules** — applying four distinct formulas with different inputs, rates, and overtime thresholds
- **Tracking totals across grouped data** — accumulating per-grade and per-department salary, hours, and headcount using scalar variables
- **Readable console output** — formatting tabular results with `iomanip` (`setw`, `setprecision`, `fixed`, `left`, `right`) inside bordered boxes

---

## Key Features

- **Multiple departments** — any number of departments in a single input file, each introduced by a line starting with `The`
- **Flexible time formats** — handles mixed notation in a single line: `8 hours 20 minutes`, `7hours`, `9hrs 10min`, `57 minutes`, etc.
- **Four pay grades** — F1 (hourly), F2 (salaried with overtime), F3 (commission-based), F4 (weekday/weekend split)
- **Department totals** — total salary, total hours, and total headcount printed for each department
- **Per-grade summaries** — F1/F2 shown side-by-side with F3/F4 inside each department block
- **Employee rosters** — comma-separated list of all employees in each department

---

## Pay Grades Supported

**F1 — Hourly Worker**
Pay is calculated by multiplying total hours worked by a flat rate of $12.15/hr. All time entries across the week are accumulated into a single total before applying the rate.

**F2 — Salaried with Overtime**
Employees receive a flat $500.00 weekly base. Any hours worked beyond 35 in the week are paid at an overtime rate of $18.95/hr. Employees working 35 hours or fewer receive only the base pay.

**F3 — Commission**
Pay is the employee's total sales amount multiplied by their commission rate. No time parsing is required — the input line contains a dollar amount and a rate (e.g., `$24,000 0.105`). Required hours are implied by the rate: 30 hours if the rate is 10% or below, 40 hours if above 10%.

**F4 — Weekly with Weekend Differential**
The first five time entries represent Monday through Friday (weekday hours) paid at $26.55/hr. The next two entries represent Saturday and Sunday (weekend hours) paid at a higher rate of $39.75/hr.

**Time rounding (F1, F2, F4):** minutes are accumulated across all entries for the week, then rounded once at the end — 1–29 minutes rounds to 0.5 hr, 30 or more minutes rounds to 1.0 hr.

---

## Terminal Output

```
+--------------------------------------------------------------------------------------------------+
| The IT Department                                                                                |
| Total Salary: $                  3075.70                                                         |
| Total Hours:                      168.00                                                         |
| Total Employees:                       4                                                         |
| Roster: Bill, Betty, Brandon, Brad                                                               |
|                                                                                                  |
| F1 Stats                                          F3 Stats                                       |
| Total Salary: $                   413.10          Total Salary: $                     0.00       |
| Total Hours:                       34.00          Total Hours:                        0.00       |
| Total Employees:                       1          Total Employees:                       0       |
|                                                                                                  |
| F2 Stats                                          F4 Stats                                       |
| Total Salary: $                  1255.82          Total Salary: $                  1406.78       |
| Total Hours:                       83.50          Total Hours:                       50.50       |
| Total Employees:                       2          Total Employees:                       1       |
+--------------------------------------------------------------------------------------------------+

+--------------------------------------------------------------------------------------------------+
| The Sales Department                                                                             |
| Total Salary: $                  7147.45                                                         |
| Total Hours:                      181.00                                                         |
| Total Employees:                       5                                                         |
| Roster: Kyle, Tyler, Konner, Sam, Kent                                                           |
|                                                                                                  |
| F1 Stats                                          F3 Stats                                       |
| Total Salary: $                     0.00          Total Salary: $                  5417.75       |
| Total Hours:                        0.00          Total Hours:                      100.00       |
| Total Employees:                       0          Total Employees:                       3       |
|                                                                                                  |
| F2 Stats                                          F4 Stats                                       |
| Total Salary: $                   528.42          Total Salary: $                  1201.28       |
| Total Hours:                       36.50          Total Hours:                       44.50       |
| Total Employees:                       1          Total Employees:                       1       |
+--------------------------------------------------------------------------------------------------+

+--------------------------------------------------------------------------------------------------+
| The Overseas Department                                                                          |
| Total Salary: $                  3399.55                                                         |
| Total Hours:                      104.00                                                         |
| Total Employees:                       3                                                         |
| Roster: Jim, Frank, Lester                                                                       |
|                                                                                                  |
| F1 Stats                                          F3 Stats                                       |
| Total Salary: $                   303.75          Total Salary: $                  2520.00       |
| Total Hours:                       25.00          Total Hours:                       40.00       |
| Total Employees:                       1          Total Employees:                       1       |
|                                                                                                  |
| F2 Stats                                          F4 Stats                                       |
| Total Salary: $                   575.80          Total Salary: $                     0.00       |
| Total Hours:                       39.00          Total Hours:                        0.00       |
| Total Employees:                       1          Total Employees:                       0       |
+--------------------------------------------------------------------------------------------------+
```

---

## Files in This Repository

| Path | Description |
|------|-------------|
| `cpp/PayrollParser.cpp` | The complete C++ source file — all parsing and output logic |
| `cpp/input.txt` | Sample payroll input with three departments and twelve employees |
| `lab/` | Original lab assignment document (Lab 8 — Chapter 7) |
| `web/` | React + Vite dashboard that re-implements the same logic in the browser |

---

## Compile & Run

```bash
# From the cpp/ directory
g++ PayrollParser.cpp -o PayrollParser
./PayrollParser
```

Reads from `input.txt` in the same directory. Output prints directly to the terminal.

---

## Web App

An interactive React dashboard that ports the same parsing algorithm and pay-grade formulas into the browser. Features a drag-and-drop file input, live KPI cards, a payroll bar chart, a grade distribution donut chart, a ranked top earners table, and collapsible department breakdowns.

**Live:** https://web-mu-five-96.vercel.app

[View Web App →](https://github.com/BrandonMercadoPerez/salary-processing/blob/main/web/README.md)

---

## Notes

This project was written to match the scope of an introductory C++ course. Capabilities that would normally be reached for first — `std::vector`, `std::istringstream`, range-based loops, or structured file parsing — are deliberately absent. The goal was to demonstrate that the same result can be achieved with `while` loops, manual string scanning, and scalar accumulator variables. Educational clarity was prioritized over brevity or optimization.

---

## Author

**Brandon Mercado Perez**
