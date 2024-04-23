import React, { useState, useEffect } from 'react';
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://127.0.0.1:8000/', // Set the base URL without "https"
});

const AdminConcern = () => {
    const [messages, setMessages] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const messagesPerPage = 4; // Number of messages to display per page

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await instance.get('api/get-contact/');
                setMessages(response.data);
            } catch (error) {
                console.error('Failed to fetch messages: ', error);
            }
        };

        fetchMessages();
    }, []);

    // Pagination logic
    const indexOfLastMessage = currentPage * messagesPerPage;
    const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
    const currentMessages = messages && messages.slice(indexOfFirstMessage, indexOfLastMessage);

    const handleReplySubmit = async (messageId, reply) => {
        try {
            await instance.post(`api/reply-to-message/${messageId}/`, { reply });
            alert('Reply sent successfully');
            // Optionally, you can update the state or UI to indicate that the reply was sent
        } catch (error) {
            console.error('Failed to send reply: ', error);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            await instance.delete(`api/delete-message/${messageId}/`);
            setMessages(messages.filter(message => message.id !== messageId));
            alert('Message deleted successfully');
            // Optionally, you can update the state or UI to indicate that the message was deleted
        } catch (error) {
            console.error('Failed to delete message: ', error);
        }
    };

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => setCurrentPage(currentPage + 1);
    const prevPage = () => setCurrentPage(currentPage - 1);

    return (
        <div>
            <h1>Sent Messages</h1>
            <ul>
                {currentMessages.map(message => (
                    <li key={message.id}>
                        <strong>Name:</strong> {message.name}<br />
                        <strong>Email:</strong> {message.email}<br />
                        <strong>Message:</strong> {message.message}<br />
                        <strong>Created At:</strong> {new Date(message.created_at).toLocaleString()}<br />
                        <button onClick={() => handleDeleteMessage(message.id)}>Delete</button>
                        <ReplyForm messageId={message.id} onReplySubmit={handleReplySubmit} />
                    </li>
                ))}
            </ul>
            {/* Pagination */}
            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
                {[...Array(Math.ceil((messages && messages.length || 0) / messagesPerPage)).keys()].map((number) => (
                    <button key={number + 1} onClick={() => paginate(number + 1)} className={currentPage === number + 1 ? 'active' : ''}>{number + 1}</button>
                ))}
                <button onClick={nextPage} disabled={currentPage === Math.ceil((messages && messages.length || 0) / messagesPerPage)}>Next</button>
            </div>
        </div>
    );
};

const ReplyForm = ({ messageId, onReplySubmit }) => {
    const [reply, setReply] = useState('');

    const handleReplyChange = (e) => {
        setReply(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onReplySubmit(messageId, reply);
        setReply('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea rows="4" cols="50" value={reply} onChange={handleReplyChange} /><br />
            <button type="submit">Reply</button>
        </form>
    );
};

export default AdminConcern;
