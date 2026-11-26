"use strict";
import { celebrate, Joi, Segments } from "celebrate";

/**
 * Input sanitization middleware
 * Removes potentially dangerous characters from input
 */
export const sanitizeInput = (req: any, res: any, next: any) => {
  const sanitize = (obj: any): any => {
    if (typeof obj === "string") {
      return obj
        .replace(/[<>]/g, "") // Remove < and >
        .replace(/javascript:/gi, "") // Remove javascript: protocol
        .replace(/on\w+=/gi, "") // Remove event handlers
        .trim();
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj && typeof obj === "object") {
      const sanitized: any = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }
  next();
};

/**
 * Validation schemas for common endpoints
 */
export const schemas = {
  // Auth validation
  login: {
    [Segments.BODY]: Joi.object().keys({
      email: Joi.string().email().required().messages({
        "string.email": "Please provide a valid email address",
        "any.required": "Email is required",
      }),
      password: Joi.string().min(6).max(128).required().messages({
        "string.min": "Password must be at least 6 characters",
        "any.required": "Password is required",
      }),
    }),
  },

  // Inventory item validation
  createItem: {
    [Segments.BODY]: Joi.object().keys({
      deviceName: Joi.string().min(1).max(255).required(),
      brand: Joi.string().max(255).allow(""),
      type: Joi.string().valid("W", "C", "NC").required(),
      maintenanceType: Joi.string().valid("SER", "BER").required(),
      dateOfVintage: Joi.string().allow(""),
      category: Joi.string().max(255).required(),
      sku: Joi.string().max(255).allow(""),
      quantity: Joi.number().integer().min(0).required(),
      notes: Joi.string().allow(""),
      cpuType: Joi.string().valid("CAN", "NKN", "SA").allow(""),
      department: Joi.string().max(255).required(),
    }),
  },

  updateItem: {
    [Segments.BODY]: Joi.object().keys({
      deviceName: Joi.string().min(1).max(255),
      brand: Joi.string().max(255).allow(""),
      type: Joi.string().valid("W", "C", "NC"),
      maintenanceType: Joi.string().valid("SER", "BER"),
      dateOfVintage: Joi.string().allow(""),
      category: Joi.string().max(255),
      sku: Joi.string().max(255).allow(""),
      quantity: Joi.number().integer().min(0),
      notes: Joi.string().allow(""),
      cpuType: Joi.string().valid("CAN", "NKN", "SA").allow(""),
      department: Joi.string().max(255),
    }),
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().required(),
    }),
  },

  // Stock In validation
  stockIn: {
    [Segments.BODY]: Joi.object().keys({
      itemId: Joi.string().required(),
      quantity: Joi.number().integer().min(1).required(),
      note: Joi.string().allow(""),
      defect: Joi.string().allow(""),
    }),
  },

  // Stock Out validation
  stockOut: {
    [Segments.BODY]: Joi.object().keys({
      id: Joi.string().required(),
      remarks: Joi.string().required(),
      technicianName: Joi.string().required(),
      secIcName: Joi.string().required(),
    }),
  },

  // Category validation
  createCategory: {
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(255).required(),
      description: Joi.string().min(2).max(1000).required(),
    }),
  },

  updateCategory: {
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(255),
      description: Joi.string().min(2).max(1000),
    }),
    [Segments.PARAMS]: Joi.object().keys({
      id: Joi.string().required(),
    }),
  },

  // Department validation
  createDepartment: {
    [Segments.BODY]: Joi.object().keys({
      name: Joi.string().min(2).max(255).required(),
      code: Joi.string().min(2).max(50).required(),
      color: Joi.string()
        .pattern(/^#[0-9A-Fa-f]{6}$/)
        .required(),
    }),
  },

  // Stock In filters validation
  stockInFilters: {
    [Segments.QUERY]: Joi.object().keys({
      dateFrom: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
      dateTo: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/),
      status: Joi.string().valid("all", "pending", "Stock Out", "cancelled"),
      search: Joi.string().max(255).allow(""),
      type: Joi.string().valid("all", "W", "C", "NC"),
      maintenanceType: Joi.string().valid("all", "SER", "BER"),
      category: Joi.string().valid("all"),
      department: Joi.string().allow(""),
    }),
  },
};

/**
 * Middleware factory for validation
 */
export const validate = (schemaName: keyof typeof schemas) => {
  return celebrate(schemas[schemaName], {
    abortEarly: false,
  });
};

/**
 * Generic ID parameter validation
 */
export const validateIdParam = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.string().required(),
  }),
});
