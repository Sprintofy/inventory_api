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

INSERT INTO `departments` (
  `id`,
  `name`,
  `code`,
  `manager`,
  `users_count`,
  `status`,
  `color`,
  `created_at`
) VALUES
  ('DEP-001', 'CS Dept', 'CSDP', '', 0, 'active', '#4f46e5', CURRENT_TIMESTAMP),
  ('DEP-002', 'Vyas Library', 'VYAS', '', 0, 'active', '#0ea5e9', CURRENT_TIMESTAMP),
  ('DEP-003', 'JTT', 'JTT01', '', 0, 'active', '#10b981', CURRENT_TIMESTAMP),
  ('DEP-004', 'FL Dept', 'FLDP', '', 0, 'active', '#f59e0b', CURRENT_TIMESTAMP),
  ('DEP-005', 'Hindi Dept', 'HNDI', '', 0, 'active', '#ef4444', CURRENT_TIMESTAMP),
  ('DEP-006', 'Economics Dept', 'ECON', '', 0, 'active', '#8b5cf6', CURRENT_TIMESTAMP),
  ('DEP-007', 'Edn Br', 'EDN ', '', 0, 'active', '#14b8a6', CURRENT_TIMESTAMP),
  ('DEP-008', 'No 1 Bn Office', 'BN01 ', '', 0, 'active', '#6366f1', CURRENT_TIMESTAMP),
  ('DEP-009', 'A Sqn', 'ASQN ', '', 0, 'active', '#84cc16', CURRENT_TIMESTAMP),
  ('DEP-010', 'B Sqn', 'BSQN ', '', 0, 'active', '#14b8a6', CURRENT_TIMESTAMP),
  ('DEP-011', 'C Sqn', 'CSQN ', '', 0, 'active', '#0ea5e9', CURRENT_TIMESTAMP),
  ('DEP-012', 'D Sqn', 'DSQN ', '', 0, 'active', '#f59e0b', CURRENT_TIMESTAMP),
  ('DEP-013', 'No 2 Bn Office', 'BN02 ', '', 0, 'active', '#ef4444', CURRENT_TIMESTAMP),
  ('DEP-014', 'E Sqn', 'ESQN ', '', 0, 'active', '#8b5cf6', CURRENT_TIMESTAMP),
  ('DEP-015', 'F Sqn', 'FSQN ', '', 0, 'active', '#14b8a6', CURRENT_TIMESTAMP),
  ('DEP-016', 'G Sqn', 'GSQN ', '', 0, 'active', '#6366f1', CURRENT_TIMESTAMP),
  ('DEP-017', 'H Sqn', 'HSQN ', '', 0, 'active', '#4f46e5', CURRENT_TIMESTAMP),
  ('DEP-018', 'No 3 Bn Office', 'BN03 ', '', 0, 'active', '#0ea5e9', CURRENT_TIMESTAMP),
  ('DEP-019', 'I Sqn', 'ISQN ', '', 0, 'active', '#10b981', CURRENT_TIMESTAMP),
  ('DEP-020', 'J Sqn', 'JSQN ', '', 0, 'active', '#f59e0b', CURRENT_TIMESTAMP),
  ('DEP-021', 'K Sqn', 'KSQN ', '', 0, 'active', '#ef4444', CURRENT_TIMESTAMP),
  ('DEP-022', 'L Sqn', 'LSQN ', '', 0, 'active', '#8b5cf6', CURRENT_TIMESTAMP),
  ('DEP-023', 'No 4 Bn Office', 'BN04 ', '', 0, 'active', '#14b8a6', CURRENT_TIMESTAMP),
  ('DEP-024', 'M Sqn', 'MSQN ', '', 0, 'active', '#6366f1', CURRENT_TIMESTAMP),
  ('DEP-025', 'N Sqn', 'NSQN ', '', 0, 'active', '#4f46e5', CURRENT_TIMESTAMP),
  ('DEP-026', 'O Sqn', 'OSQN ', '', 0, 'active', '#0ea5e9', CURRENT_TIMESTAMP),
  ('DEP-027', 'P Sqn', 'PSQN ', '', 0, 'active', '#10b981', CURRENT_TIMESTAMP),
  ('DEP-028', 'No 5 Bn Office', 'BN05 ', '', 0, 'active', '#f59e0b', CURRENT_TIMESTAMP),
  ('DEP-029', 'Q Sqn', 'QSQN ', '', 0, 'active', '#ef4444', CURRENT_TIMESTAMP),
  ('DEP-030', 'R Sqn', 'RSQN ', '', 0, 'active', '#8b5cf6', CURRENT_TIMESTAMP),
  ('DEP-031', 'Comdt Sect.', 'CDST ', '', 0, 'active', '#14b8a6', CURRENT_TIMESTAMP),
  ('DEP-032', 'Dy Comdt sectt', 'DCST ', '', 0, 'active', '#6366f1', CURRENT_TIMESTAMP),
  ('DEP-033', 'Adjt Br', 'ADJT ', '', 0, 'active', '#4f46e5', CURRENT_TIMESTAMP),
  ('DEP-034', 'Method Sec', 'MTHD ', '', 0, 'active', '#0ea5e9', CURRENT_TIMESTAMP),
  ('DEP-035', 'H_Hall', 'HHAL ', '', 0, 'active', '#10b981', CURRENT_TIMESTAMP),
  ('DEP-036', 'TPO', 'TPO  ', '', 0, 'active', '#f59e0b', CURRENT_TIMESTAMP),
  ('DEP-037', 'Est-2', 'EST2 ', '', 0, 'active', '#ef4444', CURRENT_TIMESTAMP),
  ('DEP-038', 'PAO', 'PAO  ', '', 0, 'active', '#8b5cf6', CURRENT_TIMESTAMP),
  ('DEP-039', 'Trg Br', 'TRGB ', '', 0, 'active', '#14b8a6', CURRENT_TIMESTAMP),
  ('DEP-040', 'Basic Engg', 'BENG ', '', 0, 'active', '#6366f1', CURRENT_TIMESTAMP),
  ('DEP-041', 'Maths Dept', 'MATH ', '', 0, 'active', '#4f46e5', CURRENT_TIMESTAMP),
  ('DEP-042', 'Physics Dept', 'PHYS ', '', 0, 'active', '#0ea5e9', CURRENT_TIMESTAMP),
  ('DEP-043', 'Chemistry Dept', 'CHEM ', '', 0, 'active', '#10b981', CURRENT_TIMESTAMP),
  ('DEP-044', 'Eng Dept', 'ENG  ', '', 0, 'active', '#f59e0b', CURRENT_TIMESTAMP),
  ('DEP-045', 'History Dept', 'HIST ', '', 0, 'active', '#ef4444', CURRENT_TIMESTAMP),
  ('DEP-046', 'Political Science Dept', 'POLS ', '', 0, 'active', '#8b5cf6', CURRENT_TIMESTAMP),
  ('DEP-047', 'Geography Dept', 'GEOG ', '', 0, 'active', '#14b8a6', CURRENT_TIMESTAMP),
  ('DEP-048', 'QM', 'QM   ', '', 0, 'active', '#6366f1', CURRENT_TIMESTAMP),
  ('DEP-049', 'Offer Mess', 'OFRM ', '', 0, 'active', '#4f46e5', CURRENT_TIMESTAMP),
  ('DEP-050', 'Estate Sec', 'ESTS ', '', 0, 'active', '#0ea5e9', CURRENT_TIMESTAMP),
  ('DEP-051', 'Cadet Mess', 'CDMS ', '', 0, 'active', '#10b981', CURRENT_TIMESTAMP),
  ('DEP-052', 'PTT', 'PTT  ', '', 0, 'active', '#f59e0b', CURRENT_TIMESTAMP),
  ('DEP-053', 'ATT', 'ATT  ', '', 0, 'active', '#ef4444', CURRENT_TIMESTAMP),
  ('DEP-054', 'NTT', 'NTT  ', '', 0, 'active', '#8b5cf6', CURRENT_TIMESTAMP),
  ('DEP-055', 'AFTT', 'AFTT ', '', 0, 'active', '#14b8a6', CURRENT_TIMESTAMP),
  ('DEP-056', 'ETT', 'ETT  ', '', 0, 'active', '#6366f1', CURRENT_TIMESTAMP),
  ('DEP-057', '45 MVH', 'MVH45', '', 0, 'active', '#4f46e5', CURRENT_TIMESTAMP),
  ('DEP-058', 'MT', 'MT   ', '', 0, 'active', '#0ea5e9', CURRENT_TIMESTAMP),
  ('DEP-059', 'Stn HQ', 'STNHQ', '', 0, 'active', '#10b981', CURRENT_TIMESTAMP),
  ('DEP-060', 'Security Sec', 'SECR ', '', 0, 'active', '#f59e0b', CURRENT_TIMESTAMP),
  ('DEP-061', 'MH Khadakwasla', 'MHKD ', '', 0, 'active', '#ef4444', CURRENT_TIMESTAMP),
  ('DEP-062', 'OC TPS', 'OCTPS', '', 0, 'active', '#8b5cf6', CURRENT_TIMESTAMP),
  ('DEP-063', 'CSD', 'CSD  ', '', 0, 'active', '#14b8a6', CURRENT_TIMESTAMP),
  ('DEP-064', 'DSC', 'DSC  ', '', 0, 'active', '#6366f1', CURRENT_TIMESTAMP),
  ('DEP-065', 'Fire Station', 'FIRE ', '', 0, 'active', '#4f46e5', CURRENT_TIMESTAMP),
  ('DEP-066', 'Adm Br', 'ADMBR', '', 0, 'active', '#0ea5e9', CURRENT_TIMESTAMP),
  ('DEP-067', 'Arjun Hall', 'AJUN ', '', 0, 'active', '#10b981', CURRENT_TIMESTAMP),
  ('DEP-068', 'Chanakya Hall', 'CHKY ', '', 0, 'active', '#f59e0b', CURRENT_TIMESTAMP),
  ('DEP-069', 'B Tech', 'BTEC ', '', 0, 'active', '#ef4444', CURRENT_TIMESTAMP),
  ('DEP-070', 'ITCC', 'ITCC ', '', 0, 'active', '#8b5cf6', CURRENT_TIMESTAMP);

CREATE TABLE categories (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  description TEXT NULL,
  items_count INT NOT NULL DEFAULT 0,
  color VARCHAR(16) NOT NULL DEFAULT '#4f46e5',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_cat_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `categories` (
  `id`,
  `name`,
  `description`,
  `items_count`,
  `color`,
  `created_at`
) VALUES
  ('CAT-V6Y878', 'CPU', 'CPU', 0, '#4f46e5', CURRENT_TIMESTAMP),
  ('CAT-K90XSF', 'PRINTER', 'PRINTER', 0, '#0ea5e9', CURRENT_TIMESTAMP),
  ('CAT-WS9Z15', 'UPS', 'UPS', 0, '#ef4444', CURRENT_TIMESTAMP),
  ('CAT-MQO9D1', 'PROJECTOR', 'PROJECTOR', 0, '#f59e0b', CURRENT_TIMESTAMP),
  ('CAT-XO426R', 'MONITOR', 'MONITOR', 0, '#10b981', CURRENT_TIMESTAMP),
  ('CAT-84GSO2', 'KEYBOARD', 'KEYBOARD', 0, '#f59e0b', CURRENT_TIMESTAMP),
  ('CAT-CLCKZI', 'MOUSE', 'MOUSE', 0, '#10b981', CURRENT_TIMESTAMP),
  ('CAT-T3OJWS', 'THINCLIENT INP', 'THINCLIENT INP', 0, '#8b5cf6', CURRENT_TIMESTAMP),
  ('CAT-U4K3RK', 'HLBS', 'HLBS', 0, '#14b8a6', CURRENT_TIMESTAMP),
  ('CAT-ZEYGI8', 'ADAPTOR ALL TYPES', 'ADAPTOR ALL TYPES', 0, '#0ea5e9', CURRENT_TIMESTAMP),
  ('CAT-FJTD4S', 'DELL LAPTOP', 'DELL LAPTOP', 0, '#4f46e5', CURRENT_TIMESTAMP),
  ('CAT-F1RZQL', 'HP THINCLIENT LAPTOP', 'HP THINCLIENT LAPTOP', 0, '#6366f1', CURRENT_TIMESTAMP),
  ('CAT-BDK2AP', 'MISC', 'MISC', 0, '#ef4444', CURRENT_TIMESTAMP);

CREATE TABLE inventory_items (
  id VARCHAR(32) PRIMARY KEY,
  device_name VARCHAR(191) NOT NULL,
  brand VARCHAR(191) NOT NULL DEFAULT '',
  type VARCHAR(32) NOT NULL DEFAULT 'C',
  maintenance_type VARCHAR(32) NOT NULL DEFAULT 'SER',
  date_of_vintage VARCHAR(64) NULL,
  category VARCHAR(191) NOT NULL DEFAULT '',
  notes TEXT NULL,
  sku VARCHAR(191) NULL UNIQUE,
  quantity INT NOT NULL DEFAULT 0,
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
  product_type VARCHAR(32) NOT NULL DEFAULT 'C',
  quantity INT NOT NULL DEFAULT 0,
  date_in DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  date_out DATETIME NULL DEFAULT NULL,
  remarks TEXT NULL DEFAULT NULL,
  defect TEXT NULL DEFAULT NULL,
  technician_name TEXT NULL DEFAULT NULL,
  sec_ic_name TEXT NULL DEFAULT NULL,
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
  category VARCHAR(191) NOT NULL DEFAULT '',
  quantity INT NOT NULL DEFAULT 0,
  department VARCHAR(191) NOT NULL DEFAULT '',
  to_department VARCHAR(191) NULL,
  supplier VARCHAR(191) NULL,
  created_by VARCHAR(191) NOT NULL DEFAULT '',
  date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  note TEXT NULL,
  INDEX idx_txn_type (type),
  INDEX idx_txn_item (item_id),
  INDEX idx_txn_cat (category),
  INDEX idx_txn_dept (department)
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
