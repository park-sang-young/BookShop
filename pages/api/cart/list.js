import { connectDB } from "@/util/database";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(req, res) {
    let session = await getServerSession(req, res, authOptions)
    
    const db = (await connectDB).db('book');
    let result = await db.collection('cart').find({ email :  session.user.email }).toArray()
    res.status(200).json(result)
}