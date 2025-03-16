'use client';
import { useState, useEffect } from "react";
import { Button, Table, Spinner, Breadcrumb, Pagination } from "react-bootstrap";
import { TrashFill, Bag, ChevronLeft, ChevronRight } from "react-bootstrap-icons"; 
import axios from "axios";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setSelectedBook } from "../redux/bookSlice";

export default function CartPage() {
    const [cartData, setCartData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItems, setSelectedItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const response = await axios.get('/api/cart/list');
                setCartData(response.data);
                setLoading(false);
                
                const allSelected = response.data.map(item => item.bookId);
                setSelectedItems(allSelected);
                calculateTotalAmount(response.data, allSelected);
            } catch (error) {
                console.error("장바구니 데이터를 가져오는 데 실패했습니다.", error);
                setLoading(false);
            }
        };
        fetchCartData();
    }, []);

    const calculateTotalAmount = (items, selectedItems) => {
        const total = items.reduce((acc, item) => {
            if (selectedItems.includes(item.bookId)) {
                return acc + item.amount * item.quantity;
            }
            return acc;
        }, 0);
        setTotalAmount(total);
    };

    const handleCheckboxChange = (bookId, checked) => {
        let updatedSelectedItems = checked
            ? [...selectedItems, bookId]
            : selectedItems.filter(id => id !== bookId);

        setSelectedItems(updatedSelectedItems);
        calculateTotalAmount(cartData, updatedSelectedItems);
    };

    const handleOrder = (purchase) => {
        if (purchase) {
            router.push(purchase);
        } else {
            alert("해당 책은 품절되었습니다.");
        }
    };

    const handleRemoveFromCart = async (bookId) => {
        if (confirm("정말로 이 상품을 삭제하시겠습니까?")) {
            try {
                await axios.delete(`/api/cart/remove/${bookId}`);
                const updatedCart = cartData.filter(item => item.bookId !== bookId);
                setCartData(updatedCart);
                setSelectedItems(selectedItems.filter(id => id !== bookId));
                calculateTotalAmount(updatedCart, selectedItems.filter(id => id !== bookId));
                alert("상품이 삭제되었습니다.");
            } catch (error) {
                console.error("삭제 실패:", error);
                alert("삭제에 실패했습니다. 다시 시도해주세요.");
            }
        }
    };

    const handleQuantityChange = (bookId, change) => {
        if (!selectedItems.includes(bookId)) return;
        const updatedCart = cartData.map(item => {
            if (item.bookId === bookId) {
                return { ...item, quantity: Math.max(1, item.quantity + change) };
            }
            return item;
        });
        setCartData(updatedCart);
        calculateTotalAmount(updatedCart, selectedItems);
    };

    const handleBookClick = (item) => {
        dispatch(setSelectedBook({
            id: item.bookId,
            volumeInfo: {
                title: item.title,
                authors: item.authors || ["Unknown Author"],
                description: item.description || "No description available.",
                imageLinks: { thumbnail: item.imgSmall || "/default-thumbnail.png" },
            },
        }));
        router.push(`/detail/${item.bookId}`);
    };

    const handleGoHome = () => {
        router.push('/');
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = cartData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(cartData.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <section className="py-4 container cart-area">
            <Breadcrumb className="breadcrumb-area">
                <Breadcrumb.Item onClick={handleGoHome}>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Cart</Breadcrumb.Item>
            </Breadcrumb>

            <h1 className="mb-4">Cart</h1>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2">장바구니 데이터를 불러오는 중...</p>
                </div>
            ) : cartData.length === 0 ? (
                <div className="text-center p-4 border rounded bg-light">
                    <h5 className="text-muted">장바구니가 비어 있습니다.</h5>
                </div>
            ) : (
                <>
                    <h4 className="text-end mb-2 total-price">💰 총 합계: {totalAmount.toLocaleString()}원</h4>

                    <div className="table-responsive">
                        <Table striped bordered hover className="text-center align-middle cart-table">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>상품정보</th>
                                    <th>수량</th>
                                    <th>가격</th>
                                    <th>작업</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item, index) => {
                                    const isChecked = selectedItems.includes(item.bookId);
                                    return (
                                        <tr key={index} style={{ opacity: isChecked ? 1 : 0.5 }}>
                                            <td>
                                                <input 
                                                    type="checkbox" 
                                                    checked={isChecked}
                                                    onChange={(e) => handleCheckboxChange(item.bookId, e.target.checked)}
                                                />
                                            </td>
                                            <td className="text-start">
                                                <div 
                                                    className="d-flex align-items-center" 
                                                    style={{ cursor: 'pointer', maxWidth: '400px' }} 
                                                    onClick={() => handleBookClick(item)}
                                                >
                                                    <img 
                                                        src={item.imgSmall} 
                                                        alt={item.title} 
                                                        className="me-2" 
                                                        style={{ width: '50px', height: '75px', objectFit: 'cover' }} 
                                                    />
                                                    <span 
                                                        className="Product-information"
                                                        title={item.title} // 마우스 오버 시 전체 제목 표시
                                                        style={{ 
                                                            whiteSpace: 'nowrap', 
                                                            overflow: 'hidden', 
                                                            textOverflow: 'ellipsis', 
                                                            display: 'inline-block', 
                                                            maxWidth: '400px' // 제목이 너무 길면 줄임
                                                        }}
                                                    >
                                                        {item.title}
                                                    </span>
                                                </div>
                                            </td>
                                            <td>{item.quantity}</td>
                                            <td>{(item.amount * item.quantity).toLocaleString()}원</td>
                                            <td>
                                                <Button className="me-2" variant="success" size="sm" onClick={() => handleOrder(item.purchase)} disabled={!isChecked}>
                                                    <Bag size={16} /> 주문
                                                </Button>
                                                <Button variant="danger" size="sm" onClick={() => handleRemoveFromCart(item.bookId)} disabled={!isChecked}>
                                                    <TrashFill size={16} /> 삭제
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </div>

                    
                    <Pagination className="justify-content-center mt-4">
                        <Pagination.Prev disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                            <ChevronLeft /> 이전
                        </Pagination.Prev>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <Pagination.Item key={index} active={currentPage === index + 1} onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                            다음 <ChevronRight />
                        </Pagination.Next>
                    </Pagination>
                </>
            )}
        </section>
    );
}
