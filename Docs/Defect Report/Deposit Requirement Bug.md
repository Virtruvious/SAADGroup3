# Bug ID

Id Number - 6
Title - Deposit Must Be Entered to Register
Reporter - Cory Newman-Mahoney
Submit date - 17 / 12 / 2024

# Bug overview 

Summary - When a guest attempts to register a new account, if they want to leave the deposit as 0, it will fail to make a new account.

URL - http://localhost:3000

# Environment 

Operating system - Windows - 22631.4602

Browser - Chrome 

# Bug details 

Steps to reproduce 
    1: Navigate to the register account modal as a guest
    2: Fill out the form with all required fields, leaving the deposit field as 0
    3: Click the register button

Expected Result - A new account is created with a deposit of 0

Actual result - The form fails to submit as it does not accept a deposit of 0

# Bug tracking 

Severity - Low

Assigned to - Cory Newman-Mahoney

Priority - Medium