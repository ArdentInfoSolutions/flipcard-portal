import { Pool } from "pg";

// PostgreSQL Connection Config
const pool = new Pool({
    host: 'ec2-16-171-14-2.eu-north-1.compute.amazonaws.com',
    port: 5432,
    user: 'flipcarddbuser',
    password: '$safetymindsUK',
    database: 'flipcard',
    ssl: { rejectUnauthorized: false }, // for cloud PostgreSQL connections
});

export const query = async (text: string, params?: any[]) => {
    const client = await pool.connect();
    try {
        console.log("Executing query:", text);
        const result = await client.query(text, params);
        return result.rows;
    } catch (error) {
        console.error("Database Error:", error);
        throw error;
    } finally {
        client.release();
    }
};
