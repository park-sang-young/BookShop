'use client';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setSelectedBook } from '../../redux/bookSlice'; // Redux 액션 가져오기
import { Card, Container, Row, Col, Button, Breadcrumb } from 'react-bootstrap';
import { FaSearch } from 'react-icons/fa';

export default function SearchResultsPage() {
  const books = useSelector((state) => state.book.searchResults); // 검색 결과 가져오기
  const dispatch = useDispatch();
  const router = useRouter();

  const handleBookClick = (book) => {
    dispatch(setSelectedBook(book)); // 선택된 책 데이터를 Redux에 저장
    router.push(`/detail/${book.id}`); // 상세 페이지로 이동
  };

  const handleGoBack = () => {
    router.back(); // 이전 페이지로 이동
  };

  if (!books || books.length === 0) {
    return (
      <Container className="text-center my-4">
        <p>No results found.</p>
        {/* 🔹 이전 페이지 버튼 추가 */}
        <Button variant="secondary" onClick={handleGoBack} className="mt-3">
          ← 이전 페이지
        </Button>
      </Container>
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
                <Breadcrumb.Item active>Search</Breadcrumb.Item>
    </Breadcrumb>

      <h1 className="mb-4 d-flex align-items-center">
        Search Results
      </h1>
      <Row xs={1} sm={2} md={3} lg={4} className="g-4 card-area">
        {books.map((book) => (
          <Col key={book.id}>
            <Card
              onClick={() => handleBookClick(book)} // 클릭 이벤트 추가
              className="shadow-sm hover-shadow"
              style={{
                cursor: 'pointer',
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Card.Img
                variant="top"
                src={book.volumeInfo.imageLinks?.thumbnail}
                alt={book.volumeInfo.title}
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
    </Container>
  );
}
