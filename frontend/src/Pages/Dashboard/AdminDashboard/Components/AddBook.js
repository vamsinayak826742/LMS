import React, { useEffect, useState } from 'react';
import "../AdminDashboard.css";
import axios from "axios";
import { Dropdown } from 'semantic-ui-react';

function AddBook() {

    const API_URL = process.env.REACT_APP_API_URL;
    const [isLoading, setIsLoading] = useState(false);

    const [bookName, setBookName] = useState("");
    const [alternateTitle, setAlternateTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [bookCountAvailable, setBookCountAvailable] = useState("");
    const [language, setLanguage] = useState("");
    const [publisher, setPublisher] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [recentAddedBooks, setRecentAddedBooks] = useState([]);

    /* Fetch Recently Added Books */
    useEffect(() => {
        const getRecentBooks = async () => {
            try {
                const response = await axios.get(`${API_URL}/api/books/allbooks`);
                setRecentAddedBooks(response.data.slice(0, 5)); // Get the 5 latest books
            } catch (err) {
                console.error("Failed to fetch recent books:", err);
            }
        };
        getRecentBooks();
    }, [API_URL]);

    /* Adding a Book */
    const addBook = async (e) => {
        e.preventDefault();
        setIsLoading(true);
    
        const bookData = {
            bookName,
            alternateTitle,
            author,
            bookCountAvailable,
            language,
            publisher,
            categories: selectedCategories,
            isAdmin: true // Assuming the current user has admin permissions
        };
    
        try {
            const response = await axios.post(`${API_URL}/api/books/addbook`, bookData);
            console.log("Book Added Successfully:", response.data);
            alert("Book added successfully!");
            setBookName("");
            setAlternateTitle("");
            setAuthor("");
            setBookCountAvailable("");
            setLanguage("");
            setPublisher("");
            setSelectedCategories([]);
        } catch (err) {
            console.error("Error Adding Book:", err.response?.data || err.message);
            alert(err.response?.data || "Error: Unable to add book.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div>
            <p className="dashboard-option-title">Add a Book</p>
            <div className="dashboard-title-line"></div>
            <form className='addbook-form' onSubmit={addBook}>

                <label className="addbook-form-label" htmlFor="bookName">
                    Book Name<span className="required-field">*</span>
                </label><br />
                <input
                    className="addbook-form-input"
                    type="text"
                    name="bookName"
                    value={bookName}
                    onChange={(e) => setBookName(e.target.value)}
                    required
                /><br />

                <label className="addbook-form-label" htmlFor="alternateTitle">
                    Alternate Title
                </label><br />
                <input
                    className="addbook-form-input"
                    type="text"
                    name="alternateTitle"
                    value={alternateTitle}
                    onChange={(e) => setAlternateTitle(e.target.value)}
                /><br />

                <label className="addbook-form-label" htmlFor="author">
                    Author Name<span className="required-field">*</span>
                </label><br />
                <input
                    className="addbook-form-input"
                    type="text"
                    name="author"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    required
                /><br />

                <label className="addbook-form-label" htmlFor="language">
                    Language
                </label><br />
                <input
                    className="addbook-form-input"
                    type="text"
                    name="language"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                /><br />

                <label className="addbook-form-label" htmlFor="publisher">
                    Publisher
                </label><br />
                <input
                    className="addbook-form-input"
                    type="text"
                    name="publisher"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                /><br />

                <label className="addbook-form-label" htmlFor="copies">
                    No. of Copies Available<span className="required-field">*</span>
                </label><br />
                <input
                    className="addbook-form-input"
                    type="number"
                    name="copies"
                    value={bookCountAvailable}
                    onChange={(e) => setBookCountAvailable(e.target.value)}
                    required
                /><br />

                <label className="addbook-form-label" htmlFor="categories">
                    Categories
                </label><br />
                <div className="semanticdropdown">
                    <Dropdown
                        placeholder="Select Categories"
                        fluid
                        multiple
                        search
                        selection
                        options={[
                            { key: 'fiction', value: 'Fiction', text: 'Fiction' },
                            { key: 'sci-fi', value: 'Sci-Fi', text: 'Sci-Fi' },
                            { key: 'history', value: 'History', text: 'History' },
                            { key: 'biography', value: 'Biography', text: 'Biography' },
                            { key: 'fantasy', value: 'Fantasy', text: 'Fantasy' },
                        ]}
                        value={selectedCategories}
                        onChange={(e, { value }) => setSelectedCategories(value)}
                    />
                </div>

                <input
                    className="addbook-submit"
                    type="submit"
                    value="SUBMIT"
                    disabled={isLoading}
                />
            </form>

            <div>
                <p className="dashboard-option-title">Recently Added Books</p>
                <div className="dashboard-title-line"></div>
                <table className='admindashboard-table'>
                    <thead>
                        <tr>
                            <th>S.No</th>
                            <th>Book Name</th>
                            <th>Added Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentAddedBooks.map((book, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{book.bookName}</td>
                                <td>{book.createdAt.substring(0, 10)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default AddBook;
