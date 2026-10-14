'use strict';
import catalogModel from '../models/catalog.model';
import { toCategory, toSupplier, asArray, asNumber } from "./mappers";

const listCategories = async () => {
    const rows: any = await catalogModel.listCategories();
    return rows.map(toCategory);
};

const createCategory = async (req: any) => {
    const b = req.body || {};
    const row = { id: b.id, name: b.name, description: b.description || "", items_count: asNumber(b.items ?? b.items_count), color: b.color || "#4f46e5" };
    await catalogModel.createCategory(row);
    return toCategory({ ...row, items_count: row.items_count });
};

const updateCategory = async (req: any) => {
    const id = req.params.id;
    const b = req.body || {};
    const data: any = {};
    if (b.name !== undefined) data.name = b.name;
    if (b.description !== undefined) data.description = b.description;
    if (b.items !== undefined) data.items_count = asNumber(b.items);
    if (b.items_count !== undefined) data.items_count = asNumber(b.items_count);
    if (b.color !== undefined) data.color = b.color;
    if (Object.keys(data).length > 0) await catalogModel.updateCategory(id, data);
    return { id, ...b };
};

const removeCategory = async (req: any) => {
    await catalogModel.deleteCategory(req.params.id);
    return { id: req.params.id };
};

const listSuppliers = async () => {
    const rows: any = await catalogModel.listSuppliers();
    return rows.map(toSupplier);
};

const createSupplier = async (req: any) => {
    const b = req.body || {};
    const row = {
        id: b.id, name: b.name, contact_person: b.contactPerson || b.contact_person || "",
        email: b.email || "", phone: b.phone || "", address: b.address || null,
        categories: JSON.stringify(asArray(b.categories)), items_supplied: asNumber(b.itemsSupplied ?? b.items_supplied),
        purchase_orders: asNumber(b.purchaseOrders ?? b.purchase_orders), total_spend: asNumber(b.totalSpend ?? b.total_spend),
        status: b.status || "active", rating: asNumber(b.rating),
    };
    await catalogModel.createSupplier(row);
    return toSupplier({ ...row });
};

const updateSupplier = async (req: any) => {
    const id = req.params.id;
    const b = req.body || {};
    const data: any = {};
    if (b.name !== undefined) data.name = b.name;
    if (b.contactPerson !== undefined) data.contact_person = b.contactPerson;
    if (b.contact_person !== undefined) data.contact_person = b.contact_person;
    if (b.email !== undefined) data.email = b.email;
    if (b.phone !== undefined) data.phone = b.phone;
    if (b.address !== undefined) data.address = b.address || null;
    if (b.categories !== undefined) data.categories = JSON.stringify(asArray(b.categories));
    if (b.itemsSupplied !== undefined) data.items_supplied = asNumber(b.itemsSupplied);
    if (b.items_supplied !== undefined) data.items_supplied = asNumber(b.items_supplied);
    if (b.purchaseOrders !== undefined) data.purchase_orders = asNumber(b.purchaseOrders);
    if (b.purchase_orders !== undefined) data.purchase_orders = asNumber(b.purchase_orders);
    if (b.totalSpend !== undefined) data.total_spend = asNumber(b.totalSpend);
    if (b.total_spend !== undefined) data.total_spend = asNumber(b.total_spend);
    if (b.status !== undefined) data.status = b.status;
    if (b.rating !== undefined) data.rating = asNumber(b.rating);
    if (Object.keys(data).length > 0) await catalogModel.updateSupplier(id, data);
    return { id, ...b };
};

const removeSupplier = async (req: any) => {
    await catalogModel.deleteSupplier(req.params.id);
    return { id: req.params.id };
};

export default {
    listCategories,
    createCategory,
    updateCategory,
    removeCategory,
    listSuppliers,
    createSupplier,
    updateSupplier,
    removeSupplier,
}
