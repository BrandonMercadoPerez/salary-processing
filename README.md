# Payroll Processing – Lab 8 (C++)

This repository contains my C++ solution for Lab 8 (Chapter 7 – Salary Processing).
The program reads payroll data from a text file, parses time and sales information,
and calculates employee pay based on predefined pay grades.

This project was completed as part of a coursework assignment and focuses on
correctness, clarity, and proper use of core C++ concepts.

---

## Project Scope

The purpose of this project is to practice parsing structured text data from a `.txt` file and applying basic logic to compute results based on that input. Since this was completed for an introductory programming course, the solution is intentionally limited to concepts covered in class.

Only fundamental programming techniques are used, such as:
- Basic file input
- Conditional statements
- Loops
- Simple functions and variables

Advanced features not yet taught in the course (such as vectors, string streams, or other advanced C++ libraries) were intentionally avoided.

---

## Lab Objectives

- File input using ifstream
- String parsing and numeric extraction
- Conditional logic for multiple pay rules
- Accumulating totals and formatting output
- Writing modular and readable C++ code

---

## Pay Grade Rules Implemented

- F1: Total hours × 12.15
- F2: Total hours × 18.25
- F3: Base salary plus commission based on sales
- F4:
  - Weekday hours × 26.55
  - Weekend hours × 39.75

---

## Input

Sample file: data/input.txt

Time values may appear in formats such as:
- 8 hours 20 minutes
- 7hrs 10min
- 9 hours

---

## How to Compile and Run

Compile the program locally using a C++ compiler:

g++ -std=c++17 src/PayrollParser.cpp -o payroll

Run the program after compiling:

./payroll

Note: These commands are for local use only.
GitHub does not run C++ programs.

---

## Project Structure

salary-processing/
- README.md
- src/
