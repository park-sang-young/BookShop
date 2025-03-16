'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Button, Breadcrumb } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

export default function HanAuthorAllBooks() {
    const [hanBooks, setHanBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
                const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=inauthor:Han Kang&key=${apiKey}`);
                
                const booksByHanKang = response.data.items || [];
                setHanBooks(booksByHanKang);
            } catch (error) {
                console.error('Error fetching books:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const handleBookClick = (bookId) => {
        router.push(`/detail/${bookId}`);
    };

    const handleGoHome = () => {
        router.push('/'); // 이전 페이지로 이동
    };

    return (
        <Container className='my-4'>
            {/* 🔹 브레드크럼 추가 */}
            <Breadcrumb className="breadcrumb-area">
                <Breadcrumb.Item onClick={handleGoHome}>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>All Books by Han Kang</Breadcrumb.Item>
            </Breadcrumb>

            <h1 className='mb-4'>All Books by Han Kang</h1>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                    <p>Loading...</p>
                </div>
            ) : hanBooks.length === 0 ? (
                <p className="text-center">No books found.</p>
            ) : (
                <Row xs={1} sm={2} md={3} lg={4} className="g-4 card-area">
                    {hanBooks.map((book) => (
                        <Col key={book.id}>
                            <Card className="h-100 shadow-sm"
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
                                    src={book.volumeInfo.imageLinks?.thumbnail || '/default-thumbnail.png'}
                                    alt={book.volumeInfo.title}
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
                                        {book.volumeInfo.title}
                                    </Card.Title>
                                    <Card.Text style={{
                                        fontSize: "0.875rem",
                                        color: "#555",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    }}>
                                        {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
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
