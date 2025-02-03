import Cors from 'cors';
import { NextRequest } from 'next/server';

// Initialize CORS
const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  origin: '*', // Change to your allowed origin(s) if needed
  allowedHeaders: ['Content-Type', 'Authorization'],
});

// Helper function to run CORS middleware
export const runCors = (req: NextRequest) => {
  return new Promise((resolve, reject) => {
    const corsReq = {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
      url: req.url,
    };

    cors(corsReq, {
      statusCode: 200,
      setHeader: (key: string, value: string) => {}, // Placeholder for setting headers
      end: () => {}, // Placeholder for ending the request
    }, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
};
