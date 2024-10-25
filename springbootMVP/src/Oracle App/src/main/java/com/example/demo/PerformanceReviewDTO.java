package com.example.demo;

import java.util.Date;
import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

//review_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
//employee_id NUMBER NOT NULL,
//review_comments VARCHAR2(500),
//review_score NUMBER CHECK (review_score BETWEEN 1 AND 5),
//review_date DATE DEFAULT SYSDATE,
//CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES employees(employee_i
@Entity
public class PerformanceReviewDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Ensure this is added for auto-generation

    private Long reviewId;



    private Long employeeId;

    private String reviewComments;
    private double reviewScore;
    private String reviewDate;


    public PerformanceReviewDTO(){

    }
    public PerformanceReviewDTO(Long reviewId,Long employeeId, String reviewComments, double reviewScore){
        this.reviewId =reviewId;
        this.employeeId = employeeId;
        this.reviewComments = reviewComments;
        this.reviewScore = reviewScore;

    }
    public Long getId(){
        return reviewId;
    }
    public Long getEmployeeId(){
        return employeeId;
    }
    public void setId(Long id){
        this.reviewId=id;
    }
    public String getReviewComments() {
        return reviewComments;
    }
    public Double getReviewScore() {
        return reviewScore;
    }
    public String getReviewDate(){return reviewDate;}
    public void setReviewScore(double reviewScore) {
        this.reviewScore = reviewScore;
    }
    public void setReviewComments(String comment){
        this.reviewComments = comment;
    }

    public void setReviewDate(String date){
        this.reviewDate = date;
    }


    @Override
    public String toString() {
        return "ReviewDTO { " +
                "reviewId=" + reviewId +
                ", reviewScore='" + reviewScore  +
                ", employeeid=" + employeeId +
                ", ReviewComments =" + reviewComments+
                '}';
    }

    public void setEmployeeId(long employeeId) {
        this.employeeId=employeeId;
    }

}