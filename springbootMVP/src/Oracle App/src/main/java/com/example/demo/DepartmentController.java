package com.example.demo;

import com.example.demo.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.List;

@RestController
//@RequestMapping("/departments")
@CrossOrigin(origins = "http://127.0.0.1:5173") // Allow requests from your frontend
public class DepartmentController{


    @Autowired
    private DepartmentService departmentService;
//    @GetMapping("/test")
//    public String testService() {
//        return employeeService != null ? "EmployeeService is injected!" : "EmployeeService is NOT injected.";
//    }
//
//    @Secured("ROLE_EMPLOYEE")
//    @GetMapping("/profile")
//    public String getEmployeeProfile() {
//        return "Employee Profile Data";
//    }
//
//    // Accessible by admins only
//    @Secured("ROLE_ADMIN")
//    @GetMapping("/manage")
//    public String manageEmployees() {
//        return "Manage Employees Section";
//    }

    @GetMapping("/departments")
    public ResponseEntity<?> getDepartments(){
        try{
            return ResponseEntity.ok(departmentService.getAllDepartments());
        }catch(Exception e){
            return ResponseEntity.status(500).body("Error fetching departments: " + e.getMessage());
        }

    }


    @PostMapping("/departments/add")
    public ResponseEntity<String> addDepartment(@Valid @RequestBody DepartmentDTO departmentDTO){
        try{
            departmentService.addDepartment(departmentDTO);
            return ResponseEntity.ok("Department added successfully");
        }catch(Exception e){
            System.out.println("Error adding department:" + e.getMessage());
            return ResponseEntity.status(500).body("Error adding department: " + e.getMessage());
        }

    }
    @PutMapping("/departments/update/{id}")
    public ResponseEntity<String> updateDepartment(@PathVariable("id") Long departmentId,
                                                 @RequestBody DepartmentDTO departmentDTO){
        departmentService.updateDepartment(departmentId,departmentDTO);
        return ResponseEntity.ok("Department updated successfully");
    }

    @DeleteMapping("/departments/delete/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable("id") Long departmentId){
        departmentService.deleteDepartment(departmentId);
        return ResponseEntity.ok("Department deleted successfully");
    }
}