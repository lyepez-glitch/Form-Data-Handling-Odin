CREATE TABLE employee_audit(
    audit_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    employee_id NUMBER,
    old_salary NUMBER,
    old_role_id NUMBER,
    change_date DATE,
    change_type VARCHAR2(50)
)

CREATE OR REPLACE TRIGGER audit_employee_changes
AFTER UPDATE ON employees
FOR EACH ROW
BEGIN
    INSERT INTO employee_audit (employee_id, old_salary, old_role_id, change_date, change_type)
    VALUES (:OLD.employee_id, :OLD.salary, :OLD.role_id, SYSDATE, 'Update');
END audit_employee_changes;
/