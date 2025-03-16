'use client';

import { useState, useEffect } from "react";
import { Row, Col, Card, Button, Spinner, Container } from "react-bootstrap";
import { useRouter } from "next/navigation";
import axios from "axios";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// 새로운 고정된 책 ID 목록
const fixedBookIds = [
    "3TjTz6w0zEoC",  // Atomic Habits
    "gnm1h2TqdEC",   // The Subtle Art of Not Giving a F*ck
    "wZ21n4jEwgoC",   // Educated
    "P2o6Hwa6e5YC"    // Becoming
];

// 고정된 책들을 가져오는 함수
async function fetchBooks() {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    const bookPromises = fixedBookIds.map(id =>
        axios.get(`https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`)
    );

    try {
        const responses = await Promise.all(bookPromises); // 고정된 책의 ID로만 API 호출
        return responses.map(response => response.data);
    } catch (error) {
        console.error("책 데이터를 가져오는 데 실패했습니다.", error);
        return [];
    }
}

export default function MonthBook() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const storedBooks = localStorage.getItem("monthBooks"); // 로컬 저장소에서 책 목록을 가져옴

        if (storedBooks) {
            setBooks(JSON.parse(storedBooks)); // 로컬 저장소에서 가져온 책 목록을 사용
        } else {
            const getBooks = async () => {
                setLoading(true);
                const fetchedBooks = await fetchBooks(); // 고정된 책들만 가져옴
                setBooks(fetchedBooks);
                localStorage.setItem("monthBooks", JSON.stringify(fetchedBooks)); // 로컬 저장소에 책 목록 저장
                setLoading(false);
            };
            getBooks();
        }
    }, []);

    const handleBookClick = (bookId) => {
        router.push(`/detail/${bookId}`); // 책 클릭 시 상세 페이지로 이동
    };

    const handleMoreClick = () => {
        router.push("/books/month"); // More Books 버튼 클릭 시 20개 책 페이지로 이동
    };

    return (
        <section className="section-area">
            <h1 style={{fontSize : '0'}}>이 달의 책 리스트</h1>
            <Container>
                <h5 className="section-title text-left mb-0 mb-4" style={{fontWeight: '700'}}>
                    <FontAwesomeIcon icon={faCalendarDays} className="me-2" />
                    Month's Book Picks
                </h5>
                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" />
                    </div>
                ) : books.length === 0 ? (
                    <p className="text-center">No books found.</p>
                ) : (
                    <Row xs={1} sm={2} md={3} lg={4} className="card-area g-4">
                        {books.map((book) => ( // 고정된 책들만 표시
                            <Col key={book.id}>
                                <Card
                                    style={{
                                        cursor: "pointer",
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                                    }}
                                    onClick={() => handleBookClick(book.id)} // 책 클릭 시 상세 페이지로 이동
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
                <div className="d-flex justify-content-end mt-2">
                    <Button className="more-books" onClick={handleMoreClick}>More Books &gt;</Button>
                </div>
            </Container>
        </section>
    );
}
