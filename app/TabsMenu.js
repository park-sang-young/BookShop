'use client';

import { useState, useEffect } from "react";
import { Tabs, Tab, Row, Col, Card, Spinner, Container, Button } from "react-bootstrap";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";

// Google Books API에서 특정 카테고리의 책을 불러오는 함수
const fetchBooksByCategory = async (category) => {
    try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
        const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=subject:${category}&key=${apiKey}`);
        return response.data.items || [];
    } catch (error) {
        console.error("책 데이터를 가져오는 데 실패했습니다.", error);
        return [];
    }
};

export default function TabsMenu() {
    const [activeKey, setActiveKey] = useState("fiction");
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categories] = useState([
        "fiction", "science", "self-help", "history", "economics", "art", "literature", "business"
    ]);
    const router = useRouter();

    // 선택된 책 종류에 따라 책 목록을 불러오기
    useEffect(() => {   
        const getBooks = async () => {
            setLoading(true);
            const fetchedBooks = await fetchBooksByCategory(activeKey);
            setBooks(fetchedBooks);
            setLoading(false);
        };
        getBooks();
    }, [activeKey]);

    const handleBookClick = (book) => {
        if (!book.volumeInfo) return;

        router.push(`/detail/${book.id}`);
    };

    const handleMoreClick = () => {
        router.push(`/books/${activeKey}`); // More Books 버튼 클릭 시 해당 카테고리의 책 목록 페이지로 이동
    };

    return (
        <section className="section-area">
            <h1 style={{fontSize : '0'}}>책 카테고리 리스트</h1>
            <Container>
                <Tabs
                    activeKey={activeKey}
                    onSelect={(k) => setActiveKey(k)}
                    className="mb-3 custom-tabs"
                    id="category-tabs"
                    justify
                >
                    {categories.map((category) => (
                        <Tab
                            eventKey={category}
                            title={category.charAt(0).toUpperCase() + category.slice(1)}
                            key={category}
                            className="custom-tab"
                        >
                            <div>
                                {/* 카테고리 제목 추가 */}
                                <h5 className="section-title categorytext-left mb-0 mt-4" style={{fontWeight: '700'}}>
                                    <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                                    {category.charAt(0).toUpperCase() + category.slice(1)} Books
                                </h5>
                                
                                {loading ? (
                                    <div className="text-center">
                                        <Spinner animation="border" />
                                    </div>
                                ) : books.length === 0 ? (
                                    <p className="text-center">No books found.</p>
                                ) : (
                                    <Row style={{marginTop: "0"}} xs={1} sm={2} md={3} lg={4} className="card-area g-4">
                                        {books.slice(0, 8).map((book) => ( // 8개 책만 보이게 하기
                                            <Col key={book.id}>
                                                <Card
                                                    style={{
                                                        cursor: "pointer",
                                                        border: "1px solid #ddd",
                                                        borderRadius: "8px",
                                                        overflow: "hidden",
                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
                                                    }}
                                                    onClick={() => handleBookClick(book)}
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
                                                        <Card.Title 
                                                            style={{
                                                                fontSize: "1rem", 
                                                                height: "50px", 
                                                                overflow: "hidden", 
                                                                textOverflow: "ellipsis", 
                                                                whiteSpace: "nowrap"
                                                            }}
                                                        >
                                                            {book.volumeInfo.title || "No Title"}
                                                        </Card.Title>
                                                        <Card.Text 
                                                            style={{
                                                                fontSize: "0.875rem", 
                                                                color: "#555", 
                                                                overflow: "hidden", 
                                                                textOverflow: "ellipsis", 
                                                                whiteSpace: "nowrap"
                                                            }}
                                                        >
                                                            {book.volumeInfo.authors?.join(", ") || "Unknown Author"}
                                                        </Card.Text>
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                )}
                                
                                {/* More button */}
                                <div className="d-flex justify-content-end mt-2">
                                    <Button className="more-books" onClick={handleMoreClick}>
                                        More Books  &gt;
                                    </Button>
                                </div>
                            </div>
                        </Tab>
                    ))}
                </Tabs>
            </Container>
        </section>
    );
}
