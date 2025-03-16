
import { faBook } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TabsMenu from "./TabsMenu";
import Search from "./Search";
import MonthAuthor from "./HanAuthor";
import HanAuthor from "./HanAuthor";
import MonthBook from "./LatestBook";
import LatestBook from "./LatestBook";


export default async function Home() {
  return (
    <>      
        {/* 헤더 영역 */}
        <div className="d-flex justify-content-around book-background">
            <div className="d-flex flex-column align-items-center">
                <h1 className="header-title">
                    <FontAwesomeIcon icon={faBook} className="me-2" />
                    Have a peaceful day with a book today too
                </h1>

                <Search></Search>
            </div>            
        </div>
        <div className='contents-area'>
            <TabsMenu />
            <LatestBook />
            <HanAuthor />
        </div>
      
    </>
  );
}
