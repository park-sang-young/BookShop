'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Button } from 'react-bootstrap';
import { useRouter } from 'next/navigation';

export default function HanAuthor() {
    const [hanBooks, setHanBooks] = useState([]);
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
            }
        };

        fetchBooks();
    }, []);

    return (
        <section className='section-area hangang-author'>
            <h1 style={{ fontSize: '0' }}>한강 작가 책</h1>
            <Container className='d-flex align-items-center justify-content-between h-100  hangang-author-list'>
                <div className='hangang-profile'>
                    <h1 className='text-white'>Han Kang Author's Books</h1>
                    <p className='text-white mt-2'>Author Han Kang was born in late November 1970. After graduating from Yonsei University’s Department of Korean Literature, she published a poem in Literature and Society in 1993, and began her literary career the following year when her short story “Red Anchor” won the Seoul Shinmun New Year’s Literary Contest.<br /><br />
                    The Vegetarian, published in 2007, was covered in favorable articles in the New York Times and other media outlets this year for its English-language edition, and won the 2016 Man Booker International Prize, increasing domestic and international interest in Han Kang's works that question human violence and dignity. The overseas translation rights for the Manhae Literary Award-winning Boy Acts have also been sold to 20 countries, adding vitality to Korean literature. In 2023, the novel No Farewell was selected as the winner of the Prix Médicis Foreign Literature, one of the four major literary awards in France. In 2024, she will be the first Korean writer to win the Nobel Prize in Literature.</p>
                </div>
                <div className='d-flex flex-column align-items-end hangang-books-area'>
                    {hanBooks.length > 0 ? (
                        <ul className='d-flex list-unstyled han-books-list'>
                            {hanBooks.slice(0, 3).map((book, index) => ( // 최대 3개만 표시
                                <li key={index} className='mx-3 text-center'>
                                    <img src={book.volumeInfo.imageLinks?.thumbnail} alt={book.volumeInfo.title} />
                                    <h5 className='text-white mt-2'>{book.volumeInfo.title}</h5>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className='text-white'>No books found.</p>
                    )}
                    <Button variant="light" className="han-books-more more-books" onClick={() => router.push('/books/han-author')}>
                        More Books &gt;
                    </Button>
                </div>
                
            </Container>
            
        </section>
    );
}
