package com.example.demo;

import javax.persistence.*;

import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
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

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PerformanceReviewsService {
    @PersistenceContext
    private EntityManager entityManager;
    private static final Logger logger = LoggerFactory.getLogger(PerformanceReviewsService.class);


    // Initialize SimpleJdbcCall
    @PostConstruct
    public void init() {
        // Convert the cursor to a List<EmployeeDTO>
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("get_all_reviews")
                .returningResultSet("p_performance_review_cursor", BeanPropertyRowMapper.newInstance(PerformanceReviewDTO.class));
    }

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<PerformanceReviewDTO> getAllReviews() {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("get_all_reviews")
                .returningResultSet("p_review_cursor", (rs, rowNum) -> {
                    PerformanceReviewDTO review = new PerformanceReviewDTO();
                    review.setId(rs.getLong("review_id"));
                    review.setEmployeeId(rs.getLong("employee_id"));
                    review.setReviewComments(rs.getString("review_comments"));
                    review.setReviewScore(rs.getDouble("review_score"));

                    String reviewDate = rs.getString("review_date");
                    review.setReviewDate(reviewDate);

                    return review;
                });

        Map<String, Object> result = simpleJdbcCall.execute();
        System.out.println("Stored Procedure Result: " + result);
        @SuppressWarnings("unchecked")
        List<PerformanceReviewDTO> reviews = (List<PerformanceReviewDTO>) result.get("p_review_cursor");

        return reviews;
    }

    public void addReview(PerformanceReviewDTO reviewDTO) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("add_performance_review")
                .declareParameters(
                        new SqlParameter("p_employee_score", Types.DOUBLE),
                        new SqlParameter("p_employee_id", Types.INTEGER),
                        new SqlParameter("p_review_comments", Types.VARCHAR),
                        new SqlOutParameter("p_review_id", Types.INTEGER)
                );

        // Set the parameters
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("p_review_score", reviewDTO.getReviewScore());
        parameters.put("p_employee_id", reviewDTO.getEmployeeId());
        parameters.put("p_review_comments", reviewDTO.getReviewComments());


        // Execute the stored procedure
        try {
            Map<String, Object> result = simpleJdbcCall.execute(parameters);
            Integer generatedId = (Integer) result.get("p_review_id"); // Cast to Integer
            System.out.println("Generated ID: " + generatedId);


            // Convert Integer to Long if necessary
            reviewDTO.setId(generatedId != null ? generatedId.longValue() : null);
            System.out.println("Review DTO after setting ID: " + reviewDTO);

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error adding review: " + e.getMessage(), e);
        }
    }

    public void updateReview(Long reviewId, PerformanceReviewDTO reviewDTO) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("update_review")
                .declareParameters(
                        new SqlParameter("P_REVIEW_ID", Types.BIGINT),
                        new SqlParameter("P_EMPLOYEE_ID", Types.BIGINT),
                        new SqlParameter("P_REVIEW_COMMENTS", Types.VARCHAR),
                        new SqlParameter("P_REVIEW_SCORE", Types.BIGINT)
                );

        // Set the parameters
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("P_REVIEW_ID", reviewId);
        parameters.put("P_EMPLOYEE_ID", reviewDTO.getEmployeeId());
        parameters.put("P_REVIEW_COMMENTS", reviewDTO.getReviewComments());
        parameters.put("P_REVIEW_SCORE", reviewDTO.getReviewScore());


        // Execute the stored procedure
        try {
            simpleJdbcCall.execute(parameters);
        } catch (Exception e) {
            throw new RuntimeException("Error updating review: " + e.getMessage(), e);
        }
    }




    public void deleteReview(Long reviewId) {
        SimpleJdbcCall simpleJdbcCall = new SimpleJdbcCall(jdbcTemplate)
                .withProcedureName("delete_review")
                .declareParameters(
                        new SqlParameter("P_REVIEW_ID", Types.BIGINT)
                );

        // Set the parameters
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("P_REVIEW_ID", reviewId);

        // Execute the stored procedure
        try {
            simpleJdbcCall.execute(parameters);
        } catch (Exception e) {
            throw new RuntimeException("Error deleting review: " + e.getMessage(), e);
        }
    }


}
