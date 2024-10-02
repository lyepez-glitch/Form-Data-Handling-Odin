package com.example.demo;

import java.sql.Date;

public class EmployeeAuditDTO {

    // Fields for EmployeeAuditDTO
    private long employeeAuditId;
    private int employeeId;
    private int oldSalaryId;
    private int oldRoleId;
    private Date oldChangeDate;
    private String oldChangeType;

    // Getter and setter for employeeAuditId
    public long getId() {
        return employeeAuditId;
    }

    public void setId(long employeeAuditId) {
        this.employeeAuditId = employeeAuditId;
    }

    // Getter and setter for employeeId
    public int getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(int employeeId) {
        this.employeeId = employeeId;
    }

    // Getter and setter for oldSalaryId
    public int getSalary() {
        return oldSalaryId;
    }

    public void setSalary(int oldSalaryId) {
        this.oldSalaryId = oldSalaryId;
    }

    // Getter and setter for oldRoleId
    public int getRoleId() {
        return oldRoleId;
    }

    public void setRole(int oldRoleId) {
        this.oldRoleId = oldRoleId;
    }

    // Getter and setter for oldChangeDate
    public Date getDate() {
        return oldChangeDate;
    }

    public void setDate(Date oldChangeDate) {
        this.oldChangeDate = oldChangeDate;
    }

    // Getter and setter for oldChangeType
    public String getType() {
        return oldChangeType;
    }

    public void setType(String oldChangeType) {
        this.oldChangeType = oldChangeType;
    }

    public int getRole() {
        return oldRoleId;
    }
}
