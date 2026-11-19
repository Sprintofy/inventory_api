'use strict';
import mysql from './dbConnection';
import { Connection } from 'mysql2/promise';

class BaseModel {
    constructor() {}

    async _executeQuery(query: string, params: Array<any>) {
        return await mysql.execute_query(query, params);
    }

    async _getConnection(): Promise<Connection> {
        return await mysql.getConnection();
    }

    async _executeQueryTransaction(sqlConnection: Connection, query: string, params: Array<any>) {
        return await mysql.execute_query_transaction(sqlConnection, query, params);
    }

    async _beginTransaction(sqlConnection: Connection) {
        return await mysql.begin_transaction(sqlConnection);
    }

    async _commitTransaction(sqlConnection: Connection) {
        return await mysql.commit_transaction(sqlConnection);
    }

    async _rollbackTransaction(sqlConnection: Connection) {
        return await mysql.rollback_transaction(sqlConnection);
    }

    async _releaseConnection(sqlConnection: Connection) {
        return await mysql.releaseConnection(sqlConnection);
    }

    async getMaxId(table: string, column: string): Promise<{ maxId: string | null }> {
        // Validate table and column names to prevent SQL injection
        // Only allow alphanumeric and underscore
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table) || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(column)) {
            throw new Error('Invalid table or column name');
        }
        const rows: any = await this._executeQuery(`SELECT MAX(${column}) as maxId FROM ${table}`, []);
        return rows[0];
    }
}

export default BaseModel;
