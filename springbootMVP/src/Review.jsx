import { useState } from 'react';
import axios from 'axios';

function Review({ setReviews, emp, reviews }) {  // Added 'emp' and 'reviews' as props
    const [departmentName, setDepartmentName] = useState('');
    const [departmentManager, setDepartmentManager] = useState('');
    const [salary, setSalary] = useState(0);
    const [editedSalary, setEditedSalary] = useState(0);
    const [editedDepartmentName, setEditedDepartmentName] = useState('');
    const [editedDepartmentManager, setEditedDepartmentManager] = useState(0);
    const [edit, setEdit] = useState(0);
    const [reviewComments, setReviewComments] = useState(''); // Added for review comments
    const [reviewScore, setReviewScore] = useState(0); // Added for review score
    const [editedReviewComments, setEditedReviewComments] = useState(''); // Added for edited review comments
    const [editedReviewScore, setEditedReviewScore] = useState(0); // Added for edited review score
    const [editReview, setEditReview] = useState(null); // State to track which review is being edited

    const handleDeleteDepartmentClick = async (id) => {
        const response = await axios.delete(`http://localhost:8081/departments/delete/${id}`);
        console.log('department delete res:', response.data);
        const fetchDepartments = await axios.get('http://localhost:8081/departments');
        setDepartments(fetchDepartments.data);
    };

    const handleEditDepartmentClick = async (department) => {
        setEdit(department.id);
        setEditedDepartmentName(department.departmentName);
        setEditedDepartmentManager(department.departmentManager);
    };

    const handleEditDepartmentSubmit = async (event, id) => {
        event.preventDefault();
        const departmentDTO = {
            departmentName: editedDepartmentName,
            departmentManager: editedDepartmentManager
        };
        console.log('Edited Department DTO:', departmentDTO, "id", id);
        const response = await axios.put(`http://localhost:8081/departments/update/${id}`, departmentDTO);
        console.log('update res:', response.data);
        setEditedDepartmentName('');
        setEditedDepartmentManager('');
        const fetchDepartments = await axios.get('http://localhost:8081/departments');
        console.log('fetch departments after update', fetchDepartments);
        setEdit(null);
        setDepartments(fetchDepartments.data);
    };

    const handleDepartmentSubmit = async (event) => {
        event.preventDefault();
        const departmentDTO = {
            departmentName,
            departmentManager: Number(departmentManager)
        };
        console.log('dept DTO:', departmentDTO);
        const response = await axios.post('http://localhost:8081/departments/add', departmentDTO);
        console.log('department post res:', response.data);
        setDepartmentName('');
        setDepartmentManager(0);
        const fetchDepartments = await axios.get('http://localhost:8081/departments');
        console.log('Fetched departments:', fetchDepartments.data);
        setDepartments(fetchDepartments.data);
    };

    const handleReviewSubmit = async (event, empId) => {
        event.preventDefault();
        const reviewDTO = {
            employeeId: empId,
            reviewComments,
            reviewScore
        };
        console.log('Review DTO:', reviewDTO);
        const response = await axios.post('http://localhost:8081/reviews/add', reviewDTO);
        console.log('Review post res:', response.data);
        setReviewComments('');
        setReviewScore(0);
        const fetchReviews = await axios.get(`http://localhost:8081/reviews`);
        setReviews(fetchReviews.data);
    };

    const handleReviewDeleteClick = async(id)=>{
        const response = await axios.delete(`http://localhost:8081/reviews/delete/${id}`);
        console.log('Delete review res:', response.data);
        const fetchReviews = await axios.get(`http://localhost:8081/reviews`);
        setReviews(fetchReviews.data);
    }

    const handleReviewEditClick = (reviewId) => {
        setEditReview(reviewId);
        const reviewToEdit = reviews.find(review => review.id === reviewId);
        setEditedReviewComments(reviewToEdit.reviewComments);
        setEditedReviewScore(reviewToEdit.reviewScore);
    };

    const handleReviewEditSubmit = async (event, reviewId) => {
        event.preventDefault();
        const editedReviewDTO = {
            reviewComments: editedReviewComments,
            reviewScore: editedReviewScore
        };
        console.log('Edited Review DTO:', editedReviewDTO, "id", reviewId);
        const response = await axios.put(`http://localhost:8081/reviews/update/${reviewId}`, editedReviewDTO);
        console.log('Update review res:', response.data);
        setEditReview(null);
        const fetchReviews = await axios.get(`http://localhost:8081/reviews`);
        setReviews(fetchReviews.data);
    };

    return (
        <div>
            <h3>Add Review</h3>
            <form className="reviewForm" onSubmit={(e) => handleReviewSubmit(e, emp.id)}>
                <label>
                    Add Review Comments:
                    <input type="text" value={reviewComments} onChange={(e) => setReviewComments(e.target.value)} />
                </label>
                <label>
                    Add Review Score:
                    <input type="number" value={reviewScore} onChange={(e) => setReviewScore(e.target.value)} />
                </label>
                <button className="reviewSubmit" type="submit">Submit</button>
            </form>
            <div>

                {reviews.map((review) => (
                    review.employeeId === emp.id ? (
                        editReview === review.id ? (
                            <form key={review.id} onSubmit={(e) => handleReviewEditSubmit(e, review.id)}>
                                <label>
                                    Edit Review Comments:
                                    <input type="text" value={editedReviewComments} onChange={(e) => setEditedReviewComments(e.target.value)} />
                                </label>
                                <label>
                                    Edit Review Score:
                                    <input type="number" value={editedReviewScore} onChange={(e) => setEditedReviewScore(e.target.value)} />
                                </label>
                                <button type="submit">Submit Changes</button>
                            </form>
                        ) : (
                            <div key={review.id}>
                                <div>Review Comments: {review.reviewComments}</div>
                                <div>Review Score: {review.reviewScore}</div>
                                <div>Review Date: {review.reviewDate}</div>
                                <button onClick={() => handleReviewEditClick(review.id)}>Edit Review</button>
                                <button onClick={() => handleReviewDeleteClick(review.id)}>Delete Review</button>
                            </div>
                        )
                    ) : null
                ))}
            </div>
        </div>
    );
}

export default Review;
