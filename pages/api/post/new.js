import { connectDB } from "@/util/database";


export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        let db = (await connectDB).db("book"); // ✅ connectDB() 함수 실행
        let result = await db.collection("review").insertOne(req.body); // ✅ `await` 추가

        return res.status(200).json({ message: "리뷰가 등록되었습니다.", insertedId: result.insertedId }); // ✅ 응답 반환
    } catch (error) {
        console.error("리뷰 저장 오류:", error);
        return res.status(500).json({ error: "서버 오류 발생" });
    }
}
