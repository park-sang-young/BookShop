import { connectDB } from "@/util/database";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        let session = await getServerSession(req, res, authOptions);

        if (!session) {
            return res.status(401).json({ message: "로그인이 필요합니다." });
        }

        const { bookId } = req.query; // URL 파라미터에서 bookId 추출
        const db = (await connectDB).db('book');

        try {
            // 장바구니에서 해당 책 삭제
            const result = await db.collection('cart').deleteOne({
                email: session.user.email,
                bookId: bookId, // 삭제할 책의 ID
            });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: "책을 찾을 수 없습니다." });
            }

            res.status(200).json({ message: "책이 성공적으로 삭제되었습니다." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "서버에서 오류가 발생했습니다." });
        }
    } else {
        res.status(405).json({ message: "허용되지 않은 메소드입니다." });
    }
}
