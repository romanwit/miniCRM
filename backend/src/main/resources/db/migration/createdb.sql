DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'minicrm_db') THEN
		CREATE EXTENSION IF NOT EXISTS dblink;
        PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE minicrm_db');
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'project_user') THEN
        CREATE USER project_user WITH PASSWORD 'admin';
    END IF;
END $$;

--\c minicrm_db;

GRANT USAGE, CREATE ON SCHEMA public TO project_user;

GRANT ALL PRIVILEGES ON DATABASE minicrm_db TO project_user;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO project_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO project_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO project_user;
