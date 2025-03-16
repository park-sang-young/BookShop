import { connectDB } from "@/util/database";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
    if (req.method === "POST") {
        try {
            const db = (await connectDB).db("book");

            // 입력값 검증
            if (!req.body.name) {
                return res.status(400).json({ error: "이름을 입력해 주세요." });
            }
            if (!req.body.email) {
                return res.status(400).json({ error: "이메일을 입력해 주세요." });
            }
            if (!req.body.password) {
                return res.status(400).json({ error: "패스워드를 입력해 주세요." });
            }

            // 이메일 형식 검증
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailRegex.test(req.body.email)) {
                return res.status(400).json({ error: "올바른 이메일 형식이 아닙니다." });
            }

            // 이메일 중복 검사
            const existingUser = await db.collection("user_cred").findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(409).json({ error: "이미 사용 중인 이메일입니다." }); // 📌 409 Conflict 사용
            }

            // 비밀번호 해싱 후 저장
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await db.collection("user_cred").insertOne({ 
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            });

            // 회원가입 완료 응답
            return res.status(200).json({ message: "회원가입이 완료되었습니다." });

        } catch (error) {
            console.error("서버 오류:", error);
            return res.status(500).json({ error: "서버 오류 발생" });
        }
    } else {
        return res.status(405).json({ error: "허용되지 않은 요청" });
    }
}
