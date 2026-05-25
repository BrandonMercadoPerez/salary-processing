#include <iostream>
#include <fstream>
#include <string>
#include <iomanip>
using namespace std;

/*


    Function to convert minutes into hours


*/
float convertMinutesToHours(int minutes) {
    if (minutes > 0 && minutes <= 29) {
        return 0.5f;  // Convert to half an hour for 1-29 minutes
    }
    else if (minutes >= 30) {
        return 1.0f;  // Convert to a full hour for 30-59 minutes
    }
    else {
        return 0.0f;  // No additional hours if 0 minutes
    }
}

/*



            This Function is meant to process the file for both category f1 and f2




*/

float processF1F2(string line) {
    float totalHours = 0;
    int totalMinutes = 0;

    while (!line.empty()) {

        /*
           The two lines minPos and hrPos is used to find the position
           of the character 'm' and 'h' in the string line.

       */
        size_t minPos = line.find("m");
        size_t hrPos = line.find("h");


        /*
           if statement check both 'm' and 'h' if they are not found
           then break out of the loop.

       */
        if (minPos == string::npos && hrPos == string::npos)
            break;


        /*
             if statement


             if hour position is less the the minutes
             then go inside the body

             the body has a variable that locates the Position of spaces
             it starting at the hour position

             the inner if statement checks if no space was found in the string line.
             If no space is found, spacePos is set to the end of the string.
             to extract the numeric value from the string into a integer i'm using stoi string function
             storing it into hrs
             i created another variable called totalHours to track the total hours
             once im done processisng the part of the line
             line.erease will erase the peiece of data past the space to contiune on to the next part


        */
        if (hrPos < minPos) {
            // Extract hours
            size_t spacePos = line.find(" ", hrPos); // will look for space position from hour poisition
            if (spacePos == string::npos) spacePos = line.length();
            int hrs = stoi(line.substr(0, hrPos)); // extract sting convert into integer
            totalHours += hrs; // track hours for later 
            line.erase(0, spacePos + 1); // Remove processed part
        }
        else {
            // Extract minutes
            size_t spacePos = line.find(" ", minPos);
            if (spacePos == string::npos) spacePos = line.length();
            int minutes = stoi(line.substr(0, minPos));
            totalMinutes += minutes;
            line.erase(0, spacePos + 1); // Remove processed part
        }
    }

    // Convert total minutes to hours using a function to return .5 or 1 hour depending on minutes
    totalHours += (totalMinutes / 60);
    totalHours += convertMinutesToHours(totalMinutes % 60);
    return totalHours;
}



/*
    A function that process the data for f3 category

*/
void processF3(string line, double& salesAmount, double& commissionRate, double& workHours) {




    /*
        This function work similar to the f1 and f2 but requires to deal with the ',' in sales ammount

    */


    size_t dollarPos = line.find('$');  // find the posiotion for $ sign
    size_t spaceAfterDollar = line.find(" ", dollarPos);  // find the posiotion for space
    string salesAmountStr = line.substr(dollarPos + 1, spaceAfterDollar - dollarPos - 1);  // store the string after the $ and before the space. "30,011" from $30,011 

    /*

        the comma will cuase issue when trying to conver the string into a numeric values
        so it need to be ingored removed
    */

    string NewSalesAmountStr = "";  // placeholder for new sales amount

    /*

        this for loop will check each charater in of the string in salesAmount
        everytime it loops If the character is not a comma, it gets appended to the new sales ammount string
        when the character cant be ',' so it skip the process continues untill no charater is left in the string
        instead of adding 'c' i couldve use the append function

        NewSalesAmountStr.append(1, c);

    */

    for (char c : salesAmountStr) {
        if (c != ',') {
            NewSalesAmountStr += c; // append character into new string
        }
    }
    salesAmount = stod(NewSalesAmountStr); // wansnt sure on which one to use stoi, stof, or stod. but isnce we are working with money i assumed either float or double.
    line.erase(0, spaceAfterDollar + 1); // Remove processed part

    // Extract commission rate
    size_t spaceAfterRate = line.find(" ");
    commissionRate = stod(line.substr(0, spaceAfterRate));
    line.erase(0, spaceAfterRate + 1); // Remove processed part

    // Determine work hours
    workHours = (commissionRate <= 0.10) ? 30 : 40;
}



void processF4(string line, double& weekdayHours, double& weekendHours) {
    int count = 0; // Tracks the number of timestamps processed

    while (!line.empty()) {
        size_t hrPos = line.find("h");
        size_t minPos = line.find("m");

        if (hrPos == string::npos && minPos == string::npos)
            break;

        double combinedHours = 0.0;
        /*






            I proccesed this line like I did with f1 and f2.
            For example, consider the input "10hrs 12min".
            extract the integer part, "10", representing hours.
            Check if there are any minutes following the hours.
            If the minutes is found after hours, extract the ("12") and convert it to a decimal representation of hours since it ask to round the value to the nearest half-hour
            I added the decimal hours to the integer hours to get the total hours
            10 + 0.5 = 10.5 hours.
            Technically soomeone can work only 4 minutes on the first day, but for this im going to assume that they work at least a few hours so i choose to pair hours and minutes
            Here are some examples:

            Weekday 9 hours
            Weekday 8 hours
            Weekday 10.5 hours (for 10 hours and 12 minutes)
            Weekday 9.5 hours  (for 9 hours and 4 minutes)
            Weekday 8.5 hours  (for 8 hours and 6 minutes)
            Weekdend 3.5 hours (for 3 hours and 24 minutes)
            Weekdend 1.5 hours (for 1 hours and 6 minutes)

            Weekeday Hours 45.5
            Weekend Hours 5




        */
        if (hrPos < minPos) {
            // Extract hours
            size_t spacePos = line.find(" ", hrPos); // will look for space position from hour poisition
            if (spacePos == string::npos) spacePos = line.length();
            int hrs = stoi(line.substr(0, hrPos)); // extract the mumeric string hours and converts it to an integer
            line.erase(0, spacePos + 1); // Remove processed part

            // add this to check if there a mintues following the hours
            size_t nextMinPos = line.find("m"); // find the mintues after hours
            if (nextMinPos < line.find("h")) {
                size_t nextSpacePos = line.find(" ", nextMinPos); // find the position of the spaces after minutes
                if (nextSpacePos == string::npos) nextSpacePos = line.length(); //check if theres a space, If the space wasn't found, this line sets nextSpacePos to the length of the line string 
                int mins = stoi(line.substr(0, nextMinPos)); // extract the mumeric string minutes  and converts it to an integer
                line.erase(0, nextSpacePos + 1);

                // Convert minutes to hours .  This will give the .5 or 1.0 to add into hours
                double convertedMintues = convertMinutesToHours(mins);
                combinedHours = hrs + convertedMintues; // Combine hours and converted minutes
            }
            else {
                // if there no minutes following the hours thill will store it directly 
                combinedHours = hrs;
            }
        }


        /*
            this is the same process as hours but for minutes
        */


        else {
            // Extract standalone minutes
            size_t spacePos = line.find(" ", minPos);
            if (spacePos == string::npos) spacePos = line.length();
            int mins = stoi(line.substr(0, minPos));
            line.erase(0, spacePos + 1);

            // Convert minutes to fractional hours using the provided function
            combinedHours = convertMinutesToHours(mins);
        }


        /*

            using the if-else statment to add the corresponding hours to weekday or weekend using the counter variables


        */
        if (count < 5) {
            weekdayHours += combinedHours;
        }
        else if (count < 7) {
            weekendHours += combinedHours;
        }
        count++;
    }
}
void printBox() {
    int width = 30; // Set the width of the box
    for (int i = 0; i < 2; ++i) {
        cout << "+"; // Print the top border
        for (int j = 0; j < width; ++j) {
            cout << "-"; // Fill the border with dashes
        }
        cout << "+" << endl; // End the top border line

        // Print the empty space inside the box
        cout << "| " << left << setw(width - 1) << " " << left << setw(width - 1) << "|" << endl;
    }
}


/*
        This fucntion will display the result of each department when called
        passing all the values we use to track data by reference
*/
void results(const string& departmentName,
    string& roster, int& totalEmployees, double& totalSalary,
    double& f1TotalHours, double& f2TotalHours, double& f3TotalHours, double& f4TotalHours,
    double& f1Salary, double& f2Salary, double& f3Salary, double& f4Salary,
    int& f1Employees, int& f2Employees, int& f3Employees, int& f4Employees) {
    if (!departmentName.empty()) {

        // get all the hours from categories to get total hours for the department
        double totalHours = f1TotalHours + f2TotalHours + f3TotalHours + f4TotalHours;

    
    // int widthOfBox = 50; // Define the width of the box

    // Assuming widthOfBox is 100 for clear demonstration
    const int widthOfBox = 100;
    const int sectionWidth = (widthOfBox / 2) - 1;  // Each section is half the width minus a bit for the divider

    // Display F1 and F3 stats
    cout << "+";
    for (int i = 0; i < widthOfBox-2; ++i) {
        cout << "-";
    }
    cout << "+" << endl;
    cout << "| " << departmentName << setw(widthOfBox-(1 +departmentName.length()))<< "|\n";;
    cout << "| " << left << setw(20) << "Total Salary: $" << right << setw(20) << fixed << setprecision(2) << totalSalary << setw(59) <<  "|\n";
    cout << "| " << left << setw(20) << "Total Hours:" << right << setw(20) << totalHours << setw(59) << "|\n";
    cout << "| " << left << setw(20) << "Total Employees:" << right << setw(20) << totalEmployees << setw(59)<<  "|\n";
    cout << "| " << "Roster: " << roster << setw(widthOfBox-(9+roster.length()))<< "|\n";
    cout << "|  " << setw(widthOfBox-2) <<  "|\n" ;

    cout << "| " << left << setw(sectionWidth) << "F1 Stats" << " " << left << setw(sectionWidth-2) << "F3 Stats" << "|\n";
    cout << "| " << left << setw(20) << "Total Salary: $" << right << setw(20) << fixed << setprecision(2) << f1Salary << "\t   ";
    cout << " " << left << setw(20) << "Total Salary: $" << right << setw(20) << f3Salary << "\t   " << "|\n";

    cout << "| " << left << setw(20) << "Total Hours:" << right << setw(20) << f1TotalHours << "\t   ";
    cout << " " << left << setw(20) << "Total Hours:" << right << setw(20) << f3TotalHours << "\t   "<< "|\n" ;

    cout << "| " << left << setw(20) << "Total Employees:" << right << setw(20) << f1Employees<< "\t   ";
    cout << " " << left << setw(20) << "Total Employees:" << right << setw(20) << f3Employees << "\t   "<< "|\n";


    cout << "|  " << setw(widthOfBox-2) <<  "|\n" ;
    cout << "| " << left << setw(sectionWidth) << "F2 Stats" << " " << left << setw(sectionWidth-2) << "F4 Stats" << "|\n";
    cout << "| " << left << setw(20) << "Total Salary: $" << right << setw(20) << fixed << setprecision(2) << f2Salary << "\t   ";
    cout << " " << left << setw(20) << "Total Salary: $" << right << setw(20) << f4Salary << "\t   "<< "|\n";

    cout << "| " << left << setw(20) << "Total Hours:" << right << setw(20) << f2TotalHours<< "\t   ";
    cout << " " << left << setw(20) << "Total Hours:" << right << setw(20) << f4TotalHours << "\t   "<< "|\n";

    cout << "| " << left << setw(20) << "Total Employees:" << right << setw(20) << f2Employees<< "\t   ";
    cout << " " << left << setw(20) << "Total Employees:" << right << setw(20) << f4Employees << "\t   "<< "|\n";

    cout << "+";
    for (int i = 0; i < widthOfBox-2; ++i) {
        cout << "-";
    }
    cout << "+" << endl;
    
    cout << endl;

// Display F2 and F4 stats, similar to F1 and F3 with your specific values for salaries, hours, and employee counts


    // Print the top border of the box
    // cout << "+";
    // for (int i = 0; i < widthOfBox; ++i) {
    //     cout << "-";
    // }
    // cout << "+" << endl;

    // // Print the department name
    // cout << "| " << left << setw(widthOfBox - 1) << departmentName << "|" << endl;

    // // Print the separator line
    // cout << "+";
    // for (int i = 0; i < widthOfBox; ++i) {
    //     cout << "-";
    // }
    // cout << "+" << endl;

    // // Print department details
    // cout << "| " << left << setw(widthOfBox - 20) << "Total Salary: $" 
    //      << fixed << setprecision(2) << totalSalary << " |" << endl;

    // cout << "| " << left << setw(widthOfBox - 20) << "Total Hours: " 
    //      << right << setw(18) << static_cast<int>(totalHours) << " |" << endl;

    // cout << "| " << left << setw(widthOfBox - 20) << "Total Employees: " 
    //      << right << setw(18) << totalEmployees << " |" << endl;

    // cout << "| " << left << setw(widthOfBox - 1) << ("Roster: " + roster) << "|" << endl;

    // // Print the bottom border of the box
    // cout << "+";
    // for (int i = 0; i < widthOfBox; ++i) {
    //     cout << "-";
    // }
    // cout << "+" << endl;

    //     // display F1 and F3 stats
    // cout << "+";
    // for (int i = 0; i < widthOfBox; ++i) {
    //     cout << "-";
    // }
    // cout << "+" << endl;
    //     cout << "| " << "F1:" << setw(40) << " " << "F3: " << setw(40) << "| " << endl;
    //     cout << "| " << left << "Total Salary: $" << fixed << setprecision(2) << f1Salary << "    " << "Total Salary: $" << f3Salary << "| " << "\n";
    //     cout << "| " << "Total Hours: " << f1TotalHours << fixed << setprecision(1) << "             " << right << "Total Hours: " << fixed << setprecision(1) << f3TotalHours << "| "  << "\n";
    //     cout << "| " << "Total Number of Employees: " << f1Employees << setw(15) << " " << "Total Number of Employees: " << f3Employees << "| " << "\n";
    //     cout << "| " << "+";
    // for (int i = 0; i < widthOfBox; ++i) {
    //     cout << "-";
    // }
    //     // display F2 and F4  stats
    //     cout << "| " << "F2:" << setw(40) << " " << "F4:" << setw(40) << "| \n";
    //     cout << "| " << "Total Salary: $" << fixed << setprecision(2) << f2Salary << setw(21) << " " << "Total Salary: $" << f4Salary << "\n";
    //     cout << "| " << "Total Hours: " <<  f2TotalHours << fixed << setprecision(1) << setw(25) << " " << "Total Hours: " << fixed << setprecision(1) << f4TotalHours << "\n";
    //     cout << "| " << "Total Number of Employees: " << f2Employees << setw(15) << " " << "Total Number of Employees: " << f4Employees << "\n";

    }

    // Reset all values for the new department
    roster.clear();
    totalEmployees = 0;
    totalSalary = 0;
    f1TotalHours = f2TotalHours = f3TotalHours = f4TotalHours = 0.0;
    f1Salary = f2Salary = f3Salary = f4Salary = 0.0;
    f1Employees = f2Employees = f3Employees = f4Employees = 0;
}



int main() {

    /*

        All the variables that need to be tracked

    */
    double f1TotalHours = 0, f2TotalHours = 0, f3TotalHours = 0, f4TotalHours = 0;
    double f1Salary = 0, f2Salary = 0, f3Salary = 0, f4Salary = 0;
    int f1Employees = 0, f2Employees = 0, f3Employees = 0, f4Employees = 0;
    double totalSalary = 0;
    int totalEmployees = 0;
    string departmentName, roster;

    ifstream file("input.txt");
    if (!file) {
        cerr << "Error opening file." << endl;
        return 1;
    }

    string line;
    while (getline(file, line)) {
        // Find the department 
        if (line.find("The") == 0) {
            if (!departmentName.empty()) {
                // Display stats for the previous department before moving to the next
                results(departmentName, roster, totalEmployees, totalSalary,
                    f1TotalHours, f2TotalHours, f3TotalHours, f4TotalHours,
                    f1Salary, f2Salary, f3Salary, f4Salary,
                    f1Employees, f2Employees, f3Employees, f4Employees);
            }

            departmentName = line;
            continue; // Skip further processing for department lines
        }

        /*

            Extract the name from the line and store it into a varibles called roster
            which i need to find out what employee working in that department
            once extracted that part of the line is then erased


        */
        string name = line.substr(0, line.find(" "));
        line.erase(0, line.find(" ") + 1);
        roster += (roster.empty() ? "" : ", ") + name;  // decide whether to add a comma before appending a name, that way the last name doesnt have a comma.
        float totalHours = 0;

        /*

            when reading the line of the file it will check the line to find f1 to f4
            it will go to the corresponding if statment to call the function to get the times
            which is stored into is repsected variables that need to be tracked
            salary calcuation is also located inside each body

        */

        if (line.find("F1") != string::npos) {
            totalHours = processF1F2(line);
            f1TotalHours += totalHours;
            f1Employees++;
            double salary = totalHours * 12.15; // F1 salary calculation
            f1Salary += salary;
            totalSalary += salary;
        }
        else if (line.find("F2") != string::npos) {
            totalHours = processF1F2(line);
            f2TotalHours += totalHours;
            f2Employees++;
            double salary = ((totalHours > 35) ? (totalHours - 35) * 18.95 + 500 : 500); // F2 salary calculation
            f2Salary += salary;
            totalSalary += salary;
        }


        /*

            The line for employees of category f3 does not contain hour or minutes instead sales ammount and commision rate
            base on the comission rate F3s are also assumed to work 30 hours if their commission is 10% or below and 40 hours if their commission is above 10%.


        */
        else if (line.find("F3") != string::npos) {
            double salesAmount = 0, commissionRate = 0, workHours = 0;

            // Process the F3 line to extract salesAmount, commissionRate, and workHours
            processF3(line, salesAmount, commissionRate, workHours);

            // Remaining calculations in main
            f3TotalHours += workHours;
            double salary = salesAmount * commissionRate; // F3 salary calculation
            f3Salary += salary;
            f3Employees++;
            totalSalary += salary;
        }
        else {



            double regularHours = 0, weekendHours = 0;

            // Process the F4 line
            processF4(line, regularHours, weekendHours);

            // Perform calculations in main
            f4TotalHours += (regularHours + weekendHours);
            double salary = (regularHours * 26.55) + (weekendHours * 39.75);
            f4Salary += salary;
            f4Employees++;
            totalSalary += salary;

        }
        totalEmployees++;
    }

    file.close();

    // Display stats for the last department
    if (!departmentName.empty()) {
        results(departmentName, roster, totalEmployees, totalSalary,
            f1TotalHours, f2TotalHours, f3TotalHours, f4TotalHours,
            f1Salary, f2Salary, f3Salary, f4Salary,
            f1Employees, f2Employees, f3Employees, f4Employees);
    }

    return 0;
}
