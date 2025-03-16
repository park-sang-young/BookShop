import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Spinner, Modal, Form } from "react-bootstrap";
import { TrashFill, Pencil } from "react-bootstrap-icons"; // 아이콘 추가

export default function Board({ bookId, userId, reviewUpdated }) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [show, setShow] = useState(false);
    const [currentReview, setCurrentReview] = useState(null);
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewContent, setReviewContent] = useState("");

    // 📌 리뷰 데이터 불러오기
    useEffect(() => {
        setLoading(true);
        axios.get(`/api/post/reviews?bookId=${bookId}`)
            .then((result) => setReviews(result.data))
            .catch((error) => console.error("리뷰 데이터를 불러오는 중 오류 발생:", error))
            .finally(() => setLoading(false));
    }, [bookId, reviewUpdated]);

    // 📌 리뷰 수정 모달 열기
    const handleShow = (review) => {
        if (review.userId !== userId) {
            alert("본인의 리뷰만 수정할 수 있습니다.");
            return;
        }
        console.log("🔹 수정할 리뷰:", review); // ✅ 현재 리뷰 확인
        setCurrentReview(review);
        setReviewTitle(review.title);
        setReviewContent(review.content);
        setShow(true);
    };

    // 📌 리뷰 삭제
    const handleDelete = async (review) => {
        if (review.userId !== userId) {
            alert("본인이 작성한 리뷰만 삭제할 수 있습니다.");
            return;
        }
        if (confirm("정말로 이 리뷰를 삭제하시겠습니까?")) {
            try {
                await axios.delete(`/api/post/remove/${review._id}`);
                setReviews((prevReviews) => prevReviews.filter(item => item._id !== review._id));
                alert("리뷰가 삭제되었습니다.");
            } catch (error) {
                console.error("리뷰 삭제 실패:", error);
                alert("삭제에 실패했습니다. 다시 시도해주세요.");
            }
        }
    };

    // 📌 모달 닫기
    const handleClose = () => {
        setShow(false);
        setReviewTitle("");
        setReviewContent("");
        setCurrentReview(null);
    };

    // 📌 리뷰 수정 제출
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!reviewTitle || !reviewContent) {
            alert("제목과 내용을 모두 입력해주세요.");
            return;
        }
        if (!currentReview) {
            alert("수정할 리뷰 정보가 없습니다.");
            return;
        }

        try {
            const reviewData = {
                _id: currentReview._id,
                title: reviewTitle,
                content: reviewContent,
                createdAt: new Date().toISOString(),
            };

            console.log("🔹 수정 요청 데이터:", reviewData); // ✅ 확인용 로그

            const response = await axios.post("/api/post/edit", reviewData);
            console.log("🔹 서버 응답:", response.data); // ✅ 응답 확인

            if (response.status === 200) {
                setReviews((prevReviews) =>
                    prevReviews.map((review) =>
                        review._id === currentReview._id
                            ? { ...review, title: reviewTitle, content: reviewContent, createdAt: new Date().toISOString() }
                            : review
                    )
                );
                alert("리뷰가 수정되었습니다.");
                handleClose();
            } else {
                alert("리뷰 수정에 실패했습니다.");
            }
        } catch (error) {
            console.error("리뷰 수정 오류:", error);
            alert("리뷰 수정에 실패했습니다.");
        }
    };

    return (
        <div className="mt-4">
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">리뷰를 불러오는 중...</p>
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center p-4 border rounded bg-light">
                    <h5 className="text-muted">아직 작성된 리뷰가 없습니다.</h5>
                </div>
            ) : (
                <Table striped bordered hover className="text-center align-middle review-table">
                    <thead className="table-dark">
                        <tr>
                            <th style={{ width: "5%" }}>#</th>
                            <th style={{ width: "15%" }}>제목</th>
                            <th style={{ width: "40%" }}>내용</th>
                            <th style={{ width: "15%" }}>작성자</th>
                            <th style={{ width: "11%" }}>작성일</th>
                            <th style={{ width: "14%" }}>작업</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map((review, index) => (
                            <tr key={review._id}>
                                <td>{index + 1}</td>
                                <td>{review.title}</td>
                                <td className="text-truncate" style={{ maxWidth: "300px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    {review.content}
                                </td>
                                <td style={{ fontSize: "0.9rem" }}>
                                    {review.userId.length > 10 ? review.userId.slice(0, 10) + "..." : review.userId}
                                </td>
                                <td>
                                    {new Intl.DateTimeFormat("ko-KR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit"
                                    }).format(new Date(review.createdAt))}
                                </td>
                                <td>
                                    <div className="d-flex justify-content-center review-btn">
                                        <Button variant="success" className="me-2" size="sm" onClick={() => handleShow(review)}>
                                            <Pencil size={16} /> 수정
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => handleDelete(review)}>
                                            <TrashFill size={16} /> 삭제
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}

            {/* 리뷰 수정 모달 */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>리뷰 수정</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitReview}>
                        <Form.Group className="mb-3">
                            <Form.Label>제목</Form.Label>
                            <Form.Control type="text" value={reviewTitle} onChange={(e) => setReviewTitle(e.target.value)} required />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>내용</Form.Label>
                            <Form.Control as="textarea" value={reviewContent} onChange={(e) => setReviewContent(e.target.value)} rows={5} required />
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>취소</Button>
                            <Button variant="primary" type="submit">수정 완료</Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
