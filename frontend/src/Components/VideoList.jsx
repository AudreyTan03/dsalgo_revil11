import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVideos, deleteVideo } from '../actions/adminActions';
import { Link } from 'react-router-dom';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import './videolist.css'; // Import custom CSS for additional styling

const VideoList = () => {
    const dispatch = useDispatch();
    const videos = useSelector(state => state.videoReducer.videos);

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const videosPerPage = 6; // Number of videos to display per page

    useEffect(() => {
        dispatch(getVideos());
    }, [dispatch]);

    // Pagination logic
    const indexOfLastVideo = currentPage * videosPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
    const currentVideos = videos && videos.slice(indexOfFirstVideo, indexOfLastVideo);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(currentPage + 1);
    const prevPage = () => setCurrentPage(currentPage - 1);

    const handleDelete = (videoId) => {
        if (window.confirm('Are you sure you want to delete this video?')) {
            dispatch(deleteVideo(videoId));
        }
    };

    return (
        <Container className="AdminVid-container mt-5"> {/* Add AdminVid prefix to container */}
            <h2 className="AdminVid-heading mb-4">Video List</h2> {/* Add AdminVid prefix to heading */}
            <Row>
                {currentVideos && currentVideos.map(video => (
                    <Col key={video.id} lg={4} md={6} sm={12} className="AdminVid-col mb-4"> {/* Add AdminVid prefix to col */}
                        <Card className="AdminVid-card"> {/* Add AdminVid prefix to card */}
                            <Card.Body>
                                <Card.Title>{video.title}</Card.Title>
                                {/* <Link to={`/admin/video-details/${video.id}`} className="AdminVid-btn btn btn-primary mr-2">View Details</Link> Add AdminVid prefix to btn */}
                                <Button variant="danger" onClick={() => handleDelete(video.id)} className="AdminVid-delete-btn">Delete</Button> {/* Add AdminVid prefix to delete-btn */}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            {/* Pagination */}
            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                {[...Array(Math.ceil((videos && videos.length || 0) / videosPerPage)).keys()].map((number) => (
                    <button key={number + 1} onClick={() => paginate(number + 1)} className={currentPage === number + 1 ? 'active' : ''}>{number + 1}</button>
                ))}
                <button onClick={nextPage} disabled={currentPage === Math.ceil((videos && videos.length || 0) / videosPerPage)}>Next</button>
            </div>
        </Container>
    );
};

export default VideoList;
