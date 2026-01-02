# Salary Processing: Introductory Payroll Calculation System

### **Project Overview:**

> Salary Processing is an introductory C++ application designed to parse and compute payroll data from departmental employee records in a text file. This project focuses on foundational programming concepts such as file I/O, string manipulation, conditional logic, and modular functions to handle basic payroll calculations across different employee grades.

### **Key Features:**

> Multi-Department Processing:  
> Reads and summarizes payroll data for multiple departments from a single input file.  

> Versatile Time Parsing:  
> Handles mixed time formats (e.g., "8 hours 20 minutes", "7hrs 10min", "9 hours") with manual string extraction and rounding to the nearest half-hour.  

> Grade-Specific Calculations:  
> Applies unique logic for pay grades F1, F2, F3, and F4, including hourly rates, overtime, commissions, and weekend premiums.  

> Commission Handling for F3:  
> Processes sales amounts and commission rates, assigning assumed work hours based on rate thresholds (30 or 40 hours).  

> Weekend and Overtime for F4:  
> Differentiates weekday and weekend hours with adjusted pay rates.  

> Formatted Output:  
> Displays results in a boxed, tabular format with totals for salaries, hours, employees, and rosters per department and grade.  

> Basic Error Handling:  
> Includes file open checks and assumes consistent input structure for stability in an educational context.

## **Code Brainstorming:**

### **Basic Memory Management:**

> Relies on stack-based variables and simple data types to avoid complexity.  
> Uses primitive types like floats, doubles, and strings for calculations and storage.  
> Avoids dynamic allocation to keep the focus on introductory concepts.

### **Core Language Fundamentals:**

> Employs conditional statements (if-else) for decision-making in parsing and calculations.  
> Utilizes loops (while, for) for iterative string processing and data accumulation.  
> Leverages standard library functions like stoi/stod for string-to-number conversions.

### **Modular Design Principles:**

> Defines separate functions for each pay grade's processing (e.g., processF1F2, processF3, processF4) to promote code reuse and readability.  
> Includes helper functions like convertMinutesToHours for time rounding.  
> Uses pass-by-reference in functions to efficiently update tracking variables without global scope.
