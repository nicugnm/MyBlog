CREATE TABLE
    regions (
        region_id INTEGER IDENTITY(1, 1),
        region_name NVARCHAR(20),

        PRIMARY KEY (region_id)
    );

INSERT INTO regions (region_name) VALUES ('REGIUNE-EUROPA');
INSERT INTO regions (region_name) VALUES ('REGIUNE-AFRICA');
INSERT INTO regions (region_name) VALUES ('REGIUNE-AMERICA');
INSERT INTO regions (region_name) VALUES ('REGIUNE-ASIA');
INSERT INTO regions (region_name) VALUES ('REGIUNE-OCEANIA');
INSERT INTO regions (region_name) VALUES ('POLII');
INSERT INTO regions (region_name) VALUES ('OCEANELE-TERREI');

CREATE FUNCTION IsValidPermissionType (@permission_type_id INT)
RETURNS BIT
AS
BEGIN
  DECLARE @result BIT;
  SET @result = 0;

  IF EXISTS (SELECT 1 FROM permission_type WHERE permission_type_id = @permission_type_id)
    SET @result = 1;

  RETURN @result;
END;

CREATE TABLE permission_type
(
  permission_type_id INTEGER NOT NULL PRIMARY KEY IDENTITY(1,1),
  permission_value NVARCHAR(10) NOT NULL
);

INSERT INTO permission_type (permission_value)
VALUES ('CREATE'), ('READ'), ('UPDATE'), ('DELETE');

CREATE TABLE
    roles (
        role_id INTEGER IDENTITY(1, 1),
        role_name NVARCHAR(20)

        PRIMARY KEY (role_id)
    );


-- DEFAULT role - 1
INSERT INTO roles (role_name) VALUES ('DEFAULT');
-- MODERATOR role - 2
INSERT INTO roles (role_name) VALUES ('MODERATOR');
-- ADMIN role - 3
INSERT INTO roles (role_name) VALUES ('ADMIN');

CREATE TABLE permissions (
  permission_id INTEGER NOT NULL PRIMARY KEY IDENTITY(1, 1),
  role_id INTEGER NOT NULL,
  permission_type_id INTEGER NOT NULL,
  FOREIGN KEY (role_id) REFERENCES roles (role_id),
  FOREIGN KEY (permission_type_id) REFERENCES permission_type (permission_type_id),
  CHECK (dbo.IsValidPermissionType(permission_type_id) = 1)
);

-- default user - only read - id 1
INSERT INTO permissions (role_id, permission_type_id) VALUES (1, (SELECT permission_type_id FROM permission_type WHERE permission_type.permission_value = 'READ'));
-- moderator user - read + update - id 2
INSERT INTO permissions (role_id, permission_type_id) VALUES (2, (SELECT permission_type_id FROM permission_type WHERE permission_type.permission_value = 'READ'));
INSERT INTO permissions (role_id, permission_type_id) VALUES (2, (SELECT permission_type_id FROM permission_type WHERE permission_type.permission_value = 'UPDATE'));
-- admin user - create + read + update + delete - id 3
INSERT INTO permissions (role_id, permission_type_id) VALUES (3, (SELECT permission_type_id FROM permission_type WHERE permission_type.permission_value = 'CREATE'));
INSERT INTO permissions (role_id, permission_type_id) VALUES (3, (SELECT permission_type_id FROM permission_type WHERE permission_type.permission_value = 'READ'));
INSERT INTO permissions (role_id, permission_type_id) VALUES (3, (SELECT permission_type_id FROM permission_type WHERE permission_type.permission_value = 'UPDATE'));
INSERT INTO permissions (role_id, permission_type_id) VALUES (3, (SELECT permission_type_id FROM permission_type WHERE permission_type.permission_value = 'DELETE'));

CREATE TABLE
    places (
        place_id INTEGER IDENTITY(1, 1),
        name NVARCHAR(50),
        description NVARCHAR(200),
        image_name NVARCHAR(50),
        region_id INTEGER,
        price DECIMAL,
        date DATE,
        rating FLOAT,

        PRIMARY KEY (place_id),

    CONSTRAINT fk_region_id FOREIGN KEY (region_id) REFERENCES regions (region_id)
    );

INSERT INTO places (name, description, image_name, region_id, price, date, rating) VALUES ('Turnul Eiffel', 'Turnul Eiffel din Paris', 'turnul-eiffel.jpg', (SELECT region_id from regions where region_name = 'REGIUNE-EUROPA'), 100, GETDATE(), 3);
INSERT INTO places (name, description, image_name, region_id, price, date, rating) VALUES ('Santorini', 'Santorini', 'santorini.jpg', (SELECT region_id from regions where region_name = 'REGIUNE-EUROPA'), 100, GETDATE(), 4);
INSERT INTO places (name, description, image_name, region_id, price, date, rating) VALUES ('Barcelona', 'Barcelona', 'barcelona.webp', (SELECT region_id from regions where region_name = 'REGIUNE-EUROPA'), 100, GETDATE(), 5);
INSERT INTO places (name, description, image_name, region_id, price, date, rating) VALUES ('Dubrovnik', 'Dubrovnik', 'dubrovnik.webp', (SELECT region_id from regions where region_name = 'REGIUNE-EUROPA'), 100, GETDATE(), 3);
INSERT INTO places (name, description, image_name, region_id, price, date, rating) VALUES ('Rome', 'Rome', 'rome.webp', (SELECT region_id from regions where region_name = 'REGIUNE-EUROPA'), 100, GETDATE(), 4);
INSERT INTO places (name, description, image_name, region_id, price, date, rating) VALUES ('Venice', 'Venice', 'venice.webp', (SELECT region_id from regions where region_name = 'REGIUNE-EUROPA'), 100, GETDATE(), 5);
INSERT INTO places (name, description, image_name, region_id, price, date, rating) VALUES ('London', 'London', 'london.webp', (SELECT region_id from regions where region_name = 'REGIUNE-EUROPA'), 100, GETDATE(), 2);

INSERT INTO places (name, description, image_name, region_id, price, date, rating) VALUES ('Grand Canion', 'Grand Canion', 'grand-canion.jpeg', (SELECT region_id from regions where region_name = 'REGIUNE-AMERICA'), 200, GETDATE(), 3);
INSERT INTO places (name, description, image_name, region_id, price, date, rating) VALUES ('Yellowstone', 'Yellowstone', 'yellowstone.jpeg', (SELECT region_id from regions where region_name = 'REGIUNE-AMERICA'), 200, GETDATE(), 4);
INSERT INTO places (name, description, image_name, region_id, price, date, rating) VALUES ('Yosemite', 'Yosemite', 'yosemite.jpeg', (SELECT region_id from regions where region_name = 'REGIUNE-AMERICA'), 200, GETDATE(), 5);
INSERT INTO places (name, description, image_name, region_id, price, date, rating) VALUES ('Maui', 'Maui', 'maui.jpeg', (SELECT region_id from regions where region_name = 'REGIUNE-AMERICA'), 200, GETDATE(), 5);
INSERT INTO places (name, description, image_name, region_id, price, date, rating) VALUES ('Glacier National Park', 'Glacier National Park', 'glacier-national-park.jpeg', (SELECT region_id from regions where region_name = 'REGIUNE-AMERICA'), 200, GETDATE(), 2);

CREATE TABLE
    users (
        user_id INTEGER IDENTITY(1, 1),
        username NVARCHAR(20) NOT NULL,
        firstname NVARCHAR(20) NOT NULL,
        lastname NVARCHAR(20) NOT NULL,
        email NVARCHAR(20) NOT NULL,
        password NVARCHAR(20) NOT NULL,
        birth_date DATE NOT NULL,
        register_date DATE DEFAULT GETDATE(),
        chat_color NVARCHAR(20) DEFAULT 'BLACK',
        role_id INTEGER,
        telephone_number INTEGER,
        profile_image BINARY,

        PRIMARY KEY (user_id),

    CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles(role_id)
    );