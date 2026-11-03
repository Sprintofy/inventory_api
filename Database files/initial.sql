CREATE DATABASE IF NOT EXISTS inventory_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inventory_db;

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS stock_transactions;
DROP TABLE IF EXISTS stock_in_records;
DROP TABLE IF EXISTS inventory_items;
DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS transfers;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS sub_departments;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS technicians;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  employee_id VARCHAR(64) NOT NULL,
  department VARCHAR(191) NOT NULL,
  sub_department VARCHAR(191) NULL,
  post VARCHAR(191) NULL,
  role VARCHAR(32) NOT NULL,
  status VARCHAR(16) NOT NULL DEFAULT 'active',
  color VARCHAR(16) NOT NULL DEFAULT '#4f46e5',
  last_active VARCHAR(64) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (
  `id`,
  `name`,
  `email`,
  `password_hash`,
  `employee_id`,
  `department`,
  `sub_department`,
  `post`,
  `role`,
  `status`,
  `color`,
  `last_active`,
  `created_at`
) VALUES (
  'USR-001',
  'Manish Jawale',
  'admin@gmail.com',
  'scrypt$afdf52eee715529b407b057e3b01ba01$4899023937a3628cd46b164663578dc334e155f99cc111e5229b0e6df8f47ba6719f697ffd66e85c82b958379ac72a47622af466a4c95c504d522dcaca5d9f25',
  'EMP-0001',
  'ADM BR',
  NULL,
  NULL,
  'super-admin',
  'active',
  '#4f46e5',
  '2026-10-14 17:41:29',
  CURRENT_TIMESTAMP
);

CREATE TABLE technicians (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  email VARCHAR(191) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  employee_id VARCHAR(64) NOT NULL,
  specialization VARCHAR(191) NOT NULL,
  availability VARCHAR(32) NOT NULL DEFAULT 'Available',
  status VARCHAR(16) NOT NULL DEFAULT 'Active',
  phone VARCHAR(64) NULL,
  color VARCHAR(16) NULL,
  active_tickets INT NOT NULL DEFAULT 0,
  resolved_tickets INT NOT NULL DEFAULT 0,
  last_active VARCHAR(64) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_tech_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE departments (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  code VARCHAR(64) NOT NULL,
  manager VARCHAR(191) NOT NULL DEFAULT '',
  users_count INT NOT NULL DEFAULT 0,
  status VARCHAR(16) NOT NULL DEFAULT 'active',
  color VARCHAR(16) NOT NULL DEFAULT '#4f46e5',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_dept_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE categories (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  description TEXT NULL,
  items_count INT NOT NULL DEFAULT 0,
  color VARCHAR(16) NOT NULL DEFAULT '#4f46e5',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_cat_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE suppliers (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  contact_person VARCHAR(191) NOT NULL DEFAULT '',
  email VARCHAR(191) NOT NULL DEFAULT '',
  phone VARCHAR(64) NOT NULL DEFAULT '',
  address TEXT NULL,
  categories JSON NULL,
  items_supplied INT NOT NULL DEFAULT 0,
  purchase_orders INT NOT NULL DEFAULT 0,
  total_spend DECIMAL(14,2) NOT NULL DEFAULT 0,
  status VARCHAR(16) NOT NULL DEFAULT 'active',
  rating DECIMAL(3,2) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sup_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE inventory_items (
  id VARCHAR(32) PRIMARY KEY,
  device_name VARCHAR(191) NOT NULL,
  brand VARCHAR(191) NOT NULL DEFAULT '',
  type ENUM('W','C','NC') NOT NULL DEFAULT 'C',
  category VARCHAR(191) NOT NULL DEFAULT '',
  notes TEXT NULL,
  sku VARCHAR(191) NULL UNIQUE,
  quantity INT NOT NULL DEFAULT 0,
  unit VARCHAR(32) NOT NULL DEFAULT 'unit',
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  department VARCHAR(191) NOT NULL DEFAULT '',
  cpu_type ENUM('CAN','NCAN','SA') NULL,
  last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_inv_sku (sku),
  INDEX idx_inv_dept (department),
  INDEX idx_inv_category (category),
  INDEX idx_inv_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE stock_in_records (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  work_order_id VARCHAR(64) NOT NULL,
  job_no VARCHAR(64) NOT NULL,
  item_id VARCHAR(32) NOT NULL DEFAULT '',
  item_name VARCHAR(191) NOT NULL DEFAULT '',
  product_type ENUM('W','C','NC') NOT NULL DEFAULT 'C',
  quantity INT NOT NULL DEFAULT 0,
  date_in DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_out DATETIME NULL DEFAULT NULL,
  remarks TEXT NULL DEFAULT NULL,
  department VARCHAR(191) NOT NULL DEFAULT '',
  created_by VARCHAR(191) NOT NULL DEFAULT '',
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  INDEX idx_sin_work_order (work_order_id),
  INDEX idx_sin_job_no (job_no),
  INDEX idx_sin_item (item_id),
  INDEX idx_sin_dept (department),
  INDEX idx_sin_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE stock_transactions (
  id VARCHAR(32) PRIMARY KEY,
  type VARCHAR(32) NOT NULL,
  reference VARCHAR(64) NOT NULL DEFAULT '',
  item_id VARCHAR(32) NOT NULL DEFAULT '',
  item_name VARCHAR(191) NOT NULL DEFAULT '',
  quantity INT NOT NULL DEFAULT 0,
  department VARCHAR(191) NOT NULL DEFAULT '',
  to_department VARCHAR(191) NULL,
  supplier VARCHAR(191) NULL,
  created_by VARCHAR(191) NOT NULL DEFAULT '',
  date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  note TEXT NULL,
  INDEX idx_txn_type (type),
  INDEX idx_txn_item (item_id),
  INDEX idx_txn_dept (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE transfers (
  id VARCHAR(32) PRIMARY KEY,
  transfer_no VARCHAR(64) NOT NULL DEFAULT '',
  from_department VARCHAR(191) NOT NULL DEFAULT '',
  to_department VARCHAR(191) NOT NULL DEFAULT '',
  item_id VARCHAR(32) NOT NULL DEFAULT '',
  item_name VARCHAR(191) NOT NULL DEFAULT '',
  quantity INT NOT NULL DEFAULT 0,
  reason TEXT NULL,
  requested_by VARCHAR(191) NOT NULL DEFAULT '',
  date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  approved_by VARCHAR(191) NULL,
  approval_date DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE requests (
  id VARCHAR(64) PRIMARY KEY,
  requested_by VARCHAR(191) NOT NULL DEFAULT '',
  department VARCHAR(191) NOT NULL DEFAULT '',
  sub_department VARCHAR(191) NULL,
  item_id VARCHAR(32) NOT NULL DEFAULT '',
  item_name VARCHAR(191) NOT NULL DEFAULT '',
  quantity INT NOT NULL DEFAULT 0,
  priority VARCHAR(32) NOT NULL DEFAULT 'medium',
  date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(32) NOT NULL DEFAULT 'pending',
  reason TEXT NULL,
  INDEX idx_req_dept (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE activities (
  id VARCHAR(32) PRIMARY KEY,
  user_name VARCHAR(191) NOT NULL DEFAULT '',
  action VARCHAR(191) NOT NULL DEFAULT '',
  module VARCHAR(64) NOT NULL DEFAULT '',
  item VARCHAR(255) NOT NULL DEFAULT '',
  department VARCHAR(191) NOT NULL DEFAULT '',
  date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_act_module (module)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE notifications (
  id VARCHAR(32) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  type VARCHAR(16) NOT NULL DEFAULT 'info'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
