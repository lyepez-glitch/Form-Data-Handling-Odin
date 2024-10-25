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
public class EmployeeService {
    @PersistenceContext
    private EntityManager entityManager;
    private static final Logger logger = LoggerFactory.getLogger(EmployeeService.class);


    // Initialize SimpleJdbcCall
    @PostConstruct
    public void init() {
        // Convert the cursor to a List<EmployeeDTO>
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("get_all_employees")
                .returningResultSet("p_employee_cursor", BeanPropertyRowMapper.newInstance(EmployeeDTO.class));
    }

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<EmployeeDTO> getAllEmployees() {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("get_all_employees")
                .returningResultSet("p_employee_cursor", (rs, rowNum) -> {
                    EmployeeDTO employee = new EmployeeDTO();
                    employee.setId(rs.getLong("employee_id"));  // Ensure correct column name here
                    employee.setEmployeeName(rs.getString("employee_name"));
                    employee.setDepartmentId(rs.getLong("department_id"));
                    employee.setRoleId(rs.getLong("role_id"));
                    employee.setSalary(rs.getDouble("salary"));
                    return employee;
                });
        Map<String, Object> result = simpleJdbcCall.execute();
        System.out.println("Stored Procedure Result: " + result);
        // Safely extract the list of EmployeeDTO
        System.out.println("Result Set: " + result.get("p_employee_cursor"));
        @SuppressWarnings("unchecked") // Suppress warning if you're sure about the type
        List<EmployeeDTO> employees = (List<EmployeeDTO>) result.get("p_employee_cursor");

        return employees;
    }

    public void hireEmployee(EmployeeDTO employeeDTO) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("hire_employee")
                .declareParameters(
                        new SqlParameter("p_employee_name", Types.VARCHAR),
                        new SqlParameter("p_department_id", Types.INTEGER),
                        new SqlParameter("p_role_id", Types.INTEGER),
                        new SqlParameter("p_salary", Types.DOUBLE),
                        new SqlOutParameter("p_employee_id", Types.INTEGER)  // Use Types.INTEGER
                );

        // Set the parameters
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("p_employee_name", employeeDTO.getEmployeeName());
        parameters.put("p_department_id", employeeDTO.getDepartmentId());
        parameters.put("p_role_id", employeeDTO.getRoleId());
        parameters.put("p_salary", employeeDTO.getSalary());

        // Execute the stored procedure
        try {
            Map<String, Object> result = simpleJdbcCall.execute(parameters);
            Integer generatedId = (Integer) result.get("p_employee_id"); // Cast to Integer
            System.out.println("Generated ID: " + generatedId);


            // Convert Integer to Long if necessary
            employeeDTO.setId(generatedId != null ? generatedId.longValue() : null);
            System.out.println("Employee DTO after setting ID: " + employeeDTO);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error adding employee: " + e.getMessage(), e);
        }
    }

    public void updateEmployee(Long employeeId, EmployeeDTO employeeDTO) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("update_employee")
                .declareParameters(
                        new SqlParameter("P_EMPLOYEE_ID", Types.BIGINT),
                        new SqlParameter("P_EMPLOYEE_NAME", Types.VARCHAR),
                        new SqlParameter("P_DEPARTMENT_ID", Types.BIGINT),
                        new SqlParameter("P_ROLE_ID", Types.BIGINT),
                        new SqlParameter("P_SALARY", Types.DOUBLE)
                );

        // Set the parameters
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("P_EMPLOYEE_ID", employeeId);
        parameters.put("P_EMPLOYEE_NAME", employeeDTO.getEmployeeName());
        parameters.put("P_DEPARTMENT_ID", employeeDTO.getDepartmentId());
        parameters.put("P_ROLE_ID", employeeDTO.getRoleId());
        parameters.put("P_SALARY", employeeDTO.getSalary());

        // Execute the stored procedure
        try {
            simpleJdbcCall.execute(parameters);
        } catch (Exception e) {
            throw new RuntimeException("Error updating employee: " + e.getMessage(), e);
        }
    }


    public void promoteEmployee(Long employeeId, Long newRoleId, Double newSalary) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("promote_employee")
                .declareParameters(
                        new SqlParameter("P_EMPLOYEE_ID", Types.BIGINT),
                        new SqlParameter("P_NEW_ROLE_ID", Types.BIGINT),
                        new SqlParameter("P_NEW_SALARY", Types.DOUBLE)
                );

        // Set the parameters
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("P_EMPLOYEE_ID", employeeId);
        parameters.put("P_NEW_ROLE_ID", newRoleId);
        parameters.put("P_NEW_SALARY", newSalary);

        // Execute the stored procedure
        try {
            simpleJdbcCall.execute(parameters);
        } catch (Exception e) {
            throw new RuntimeException("Error promoting employee: " + e.getMessage(), e);
        }
    }

    public void deleteEmployee(Long employeeId) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("delete_employee")
                .declareParameters(
                        new SqlParameter("P_EMPLOYEE_ID", Types.BIGINT)
                );

        // Set the parameters
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("P_EMPLOYEE_ID", employeeId);

        // Execute the stored procedure
        try {
            simpleJdbcCall.execute(parameters);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting employee: " + e.getMessage(), e);
        }
    }
}
