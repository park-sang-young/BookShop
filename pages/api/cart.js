import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { connectDB } from '../../util/database';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "You must be logged in." });
  }

  const client = await connectDB;
  const db = client.db('shop');

  if (req.method === 'GET') {
    const cartItems = await db.collection('cart').find({ userId: session.user.id }).toArray();
    res.status(200).json(cartItems);
  } else if (req.method === 'POST') {
    const book = { ...req.body, userId: session.user.id };
    const result = await db.collection('cart').insertOne(book);
    res.status(201).json({ ...book, _id: result.insertedId });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
