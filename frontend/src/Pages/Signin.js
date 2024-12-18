import React, { useContext, useState } from 'react';
import './Signin.css';
import { AuthContext } from '../Context/AuthContext.js';
import { useHistory } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';
import axios from 'axios';

function Signin() {
    const [isStudent, setIsStudent] = useState(true);
    const [email, setEmail] = useState('');  // Changed from admissionId/employeeId to email
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { dispatch } = useContext(AuthContext);
    const history = useHistory(); // Use React Router for navigation

    const API_URL = 'http://localhost:4000'; // Your backend URL for authentication API

    const loginCall = async (credentials) => {
        dispatch({ type: 'LOGIN_START' });

        // Check for default admin and user credentials
        if (
            (credentials.email === 'admin@gmail.com' && credentials.password === 'admin') || // Default admin Gmail
            (credentials.email === 'user@gmail.com' && credentials.password === 'user') // Default user Gmail
        ) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: { isAdmin: true, username: 'admin' } });
            localStorage.setItem('currentUser', JSON.stringify({ isAdmin: true, username: 'admin' }));
            history.push('/admin-dashboard'); // Redirect to Admin Dashboard
            return;
        }

        try {
            // Send login request to backend to validate user credentials
            const response = await axios.post(`${API_URL}/api/auth/signin`, credentials, {
                headers: {
                    'Content-Type': 'application/json',  // Ensure the content is sent as JSON
                },
            });

            if (response.status === 200) {
                // Successful login
                const { user } = response.data;
                dispatch({ type: 'LOGIN_SUCCESS', payload: { isAdmin: user.isAdmin, username: user.username } });
                localStorage.setItem('currentUser', JSON.stringify({ isAdmin: user.isAdmin, username: user.username }));

                // Redirect to the appropriate dashboard based on the role
                if (user.isAdmin) {
                    history.push('/admin-dashboard'); // Redirect to Admin Dashboard
                } else {
                    history.push('/member-dashboard'); // Redirect to Member Dashboard
                }
            } else {
                // Handle failed login
                setError('Invalid credentials. Please try again.');
            }
        } catch (err) {
            console.error('Login Error:', err.response ? err.response.data : err.message);
            setError('An error occurred while logging in.');
        }
    };

    const handleForm = (e) => {
        e.preventDefault();
        const credentials = { email, password }; // Sending email instead of admissionId/employeeId
        loginCall(credentials);
    };

    return (
        <div className="signin-container">
            <div className="signin-card">
                <form onSubmit={handleForm}>
                    <h2 className="signin-title">Log in</h2>
                    <p className="line"></p>
                    <div className="persontype-question">
                        <p>Are you a Staff member?</p>
                        <Switch
                            checked={!isStudent}
                            onChange={() => setIsStudent(!isStudent)}
                            color="primary"
                        />
                    </div>
                    <div className="error-message">
                        <p>{error}</p>
                    </div>
                    <div className="signin-fields">
                        <label htmlFor="email"><b>Email</b></label>
                        <input
                            className="signin-textbox"
                            type="text"
                            placeholder="Enter Gmail"
                            required
                            onChange={(e) => setEmail(e.target.value)} // Change here to set email
                        />
                    </div>
                    <div className="signin-fields">
                        <label htmlFor="password"><b>Password</b></label>
                        <input
                            className="signin-textbox"
                            type="text"
                            placeholder="Enter Password"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="signin-button">Log In</button>
                    <a className="forget-pass" href="#home">
                        Forgot password?
                    </a>
                </form>
                <div className="signup-option">
                    <p className="signup-question">
                        Don't have an account? Contact Librarian
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signin;
