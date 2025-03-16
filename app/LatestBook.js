'use client';
import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';

const fetchLatestBooks = async () => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=new+releases&maxResults=4&key=${apiKey}`
    );
    return response.data.items || [];
  } catch (error) {
    console.error("최신 책을 가져오는 데 실패했습니다.", error);
    return [];
  }
};

export default function LatestBook() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getLatestBooks = async () => {
      const latestBooks = await fetchLatestBooks();
      setBooks(latestBooks);
      setLoading(false);
    };

    getLatestBooks();
  }, []);

  const handleBookClick = (book) => {
        if (!book.volumeInfo) return;

        router.push(`/detail/${book.id}`);
    };

  const handleMoreClick = () => {
    router.push('/books/latest');  // "More Books" 클릭 시 새로운 페이지로 이동
  };

  return (
    <section className="section-area">
        <h1 style={{fontSize : '0'}}>최신 책 리스트</h1>
      <Container>
        <h5 className="section-title categorytext-left" style={{fontWeight: '700'}}>
            <FontAwesomeIcon icon={faBookOpen} className="me-2" />
            Latest book
        </h5>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : books.length === 0 ? (
          <p className="text-center">최신 책이 없습니다.</p>
        ) : (
            <Row style={{marginTop: "0"}} xs={1} sm={2} md={3} lg={4} className="card-area g-4">
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
                  onClick={() => handleBookClick(book)}
                >
                  <Card.Img
                    variant="top"
                    src={book.volumeInfo.imageLinks?.thumbnail || '/default-thumbnail.png'}
                    alt={book.volumeInfo.title || 'No Image'}
                    style={{
                      objectFit: 'cover',
                      height: '250px',
                      width: '100%',
                    }}
                  />
                  <Card.Body>
                    <Card.Title
                      style={{
                        fontSize: '1rem',
                        height: '50px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {book.volumeInfo.title || 'No Title'}
                    </Card.Title>
                    <Card.Text
                      style={{
                        fontSize: '0.875rem',
                        color: '#555',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {book.volumeInfo.authors?.join(', ') || 'Unknown Author'}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
        <div className="d-flex justify-content-end mt-2">
          <Button onClick={handleMoreClick} className="more-books">
            More Books &gt;
          </Button>
        </div>
      </Container>
    </section>
  );
}
