const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employee_tracker'
});

//Create a function containing a question with different choises for the user to select
function startPrompt() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'choice',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Delete role',
                'Delete department',
                'Delete Employee',
                'Exit'
            ]
        }
    ]).then((answers) => {
        //Create a switch stament with all the choises above, each of the cases will have a function
        switch (answers.choice) {
            case 'View all departments':
                viewAllDepartments();
                break;

            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;

            case 'Add a department':
                addDepartment();
                break;

            case 'Add a role':
                addRole();
                break;

            case 'Add an employee':
                addEmployee();
                break;

            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Delete role':
                deleteRole();
                break;
            case 'Delete Department':
                deleteDepartment();
                break;
            case 'Delete Employee':
                deleteEmployee();
                break;
            case 'Exit':
                connection.end();
                break;
        };
    });
};

//Create a function that will allow the user to view all the departments inside the department table.
function viewAllDepartments() {
    connection.query('SELECT * FROM department', (err, data) => {
        if (err) throw err;
        console.table(data);
        startPrompt();
    });
};

//Create a function that will allow the user to view all the roles inside the role table.
function viewAllRoles() {
    connection.query('SELECT * FROM role', (err, data) => {
        if (err) throw err;
        console.table(data);
        startPrompt();
    });
};

//Create a function that will allow the user to view all the employees inside the employee table.
function viewAllEmployees() {
    connection.query('SELECT * FROM employee', (err, data) => {
        if (err) throw err;
        console.table(data);
        startPrompt();
    });
};

//Create a function that will allow the user to create departments, and prompt the user with the requirement field for the department.
function addDepartment() {
    inquirer.prompt([
        {
            name: 'name',
            message: 'What Department would you like to add?'
        }
    ]).then((answer) => {
        connection.query('INSERT INTO department SET ? ',
            {
                name: answer.name

            },
            (err) => {
                if (err) throw err;
                console.table(answer);
                startPrompt();
            }
        )
    });
};

//Create a function that will allow the user to create roles, and prompt the user with the requirements for the role.
function addRole() {
    connection.query('SELECT role.title AS Title, role.salary AS Salary FROM role', (err, data) => {
        inquirer.prompt([
            {
                name: 'Title',
                message: 'What is the roles Title?'
            },
            {
                name: 'Salary',
                message: 'What is the Salary?'
            }
        ]).then((answer) => {
            connection.query(
                'INSERT INTO role SET ?',
                {
                    title: answer.Title,
                    salary: answer.Salary,
                },
                (err) => {
                    if (err) throw err;
                    console.table(answer);
                    startPrompt();
                }
            );

        });
    });
};

//Create a function that will allow the user to add employees, and prompt the user with the requirements to add a new employee.
function addEmployee() {
    inquirer.prompt([
        {
            name: 'firstName',
            message: 'Enter their first name '
        },
        {
            name: 'lastName',
            message: 'Enter their last name '
        },
        {
            name: 'role',
            type: 'list',
            message: 'Employee role?',
            choices: role()
        },
        {
            name: 'choice',
            type: 'rawlist',
            message: 'Managers name?',
            choices: manager()
        }
    ]).then((answer) => {
        var roleId = role().indexOf(answer.role) + 1;
        var managerId = manager().indexOf(answer.choice) + 1;

        connection.query('INSERT INTO employee SET ?',
            {
                first_name: answer.firstName,
                last_name: answer.lastName,
                manager_id: managerId,
                role_id: roleId

            }, (err) => {
                if (err) throw err;
                console.table(answer);
                startPrompt();
            });

    });
};

//Cretate a function that will select the all from the role table
var roleArray = [];
function role() {
    connection.query('SELECT * FROM role', (err, data) => {
        if (err) throw err;
        for (var i = 0; i < data.length; i++) {
            roleArray.push(data[i].title);
        };

    });
    return roleArray;
};

//Create a function that will select the manager from the employee table
var managerArray = [];
function manager() {
    connection.query('SELECT first_name, last_name FROM employee WHERE manager_id IS NULL', (err, data) => {
        if (err) throw err;
        for (var i = 0; i < data.length; i++) {
            managerArray.push(data[i].first_name);
        };

    });
    return managerArray;
};

//push the first name of all the employees from the employee table to an empty array
employeesArray = [];
const select = 'SELECT first_name FROM employee';
 connection.query(select, (err, res) => {
     if (err) throw err;
     res.forEach(({first_name}) => {
         employeesArray.push(first_name);
     });
 });

//push the title column from the role table to an empty array
 rolesArray = [];
 const select1 = `SELECT title FROM role`
 connection.query(select1, (err, res) => {
   if (err) throw err;
   res.forEach(({title}) => {
     rolesArray.push(title);
});
});


//This function will update the role on an existing employee
const updateEmployeeRole = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Which employee would you like to update?',
            choices: employeesArray,
            name: 'employee'
        },
        {
            type: 'list',
            message: 'What would you like for the new role',
            choices: roleArray,
            name: 'role'
        }
    ]).then((answers) => {
        connection.query(
            `UPDATE employee SET role_id = (SELECT id FROM role WHERE title = ?) WHERE first_name = ?`,
            [answers.role, answers.employee],
            (err) => {
                if (err) throw err;
                console.log('Updated Employee Role');
                console.table(answers);
                startPrompt();
            }
        );
    });
};



//Start to prompt the questions
startPrompt();