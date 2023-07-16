USE employee_tracker;

INSERT INTO department (name) VALUES 
    ('Sales');

INSERT INTO role (title, salary) VALUES 
    ('Sales Lead', 100000);

INSERT INTO employee (
    first_name, 
    last_name, 
    role_id, 
    manager_id
    ) VALUES 
    ('Megan', 'Manthis', 1, NULL),
    ('James', 'Castro', 1, 1),
    ('Emily', 'Johnson', 1, 1),
    ('Michael', 'Williams', 1, 2),
    ('Sophia', 'Brown', 1, NULL),
    ('Emma', 'Jones', 1, 2);