CREATE TABLE IF NOT EXISTS
    categories (
        category_id SERIAL,
        category_name VARCHAR,

        PRIMARY KEY (category_id)
    );

CREATE TABLE IF NOT EXISTS
    roles (
        role_id SERIAL,
        permissions VARCHAR,

        PRIMARY KEY (role_id)
    );

CREATE TABLE IF NOT EXISTS
    products (
        product_id SERIAL,
        name VARCHAR,
        description VARCHAR,
        image_url VARCHAR,
        category_id INTEGER,
        price DECIMAL,
        date DATE,

        PRIMARY KEY (category_id),

    CONSTRAINT fk_category_id FOREIGN KEY (category_id) REFERENCES categories (category_id)
    );

CREATE TABLE IF NOT EXISTS
    users (
        user_id SERIAL,
        username VARCHAR NOT NULL,
        firstname VARCHAR NOT NULL,
        lastname VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        password VARCHAR NOT NULL,
        birth_date DATE NOT NULL,
        register_date DATE DEFAULT NOW(),
        chat_color VARCHAR DEFAULT 'BLACK',
        role_id INTEGER,
        telephone_number INTEGER,
        profile_image BYTEA,

        PRIMARY KEY (user_id),

    CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles(role_id)
    );