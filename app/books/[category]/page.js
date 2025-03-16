'use client';

import { useEffect, useState } from "react";
import { Row, Col, Card, Container, Spinner, Button, Breadcrumb } from "react-bootstrap";
import axios from "axios";
import { useParams, useRouter } from "next/navigation"; 

// 특정 카테고리의 책을 가져오는 함수
async function fetchBooksByCategory(category, startIndex = 0, maxResults = 20) {
    try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=subject:${category}&key=${apiKey}&startIndex=${startIndex}&maxResults=${maxResults}`);
        return response.data.items || [];
    } catch (error) {
        console.error("책 데이터를 가져오는 데 실패했습니다.", error);
        return [];
    }
}

export default function CategoryBooks() {
    const { category } = useParams();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter(); 

    useEffect(() => {
        if (category) {
            const getBooks = async () => {
                setLoading(true);
                const fetchedBooks = await fetchBooksByCategory(category, 0, 20);
                setBooks(fetchedBooks);
                setLoading(false);
            };
            getBooks();
        }
    }, [category]);

    const handleBookClick = (bookId) => {
        router.push(`/detail/${bookId}`);
    };


    if (!category) {
        return (
            <div className="text-center">
                <Spinner animation="border" />
                <p>Loading...</p>
            </div>
        );
    }

    const handleGoHome = () => {
        router.push('/'); // 이전 페이지로 이동
    };

    return (
        <Container className="my-4">
            {/* 🔹 브레드크럼 추가 */}
            <Breadcrumb className="breadcrumb-area">
                <Breadcrumb.Item onClick={handleGoHome}>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>{category.charAt(0).toUpperCase() + category.slice(1)} Books</Breadcrumb.Item>
            </Breadcrumb>

            <h1 className="mb-4">{category.charAt(0).toUpperCase() + category.slice(1)} Books</h1>
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : books.length === 0 ? (
                <p className="text-center">No books found.</p>
            ) : (
                <Row xs={1} sm={2} md={3} lg={4} className="g-4 card-area">
                    {books.map((book) => (
                        <Col key={book.id}>
                            <Card 
                                style={{
                                    cursor: "pointer", 
                                    border: "1px solid #ddd", 
                                    borderRadius: "8px", 
                                    overflow: "hidden", 
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                                }}
                                onClick={() => handleBookClick(book.id)}
                            >
                                <Card.Img
                                    variant="top"
                                    src={book.volumeInfo.imageLinks?.thumbnail || "/default-thumbnail.png"}
                                    alt={book.volumeInfo.title || "No Image"}
                                    style={{
                                        objectFit: "cover",
                                        height: "250px",
                                        width: "100%",
                                    }}
                                />
                                <Card.Body>
                                    <Card.Title style={{
                                        fontSize: "1rem", 
                                        height: "50px", 
                                        overflow: "hidden", 
                                        textOverflow: "ellipsis", 
                                        whiteSpace: "nowrap"
                                    }}>
                                        {book.volumeInfo.title || "No Title"}
                                    </Card.Title>
                                    <Card.Text style={{
                                        fontSize: "0.875rem", 
                                        color: "#555", 
                                        overflow: "hidden", 
                                        textOverflow: "ellipsis", 
                                        whiteSpace: "nowrap"
                                    }}>
                                        {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
}
