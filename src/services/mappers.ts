'use strict';

export const asArray = (v: any): any[] => {
    if (Array.isArray(v)) return v;
    if (v === null || v === undefined || v === "") return [];
    try {
        const parsed = JSON.parse(v);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
};

export const asNumber = (v: any, fallback = 0): number => {
    const n = Number(v);
    return Number.isFinite(n) ? n : fallback;
};

export const cleanUser = (r: any) => {
    if (!r) return r;
    const { password_hash, ...rest } = r;
    return {
        id: rest.id,
        name: rest.name,
        email: rest.email,
        employeeId: rest.employee_id,
        department: rest.department,
        subDepartment: rest.sub_department ?? undefined,
        post: rest.post ?? undefined,
        role: rest.role,
        status: rest.status,
        lastActive: rest.last_active ?? "Never",
        color: rest.color,
    };
};

export const cleanTechnician = (r: any) => {
    if (!r) return r;
    const { password_hash, ...rest } = r;
    return {
        id: rest.id,
        name: rest.name,
        email: rest.email,
        employeeId: rest.employee_id,
        specialization: rest.specialization,
        availability: rest.availability,
        status: rest.status,
        activeTickets: asNumber(rest.active_tickets),
        resolvedTickets: asNumber(rest.resolved_tickets),
        phone: rest.phone ?? undefined,
        lastActive: rest.last_active ?? undefined,
        color: rest.color ?? undefined,
    };
};

export const toDepartment = (r: any) => ({
    id: r.id,
    name: r.name,
    code: r.code,
    manager: r.manager,
    status: r.status,
    color: r.color,
    subDepartments: [],
});

export const toSubDepartment = (r: any) => ({
    id: r.id,
    departmentId: r.department_id,
    parentSubDepartmentId: r.parent_sub_id ?? null,
    name: r.name,
    code: r.code,
    manager: r.manager,
    users: asNumber(r.users_count),
    status: r.status,
    color: r.color,
    children: [],
});

export const toCategory = (r: any) => ({
    id: r.id,
    name: r.name,
    description: r.description ?? "",
    items: asNumber(r.items_count),
    color: r.color,
});

export const toItem = (r: any) => ({
    id: r.id,
    deviceName: r.device_name,
    brand: r.brand ?? "",
    type: r.type ?? "C",
    maintenanceType: r.maintenance_type ?? "SER",
    dateOfVintage: r.date_of_vintage ?? undefined,
    category: r.category ?? "",
    notes: r.notes ?? undefined,
    sku: r.sku,
    quantity: asNumber(r.quantity),
    status: r.status,
    lastUpdated: r.last_updated,
    createdAt: r.created_at,
    department: r.department ?? "",
    cpuType: r.cpu_type ?? undefined,
});

export const toStockIn = (r: any) => ({
    id: r.id,
    workOrderId: r.work_order_id,
    jobNo: r.job_no,
    dateIn: r.date_in,
    dateOut: r.date_out ?? null,
    remarks: r.remarks ?? null,
    defect: r.defect ?? null,
    technicianName: r.technician_name ?? null,
    secIcName: r.sec_ic_name ?? null,
    supplier: r.supplier ?? "",
    itemId: r.item_id ?? "",
    itemName: r.item_name ?? "",
    productType: r.product_type ?? "C",
    quantity: asNumber(r.quantity),
    department: r.department ?? "",
    createdBy: r.created_by ?? "",
    status: r.status,
});

export const toStockOut = (r: any) => ({
    id: r.id,
    reference: r.reference,
    date: r.date,
    itemId: r.item_id ?? "",
    itemName: r.item_name ?? "",
    recipient: r.recipient ?? "",
    department: r.department ?? "",
    purpose: r.purpose ?? "",
    quantity: asNumber(r.quantity),
    status: r.status,
});

export const toTransaction = (r: any) => ({
    id: r.id,
    type: r.type,
    reference: r.reference ?? "",
    itemId: r.item_id ?? "",
    itemName: r.item_name ?? "",
    category: r.category ?? undefined,
    quantity: asNumber(r.quantity),
    department: r.department ?? "",
    toDepartment: r.to_department ?? undefined,
    supplier: r.supplier ?? undefined,
    createdBy: r.created_by ?? "",
    date: r.date,
    note: r.note ?? undefined,
});

export const toIssue = (r: any) => ({
    id: r.id,
    assetId: r.asset_id ?? undefined,
    title: r.title,
    description: r.description ?? undefined,
    priority: r.priority,
    status: r.status,
    assignedTo: r.assigned_to ?? undefined,
    createdAt: r.created_at,
    resolvedAt: r.resolved_at ?? undefined,
    resolution: r.resolution ?? undefined,
});

export const toTicket = (r: any, issues: any[] = []) => ({
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    customer: r.customer ?? undefined,
    category: r.category ?? "General",
    priority: r.priority,
    department: r.department ?? "",
    subDepartment: r.sub_department ?? undefined,
    createdBy: r.created_by ?? "",
    createdAt: r.created_at,
    status: r.status,
    assets: [],
    issues,
    itemIds: asArray(r.item_ids),
    closedBy: r.closed_by ?? undefined,
    closedAt: r.closed_at ?? undefined,
    resolution: r.resolution ?? undefined,
    technicianId: r.technician_id ?? undefined,
    technicianRemark: r.technician_remark ?? undefined,
    completedAt: r.completed_at ?? undefined,
    submittedAt: r.submitted_at ?? undefined,
    reissueCount: asNumber(r.reissue_count),
    lastReissueNote: r.last_reissue_note ?? undefined,
});

export const toActivity = (r: any) => ({
    id: r.id,
    user: r.user_name ?? "",
    action: r.action ?? "",
    module: r.module ?? "",
    item: r.item ?? "",
    department: r.department ?? "",
    date: r.date,
});

export const sqlDate = (v: any): string => {
    if (!v) return new Date().toISOString().slice(0, 19).replace("T", " ");
    const d = new Date(v);
    if (isNaN(d.getTime())) return new Date().toISOString().slice(0, 19).replace("T", " ");
    return d.toISOString().slice(0, 19).replace("T", " ");
};
