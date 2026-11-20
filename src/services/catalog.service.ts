'use strict';
import catalogModel from '../models/catalog.model';
import { toCategory, asNumber } from "./mappers";

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

export default {
    listCategories,
    createCategory,
    updateCategory,
    removeCategory,
}
