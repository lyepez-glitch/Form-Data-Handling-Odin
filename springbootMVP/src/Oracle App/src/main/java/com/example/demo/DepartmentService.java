package com.example.demo;

import javax.persistence.*;

import jakarta.annotation.PostConstruct;
import org.hibernate.dialect.OracleTypes;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;

import java.sql.Types;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DepartmentService {
    @PersistenceContext
    private EntityManager entityManager;
    private static final Logger logger = LoggerFactory.getLogger(DepartmentService.class);



    // Initialize SimpleJdbcCall
    @PostConstruct
    public void init() {
        // Convert the cursor to a List<EmployeeDTO>
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("get_all_departments")
                .returningResultSet("p_department_cursor", BeanPropertyRowMapper.newInstance(DepartmentDTO.class));
    }

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<DepartmentDTO> getAllDepartments() {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("get_all_departments")
                .returningResultSet("p_department_cursor", (rs, rowNum) -> {
                    DepartmentDTO department = new DepartmentDTO();
                    department.setId(rs.getLong("department_id"));  // Ensure correct column name here
                    department.setDepartmentName(rs.getString("department_name"));
                    department.setDepartmentManager(rs.getInt("department_manager"));
                    return department;
                });

        // Execute the stored procedure
        Map<String, Object> result = simpleJdbcCall.execute();

        // Debugging - print the result of the procedure call
        System.out.println("Stored Procedure Result: " + result);
        System.out.println("Result Set: " + result.get("p_department_cursor"));

        // Safely extract the list of DepartmentDTO from the result
        @SuppressWarnings("unchecked")
        List<DepartmentDTO> departments = (List<DepartmentDTO>) result.get("p_department_cursor");

        return departments;
    }


    public void addDepartment(DepartmentDTO departmentDTO) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("add_department")
                .declareParameters(
                        new SqlParameter("p_department_name", Types.VARCHAR),
                        new SqlParameter("p_department_manager", Types.INTEGER)
                );

        // Set the parameters
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("p_department_name", departmentDTO.getDepartmentName());
        parameters.put("p_department_manager", departmentDTO.getDepartmentManager());


        // Execute the stored procedure
        try {
            Map<String, Object> result = simpleJdbcCall.execute(parameters);
            Integer generatedId = (Integer) result.get("p_department_id"); // Cast to Integer
            System.out.println("Generated ID: " + generatedId);


            // Convert Integer to Long if necessary
            departmentDTO.setId(generatedId != null ? generatedId.longValue() : null);
            System.out.println("Department DTO after setting ID: " + departmentDTO);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error adding department: " + e.getMessage(), e);
        }
    }

    public void updateDepartment(Long departmentId, DepartmentDTO departmentDTO) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("update_department")
                .declareParameters(
                        new SqlParameter("P_DEPARTMENT_ID", Types.BIGINT),
                        new SqlParameter("P_DEPARTMENT_NAME", Types.VARCHAR),
                        new SqlParameter("P_DEPARTMENT_MANAGER", Types.SMALLINT)
                );

        // Set the parameters
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("P_Department_ID", departmentId);
        parameters.put("P_DEPARTMENT_NAME", departmentDTO.getDepartmentName());
        parameters.put("P_DEPARTMENT_Manager", departmentDTO.getDepartmentManager());

        // Execute the stored procedure
        try {
            simpleJdbcCall.execute(parameters);
        } catch (Exception e) {
            throw new RuntimeException("Error updating department: " + e.getMessage(), e);
        }
    }



    public void deleteDepartment(Long departmentId) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("delete_department")
                .declareParameters(
                        new SqlParameter("P_DEPARTMENT_ID", Types.BIGINT)
                );

        // Set the parameters
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("P_DEPARTMENT_ID", departmentId);

        // Execute the stored procedure
        try {
            simpleJdbcCall.execute(parameters);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting department: " + e.getMessage(), e);
        }
    }
}
