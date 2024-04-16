import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SentMessages = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/get-contact/');
                setMessages(response.data);
            } catch (error) {
                console.error('Failed to fetch messages: ', error);
            }
        };

        fetchMessages();
    }, []);

    const handleReplySubmit = async (messageId, reply) => {
        try {
            await axios.post(`http://127.0.0.1:8000/api/reply-to-message/${messageId}/`, { reply });
            alert('Reply sent successfully');
            // Optionally, you can update the state or UI to indicate that the reply was sent
        } catch (error) {
            console.error('Failed to send reply: ', error);
        }
    };

    return (
        <div>
            <h1>Sent Messages</h1>
            <ul>
                {messages.map(message => (
                    <li key={message.id}>
                        <strong>Name:</strong> {message.name}<br />
                        <strong>Email:</strong> {message.email}<br />
                        <strong>Message:</strong> {message.message}<br />
                        <strong>Created At:</strong> {new Date(message.created_at).toLocaleString()}<br />
                        <ReplyForm messageId={message.id} onReplySubmit={handleReplySubmit} />
                    </li>
                ))}
            </ul>
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

export default SentMessages;
