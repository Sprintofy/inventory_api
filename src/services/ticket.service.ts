'use strict';
import ticketModel from '../models/ticket.model';
import systemModel from '../models/system.model';
import { toTicket, toIssue, toActivity, asNumber, sqlDate } from "./mappers";

const byName = (req: any) => {
    return (req.user && req.user.name) || "Admin";
};

const log = async (req: any, action: string, module: string, item: string, department: string) => {
    const act = {
        id: `ACT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        user_name: byName(req), action, module, item,
        department: department || "-", date: sqlDate(new Date()),
    };
    await systemModel.createActivity({
        id: act.id, user_name: act.user_name, action: act.action,
        module: act.module, item: act.item, department: act.department, date: act.date,
    });
    return toActivity(act);
};

const withIssues = async (rows: any[]) => {
    const all: any = await ticketModel.listAllIssues();
    const byTicket = new Map<string, any[]>();
    for (const r of all) {
        const list = byTicket.get(r.ticket_id) || [];
        list.push(toIssue(r));
        byTicket.set(r.ticket_id, list);
    }
    return rows.map((r: any) => toTicket(r, byTicket.get(r.id) || []));
};

const list = async () => {
    const rows: any = await ticketModel.listTickets();
    return withIssues(rows);
};

const toRow = (b: any, extra: any = {}) => ({
    id: b.id,
    title: b.title,
    description: b.description || null,
    customer: b.customer || null,
    category: b.category || "General",
    priority: b.priority || "medium",
    department: b.department || "",
    sub_department: b.subDepartment || b.sub_department || null,
    created_by: b.createdBy || b.created_by || "",
    created_at: sqlDate(b.createdAt || b.created_at || new Date()),
    status: b.status || "open",
    item_ids: JSON.stringify(b.itemIds || b.item_ids || []),
    closed_by: b.closedBy || b.closed_by || null,
    closed_at: b.closedAt || b.closed_at ? sqlDate(b.closedAt || b.closed_at) : null,
    resolution: b.resolution || null,
    technician_id: b.technicianId || b.technician_id || null,
    technician_remark: b.technicianRemark || b.technician_remark || null,
    completed_at: b.completedAt || b.completed_at ? sqlDate(b.completedAt || b.completed_at) : null,
    submitted_at: b.submittedAt || b.submitted_at ? sqlDate(b.submittedAt || b.submitted_at) : null,
    reissue_count: asNumber(b.reissueCount ?? b.reissue_count),
    last_reissue_note: b.lastReissueNote || b.last_reissue_note || null,
    ...extra,
});

const create = async (req: any) => {
    const b = req.body || {};
    const now = sqlDate(new Date());
    const row = toRow({ ...b, createdBy: byName(req), createdAt: now, status: "open" });
    await ticketModel.createTicket(row);
    const issues = Array.isArray(b.issues) ? b.issues : [];
    for (const iss of issues) {
        await ticketModel.createIssue({
            id: iss.id, ticket_id: row.id, asset_id: iss.assetId || iss.asset_id || null,
            title: iss.title, description: iss.description || null,
            priority: iss.priority || "medium", status: iss.status || "open",
            assigned_to: iss.assignedTo || iss.assigned_to || null,
            created_at: sqlDate(iss.createdAt || iss.created_at || now),
            resolved_at: iss.resolvedAt || iss.resolved_at ? sqlDate(iss.resolvedAt || iss.resolved_at) : null,
            resolution: iss.resolution || null,
        });
    }
    await log(req, "generated ticket", "Tickets", b.title || "", b.department || "");
    const listed: any = await ticketModel.listTickets();
    const found = listed.find((t: any) => t.id === row.id);
    const issRows: any = await ticketModel.listIssues(row.id);
    return toTicket(found, issRows.map(toIssue));
};

const patch = async (req: any) => {
    const id = req.params.id;
    const b = req.body || {};
    const data: any = {};
    const map: any = { title: "title", description: "description", customer: "customer", category: "category", priority: "priority", department: "department", subDepartment: "sub_department", sub_department: "sub_department", status: "status", closedBy: "closed_by", closed_by: "closed_by", closedAt: "closed_at", closed_at: "closed_at", resolution: "resolution", technicianId: "technician_id", technician_id: "technician_id", technicianRemark: "technician_remark", technician_remark: "technician_remark", completedAt: "completed_at", completed_at: "completed_at", submittedAt: "submitted_at", submitted_at: "submitted_at", reissueCount: "reissue_count", reissue_count: "reissue_count", lastReissueNote: "last_reissue_note", last_reissue_note: "last_reissue_note", createdBy: "created_by" };
    for (const k of Object.keys(map)) {
        if (b[k] !== undefined) data[map[k]] = b[k] === null ? null : b[k];
    }
    if (b.itemIds !== undefined) data.item_ids = JSON.stringify(b.itemIds || []);
    if (b.item_ids !== undefined && !Array.isArray(b.item_ids)) data.item_ids = b.item_ids;
    for (const dk of ["closed_at", "completed_at", "submitted_at"]) {
        if (data[dk]) data[dk] = sqlDate(data[dk]);
    }
    if (Object.keys(data).length > 0) await ticketModel.updateTicket(id, data);
    const listed: any = await ticketModel.listTickets();
    const found = listed.find((t: any) => t.id === id);
    const issRows: any = await ticketModel.listIssues(id);
    return toTicket(found, issRows.map(toIssue));
};

const addIssue = async (req: any) => {
    const ticketId = req.params.id;
    const b = req.body || {};
    const now = sqlDate(new Date());
    const row = {
        id: b.id, ticket_id: ticketId, asset_id: b.assetId || b.asset_id || null,
        title: b.title, description: b.description || null,
        priority: b.priority || "medium", status: b.status || "open",
        assigned_to: b.assignedTo || b.assigned_to || null,
        created_at: sqlDate(b.createdAt || b.created_at || now),
        resolved_at: b.resolvedAt || b.resolved_at ? sqlDate(b.resolvedAt || b.resolved_at) : null,
        resolution: b.resolution || null,
    };
    await ticketModel.createIssue(row);
    return toIssue(row);
};

const updateIssue = async (req: any) => {
    const id = req.params.issueId;
    const b = req.body || {};
    const data: any = {};
    const map: any = { title: "title", description: "description", priority: "priority", status: "status", assignedTo: "assigned_to", assigned_to: "assigned_to", assetId: "asset_id", asset_id: "asset_id", resolution: "resolution" };
    for (const k of Object.keys(map)) {
        if (b[k] !== undefined) data[map[k]] = b[k] === null ? null : b[k];
    }
    if (b.resolvedAt !== undefined) data.resolved_at = b.resolvedAt ? sqlDate(b.resolvedAt) : null;
    if (b.resolved_at !== undefined) data.resolved_at = b.resolved_at ? sqlDate(b.resolved_at) : null;
    if (Object.keys(data).length > 0) await ticketModel.updateIssue(id, data);
    return { id, ...b };
};

const removeIssue = async (req: any) => {
    await ticketModel.deleteIssue(req.params.issueId);
    return { id: req.params.issueId };
};

const close = async (req: any) => {
    const id = req.params.id;
    const b = req.body || {};
    const now = sqlDate(new Date());
    const resolvedIds: string[] = b.resolvedIssueIds || b.resolved_issue_ids || [];
    const issRows: any = await ticketModel.listIssues(id);
    for (const iss of issRows) {
        if (resolvedIds.includes(iss.id)) {
            await ticketModel.updateIssue(iss.id, {
                status: "resolved",
                resolved_at: iss.resolved_at || now,
                resolution: iss.resolution || b.resolution || null,
            });
        }
    }
    await ticketModel.updateTicket(id, {
        status: "closed", closed_by: b.closedBy || byName(req), closed_at: now,
        resolution: b.resolution || null,
    });
    const listed: any = await ticketModel.listTickets();
    const found = listed.find((t: any) => t.id === id);
    const fresh: any = await ticketModel.listIssues(id);
    await log(req, "closed ticket", "Tickets", found ? found.title : "", found ? found.department : "");
    return toTicket(found, fresh.map(toIssue));
};

const reissue = async (req: any) => {
    const id = req.params.id;
    const b = req.body || {};
    const listed: any = await ticketModel.listTickets();
    const found = listed.find((t: any) => t.id === id);
    if (!found) throw new Error("Ticket not found");
    const issRows: any = await ticketModel.listIssues(id);
    for (const iss of issRows) {
        await ticketModel.updateIssue(iss.id, { status: "open", resolved_at: null, resolution: null });
    }
    await ticketModel.updateTicket(id, {
        status: "in-progress", completed_at: null, submitted_at: null,
        reissue_count: asNumber(found.reissue_count) + 1,
        last_reissue_note: (b.note || "").trim() || null,
    });
    const fresh: any = await ticketModel.listIssues(id);
    const relisted: any = await ticketModel.listTickets();
    const updated = relisted.find((t: any) => t.id === id);
    await log(req, "re-issued ticket to technician", "Tickets", found.title, found.department);
    return toTicket(updated, fresh.map(toIssue));
};

const assign = async (req: any) => {
    const id = req.params.id;
    const b = req.body || {};
    await ticketModel.updateTicket(id, { technician_id: b.technicianId || b.technician_id || null });
    const listed: any = await ticketModel.listTickets();
    const found = listed.find((t: any) => t.id === id);
    const issRows: any = await ticketModel.listIssues(id);
    return toTicket(found, issRows.map(toIssue));
};

const remark = async (req: any) => {
    const id = req.params.id;
    await ticketModel.updateTicket(id, { technician_remark: req.body.remark || null });
    return { id };
};

const submitSolution = async (req: any) => {
    const id = req.params.id;
    const b = req.body || {};
    const now = sqlDate(new Date());
    const resolutions: Record<string, string> = b.issueResolutions || b.issue_resolutions || {};
    const issRows: any = await ticketModel.listIssues(id);
    for (const iss of issRows) {
        const own = (resolutions[iss.id] || "").trim();
        if (iss.status === "resolved" || iss.status === "closed") {
            if (own) await ticketModel.updateIssue(iss.id, { resolution: own });
            continue;
        }
        await ticketModel.updateIssue(iss.id, {
            status: "resolved", resolved_at: now,
            resolution: own || iss.resolution || b.remark || null,
        });
    }
    const pending = issRows.filter((i: any) => i.status === "open" || i.status === "in-progress");
    const summary = (b.remark || "").trim() || pending.map((i: any) => `${i.title}: ${(resolutions[i.id] || "").trim()}`).join("\n");
    await ticketModel.updateTicket(id, {
        status: "work-completed", technician_remark: summary,
        submitted_at: now, completed_at: now,
    });
    const listed: any = await ticketModel.listTickets();
    const found = listed.find((t: any) => t.id === id);
    const fresh: any = await ticketModel.listIssues(id);
    await log(req, "submitted ticket as resolved", "Tickets", found ? found.title : "", found ? found.department : "");
    return toTicket(found, fresh.map(toIssue));
};

export default {
    list,
    create,
    patch,
    addIssue,
    updateIssue,
    removeIssue,
    close,
    reissue,
    assign,
    remark,
    submitSolution,
}
