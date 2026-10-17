CREATE DATABASE IF NOT EXISTS inventory_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE inventory_db;

DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS activities;
DROP TABLE IF EXISTS ticket_issues;
DROP TABLE IF EXISTS tickets;
DROP TABLE IF EXISTS stock_transactions;
DROP TABLE IF EXISTS stock_out_records;
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

INSERT INTO `users` VALUES ('USR-001','Arjun Mehta','admin@example.com','scrypt$0b16ec2c60cf40cab371addc1d4123e8$28388c3082b782bb205fb335b981176cfae7407529d9fdbe58d368244a14f5ba032b1044894d0ed3733d088e0125381c39755e3f29a1bcaa50170632d8cbbd4a','EMP-0001','ADM BR',NULL,NULL,'super-admin','active','#4f46e5','2026-10-14T17:41:29.395Z','2026-10-14 23:15:29'),('USR-002','Priya Sharma','manager@example.com','scrypt$52824a31db195bbed48819fa3d0bfd5c$5956f01e37422a73539384676d474ded2d54d87f7a87a737d76d7761d2eae7a63a0826cfc7bdc361806fa0da222e006531972cf27452cc144175a8fa2849073d','EMP-0012','TRG BRANCH',NULL,NULL,'department-manager','active','#0ea5e9','2026-10-14T17:20:29.395Z','2026-10-14 23:15:29'),('USR-003','Rohan Gupta','user@example.com','scrypt$06e15b4dcaf3def495dc59c6e5492a22$cfda357b4dca4be243cbdb92d4516ae9753d489a7a2771336fb2624cff088ddb9ad8e9a3431ac6573c937edf822d0d0eafab6cf3faa9a8eaa1ef29c85110b16b','EMP-0034','STATION UNIT',NULL,NULL,'department-user','active','#10b981','2026-10-14T17:33:29.395Z','2026-10-14 23:15:29'),('USR-004','Rajesh Kumar','rajesh.kumar@inventoryos.co','scrypt$e18117cdb8eb34fe22aa7b987c34a4e2$7a3a5e793d309ccaa7cc3b6d3ac3de2a051cbec7cada084d2174d66194c1f3b1f07bc75b113a309d9abd4577997f1cd536a387e908b8b701e54ccfe84ee45e50','EMP-0009','STATION UNIT',NULL,NULL,'department-manager','active','#f59e0b','2026-10-14T16:45:29.395Z','2026-10-14 23:15:29'),('USR-005','Anita Desai','anita.desai@inventoryos.co','scrypt$4cf7a9f4cb254426a3118652f5692391$b86dd7aa016b18cbcf66f2f75ca089af0d572cc3cea4ec9c711d8edc6eca628cada615c90866be253d11f3e4df9456bf07e2091a69898412255a6ec29adffce5','EMP-0015','ADM BR',NULL,NULL,'department-manager','active','#ef4444','2026-10-14T15:45:29.395Z','2026-10-14 23:15:29'),('USR-006','Vikram Singh','vikram.singh@inventoryos.co','scrypt$2542c326024db5897a715cc7523e2ab6$9493583c46623b0901fe0153411a2221b7c504a6a8a13feaa201c96becf14c2ebcd8967fc54ec3c51fd53c5edcba5695c10407b4ad619ec63f8aae7547af778d','EMP-0021','ADM BR',NULL,NULL,'department-manager','active','#8b5cf6','2026-10-14T14:45:29.395Z','2026-10-14 23:15:29'),('USR-007','Suresh Nair','suresh.nair@inventoryos.co','scrypt$9790f06f3eb6f5f514311b6646c58691$c93db534d8ddda9bd24f452cae6f3234b654364b4228a728a0263cfed20857d05c97c887f7c2aab9a52c0963dcf35509b84e59a53670dc06855a3e7c03748c06','EMP-0027','STATION UNIT',NULL,NULL,'department-manager','active','#14b8a6','2026-10-14T12:45:29.395Z','2026-10-14 23:15:29'),('USR-008','Meera Iyer','meera.iyer@inventoryos.co','scrypt$0a3311567afe7a63ed1132e3fb2e22b5$765796d57d5aed38cec38b215ac37c8583e8aeccdce63d3cde277088fe18e388f5ec780b8d93d6e1c68a8fe3887a0928907cc1348c6b09e47c2e9b965da17651','EMP-0031','TRG BRANCH',NULL,NULL,'department-manager','active','#f43f5e','2026-10-14T11:45:29.395Z','2026-10-14 23:15:29'),('USR-009','Arun Mehta','arun.mehta@inventoryos.co','scrypt$74a9c8dd22a4d7ccfec293eace0d1090$1fe2a2bd076cf9df9f6721a92a1b3e1c10a48b208ff170ffea35e7c4e8c910c4e4886db6d4e25f387591f467ecf61bc0847d2ce06ca57ed270d17c8efc4e1773','EMP-0038','ADM BR',NULL,NULL,'department-manager','active','#6366f1','2026-10-13T17:45:29.395Z','2026-10-14 23:15:29'),('USR-010','Kavita Rao','kavita.rao@inventoryos.co','scrypt$753662a897e0b4310a0c5075ac1471be$34760b4335aaf242e2c31cbfdd36cd4c2f8932036403ba1f3975e352fd7e4d7e8d771dde195974d9a8dcedd8cddc1b9446758d9f6050ba61ead1cd68d31bce14','EMP-0042','ADM BR',NULL,NULL,'department-manager','active','#84cc16','2026-10-12T17:45:29.395Z','2026-10-14 23:15:29'),('USR-011','Deepak Verma','deepak.verma@inventoryos.co','scrypt$08b34a7ea3d14d126664dd3717e42ee5$be73930322a3613769cb8699c13a60f5b899878ed231be582a41d93c66a7219c58177c876f1eebe261f88899f3302037476dee4adb3a5166a86235f096dc7865','EMP-0046','ADM BR',NULL,NULL,'department-manager','active','#0d9488','2026-10-11T17:45:29.395Z','2026-10-14 23:15:29'),('USR-012','Sanjay Gupta','sanjay.gupta@inventoryos.co','scrypt$f4aad3c97c2152d50314dd373e03eca4$8e98249aa8af0ba4138edba396551b97ffcdff20706816a4550d87ed764eed466b0ec89d6cded1f62fab622dcfa42b125a85fab795e754bbb03e5ca72b3a161e','EMP-0049','BN AND SQN',NULL,NULL,'department-manager','active','#a855f7','2026-10-10T17:45:29.395Z','2026-10-14 23:15:29'),('USR-013','Neha Kulkarni','neha.kulkarni@inventoryos.co','scrypt$ceb5121711b90809f95e3d5dc5994f70$7117f36c32b93e5c3db22e8093dd3318f7af353903621a33718abc464b3146bd67d886e84c37f157eaa896eb745de19686b5f11746d253fe6f618eff79d2daa2','EMP-0055','TRG BRANCH',NULL,NULL,'department-user','active','#f97316','2026-10-14T17:10:29.395Z','2026-10-14 23:15:29'),('USR-014','Aditya Patel','aditya.patel@inventoryos.co','scrypt$feb881c258e2f4145fe83de0e2c7f7cb$97d7d9df953b69f9d3bb81725a28e38d0cf75fc39ca5500c56f60e898d44df73e24cad5c3eaf82241413558764af7dd948df918d08de30188fa46605bfb692f2','EMP-0058','TRG BRANCH',NULL,NULL,'department-user','active','#ec4899','2026-10-14T15:45:29.395Z','2026-10-14 23:15:29'),('USR-015','Farhan Ali','farhan.ali@inventoryos.co','scrypt$4b9824b47edee46d835d32a741016bd1$897fd7b55acc00dfb6dab4b836350fa00de7b5e4958c964e56a495b1b894d09c2e28d0ee59d566a5390ab67ea85abf5b716a002a0ad4a6665ed64f6847368bc7','EMP-0062','STATION UNIT',NULL,NULL,'department-user','active','#06b6d4','2026-10-14T13:45:29.395Z','2026-10-14 23:15:29'),('USR-016','Divya Menon','divya.menon@inventoryos.co','scrypt$fb5b28736860159d778b76d9dd6b21e6$2909baa0442a75aaa273c17bf7c340343394c14d5d2661d568d20b7125d6aebd210cea32ee1ad60847205686d8c669f565b5df48869b768687c3d4b28cfc72b3','EMP-0066','STATION UNIT',NULL,NULL,'department-user','active','#d946ef','2026-10-14T10:45:29.395Z','2026-10-14 23:15:29'),('USR-017','Karan Johar','karan.johar@inventoryos.co','scrypt$5ebfee1d2b0264011f8cd6d7d1d03009$34f233ea11cfb63f390033431c76fff297072e302d15a604405c2fc264f619aa1873059ec5e9c7794c795243b93e6ab448325a999c1073f5dde7c74bd1fff1c6','EMP-0070','ADM BR',NULL,NULL,'department-user','active','#16a34a','2026-10-14T08:45:29.395Z','2026-10-14 23:15:30'),('USR-018','Pooja Reddy','pooja.reddy@inventoryos.co','scrypt$239f56d98c7064b856ab111aba3b594d$986ab534c489b898a34d84a29519c5f3b7d0b878badeabafc692e1e5bd9fc5038d49da0d5f13a12ffb23db925851f1aea42c0a2fa1a9c116a6d711092d3142a9','EMP-0074','STATION UNIT',NULL,NULL,'department-user','invited','#64748b','-','2026-10-14 23:15:30'),('USR-019','Siddharth Jain','siddharth.jain@inventoryos.co','scrypt$b84f84dc836edbff84afb795afea75e6$0d8fd5bb879e6a6c48fe1db14a0bb8f046774dea7bf8e64a74dfec830381cff5fa6c59bbb1ccda4b53f273e93ee78e17b9054c83f03de07526bf0b78f6d3ef4a','EMP-0078','ADM BR',NULL,NULL,'viewer','active','#b45309','2026-10-12T17:45:29.395Z','2026-10-14 23:15:30'),('USR-020','Ishita Bose','ishita.bose@inventoryos.co','scrypt$8e6a46592588e7ad235b555c475aa93f$8b68f4759cd700d4be6254b60e6b34afac7f7004e4120fc68149496d75e72e7b4d66f3c474d6e5d5e0e283d3d8f3d2f6971f81f7a5442b1f8147c46305dd7cda','EMP-0081','ADM BR',NULL,NULL,'viewer','inactive','#78716c','2026-09-23T17:45:29.395Z','2026-10-14 23:15:30'),('USR-DEMO-1','Col Training','col.trg@nda.in','scrypt$1cdabbd0517a70b2843442386560327e$37e5226606c79ce5506f948f2a927e82fbd52c6ffaf4dbad325b481b3eb53d4775c2c01cf8626b7d15cff64b2a2e015ad85d92f72962e7f909726b8177ac683f','EMP-DEMO-1','TRG BRANCH',NULL,NULL,'user','active','#4f46e5','Never','2026-10-14 23:15:30'),('USR-DEMO-2','Col Adm','col.adm@nda.in','scrypt$9dba9366e014475eea053305d0dbd6d7$7bbdb791021aa5389029564b03d12ac443455b6bf4a7f405e4697d37c596fda1d4b6ea47ed0b89b8573df9394499d15082d492654e6686d6e6d2960774e22c6e','EMP-DEMO-2','ADM BR',NULL,NULL,'user','active','#4f46e5','Never','2026-10-14 23:15:30'),('USR-DEMO-3','Head of Edn','prin.edn@nda.in','scrypt$97b546dc8563d9d3ae1b9b05352dad0a$622eec75a035b4b6d6055897bf3905b3e8e47179eda0a1abb49dd8f52a9917008488a6c74c2528961b36f27f2b6f4c37c393693852fd9aebeeaa073f9c036315','EMP-DEMO-3','EDN BR',NULL,NULL,'user','active','#4f46e5','Never','2026-10-14 23:15:30');

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

CREATE TABLE sub_departments (
  id VARCHAR(32) PRIMARY KEY,
  department_id VARCHAR(32) NOT NULL,
  parent_sub_id VARCHAR(32) NULL,
  name VARCHAR(191) NOT NULL,
  code VARCHAR(64) NOT NULL DEFAULT '',
  manager VARCHAR(191) NOT NULL DEFAULT '',
  users_count INT NOT NULL DEFAULT 0,
  status VARCHAR(16) NOT NULL DEFAULT 'active',
  color VARCHAR(16) NOT NULL DEFAULT '#4f46e5',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_sub_dept (department_id),
  INDEX idx_sub_parent (parent_sub_id)
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
  model_number VARCHAR(191) NOT NULL DEFAULT '',
  category VARCHAR(191) NOT NULL DEFAULT '',
  description TEXT NULL,
  specifications TEXT NULL,
  warranty_period VARCHAR(64) NULL,
  serial_number VARCHAR(191) NULL,
  notes TEXT NULL,
  sku VARCHAR(191) NULL UNIQUE,
  supplier VARCHAR(191) NULL,
  quantity INT NOT NULL DEFAULT 0,
  unit VARCHAR(32) NOT NULL DEFAULT 'unit',
  status VARCHAR(32) NOT NULL DEFAULT 'active',
  department VARCHAR(191) NOT NULL DEFAULT '',
  sub_department VARCHAR(191) NULL,
  last_updated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_inv_sku (sku),
  INDEX idx_inv_dept (department),
  INDEX idx_inv_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE stock_in_records (
  id VARCHAR(32) PRIMARY KEY,
  reference VARCHAR(64) NOT NULL,
  date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  supplier VARCHAR(191) NOT NULL DEFAULT '',
  item_id VARCHAR(32) NOT NULL DEFAULT '',
  item_name VARCHAR(191) NOT NULL DEFAULT '',
  items_count INT NOT NULL DEFAULT 1,
  quantity INT NOT NULL DEFAULT 0,
  department VARCHAR(191) NOT NULL DEFAULT '',
  created_by VARCHAR(191) NOT NULL DEFAULT '',
  status VARCHAR(32) NOT NULL DEFAULT 'received',
  INDEX idx_sin_ref (reference),
  INDEX idx_sin_item (item_id),
  INDEX idx_sin_dept (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE stock_out_records (
  id VARCHAR(32) PRIMARY KEY,
  reference VARCHAR(64) NOT NULL,
  date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  item_id VARCHAR(32) NOT NULL DEFAULT '',
  item_name VARCHAR(191) NOT NULL DEFAULT '',
  recipient VARCHAR(191) NOT NULL DEFAULT '',
  department VARCHAR(191) NOT NULL DEFAULT '',
  purpose VARCHAR(500) NOT NULL DEFAULT '',
  quantity INT NOT NULL DEFAULT 0,
  status VARCHAR(32) NOT NULL DEFAULT 'issued',
  INDEX idx_sout_ref (reference),
  INDEX idx_sout_item (item_id),
  INDEX idx_sout_dept (department)
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

CREATE TABLE tickets (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  customer VARCHAR(191) NULL,
  category VARCHAR(191) NOT NULL DEFAULT 'General',
  priority VARCHAR(32) NOT NULL DEFAULT 'medium',
  department VARCHAR(191) NOT NULL DEFAULT '',
  sub_department VARCHAR(191) NULL,
  created_by VARCHAR(191) NOT NULL DEFAULT '',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(32) NOT NULL DEFAULT 'open',
  item_ids JSON NOT NULL,
  closed_by VARCHAR(191) NULL,
  closed_at DATETIME NULL,
  resolution TEXT NULL,
  technician_id VARCHAR(32) NULL,
  technician_remark TEXT NULL,
  completed_at DATETIME NULL,
  submitted_at DATETIME NULL,
  reissue_count INT NOT NULL DEFAULT 0,
  last_reissue_note TEXT NULL,
  INDEX idx_tkt_status (status),
  INDEX idx_tkt_dept (department),
  INDEX idx_tkt_tech (technician_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE ticket_issues (
  id VARCHAR(32) PRIMARY KEY,
  ticket_id VARCHAR(64) NOT NULL,
  asset_id VARCHAR(64) NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NULL,
  priority VARCHAR(32) NOT NULL DEFAULT 'medium',
  status VARCHAR(32) NOT NULL DEFAULT 'open',
  assigned_to VARCHAR(191) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  resolved_at DATETIME NULL,
  resolution TEXT NULL,
  INDEX idx_issue_ticket (ticket_id)
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
