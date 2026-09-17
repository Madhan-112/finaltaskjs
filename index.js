let employees = [];
let displayedEmployees = [];

let employeeGrid = document.getElementById("employeeGrid");
let searchInput = document.getElementById("searchInput");
let message = document.getElementById("message");

let totalEmployees = document.getElementById("totalEmployees");
let totalSalary = document.getElementById("totalSalary");
let averageSalary = document.getElementById("averageSalary");
let highestSalary = document.getElementById("highestSalary");

let nameInput = document.getElementById("name");
let ageInput = document.getElementById("age");
let emailInput = document.getElementById("email");
let departmentInput = document.getElementById("department");
let salaryInput = document.getElementById("salary");

const API_URL = "https://dummyjson.com/users?limit=30";

/* Different demo salaries */

const salaryList = [
    45000,
    52000,
    58000,
    62000,
    68000,
    72000,
    78000,
    85000,
    91000,
    97000,
    55000,
    64000,
    73000,
    82000,
    69000,
    76000,
    88000,
    93000,
    47000,
    59000,
    71000,
    86000,
    99000,
    54000,
    67000,
    74000,
    89000,
    61000,
    79000,
    95000
];

/* Fetch employees */

function fetchEmployees() {

    message.innerHTML = "⏳ Loading employees...";

    fetch(API_URL)
        .then(function(response) {

            if (!response.ok) {
                throw new Error("Failed to fetch employees");
            }

            return response.json();
        })

        .then(function(data) {

            employees = data.users.map(function(user, index) {

                let department = user.company.department;

                /* Convert API department names into assignment departments */

                if (department === "Engineering") {
                    department = "IT";
                }

                if (department === "Human Resources") {
                    department = "HR";
                }

                if (
                    department !== "IT" &&
                    department !== "HR" &&
                    department !== "Finance" &&
                    department !== "Marketing"
                ) {
                    department = "IT";
                }

                return {
                    id: user.id,
                    name: user.firstName + " " + user.lastName,
                    age: user.age,
                    email: user.email,
                    department: department,
                    phone: user.phone,
                    image: user.image,

                    /* Different salary for every employee */

                    salary: salaryList[index]
                };
            });

            displayedEmployees = [...employees];

            displayEmployees(displayedEmployees);
            calculateSalary();
            updateEmployeeCount();

            message.innerHTML = "✅ Employees loaded successfully!";
        })

        .catch(function(error) {

            message.innerHTML = "❌ " + error.message;
        })

        .finally(function() {

            setTimeout(function() {
                message.innerHTML = "";
            }, 2000);
        });
}


/* Display employees */

function displayEmployees(employeeArray) {

    employeeGrid.innerHTML = "";

    if (employeeArray.length === 0) {

        employeeGrid.innerHTML = `
            <h2 style="color:white; text-align:center;">
                No employees found
            </h2>
        `;

        updateEmployeeCount();
        return;
    }

    employeeArray.forEach(function(employee) {

        let card = document.createElement("div");

        card.className = "employee-card";

        card.innerHTML = `
            <img src="${employee.image}" alt="${employee.name}">

            <h3>${employee.name}</h3>

            <p>👤 Age: ${employee.age}</p>

            <p>📧 ${employee.email}</p>

            <p>📱 ${employee.phone}</p>

            <p>
                <span class="department">
                    ${employee.department}
                </span>
            </p>

            <p class="salary">
                💰 ₹${employee.salary.toLocaleString("en-IN")}
            </p>

            <button 
                class="delete-btn"
                onclick="deleteEmployee(${employee.id})">
                🗑 Delete
            </button>
        `;

        employeeGrid.appendChild(card);
    });

    updateEmployeeCount();
}


/* Search employees */

function searchEmployees() {

    let searchText = searchInput.value.toLowerCase();

    displayedEmployees = employees.filter(function(employee) {

        return employee.name
            .toLowerCase()
            .includes(searchText);
    });

    displayEmployees(displayedEmployees);
    calculateSalary();
}


/* Department filter */

function filterDepartment(department) {

    if (department === "All") {

        displayedEmployees = [...employees];

    } else {

        displayedEmployees = employees.filter(function(employee) {

            return employee.department === department;
        });
    }

    displayEmployees(displayedEmployees);
    calculateSalary();
}


/* Add employee */

function addEmployee() {

    let name = nameInput.value.trim();
    let age = Number(ageInput.value);
    let email = emailInput.value.trim();
    let department = departmentInput.value;
    let salary = Number(salaryInput.value);

    if (!validateEmployee(name, age, email, salary)) {
        return;
    }

    let newEmployee = {
        id: Date.now(),
        name: name,
        age: age,
        email: email,
        department: department,
        phone: "Not Available",
        image: "https://dummyjson.com/icon/user/128",
        salary: salary
    };

    employees = [...employees, newEmployee];

    displayedEmployees = [...employees];

    displayEmployees(displayedEmployees);
    calculateSalary();

    clearForm();

    message.innerHTML = "✅ Employee added successfully!";

    setTimeout(function() {
        message.innerHTML = "";
    }, 2000);
}


/* Validate employee */

function validateEmployee(name, age, email, salary) {

    if (name === "") {

        message.innerHTML = "❌ Enter employee name";
        return false;
    }

    if (age <= 0) {

        message.innerHTML = "❌ Enter a valid age";
        return false;
    }

    if (!email.includes("@")) {

        message.innerHTML = "❌ Enter a valid email";
        return false;
    }

    if (salary <= 0) {

        message.innerHTML = "❌ Enter a valid salary";
        return false;
    }

    return true;
}


/* Delete employee */

function deleteEmployee(id) {

    employees = employees.filter(function(employee) {

        return employee.id !== id;
    });

    displayedEmployees = displayedEmployees.filter(function(employee) {

        return employee.id !== id;
    });

    displayEmployees(displayedEmployees);
    calculateSalary();

    message.innerHTML = "🗑 Employee deleted successfully!";

    setTimeout(function() {
        message.innerHTML = "";
    }, 1500);
}


/* Salary calculations */

function calculateSalary() {

    if (displayedEmployees.length === 0) {

        totalSalary.innerHTML = "₹0";
        averageSalary.innerHTML = "₹0";
        highestSalary.innerHTML = "₹0";

        return;
    }

    let total = displayedEmployees.reduce(function(sum, employee) {

        return sum + employee.salary;

    }, 0);

    let average = total / displayedEmployees.length;

    let highestEmployee = displayedEmployees.reduce(function(highest, employee) {

        return employee.salary > highest.salary
            ? employee
            : highest;

    });

    totalSalary.innerHTML =
        "₹" + total.toLocaleString("en-IN");

    averageSalary.innerHTML =
        "₹" + Math.round(average).toLocaleString("en-IN");

    highestSalary.innerHTML =
        "₹" + highestEmployee.salary.toLocaleString("en-IN");
}


/* Employee count */

function updateEmployeeCount() {

    totalEmployees.innerHTML = displayedEmployees.length;
}


/* Sort employees */

function sortEmployees(type) {

    if (type === "name") {

        displayedEmployees.sort(function(a, b) {

            return a.name.localeCompare(b.name);
        });
    }

    if (type === "age") {

        displayedEmployees.sort(function(a, b) {

            return a.age - b.age;
        });
    }

    if (type === "salary") {

        displayedEmployees.sort(function(a, b) {

            return b.salary - a.salary;
        });
    }

    displayEmployees(displayedEmployees);
    calculateSalary();
}


/* Clear form */

function clearForm() {

    nameInput.value = "";
    ageInput.value = "";
    emailInput.value = "";
    departmentInput.value = "IT";
    salaryInput.value = "";
}


/* Date and time */

function updateDateTime() {

    let now = new Date();

    document.getElementById("dateTime").innerHTML =
        "📅 " + now.toLocaleDateString() +
        " | 🕐 " + now.toLocaleTimeString();
}


/* Start application */

fetchEmployees();

updateDateTime();

setInterval(updateDateTime, 1000);