import React, { useState } from 'react';
import axios from 'axios';

// Create an Axios instance
const instance = axios.create({
    baseURL: 'https://revil24-15f5d0b1bcb1.herokuapp.com/', // Set the base URL without "https"
});

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Use the Axios instance to make the API request
            await instance.post('api/contact/', formData);
            alert('Message sent successfully!');
            setFormData({ name: '', email: '', message: '' });
        } catch (error) {
            alert('Failed to send message. Please try again later.');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
            <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Name:
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{ padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', width: '100%' }}
                    required
                />
            </label>
            <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Email:
                <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{ padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', width: '100%' }}
                    required
                />
            </label>
            <label style={{ marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Message:
                <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    style={{ padding: '0.5rem', marginBottom: '1rem', border: '1px solid #ccc', borderRadius: '4px', fontSize: '1rem', width: '100%', height: '100px', resize: 'vertical' }}
                    required
                ></textarea>
            </label>
            <button type="submit" style={{ padding: '0.5rem', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>Send</button>
        </form>
    );
};

export default ContactForm;
