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
public class DepartmentDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Ensure this is added for auto-generation

    private Long departmentId;

//    @NotNull(message="Name cannot be null")
//    @Size(min=2,message = "Name must have at least 2 characters")
    private String departmentName;
    private int departmentManager;



//    @NotNull(message = "Role ID cannot be null")
//    private Long roleId;
//    @Min(value=0,message="Salary must be positive")
//    private Double salary;
    public DepartmentDTO(){

    }
    public DepartmentDTO(Long departmentId, String departmentName,  String departmentManager){
        this.departmentId = departmentId;
        this.departmentName = departmentName;
    }
    public Long getId(){
        return departmentId;
    }
    public void setId(Long id){
        this.departmentId=id;
    }
    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    @Override
    public String toString() {
        return "DepartmentDTO { " +
                "departmentId=" + departmentId +
                ", departmentName='" + departmentName + '\''
                +
                '}';
    }

    public void setDepartmentManager(int departmentManager) {
        this.departmentManager = departmentManager;
    }

    public Object getDepartmentManager() {
        return departmentManager;
    }
}