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
public class RoleService {
    @PersistenceContext
    private EntityManager entityManager;
    private static final Logger logger = LoggerFactory.getLogger(RoleService.class);


    // Initialize SimpleJdbcCall
    @PostConstruct
    public void init() {
        // Convert the cursor to a List<EmployeeDTO>
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("get_all_roles")
                .returningResultSet("p_role_cursor", BeanPropertyRowMapper.newInstance(RoleDTO.class));
    }

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<RoleDTO> getAllRoles() {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("get_all_roles")
                .returningResultSet("p_role_cursor", (rs, rowNum) -> {
                    RoleDTO role = new RoleDTO();
                    role.setId(rs.getLong("role_id"));  // Ensure correct column name here
                    System.out.println("role id " + role.getId());
                    role.setRoleName(rs.getString("role_name"));
                    role.setSalary(rs.getDouble("salary"));
                    return role;
                });
        Map<String, Object> result = simpleJdbcCall.execute();
        System.out.println("Stored Procedure Result: " + result);
        // Safely extract the list of RoleDTO
        System.out.println("Result Set: " + result.get("p_role_cursor"));
        @SuppressWarnings("unchecked") // Suppress warning if you're sure about the type
        List<RoleDTO> roles = (List<RoleDTO>) result.get("p_role_cursor");

        return roles;
    }

    public void addRole(RoleDTO roleDTO) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("add_role")
                .declareParameters(
                        new SqlParameter("p_role_name", Types.VARCHAR),
                        new SqlParameter("p_salary", Types.DOUBLE),
                        new SqlOutParameter("p_role_id", Types.INTEGER)  // Use Types.INTEGER
                );

        // Set the parameters
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("p_role_name",roleDTO.getRoleName());
        parameters.put("p_salary", roleDTO.getSalary());

        // Execute the stored procedure
        try {
            Map<String, Object> result = simpleJdbcCall.execute(parameters);
            Integer generatedId = (Integer) result.get("p_role_id"); // Cast to Integer
            System.out.println("Generated ID: " + generatedId);


            // Convert Integer to Long if necessary
            roleDTO.setId(generatedId != null ? generatedId.longValue() : null);
            System.out.println("Role DTO after setting ID: " + roleDTO);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error adding role: " + e.getMessage(), e);
        }
    }

    public void updateRole(Long roleId, RoleDTO roleDTO) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("update_role")
                .declareParameters(
                        new SqlParameter("P_ROLE_ID", Types.BIGINT),
                        new SqlParameter("P_ROLE_NAME", Types.VARCHAR),
                        new SqlParameter("P_SALARY", Types.DOUBLE)
                );

        // Set the parameters
        Map<String, Object> parameters = new HashMap<>();
        System.out.println("role name updated " + roleDTO);
        parameters.put("P_ROLE_ID", roleId);
        parameters.put("P_ROLE_NAME", roleDTO.getRoleName());
        parameters.put("P_SALARY", roleDTO.getSalary());

        // Execute the stored procedure
        try {
            simpleJdbcCall.execute(parameters);
        } catch (Exception e) {
            throw new RuntimeException("Error updating role: " + e.getMessage(), e);
        }
    }


    public void promoteRole(Long roleId,Long newRoleId, Double newSalary){

        try{
            StoredProcedureQuery query = entityManager.createStoredProcedureQuery("promote_role");
            query.registerStoredProcedureParameter(1, Long.class, javax.persistence.ParameterMode.IN);
            query.registerStoredProcedureParameter(2, Long.class, javax.persistence.ParameterMode.IN);
            query.registerStoredProcedureParameter(3, Double.class, javax.persistence.ParameterMode.IN);

            query.setParameter(1,roleId);
            query.setParameter(2, newRoleId);
            query.setParameter(3, newSalary);

            query.execute();
        }catch(Exception e){
            throw new RuntimeException("Error promoting role: " + e.getMessage());

        }

    }
    public void deleteRole(Long roleId) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("delete_role")
                .declareParameters(
                        new SqlParameter("P_ROLE_ID", Types.BIGINT)
                );

        // Set the parameters
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("P_ROLE_ID", roleId);

        // Execute the stored procedure
        try {
            simpleJdbcCall.execute(parameters);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting role: " + e.getMessage(), e);
        }
    }


}
