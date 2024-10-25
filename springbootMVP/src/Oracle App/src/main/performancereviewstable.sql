CREATE TABLE performance_reviews (
    review_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    employee_id NUMBER NOT NULL,
    review_comments VARCHAR2(500),
    review_score NUMBER CHECK (review_score BETWEEN 1 AND 5),
    review_date DATE DEFAULT SYSDATE,
    CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);



CREATE OR REPLACE PROCEDURE add_performance_review(
    p_employee_id IN NUMBER,
    p_review_comments IN VARCHAR2,
    p_review_score IN NUMBER
)
AS
BEGIN
    INSERT INTO performance_reviews (employee_id, review_comments, review_score, review_date)
    VALUES (p_employee_id, p_review_comments, p_review_score, SYSDATE);
END add_performance_review;
/
