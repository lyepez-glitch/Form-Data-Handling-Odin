package com.example.demo;

public class RoleDTO {

    // Fields for RoleDTO
    private long roleId;
    private String roleName;
    private double salary;

    // Getter and setter for roleId
    public long getId() {
        return roleId;
    }

    public void setId(long roleId) {
        this.roleId = roleId;
    }

    // Getter and setter for roleName
    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    // Getter and setter for salary
    public double getSalary() {
        return salary;
    }

    public void setSalary(double salary) {
        this.salary = salary;
    }
    @Override
    public String toString() {
        return "RoleDTO{" +
                "roleId=" + roleId +
                ", roleName='" + roleName + '\'' +
                ", salary=" + salary +
                '}';
    }

}

