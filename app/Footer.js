"use client"; // 클라이언트 컴포넌트로 지정

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';

export default function Footer() {
  return (
    <footer className="bg-dark text-light" style={{ height: '146px' }}>
      <div className="container h-100 d-flex flex-column justify-content-center">
        <div className="row d-flex justify-content-between align-items-center w-100">
          {/* 저작권 및 사이트 정보 */}
          <div className="col-md-6 footer-website">
            <h5 className="mb-0 text-white">© 2025 Your Website</h5>
            <p className="mb-0 text-white">All rights reserved.</p>
          </div>

          {/* 사이트 링크 */}
          <div className="col-md-6 text-md-end footer-nav">
            <nav className='d-flex'>
              <a
                href="#"
                className="text-decoration-none text-light me-3 footer-link"
              >
                About Us
              </a>
              <a
                href="#"
                className="text-decoration-none text-light me-3 footer-link"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-decoration-none text-light me-3 footer-link"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-decoration-none text-light footer-link"
              >
                Contact
              </a>
            </nav>
          </div>
        </div>

        {/* 소셜 미디어 아이콘 */}
        <div className="text-center mt-2 social-area">
          <a
            href="#"
            target="_blank"
            className="text-decoration-none text-light me-4"
          >
            <FontAwesomeIcon icon={faFacebook} size="3x" />
          </a>
          <a
            href="#"
            target="_blank"
            className="text-decoration-none text-light me-4"
          >
            <FontAwesomeIcon icon={faTwitter} size="3x" />
          </a>
          <a
            href="#"
            target="_blank"
            className="text-decoration-none text-light"
          >
            <FontAwesomeIcon icon={faInstagram} size="3x" />
          </a>
        </div>
      </div>

    </footer>
  );
}
