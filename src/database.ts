import config from './config/config'

import { createPool } from 'mysql2/promise';

export async function connect() {
    const connection = await createPool({
        host: config.DB.HOST,
        user: config.DB.USER,
        database: config.DB.DATABASE,
        password: config.DB.PASSWORD,
        connectionLimit: 10
    });
    return connection;
}


