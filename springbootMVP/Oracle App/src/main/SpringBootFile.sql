
DROP TABLE performance_reviews CASCADE CONSTRAINTS;
-- First, drop the employees table
DROP TABLE employees CASCADE CONSTRAINTS;

-- Next, drop the roles table
DROP TABLE roles CASCADE CONSTRAINTS;

-- Finally, drop the departments table
DROP TABLE departments CASCADE CONSTRAINTS;

DROP TABLE employee_audit;


CREATE TABLE departments(
    department_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    department_name VARCHAR2(100) NOT NULL,
    department_manager NUMBER,
    created_at DATE DEFAULT SYSDATE

);


INSERT INTO departments (department_name) VALUES ('Engineering');
INSERT INTO departments (department_name) VALUES ('Human Resources');
INSERT INTO departments (department_name) VALUES ('Sales');
CREATE TABLE roles (
    role_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role_name VARCHAR2(100) NOT NULL,
    salary NUMBER,
    created_at DATE DEFAULT SYSDATE
);

INSERT INTO roles (role_name, salary) VALUES ('Software Engineer', 70000);
INSERT INTO roles (role_name, salary) VALUES ('HR Manager', 60000);
INSERT INTO roles (role_name, salary) VALUES ('Sales Executive', 50000);


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
CREATE TABLE performance_reviews (
    review_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    employee_id NUMBER NOT NULL,
    review_comments VARCHAR2(500),
    review_score NUMBER CHECK (review_score BETWEEN 1 AND 5),
    review_date DATE DEFAULT SYSDATE,
    CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);
CREATE TABLE employee_audit(
    audit_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    employee_id NUMBER,
    old_salary NUMBER,
    old_role_id NUMBER,
    change_date DATE DEFAULT SYSDATE,
    change_type VARCHAR2(50)
)
/
CREATE OR REPLACE PROCEDURE add_employee_audit(
     p_employee_id IN NUMBER,
     p_old_salary IN NUMBER,
     p_old_role_id IN NUMBER,
     p_change_type IN VARCHAR2
 )
 AS
 BEGIN
     INSERT INTO employee_audit (employee_id, old_salary, old_role_id, change_date, change_type)
     VALUES (p_employee_id, p_old_salary, p_old_role_id, SYSDATE, p_change_type);
 END add_employee_audit;
 /
 CREATE OR REPLACE PROCEDURE get_all_employee_audit(
     p_audit_cursor OUT SYS_REFCURSOR
 )
 AS
 BEGIN
     OPEN p_audit_cursor FOR
     SELECT audit_id, employee_id, old_salary, old_role_id, change_date, change_type
     FROM employee_audit;
 END get_all_employee_audit;
 /
CREATE OR REPLACE PROCEDURE update_employee_audit(
    p_audit_id IN NUMBER,
    p_employee_id IN NUMBER,
    p_old_salary IN NUMBER,
    p_old_role_id IN NUMBER,
    p_change_type IN VARCHAR2
)
AS
BEGIN
    UPDATE employee_audit
    SET employee_id = p_employee_id,
        old_salary = p_old_salary,
        old_role_id = p_old_role_id,
        change_type = p_change_type,
        change_date = SYSDATE
    WHERE audit_id = p_audit_id;

    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'No audit found with the provided ID');
    END IF;
END update_employee_audit;
/
CREATE OR REPLACE PROCEDURE delete_employee_audit(
    p_audit_id IN NUMBER
)
AS
BEGIN
    DELETE FROM employee_audit
    WHERE audit_id = p_audit_id;

    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'No audit record found with ID: ' || p_audit_id);
    END IF;
END delete_employee_audit;
/


/
CREATE OR REPLACE PROCEDURE hire_employee(
    p_employee_name IN VARCHAR2,
    p_department_id IN NUMBER,
    p_role_id IN NUMBER,
    p_salary IN NUMBER,
    p_employee_id OUT NUMBER
)
AS
BEGIN
    INSERT INTO employees (employee_name, department_id, role_id, salary, hire_date)
    VALUES (p_employee_name, p_department_id, p_role_id, p_salary, SYSDATE)
    RETURNING employee_id INTO p_employee_id;
END hire_employee;
/
CREATE OR REPLACE TRIGGER employee_audit_trigger
BEFORE UPDATE OF salary, role_id ON employees
FOR EACH ROW
DECLARE
    v_change_type VARCHAR2(50);
BEGIN
    -- Determine the type of change
    IF :OLD.salary != :NEW.salary AND :OLD.role_id != :NEW.role_id THEN
        v_change_type := 'Salary and Role Changed';
    ELSIF :OLD.salary != :NEW.salary THEN
        v_change_type := 'Salary Changed';
    ELSIF :OLD.role_id != :NEW.role_id THEN
        v_change_type := 'Role Changed';
    END IF;

    -- Insert into audit table
    INSERT INTO employee_audit (employee_id, old_salary, old_role_id, change_date, change_type)
    VALUES (:OLD.employee_id, :OLD.salary, :OLD.role_id, SYSDATE, v_change_type);
END;
/
CREATE OR REPLACE PROCEDURE add_department(
    p_department_name IN VARCHAR2,
    p_department_manager IN VARCHAR2,
    p_department_id OUT NUMBER
)
AS
BEGIN
    INSERT INTO departments (department_name, department_manager)
    VALUES (p_department_name, p_department_manager)
    RETURNING department_id INTO p_department_id;
END ;
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
    SELECT employee_id, employee_name, department_id, role_id, salary FROM employees;
END get_all_employees;
/

CREATE OR REPLACE PROCEDURE get_all_departments (
    p_department_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_department_cursor FOR
    SELECT department_id, department_name, department_manager, created_at FROM departments;
END get_all_departments;
/

CREATE OR REPLACE PROCEDURE get_all_reviews(
    p_review_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_review_cursor FOR
    SELECT review_id, employee_id, review_score, review_comments,review_date FROM performance_reviews;
END get_all_reviews;
/

CREATE OR REPLACE PROCEDURE update_review(
    p_review_id IN NUMBER,
    p_employee_id IN NUMBER,
    p_review_score IN NUMBER,
    p_review_comments IN VARCHAR2
)
AS
BEGIN
    UPDATE performance_reviews
    SET review_score = p_review_score,
        review_comments = p_review_comments
    WHERE review_id = p_review_id;
    IF SQL%ROWCOUNT = 0 THEN
            RAISE_APPLICATION_ERROR(-20001, 'No review found with the provided ID');
        END IF;
END update_review;

/

SELECT e.employee_name, d.department_name
FROM employees e
JOIN departments d ON e.department_id = d.department_id;

SELECT e.employee_name, r.role_name
FROM employees e
JOIN roles r ON e.role_id = r.role_id;

CREATE OR REPLACE PROCEDURE update_department(
    p_department_id IN NUMBER,
    p_department_name IN VARCHAR2,
    p_department_manager IN NUMBER

)
AS
BEGIN
    UPDATE departments
    SET department_name = p_department_name,
        department_manager = p_department_manager
    WHERE department_id = p_department_id;
    IF SQL%ROWCOUNT = 0 THEN
            RAISE_APPLICATION_ERROR(-20001, 'No department found with the provided ID');
        END IF;
END update_department;

/

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
CREATE OR REPLACE PROCEDURE delete_department(
    p_department_id IN NUMBER
)
AS
BEGIN
    DELETE FROM departments
    WHERE department_id = p_department_id;
    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'No department found with ID: ' || p_department_id);
    END IF;

END delete_department;

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

 END delete_employee;

 /

CREATE OR REPLACE PROCEDURE delete_review(
    p_review_id IN NUMBER
)
AS
BEGIN
    DELETE FROM performance_reviews
    WHERE review_id = p_review_id;
    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'No review found with ID: ' || p_review_id);
    END IF;

END delete_review;

/
CREATE OR REPLACE PROCEDURE add_performance_review(
    p_employee_id IN NUMBER,
    p_review_comments IN VARCHAR2,
    p_review_score IN NUMBER,
    p_review_id OUT NUMBER
)
AS
BEGIN
    INSERT INTO performance_reviews (employee_id, review_comments, review_score, review_date)
    VALUES (p_employee_id, p_review_comments, p_review_score, SYSDATE)
    RETURNING review_id INTO p_review_id;
END add_performance_review;
/

CREATE OR REPLACE TRIGGER audit_employee_changes
AFTER UPDATE ON employees
FOR EACH ROW
BEGIN
    INSERT INTO employee_audit (employee_id, old_salary, old_role_id, change_date, change_type)
    VALUES (:OLD.employee_id, :OLD.salary, :OLD.role_id, SYSDATE, 'Update');
END audit_employee_changes;
/

CREATE OR REPLACE PROCEDURE add_role(
    p_role_name IN VARCHAR2,
    p_role_id OUT NUMBER,
    p_salary IN NUMBER
)
AS
BEGIN
    INSERT INTO roles (role_name, salary)
    VALUES (p_role_name, p_salary)
    RETURNING role_id INTO p_role_id;
END add_role;
/
commit;

CREATE OR REPLACE PROCEDURE get_all_roles (
    p_role_cursor OUT SYS_REFCURSOR
)
AS
BEGIN
    OPEN p_role_cursor FOR
    SELECT role_id, role_name, role_id, salary FROM roles;
END get_all_roles;
/
CREATE OR REPLACE PROCEDURE update_role(
    p_role_id IN NUMBER,
    p_role_name IN VARCHAR2,
    p_salary IN NUMBER
)
AS
BEGIN
    UPDATE roles
    SET role_name = p_role_name,
        salary = p_salary
    WHERE role_id = p_role_id;
    IF SQL%ROWCOUNT = 0 THEN
            RAISE_APPLICATION_ERROR(-20001, 'No role found with the provided ID');
        END IF;
END update_role;

/
CREATE OR REPLACE PROCEDURE delete_role(
    p_role_id IN NUMBER
)
AS
BEGIN
    DELETE FROM roles
    WHERE role_id = p_role_id;
    IF SQL%ROWCOUNT = 0 THEN
        RAISE_APPLICATION_ERROR(-20001, 'No role found with ID: ' || p_role_id);
    END IF;

END delete_role;

/

commit;