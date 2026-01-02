# Salary Processing – Lab 8 (C++)

### Project Overview

Salary Processing is a beginner-level C++ console application that reads payroll data from a text file and computes employee pay based on department and pay grade rules. This project was completed as **Lab 8** for an introductory programming course and is designed to demonstrate core C++ concepts through a realistic payroll-processing scenario.

The program processes unstructured payroll input data, parses time and sales information, and produces summarized payroll results for each department. The focus of the project is correctness, clarity, and clean program flow using only concepts covered at the time of the course.

This repository intentionally avoids advanced C++ features in order to stay aligned with the learning objectives of an introductory class.

### Learning Objectives

- Practice file input using text files
- Apply conditional logic and loops to real-world data
- Parse mixed-format input using basic string operations
- Implement multiple pay calculation rules
- Track totals and summaries across grouped data
- Produce clear and readable console output

### Key Features

- Reads payroll data from a single input file (`input.txt`)
- Supports multiple departments in one run
- Handles flexible time formats (hours and minutes in various textual forms)
- Processes four different employee pay grades
- Calculates department totals and per-grade summaries
- Tracks employee counts and rosters per department
- Outputs formatted payroll summaries to the console

### Pay Grades Supported

- **F1**  
  Hourly employees paid a fixed hourly rate based on total hours worked.
- **F2**  
  Hourly employees with a base salary and overtime rules.
- **F3**  
  Commission-based employees paid based on sales amount and commission rate.
- **F4**  
  Employees with different weekday and weekend pay rates, based on daily time entries.

(Exact calculation rules are implemented in the source code and explained separately in `notes.txt`.)

### Files in This Repository

- `README.md` – Project overview and usage information (this file)
- `input.txt` – Sample payroll input data used by the program
- `PayrollParser.cpp` – Complete C++ source code for the payroll processing program
- `notes.txt` – Detailed explanation of time parsing logic, rounding rules, and pay-grade handling

### How to Build and Run

1. Make sure `input.txt` is in the same directory as the source/executable.
2. Compile the program using a C++ compiler (example using g++):
g++ PayrollParser.cpp -o SalaryProcessor
3. Run the program:
./SalaryProcessor   # On Windows: SalaryProcessor.exe


The program will read `input.txt` and display payroll summaries for each department.

### Notes

- This project is intentionally limited to fundamental C++ concepts.
- No external libraries or STL containers beyond basic strings are used.
- The goal is educational clarity rather than production-level optimization.
- No compiled binaries are included in this repository.

**Author**  
Brandon Mercado Perez

Feel free to study or fork the code!
