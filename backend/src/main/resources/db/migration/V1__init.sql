
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    registration_date TIMESTAMP NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS property_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) CHECK (type IN ('STRING', 'DATE', 'NUMBER', 'FIXED_LIST')) NOT NULL
);

CREATE TABLE IF NOT EXISTS customer_properties (
    id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(id) ON DELETE CASCADE,
    property_type_id INT REFERENCES property_types(id) ON DELETE CASCADE,
    value VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS fixed_list_values (
    id SERIAL PRIMARY KEY,
    property_id INT REFERENCES customer_properties(id) ON DELETE CASCADE,
    value VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    entity VARCHAR(50) NOT NULL,
    entity_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM roles) THEN
        INSERT INTO roles (name) VALUES 
            ('USER'),
            ('ADMIN');
    END IF;
END $$;

INSERT INTO users (username, password, role_id) 
VALUES ('admin', '$2a$12$pTCA8Bq4Y2NxiAC5NvIDMe0zFO6Jkb5Dp/lvUB6NSk.lvkVgrhDEy', 
        (SELECT id FROM roles WHERE name = 'ADMIN'));

