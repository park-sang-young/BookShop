import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req, res) {
    let session = await getServerSession(req, res, authOptions);

    // 로그인되지 않은 경우 401 상태 코드 반환
    if (!session) {
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    if (req.method === "POST") {
        try {
            const { id, volumeInfo, saleInfo } = req.body;
            const db = (await connectDB).db("book");

            let cartItem = {
                bookId: id,
                title: volumeInfo.title,
                authors: volumeInfo.authors,
                description: volumeInfo.description,
                amount: saleInfo?.listPrice?.amount || 0, // 가격이 없을 경우 기본값 0
                imgSmall: volumeInfo.imageLinks?.smallThumbnail || "",
                imgMedium: volumeInfo.imageLinks?.thumbnail || "",
                email: session.user.email,
                purchase: saleInfo.buyLink,
                quantity: 1, // 기본 수량 1
            };

            // 장바구니에서 동일한 책이 있는지 확인
            const existingItem = await db.collection("cart").findOne({ bookId: id, email: session.user.email });

            if (existingItem) {
                // 동일한 책이 이미 존재하면 알림 메시지 반환 (수량 변경 X)
                return res.status(200).json({
                    message: "이미 장바구니에 있는 상품입니다.",
                    alreadyInCart: true, // 추가 정보 제공
                });
            } else {
                // 동일한 책이 없으면 새로 추가
                await db.collection("cart").insertOne(cartItem);
                return res.status(200).json({
                    message: "장바구니에 추가되었습니다.",
                    alreadyInCart: false,
                });
            }

        } catch (error) {
            console.error("장바구니 추가 오류:", error);
            return res.status(500).json({ message: "서버 오류 발생" });
        }
    }

    return res.status(405).json({ message: "허용되지 않은 요청 방식입니다." });
}
