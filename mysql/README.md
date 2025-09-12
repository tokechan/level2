
# MySQL Docker Setup

## Overview
This directory contains Docker configuration for MySQL database used in the Simple CRUD application.

## Files
- `Dockerfile` - MySQL 8.0 Docker image configuration
- `init/01-init.sql` - Database initialization script
- `../docker-compose.yml` - Docker Compose configuration

## Usage

### Start MySQL with Docker
```bash
# Start MySQL container
docker-compose up -d mysql

# View logs
docker-compose logs mysql

# Stop MySQL container
docker-compose down
```

### Connect to MySQL
```bash
# Connect using MySQL client
mysql -h localhost -P 3307 -u root -p

# Or connect using Docker
docker exec -it simple-crud-mysql mysql -u root -p
```

### Environment Variables for Docker
Create `.env` file with:
```env
DATABASE_URL="mysql://root:password@localhost:3307/simple_crud_db"
```

### phpMyAdmin (Optional)
Access phpMyAdmin at: http://localhost:8080
- Username: root
- Password: password

## Ports
- MySQL: 3307 (mapped from container port 3306)
- phpMyAdmin: 8080

## Data Persistence
Database data is persisted in Docker volume `mysql_data`.
