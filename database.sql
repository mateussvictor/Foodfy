DROP DATABASE IF EXISTS foodfy;
CREATE DATABASE foodfy;

-- to run seeds
DELETE FROM recipe_files;
DELETE FROM recipes;
DELETE FROM users;
DELETE FROM chefs;
DELETE FROM files;

-- restart sequence auto_increment from tables id
ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1;
ALTER SEQUENCE recipe_files_id_seq RESTART WITH 1;
ALTER SEQUENCE chefs_id_seq RESTART WITH 1;


CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "name" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "password" text NOT NULL,
  "reset_token" text,
  "reset_token_expires" text,
	"is_admin" BOOLEAN NOT NULL DEFAULT false,
  "created_at" timestamp DEFAULT(now()),
  "updated_at" timestamp DEFAULT(now())
);


CREATE TABLE files (
	id SERIAL PRIMARY KEY,
  name TEXT,
  path TEXT NOT NULL
);


CREATE TABLE chefs (
	id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  file_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT (now()),
  updated_at TIMESTAMP DEFAULT (now())
);


CREATE TABLE recipes (
	id SERIAL PRIMARY KEY,
  chef_id INT NOT NULL REFERENCES "chefs"(id),
  user_id INT NOT NULL REFERENCES "users"(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  ingredients TEXT[] NOT NULL,
  preparation TEXT[] NOT NULL,
  information TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT (now()),
  updated_at TIMESTAMP DEFAULT (now())
);


CREATE TABLE recipe_files (
	id SERIAL PRIMARY KEY,
  recipe_id INT REFERENCES "recipes"("id") ON DELETE CASCADE,
  file_id INT REFERENCES "files"("id") ON DELETE CASCADE
);


CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
CREATE INDEX "IDX_session_expire" ON "session" ("expire");


ALTER TABLE "chefs" ADD FOREIGN KEY ("file_id") REFERENCES "files"("id");


--create procedure
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = NOW();
END;
$$ LANGUAGE plpgsql;


--auto updated_at recipes
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

--auto updated_at chefs
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON chefs
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

--auto updated_at users
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


CREATE OR REPLACE FUNCTION delete_files_when_recipe_files_row_was_deleted()
RETURNS TRIGGER AS $$
BEGIN
EXECUTE ('DELETE FROM files
WHERE id = $1')
USING OLD.file_id;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- user cascade trigger
CREATE TRIGGER delete_recipe_files
AFTER DELETE ON recipe_files
FOR EACH ROW
EXECUTE PROCEDURE delete_files_when_recipe_files_row_was_deleted();
