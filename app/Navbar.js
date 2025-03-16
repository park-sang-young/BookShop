'use client'
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Container, Navbar, Nav, Button } from 'react-bootstrap';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightFromBracket, faRightToBracket, faUser, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import Search from './Search'; // Search 컴포넌트 import

export default function NavBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isSticky, setIsSticky] = useState(false);
  const [showSearch, setShowSearch] = useState(false); // Search 표시 여부

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsSticky(scrollY > 66);
      setShowSearch(scrollY > 150); 
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    const userConfirmed = confirm("로그아웃 하시겠습니까?");
    if (userConfirmed) {
      await signOut({ redirect: false });
      alert("로그아웃되었습니다.");
      router.push("/");
    }
  };

  const handleMembership = async () => {
      router.push("/register");
}

  const handleCartClick = () => {
    if (!session) {
      alert("로그인 후 이용해 주세요.");
      router.push("/api/auth/signin");
    } else {
      router.push("/cart");
    }
  };

  return (
    <>
      <Navbar expand="lg" className={`bg-white ${isSticky ? 'fixed-top shadow' : ''} header-nav`}>
        <Container>
          <Navbar.Brand as={Link} href="/" className="m-0 me-3">
            <div className="main-logo d-flex">
              <div className="d-flex align-items-center">
                <p className='book-logo'>
                  <span>ParkBOOK</span> store
                </p>
              </div>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} href="/">Home</Nav.Link>
              <Nav.Link as="button" style={{ textAlign: 'left' }} onClick={handleCartClick}>Cart</Nav.Link>
            </Nav>

            {/* 기본적으로 pathname이 '/'가 아닐 때는 Search 표시, 스크롤 시에도 표시 */}
            {(pathname !== '/' || showSearch) && <Search isInNavbar={true} />}

            {session ? (
              <div className='user-info'>
                
                <span className="me-3 user-name"><FontAwesomeIcon icon={faUser} style={{ color: '#212121' }} /> {session.user.name || 'User'}!!</span>
                <span style={{ color: 'gray' }}>|</span>
                <Button className="ms-3 p-0 log-btn" onClick={handleSignOut}>
                  <span>
                    <FontAwesomeIcon icon={faRightFromBracket} /> 로그아웃
                  </span>
                </Button>
                <Button className='ms-5 membership-btn' onClick={handleMembership}>                    
                    <span>
                        <FontAwesomeIcon icon={faUserPlus} /> 회원가입
                    </span>
                </Button>
              </div>
            ) : (
              <>
                <div className='user-info02 d-flex'>
                    <Button className="p-0 log-btn" onClick={() => signIn()}>
                    <span>
                        <FontAwesomeIcon icon={faRightToBracket} /> 로그인
                    </span>
                    </Button>
                    <Button className='ms-4 membership-btn02' onClick={handleMembership}>                    
                        <span>
                            <FontAwesomeIcon icon={faUserPlus} /> 회원가입
                        </span>
                    </Button>
                </div>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}
