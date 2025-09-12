-- Initialize database for Simple CRUD application
-- This script runs when the MySQL container starts for the first time

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS simple_crud_db;
USE simple_crud_db;

-- Create users table (matching Prisma schema)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO users (name, email) VALUES 
('John Doe', 'john.doe@example.com'),
('Jane Smith', 'jane.smith@example.com')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Show created tables
SHOW TABLES;
