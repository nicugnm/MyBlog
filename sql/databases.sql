CREATE TABLE IF NOT EXISTS
    categories (
        category_id SERIAL,
        category_name VARCHAR,

        PRIMARY KEY (category_id)
)

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