package com.example.demo;

import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;


@Entity
public class EmployeeDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Ensure this is added for auto-generation

    private Long employeeId;

    @NotNull(message="Name cannot be null")
    @Size(min=2,message = "Name must have at least 2 characters")
    private String employeeName;

    @NotNull(message = "Department ID cannot be null")
    private Long departmentId;

    @NotNull(message = "Role ID cannot be null")
    private Long roleId;
    @Min(value=0,message="Salary must be positive")
    private Double salary;
    public EmployeeDTO(){

    }
    public EmployeeDTO(Long employeeId, String employeeName, Long departmentId, Long roleId, Double salary){
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.departmentId = departmentId;
        this.roleId = roleId;
        this.salary = salary;
    }
    public Long getId(){
        return employeeId;
    }
    public void setId(Long id){
        this.employeeId=id;
    }
    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public Long getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Long departmentId) {
        this.departmentId = departmentId;
    }

    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }
    @Override
    public String toString() {
        return "EmployeeDTO { " +
                "employeeId=" + employeeId +
                ", employeeName='" + employeeName + '\'' +
                ", departmentId=" + departmentId +
                ", roleId=" + roleId +
                ", salary=" + salary +
                '}';
    }
}