// pages/api/books.js
export default async function handler(req, res) {
    const { query } = req.query;
  
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }
  
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY;
    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&key=${apiKey}`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch data" });
    }
  }
  