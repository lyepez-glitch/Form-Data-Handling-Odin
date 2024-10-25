DROP TABLE employees;

CREATE TABLE employees (
    employee_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    employee_name VARCHAR2(100) NOT NULL,
    department_id NUMBER,  -- foreign key to departments
    role_id NUMBER,        -- foreign key to roles
    hire_date DATE DEFAULT SYSDATE,
    salary NUMBER,
    created_at DATE DEFAULT SYSDATE,
    updated_at DATE,
    CONSTRAINT fk_department FOREIGN KEY (department_id) REFERENCES departments(department_id),
    CONSTRAINT fk_role FOREIGN KEY (role_id) REFERENCES roles(role_id)
);



INSERT INTO employees (employee_name, department_id, role_id, salary)
VALUES ('John Doe', 1, 1, 70000);

INSERT INTO employees (employee_name, department_id, role_id, salary)
VALUES ('Jane Smith', 2, 2, 60000);


SELECT * FROM employees;
CREATE OR REPLACE PROCEDURE hire_employee(
    p_employee_name IN VARCHAR2,
    p_department_id IN NUMBER,
    p_role_id IN NUMBER,
    p_salary IN NUMBER
)
AS
BEGIN
    INSERT INTO employees (employee_name, department_id, role_id, salary, hire_date)
    VALUES (p_employee_name, p_department_id, p_role_id, p_salary, SYSDATE);
END hire_employee;
/
CREATE OR REPLACE PROCEDURE promote_employee(
    p_employee_id IN NUMBER,
    p_new_role_id IN NUMBER,
    p_new_salary IN NUMBER DEFAULT NULL
)
AS
BEGIN
    UPDATE employees
    SET role_id = p_new_role_id,
        salary = NVL(p_new_salary, salary), -- Update salary only if provided
        updated_at = SYSDATE
    WHERE employee_id = p_employee_id;
END promote_employee;
/


CREATE OR REPLACE TRIGGER set_hire_date
BEFORE INSERT ON employees
FOR EACH ROW
BEGIN
    :NEW.hire_date := SYSDATE;
END set_hire_date;
/
CREATE OR REPLACE PROCEDURE get_all_employees (
    p_employee_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_employee_cursor FOR
    SELECT * FROM employees;
END get_all_employees;
/
SELECT e.employee_name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id;

SELECT e.employee_name, r.role_name
FROM employees e
JOIN roles r ON e.role_id = r.role_id;

CREATE OR REPLACE PROCEDURE update_employee(
    p_employee_id IN NUMBER,
    p_employee_name IN VARCHAR2,
    p_department_id IN NUMBER,
    p_role_id IN NUMBER,
    p_salary IN NUMBER
)
AS
BEGIN
    UPDATE employees
    SET employee_name = p_employee_name,
        department_id = p_department_id,
        role_id = p_role_id,
        salary = p_salary,
        updated_at = SYSDATE
    WHERE employee_id = p_employee_id;
    IF SQL%ROWCOUNT = 0 THEN
            RAISE_APPLICATION_ERROR(-20001, 'No employee found with the provided ID');
        END IF;
END update_employee;

/

CREATE OR REPLACE PROCEDURE delete_employee(
    p_employee_id IN NUMBER
)
AS
BEGIN
    DELETE FROM employees
    WHERE employee_id = p_employee_id;
    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'No employee found with ID: ' || p_employee_id);
    END IF;

END deleteEmployee;


