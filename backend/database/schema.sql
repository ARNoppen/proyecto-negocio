-- Las tablas se crean en la base de datos especificada en la conexión

-- Businesses
CREATE TABLE IF NOT EXISTS businesses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Settings
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_setting (business_id, setting_key)
);

-- Access Groups
CREATE TABLE IF NOT EXISTS access_groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT,
    access_group_id INT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    FOREIGN KEY (access_group_id) REFERENCES access_groups(id) ON DELETE SET NULL
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Brands
CREATE TABLE IF NOT EXISTS brands (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Suppliers
CREATE TABLE IF NOT EXISTS suppliers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT,
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
);

-- Products
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    business_id INT,
    category_id INT,
    brand_id INT,
    supplier_id INT,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    short_description VARCHAR(500),
    full_description TEXT,
    price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    stock_actual INT NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL DEFAULT 0,
    visible_en_web BOOLEAN DEFAULT TRUE,
    destacado BOOLEAN DEFAULT FALSE,
    en_promocion BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (brand_id) REFERENCES brands(id) ON DELETE SET NULL,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL
);

-- Product Images
CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Stock Movements
CREATE TABLE IF NOT EXISTS stock_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    user_id INT,
    type ENUM('IN', 'OUT', 'ADJUSTMENT') NOT NULL,
    quantity INT NOT NULL,
    observation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- SEED DATA
INSERT INTO businesses (name, whatsapp) VALUES ('Mi Kiosco', '5491100000000');
SET @b_id = LAST_INSERT_ID();

INSERT INTO access_groups (name) VALUES ('admin'), ('administracion');
SET @g_id = LAST_INSERT_ID(); -- Gets 'admin' ID if inserted first? Actually 'administracion' might be LAST_INSERT_ID() + 1. It varies. Let's just do it sequentially.
-- Better to just insert one by one or assume IDs for seed.
-- In safe script, we do:
-- SET @g_id = 1; (assuming start at 1). In a fresh DB this is safe.

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE access_groups;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO access_groups (id, name) VALUES (1, 'admin'), (2, 'administracion');

-- Contraseña será 'admin123', hasheada con bcrypt
INSERT INTO users (business_id, access_group_id, name, email, password_hash)
VALUES (@b_id, 1, 'Admin', 'admin@kiosco.com', '$2b$10$iPXI7Erws9EfmsuLryH6guVOR8CjmYu0lBFOG7/1yWpnI.aq13n9u');

INSERT INTO settings (business_id, setting_key, setting_value) VALUES
(@b_id, 'show_out_of_stock', 'true'),
(@b_id, 'show_exact_stock', 'false'),
(@b_id, 'show_price', 'true'),
(@b_id, 'whatsapp_number', '5491100000000'),
(@b_id, 'theme_color_main', '#10B981');

INSERT INTO categories (business_id, name, slug) VALUES
(@b_id, 'Bebidas Sin Alcohol', 'bebidas-sin-alcohol'),
(@b_id, 'Golosinas', 'golosinas'),
(@b_id, 'Snacks', 'snacks');

INSERT INTO brands (business_id, name, slug) VALUES 
(@b_id, 'Coca-Cola', 'coca-cola'),
(@b_id, 'Arcor', 'arcor'),
(@b_id, 'Lays', 'lays');

-- Obtener IDs seguros para seed (asumiendo IDs 1, 2, 3)
INSERT INTO products (business_id, category_id, brand_id, name, slug, short_description, price, stock_actual, stock_minimo, visible_en_web, destacado)
VALUES 
(@b_id, 1, 1, 'Coca-Cola Lata 354ml', 'coca-cola-lata-354ml', 'Gaseosa sabor cola en lata', 1500, 100, 20, TRUE, TRUE),
(@b_id, 1, 1, 'Coca-Cola 1.5L', 'coca-cola-1-5l', 'Gaseosa sabor cola 1.5 litros', 2800, 50, 10, TRUE, FALSE);
