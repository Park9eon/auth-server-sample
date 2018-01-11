import {createPool, Pool} from "mysql";

export let connectionPool: Pool;

export function dbConfig() {
    connectionPool = createPool({
        connectionLimit: 100,
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PWD,
        database: process.env.MYSQL_DB
    });
    connectionPool.on("connection", connection => {
        console.log(`Connection ${connection.threadId} connected`);
    });
    connectionPool.on("release", connection => {
        console.log(`Connection ${connection.threadId} released`);
    });
}
