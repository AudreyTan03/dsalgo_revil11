// VideoList.jsx

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getVideos, deleteVideo } from '../actions/adminActions';
import { Link } from 'react-router-dom';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import './videolist.css'; // Import custom CSS for additional styling

const VideoList = () => {
    const dispatch = useDispatch();
    const videos = useSelector(state => state.videoReducer.videos);

    useEffect(() => {
        dispatch(getVideos());
    }, [dispatch]);

    const handleDelete = (videoId) => {
        if (window.confirm('Are you sure you want to delete this video?')) {
            dispatch(deleteVideo(videoId));
        }
    };

    return (
        <Container className="AdminVid-container mt-5"> {/* Add AdminVid prefix to container */}
            <h2 className="AdminVid-heading mb-4">Video List</h2> {/* Add AdminVid prefix to heading */}
            <Row>
                {videos && videos.map(video => (
                    <Col key={video.id} lg={4} md={6} sm={12} className="AdminVid-col mb-4"> {/* Add AdminVid prefix to col */}
                        <Card className="AdminVid-card"> {/* Add AdminVid prefix to card */}
                            <Card.Body>
                                <Card.Title>{video.title}</Card.Title>
                                <Link to={`/admin/video-details/${video.id}`} className="AdminVid-btn btn btn-primary mr-2">View Details</Link> {/* Add AdminVid prefix to btn */}
                                <Button variant="danger" onClick={() => handleDelete(video.id)} className="AdminVid-delete-btn">Delete</Button> {/* Add AdminVid prefix to delete-btn */}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default VideoList;
