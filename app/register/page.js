'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button, Form, Container, Card, Spinner, Breadcrumb } from "react-bootstrap";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const router = useRouter();

    // 회원가입 핸들러
    const handleRegister = async (e) => {
        e.preventDefault();

        // 비밀번호 유효성 체크
        if (password.length < 6) {
            alert("❌ 비밀번호는 최소 6자 이상 입력해야 합니다.");
            return;
        }

        // 이메일 유효성 체크
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("❌ 유효한 이메일을 입력해 주세요.");
            return;
        }

        setLoading(true);
        setErrorMessage("");
        setSuccessMessage("");

        try {
            const response = await axios.post("/api/auth/signup", { name, email, password });

            if (response.status === 200) {
                setSuccessMessage("✅ 회원가입이 완료되었습니다! 🎉");
                setTimeout(() => {
                    router.push("/"); // 홈으로 이동
                }, 2000); // 2초 후에 홈으로 이동
            }
        } catch (error) {
            if (error.response) {
                setErrorMessage(`❌ 오류: ${error.response.data.error}`);
            } else {
                setErrorMessage("❌ 알 수 없는 오류가 발생했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };
    const handleGoHome = () => {
        router.push('/'); // 이전 페이지로 이동
    };

    return (
        <section className="py-4 container register-area">
        <Breadcrumb className="breadcrumb-area">
                <Breadcrumb.Item onClick={handleGoHome}>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Register</Breadcrumb.Item>
            </Breadcrumb>
            <h1 className="mb-4">Join the membership</h1>
        <Container className="d-flex flex-column justify-content-center align-items-center">
            <Card className="shadow-lg rounded p-4" style={{ maxWidth: "500px", width: "100%", backgroundColor: "#ffffff", borderRadius: '12px', border: '1px solid #ddd' }}>
                <Card.Body>
                    <h2 className="text-center mb-4 fw-bold" style={{ color: '#1e7e34' }}>회원가입</h2>

                    {/* 성공 메시지 */}
                    {successMessage && (
                        <div className="alert alert-success text-center mb-4" style={{ animation: 'fadeIn 2s' }}>
                            {successMessage}
                        </div>
                    )}

                    {/* 에러 메시지 */}
                    {errorMessage && <div className="alert alert-danger text-center mb-4">{errorMessage}</div>}

                    <Form onSubmit={handleRegister}>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">이름</Form.Label>
                            <Form.Control
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="이름을 입력하세요"
                                className="form-control-lg shadow-sm"
                                style={{
                                    borderRadius: '8px',
                                    borderColor: '#1e7e34',
                                    borderWidth: '2px'
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label className="fw-semibold">이메일</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="이메일을 입력하세요"
                                className="form-control-lg shadow-sm"
                                style={{
                                    borderRadius: '8px',
                                    borderColor: '#1e7e34',
                                    borderWidth: '2px'
                                }}
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label className="fw-semibold">비밀번호</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                                placeholder="6자 이상 입력하세요"
                                className="form-control-lg shadow-sm"
                                style={{
                                    borderRadius: '8px',
                                    borderColor: '#1e7e34',
                                    borderWidth: '2px'
                                }}
                            />
                        </Form.Group>

                        <Button
                            variant="success"
                            type="submit"
                            className="w-100 fw-bold py-2"
                            disabled={loading || !name || !email || password.length < 6}
                            style={{
                                backgroundColor: '#1e7e34',
                                border: 'none',
                                borderRadius: '8px',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.background = '#155724'}
                            onMouseLeave={(e) => e.target.style.background = '#1e7e34'}
                        >
                            {loading ? <Spinner animation="border" size="sm" /> : "회원가입"}
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
        </section>
    );
}
