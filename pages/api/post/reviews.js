import { connectDB } from "@/util/database";

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    try {
        const db = (await connectDB).db("book");
        const bookId = req.query.bookId; // 🔥 bookId 가져오기

        console.log("📌 API 요청된 bookId:", bookId); // ✅ 로그 확인

        if (!bookId) {
            return res.status(400).json({ message: "bookId가 제공되지 않았습니다." });
        }

        const result = await db.collection("review").find({ bookId :bookId }).toArray(); // 🔥 MongoDB에서 bookId로 검색

        console.log("📌 불러온 리뷰 데이터:", result); // ✅ 응답 데이터 확인

        res.status(200).json(result);
    } catch (error) {
        console.error("📌 리뷰 불러오기 오류:", error);
        res.status(500).json({ message: "서버 오류 발생" });
    }
}
