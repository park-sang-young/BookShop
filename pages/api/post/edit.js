import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        const { _id, title, content, createdAt } = req.body; // 요청 본문에서 _id, title, content 추출
        const change = { title, content, createdAt }; // 변경할 데이터 객체 생성
        const db = (await connectDB).db("book");

        const result = await db.collection('review').updateOne(
            { _id: new ObjectId(_id) },
            { $set: change }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "리뷰를 찾을 수 없습니다." });
        }

        // 수정된 리뷰 정보를 클라이언트에 반환
        return res.status(200).json({ message: "리뷰가 성공적으로 수정되었습니다." });
        
    } catch (error) {
        console.error("리뷰 저장 오류:", error);
        return res.status(500).json({ error: "서버 오류 발생" });
    }
}
