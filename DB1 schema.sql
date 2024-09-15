-- Create 'users' table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Insert sample user (optional)
-- INSERT INTO users (email, password) VALUES ('admin@example.com', 'adminpassword');
SELECT * FROM users; -- display all users (emails and passwords)
