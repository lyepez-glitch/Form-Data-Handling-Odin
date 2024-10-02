CREATE TABLE roles (
    role_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role_name VARCHAR2(100) NOT NULL,
    salary NUMBER,
    created_at DATE DEFAULT SYSDATE
);

INSERT INTO roles (role_name, salary) VALUES ('Software Engineer', 70000);
INSERT INTO roles (role_name, salary) VALUES ('HR Manager', 60000);
INSERT INTO roles (role_name, salary) VALUES ('Sales Executive', 50000);
