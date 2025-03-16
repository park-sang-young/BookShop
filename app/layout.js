import { Geist, Geist_Mono } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import './globals.css';
import "@fortawesome/fontawesome-svg-core/styles.css"; // FontAwesome CSS
import { config } from "@fortawesome/fontawesome-svg-core";
import Script from 'next/script'; // Script 컴포넌트
import Providers from './Providers'; // Redux, NextAuth 제공자
import NavBar from './Navbar'; // Navbar 컴포넌트
import Footer from './Footer'; // Footer 컴포넌트 추가

config.autoAddCss = false; // FontAwesome에서 CSS 자동 추가 방지

// Geist 폰트
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* 제목, 메타태그 추가할 수 있습니다. */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* Bootstrap JavaScript 로드 */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
          crossOrigin="anonymous"
          strategy="afterInteractive" // 로딩 최적화
        />
        
        {/* Redux와 NextAuth 세션 관리 적용 */}
        <Providers>
          {/* Navbar 렌더링 */}
          <header>
            <NavBar />
          </header>

          {/* 페이지 컨텐츠 */}
          <main>
            {children}
          </main>

          {/* Footer 컴포넌트 렌더링 */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
