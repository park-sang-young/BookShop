'use client';

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";  // ✅ useParams 사용
import { useSession } from "next-auth/react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "@/app/redux/cartSlice";
import Board from "@/app/Board";
import { Button, Modal, Form, Breadcrumb } from "react-bootstrap";
import { faCartPlus, faPen, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function DetailPage() {
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewContent, setReviewContent] = useState("");
    const [reviewUpdated, setReviewUpdated] = useState(false); // 리뷰 갱신 트리거
    const dispatch = useDispatch();
    const router = useRouter();
    const { data: session } = useSession();
    const params = useParams();  // ✅ useParams 사용
    const id = params.id;  // ✅ id 가져오기

    useEffect(() => {
        if (!id) {
            router.push("/");
            return;
        }

        const fetchBook = async () => {
            try {
                const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
                const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${id}?key=${apiKey}`);
                setBook(response.data);
            } catch (error) {
                console.error("책 데이터를 가져오는 데 실패했습니다.", error);
            }
        };

        fetchBook();
    }, [id, router]);

    if (!book) {
        return <div>Loading...</div>;
    }

    // 장바구니 추가 (가격 정보가 없으면 품절 처리)
    const handleAddToCart = async () => {
        if (!session) {
            alert("로그인이 필요합니다.");
            router.push("/api/auth/signin");
            return;
        }

        // 🔹 가격 정보가 없는 경우 품절 알림
        if (!book.saleInfo?.listPrice?.amount) {
            alert("해당 책은 품절되었습니다.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post('/api/cart/new', book);
            const { message, alreadyInCart } = response.data;

            if (alreadyInCart) {
                if (confirm(`${message} 장바구니로 이동하시겠습니까?`)) {
                    router.push("/cart");
                }
            } else {
                dispatch(addToCart({ ...book, quantity: 1 }));
                if (confirm(`${message} 장바구니로 이동하시겠습니까?`)) {
                    router.push("/cart");
                }
            }
        } catch (error) {
            console.error("장바구니 추가 오류:", error);
            alert("오류가 발생했습니다.");
        }

        setLoading(false);
    };

    // 책 주문 (구매 링크가 없으면 품절 처리)
    const handleOrder = () => {
        if (!session) {
            alert("로그인이 필요합니다.");
            router.push("/api/auth/signin");
        } else if (book.saleInfo?.buyLink) {
            router.push(book.saleInfo.buyLink);
        } else {
            alert("해당 책은 품절되었습니다.");
        }
    };

    // 리뷰 작성 핸들링
    const handleClose = () => {
        setShow(false);
        setReviewTitle("");
        setReviewContent("");
    };
    const handleShow = () => setShow(true);

    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (!session) {
            alert("로그인이 필요합니다.");
            router.push("/api/auth/signin");
            return;
        }

        if (!reviewTitle || !reviewContent) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }

        try {
            const reviewData = {
                bookId: book.id,
                userId: session.user.email,
                title: reviewTitle,
                content: reviewContent,
                createdAt: new Date().toISOString(),
            };

            await axios.post("/api/post/new", reviewData);
            alert("리뷰가 등록되었습니다.");
            handleClose();
            setReviewUpdated((prev) => !prev); // 리뷰 새로고침 트리거
        } catch (error) {
            console.error("리뷰 작성 오류:", error);
            alert("리뷰 작성에 실패했습니다.");
        }
    };

    const handleGoBack = () => {
        router.push('/'); // 이전 페이지로 이동
    };

    return (
        <section className="container py-4">
            {/* 🔹 브레드크럼 추가 */}
            <Breadcrumb className="breadcrumb-area">
                <Breadcrumb.Item onClick={handleGoBack}>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Detail</Breadcrumb.Item>
            </Breadcrumb>

            <h1>{book.volumeInfo.title}</h1>

            <div className="book-info-list d-flex justify-content-between pt-4 pb-4">
                <img src={book.volumeInfo.imageLinks?.thumbnail || "/default-thumbnail.png"} 
                     alt={book.volumeInfo.title} 
                     style={{ width: "20%", height: "500px" }} />
                
                <div className="w-75 book-info-content">
                    <p><strong>Author(s):</strong> {book.volumeInfo.authors?.join(", ") || "Unknown Author"}</p>
                    <p><strong>Publisher:</strong> {book.volumeInfo.publisher}</p>
                    <p><strong>Published Date:</strong> {book.volumeInfo.publishedDate}</p>
                    <p><strong>Price:</strong> {book.saleInfo?.listPrice?.amount 
                        ? new Intl.NumberFormat().format(book.saleInfo.listPrice.amount) 
                        : "No price available"} {book.saleInfo?.listPrice?.currencyCode || ""}</p>
                    <p><strong>Description:</strong> 
                        <br />{book.volumeInfo.description 
                            ? <span dangerouslySetInnerHTML={{ __html: book.volumeInfo.description }} />
                            : "No description available."}
                    </p>
                </div>
            </div>

            <div className="d-flex justify-content-end">
                <Button variant="primary" onClick={handleAddToCart} disabled={loading} className="me-1 d-flex align-items-center">
                    <FontAwesomeIcon icon={faCartPlus} className="me-2 fa-lg text-light" />
                    {loading ? "추가 중..." : "카트에 넣기"}
                </Button>
                <Button variant="success" onClick={handleOrder} disabled={loading} className="ms-1 d-flex align-items-center">
                    <FontAwesomeIcon icon={faShoppingBag} className="me-2 fa-lg text-light" />
                    {loading ? "주문 중..." : "주문하기"}
                </Button>
            </div>

            <div className="mt-4">
                <h3>
                    <FontAwesomeIcon icon={faPen} className="me-2" />
                    구매 리뷰
                </h3>
                
                <Board bookId={book.id} userId={session ? session.user.email : null} reviewUpdated={reviewUpdated} />

                <div className="d-flex justify-content-end mt-4">
                    <Button variant="primary" onClick={handleShow}>
                        리뷰쓰기
                    </Button>
                </div>
            </div>

            {/* 리뷰 작성 모달 */}
            <Modal show={show} backdrop="static" onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>리뷰쓰기</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitReview}>
                        <Form.Group className="mb-3">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Detail</Form.Label>
                            <Form.Control as="textarea" value={reviewContent} onChange={(e) => setReviewContent(e.target.value)} rows={5} required />
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>닫기</Button>
                            <Button variant="primary" type="submit">저장</Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </section>
    );
}
