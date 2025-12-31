# Payroll Processing – Lab 8 (C++)

This repository contains my C++ solution for Lab 8 (Chapter 7 – Salary Processing).
The program reads payroll data from a text file, parses time and sales information, and calculates employee pay based on predefined pay grades.

This project was completed as part of a coursework assignment and focuses on correctness, clarity, and proper use of core C++ concepts taught in an introductory programming course.

---

## Project Purpose and Scope

The primary goal of this project is to practice reading and parsing structured text data from a `.txt` file and applying basic logic to compute payroll results based on that input.

Because this assignment was completed for an introductory programming course, the solution is intentionally limited to concepts that had been covered at the time. The emphasis is on understanding program flow, conditionals, loops, and basic function design rather than advanced C++ features.

Only fundamental programming techniques are used, including:

* Basic file input using `ifstream`
* Conditional statements and decision logic
* Loops for repeated processing
* Simple functions and variables
* Manual string parsing techniques

Advanced features that had not yet been taught in the course (such as vectors, string streams, regular expressions, or advanced STL containers) were intentionally avoided.

---

## Lab Objectives

* Read payroll data from an external text file
* Parse time values expressed in multiple text formats
* Extract numeric values from mixed text input
* Apply different pay rules based on employee pay grade
* Accumulate totals for hours, salaries, and employees
* Produce formatted output summarizing department payroll data
* Write clear, readable, and well-structured C++ code

---

## Pay Grade Rules Implemented

The program supports multiple employee pay grades, each with its own calculation rules:

* F1: Total hours worked multiplied by 12.15
* F2: Total hours worked multiplied by 18.25
* F3: Base salary calculated using sales amount and commission rate
* F4:

  * Weekday hours multiplied by 26.55
  * Weekend hours multiplied by 39.75

Each employee record is processed according to its corresponding pay grade.

---

## Input Format

The program reads data from a text file located at:

data/input.txt

Time values in the input file may appear in various formats, including but not limited to:

* 8 hours 20 minutes
* 7hrs 10min
* 9 hours

The program is designed to handle these variations using basic string parsing logic.

---

## How to Compile and Run

Compile the program locally using a C++ compiler:

g++ -std=c++17 src/PayrollParser.cpp -o payroll

Run the program after compiling:

./payroll

Note: These commands are for local use only. GitHub does not execute or run C++ programs.

---

## Project Structure

salary-processing/

* README.md
* src/

  * PayrollParser.cpp
* data/

  * input.txt

---

## Notes

* The scope of this project is intentionally aligned with course lab requirements
* The focus is on learning and demonstrating foundational C++ concepts
* No compiled binaries or executables are included in this repository
* This repository reflects my personal implementation of the lab assignment

---

## Author

Brandon Mercado Perez
