'use client';
import { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setSearchResults } from './redux/bookSlice';

export default function Search({ isInNavbar }) {
  const [query, setQuery] = useState(''); // query 상태를 Search 컴포넌트 내에서 관리
  const router = useRouter();
  const dispatch = useDispatch();

  const searchBooks = async () => {
    if (!query) return;

    try {
      const response = await fetch(`/api/books?query=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      const data = await response.json();
      dispatch(setSearchResults(data.items || [])); // Redux에 검색 결과 저장
      router.push(`/search/results`); // 검색 결과 페이지로 이동
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  return (
    <div
      className={`book-search-area d-flex justify-content-center align-items-center ${isInNavbar ? 'navbar-search' : ''}`}
      style={{ width: '50%' }}
    >
      <InputGroup className={isInNavbar ? 'book-search navbar-search-input ' : 'book-search mt-4'} style={{ width: isInNavbar ? '400px' : '100%' }}>
        <Form.Control
          type="text"
          placeholder="책을 검색해보세요..."
          value={query}
          onChange={(e) => setQuery(e.target.value)} // query 상태 업데이트
          style={{
            borderRadius: '25px',
            padding: '12px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
            border: '1px solid #ddd',
            height: isInNavbar ? '40px' : '50px'
          }}
        />
        <Button
          onClick={searchBooks}
          variant="success"
          style={{
            borderRadius: '50%',
            padding: '12px 15px',
            marginLeft: '10px',
            border: 'none',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
            height: isInNavbar ? '40px' : '50px',
            width: isInNavbar ? '40px' : '50px'
            
          }}
        >
          <FontAwesomeIcon icon={faSearch} style={{ color: 'white' }} />
        </Button>
      </InputGroup>
    </div>
  );
}
