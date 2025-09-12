# MySQL 8.0 Dockerfile for development
FROM mysql:8.0

# Set environment variables
ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=simple_crud_db
ENV MYSQL_USER=simple_crud
ENV MYSQL_PASSWORD=password

# Copy initialization scripts
COPY ./init/ /docker-entrypoint-initdb.d/

# Expose MySQL port
EXPOSE 3306

# Set default command
CMD ["mysqld"]
