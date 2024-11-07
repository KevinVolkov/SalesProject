-- ** worstbuy_db schema (ONLY RUN ON EMPTY DATABASE)

-- ** tables that involve user accounts
-- Create 'users' table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,         -- Unique ID for each user
    email VARCHAR(255) NOT NULL UNIQUE,        -- User's email (required and unique)
    password VARCHAR(255) NOT NULL,            -- User's password (required)
    is_admin BOOLEAN DEFAULT FALSE,            -- Admin flag (default is false)
    admin_code VARCHAR(255) DEFAULT NULL       -- Admin code (nullable)
);

-- Insert a sample admin user
INSERT INTO users (id, email, password, is_admin, admin_code) 
VALUES (1, 'admin@example.com', 'adminpassword', TRUE, 'someAdminCode123');

-- Insert a sample non-admin user
INSERT INTO users (id, email, password, is_admin) 
VALUES (2,'client@example.com', 'clientpassword', FALSE);


-- ** tables that involve products

-- Create 'products' table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY, -- Unique ID for each product
    name VARCHAR(255) NOT NULL,        -- Product name
    description TEXT,                  -- Product description
    price DECIMAL(10, 2) NOT NULL,     -- Product price
    image_path VARCHAR(255),            -- path to image e.g. public/uploads/image.jpg for multer
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Insert sample product
INSERT INTO products (id, name, description, price, image_path) 
VALUES (1, 'Sample Product', 'This is a sample product', 9.99, '/uploads/jasonclone.png');

-- ** display all tables

SELECT 'User account table:' AS message;
SELECT * FROM users;
SELECT 'Products table:' AS message;
SELECT * FROM products;
