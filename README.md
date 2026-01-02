Salary Processing: Introductory Payroll Calculation System
Project Overview
Salary Processing is a beginner-friendly C++ console application that processes payroll data from a text file (input.txt) and computes department-level and pay-grade statistics.
This was completed as a lab assignment in an introductory programming course. The code uses only fundamental C++ features — file I/O, string manipulation, loops, conditionals, and functions — to demonstrate clear, well-commented solutions to real-world-style problems.
Key Features

Handles multiple departments from one input file
Parses flexible time formats ("8 hours 20 minutes", "9hrs", "57 minutes", "10min", etc.)
Supports all four pay grades with correct calculations:
F1: total hours × $12.15
F2: $500 base + overtime (hours > 35) × $18.95
F3: sales × commission rate; 30 hours if rate ≤ 0.10, else 40 hours
F4: first 5 days (weekday) × $26.55 + last 2 days (weekend) × $39.75

Rounds minutes to nearest half-hour (1–29 min → 0.5 h; 30–59 min → 1.0 h)
Produces clean, boxed tabular output with department totals and per-grade breakdowns
Tracks and displays employee roster per department

F4 Day Assignment & Parsing Logic
F4 employees have exactly 7 time entries (Monday → Sunday).
Entries are processed sequentially left-to-right using positional assignment:
1–5 → Weekdays (Monday–Friday)
6–7 → Weekend (Saturday–Sunday)
Pairing rules:

Hours token ("h"/"hrs"/"hours") sets base hours for the current day
If minutes token immediately follows, they are combined with those hours and rounded
Standalone minutes are converted and rounded independently for that day

Example – Kent (Sales Department):
9hrs 8hrs 1min 9 hrs 7hrs 5 min 8 hrs 55min 6min 1hr


→ Monday: 9 h  Tuesday: 8 h + 1 min → 8.0 h  Wednesday: 9 h
→ Thursday: 7 h + 5 min → 7.0 h  Friday: 8 h + 55 min → 9.0 h
→ Saturday: 6 min → 0.5 h  Sunday: 1 h
This linear approach keeps code simple and readable while correctly separating weekday and weekend pay.
Files in This Repository

PayrollParser.cpp – Complete source code with extensive inline comments explaining every major step
input.txt – Sample payroll data identical to the lab specification
SalaryProcessor.exe – Pre-compiled Windows executable (for instant testing)

How to Build & Run
Compile from source:
g++ PayrollParser.cpp -o SalaryProcessor
./SalaryProcessor          # Windows: SalaryProcessor.exe

Quick test:
Place input.txt in the same folder and double-click SalaryProcessor.exe (Windows).
The program will read input.txt and display formatted payroll summaries for each department.
Bonus Features Implemented

Columned/table output (5% bonus): Department and grade statistics are presented in clean, aligned boxed tables instead of plain text.

(No chart bonus implemented — focus was on correctness, clarity, and formatting.)
Code Design Highlights

String parsing uses only find(), substr(), stoi(), stod()
Dedicated functions for minute-to-hour conversion, F1/F2 parsing, F3 commission handling, and F4 day processing
All tracking variables reset between departments
Heavy inline commenting to explain parsing decisions and edge-case handling

This project prioritizes readability, correctness, and educational value — making it a solid reference for students learning file processing, string manipulation, and structured program design in C++.
Feel free to fork, study, or extend the code!
