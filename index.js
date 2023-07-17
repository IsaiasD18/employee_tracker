const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'employee_tracker'
});

function startPrompt() {
    inquirer.prompt([
    {
    type: "list",
    message: "What would you like to do?",
    name: "choice",
    choices: [
              'View all departments', 
              'View all roles',
              'View all employees', 
              'Add a department',
              'Add a role',
              'Add an employee',
              'Update an employee role'
            ]
    }
]).then(function(answers) {
        switch (answers.choice) {
            case 'View all departments':
             
            break;
    
          case 'View all roles':
          
            break;
          case 'View all employees':
             
            break;
          
          case 'Add a department':
              
              break;

          case 'Add a role':
           
              break;
      
            case 'Add an employee':
                
              break;
      
            case 'Update an employee role':
             
              break;
    
            }
    })
}



startPrompt();