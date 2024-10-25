package com.example.demo;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.SqlOutParameter;
import org.springframework.jdbc.core.SqlParameter;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;

import java.sql.Types;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EmployeeAuditService {
    @PersistenceContext
    private EntityManager entityManager;

    private static final Logger logger = LoggerFactory.getLogger(EmployeeAuditService.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void init() {
        // Initialize SimpleJdbcCall for fetching employee audits
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("get_all_employee_audit")
                .returningResultSet("p_audit_cursor", BeanPropertyRowMapper.newInstance(EmployeeAuditDTO.class));
    }

    public List<EmployeeAuditDTO> getAllEmployeeAudits() {
        try{
            SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                    .withProcedureName("get_all_employee_audit")
                    .returningResultSet("p_audit_cursor", (rs, rowNum) -> {
                        EmployeeAuditDTO employeeAudit = new EmployeeAuditDTO();
                        employeeAudit.setId(rs.getInt("audit_id"));  // Ensure correct column name here
                        employeeAudit.setEmployeeId(rs.getInt("employee_id"));
                        employeeAudit.setSalary(rs.getInt("old_salary"));
                        employeeAudit.setRole(rs.getInt("old_role_id"));
                        employeeAudit.setDate(rs.getDate("change_date"));
                        employeeAudit.setType(rs.getString("change_type"));
                        return employeeAudit;
                    });

            Map<String, Object> result = simpleJdbcCall.execute();
            logger.info("Stored Procedure Result: " + result);

            @SuppressWarnings("unchecked")
            List<EmployeeAuditDTO> employeeAudits = (List<EmployeeAuditDTO>) result.get("p_audit_cursor");
            System.out.println("emp audits " + employeeAudits);//null
            return employeeAudits;
        }
        catch(Exception e){

            logger.error("Error adding audit: " + e.getMessage(), e);
            return new ArrayList<>();
        }

    }

    public void addEmployeeAudit(EmployeeAuditDTO employeeAuditDTO) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("add_employee_audit")
                .declareParameters(
                        new SqlParameter("p_employee_id", Types.INTEGER),
                        new SqlParameter("p_old_salary_id", Types.INTEGER),
                        new SqlParameter("p_old_role_id", Types.INTEGER),
                        new SqlParameter("p_old_change_date", Types.DATE),
                        new SqlOutParameter("p_old_change_type", Types.INTEGER)
                );

        // Set the parameters
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("p_employee_id", employeeAuditDTO.getEmployeeId());
        parameters.put("p_old_salary_id", employeeAuditDTO.getSalary());
        parameters.put("p_old_role_id", employeeAuditDTO.getRole());
        parameters.put("p_old_change_date", employeeAuditDTO.getDate());

        // Execute the stored procedure
        try {
            Map<String, Object> result = simpleJdbcCall.execute(parameters);
            Integer generatedId = (Integer) result.get("p_employee_audit_id"); // Assuming this is the correct key
            employeeAuditDTO.setId(generatedId != null ? generatedId.longValue() : null);
            logger.info("Generated ID: " + generatedId);
        } catch (Exception e) {
            logger.error("Error adding audit: " + e.getMessage(), e);
            throw new RuntimeException("Error adding audit: " + e.getMessage(), e);
        }
    }

    public void updateAudit(Long employeeAuditId, EmployeeAuditDTO employeeAuditDTO) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("update_employee_audit")
                .declareParameters(
                        new SqlParameter("P_EMPLOYEE_AUDIT_ID", Types.BIGINT),
                        new SqlParameter("P_EMPLOYEE_ID", Types.BIGINT),
                        new SqlParameter("P_OLD_SALARY_ID", Types.BIGINT),
                        new SqlParameter("P_OLD_ROLE_ID", Types.BIGINT),
                        new SqlParameter("P_OLD_CHANGE_DATE", Types.DATE),
                        new SqlParameter("P_OLD_CHANGE_TYPE", Types.VARCHAR)
                );

        // Set the parameters
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("P_EMPLOYEE_AUDIT_ID", employeeAuditId);
        parameters.put("P_EMPLOYEE_ID", employeeAuditDTO.getEmployeeId());
        parameters.put("P_OLD_SALARY_ID", employeeAuditDTO.getSalary());
        parameters.put("P_OLD_ROLE_ID", employeeAuditDTO.getRole());
        parameters.put("P_OLD_CHANGE_DATE", employeeAuditDTO.getDate());
        parameters.put("P_OLD_CHANGE_TYPE", employeeAuditDTO.getType());

        // Execute the stored procedure
        try {
            simpleJdbcCall.execute(parameters);
        } catch (Exception e) {
            logger.error("Error updating audit: " + e.getMessage(), e);
            throw new RuntimeException("Error updating audit: " + e.getMessage(), e);
        }
    }

    public void deleteAudit(Long employeeAuditId) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("delete_employee_audit")
                .declareParameters(new SqlParameter("P_EMPLOYEE_AUDIT_ID", Types.BIGINT));

        // Set the parameters
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("P_EMPLOYEE_AUDIT_ID", employeeAuditId);

        // Execute the stored procedure
        try {
            simpleJdbcCall.execute(parameters);
        } catch (Exception e) {
            logger.error("Error deleting employee audit: " + e.getMessage(), e);
            throw new RuntimeException("Error deleting employee audit: " + e.getMessage(), e);
        }
    }

    public void addAudit(@Valid EmployeeAuditDTO employeeAuditDTO) {
        // This method seems incomplete, consider implementing functionality or removing it
    }
}
