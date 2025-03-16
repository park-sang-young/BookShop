import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // 환경 변수에서 MongoDB URI 가져오기
let connectDB;

if (!uri) {
  throw new Error("Please add your Mongo URI to .env.local");
}

if (process.env.NODE_ENV === 'development') {
  // 개발 환경에서는 전역 변수에 클라이언트를 캐싱
  if (!global._mongo) {
    global._mongo = new MongoClient(uri).connect();
  }
  connectDB = global._mongo;
} else {
  // 프로덕션 환경에서는 새로운 클라이언트를 생성
  connectDB = new MongoClient(uri).connect();
}

export { connectDB };
