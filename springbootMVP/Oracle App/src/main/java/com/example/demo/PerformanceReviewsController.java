//review_id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
//employee_id NUMBER NOT NULL,
//review_comments VARCHAR2(500),
//review_score NUMBER CHECK (review_score BETWEEN 1 AND 5),
//review_date DATE DEFAULT SYSDATE,
//CONSTRAINT fk_employee FOREIGN KEY (employee_id) REFERENCES employees(employee_i

package com.example.demo;

import com.example.demo.PerformanceReviewsService;
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
//@RequestMapping("/reviews")
@CrossOrigin(origins = "http://127.0.0.1:5173") // Allow requests from your frontend
public class PerformanceReviewsController{


    @Autowired
    private PerformanceReviewsService performanceReviewsService;
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

    @GetMapping("/reviews")
    public ResponseEntity<?> getEmployees(){
        try{
            return ResponseEntity.ok(performanceReviewsService.getAllReviews());
        }catch(Exception e){
            return ResponseEntity.status(500).body("Error fetching reviews: " + e.getMessage());
        }

    }


    @PostMapping("/reviews/add")
    public ResponseEntity<String> addReview(@Valid @RequestBody PerformanceReviewDTO reviewDTO){
        try{
            performanceReviewsService.addReview(reviewDTO);
            return ResponseEntity.ok("Review added successfully");
        }catch(Exception e){
            System.out.println("Error adding review:" + e.getMessage());
            return ResponseEntity.status(500).body("Error adding review: " + e.getMessage());
        }

    }
    @PutMapping("/reviews/update/{id}")
    public ResponseEntity<String> updateReview(@PathVariable("id") Long reviewId,
                                                 @RequestBody PerformanceReviewDTO reviewDTO){
        performanceReviewsService.updateReview(reviewId,reviewDTO);
        return ResponseEntity.ok("Review updated successfully");
    }

    @DeleteMapping("/reviews/delete/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable("id") Long reviewId){
        performanceReviewsService.deleteReview(reviewId);
        return ResponseEntity.ok("Review deleted successfully");
    }
}