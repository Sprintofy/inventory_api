'use strict';
import BaseModel from "./dbConnection/base.model";

class TicketModel extends BaseModel {
    constructor() {
        super();
    }

    async listTickets() {
        return await this._executeQuery("SELECT * FROM tickets ORDER BY created_at DESC;", []);
    }

    async createTicket(data: any) {
        return await this._executeQuery("INSERT INTO tickets SET ?;", [data]);
    }

    async updateTicket(id: string, data: any) {
        return await this._executeQuery("UPDATE tickets SET ? WHERE id = ?;", [data, id]);
    }

    async listIssues(ticketId: string) {
        return await this._executeQuery("SELECT * FROM ticket_issues WHERE ticket_id = ? ORDER BY created_at ASC;", [ticketId]);
    }

    async listAllIssues() {
        return await this._executeQuery("SELECT * FROM ticket_issues ORDER BY created_at ASC;", []);
    }

    async createIssue(data: any) {
        return await this._executeQuery("INSERT INTO ticket_issues SET ?;", [data]);
    }

    async updateIssue(id: string, data: any) {
        return await this._executeQuery("UPDATE ticket_issues SET ? WHERE id = ?;", [data, id]);
    }

    async deleteIssue(id: string) {
        return await this._executeQuery("DELETE FROM ticket_issues WHERE id = ?;", [id]);
    }

    async getTicketHistory(itemId: string) {
        return await this._executeQuery(
            "SELECT * FROM tickets WHERE JSON_CONTAINS(item_ids, CAST(? AS JSON)) ORDER BY created_at DESC;",
            [`"${itemId}"`],
        );
    }

    async getMaxTicketSeq(deptCode: string) {
        return await this._executeQuery(
            "SELECT MAX(CAST(SUBSTRING_INDEX(SUBSTRING_INDEX(id, '/', 2), '/', -1) AS UNSIGNED)) as maxSeq FROM tickets WHERE id LIKE ?;",
            [`${deptCode}/%`],
        );
    }
}

export default new TicketModel()
