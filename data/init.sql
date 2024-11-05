CREATE TABLE Demo (
    DemoID SERIAL PRIMARY KEY,
    Priority INT,
    Name TEXT NOT NULL UNIQUE,
    Message TEXT
);

CREATE TABLE Account (
    Account_ID SERIAL PRIMARY KEY,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Username VARCHAR(255) NOT NULL UNIQUE,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Phone VARCHAR(15) NOT NULL UNIQUE,
    Account_Role INT NOT NULL
);

CREATE TABLE Account_Credential (
    Credential_ID SERIAL PRIMARY KEY,
    Account_ID INT NOT NULL,
    Salted_Hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255),
    FOREIGN KEY(Account_ID) REFERENCES Account(Account_ID)
);

CREATE TABLE temp (
    id SERIAL PRIMARY KEY,
    isbn13 BIGINT,
    authors TEXT,
    publication_year INT,
    original_title TEXT,
    title TEXT,
    rating_avg FLOAT,
    rating_count INT,
    rating_1_star INT,
    rating_2_star INT,
    rating_3_star INT,
    rating_4_star INT,
    rating_5_star INT,
    image_url TEXT,
    image_small_url TEXT
);

CREATE TABLE Books (
    id SERIAL PRIMARY KEY,
    isbn13 BIGINT UNIQUE,
    publication_year INT,
    original_title TEXT,
    title TEXT,
    rating_avg FLOAT,
    rating_count INT,
    rating_1_star INT,
    rating_2_star INT,
    rating_3_star INT,
    rating_4_star INT,
    rating_5_star INT,
    image_url TEXT,
    image_small_url TEXT
);

CREATE TABLE Author (
    Author_ID SERIAL PRIMARY KEY,
    Author_Name TEXT NOT NULL UNIQUE
);

CREATE TABLE Books_Authors (
    isbn13 BIGINT NOT NULL,
    Author_ID INT NOT NULL,
    FOREIGN KEY (isbn13) REFERENCES Books(isbn13),
    FOREIGN KEY (Author_ID) REFERENCES Author(Author_ID),
    PRIMARY KEY (Author_ID, isbn13)
);

COPY temp
FROM '/docker-entrypoint-initdb.d/books.csv'
DELIMITER ','
CSV HEADER;

INSERT INTO Books (isbn13, publication_year, original_title, title, rating_avg, rating_count, rating_1_star, rating_2_star, rating_3_star, rating_4_star, rating_5_star, image_url, image_small_url)
SELECT isbn13, publication_year, original_title, title, rating_avg, rating_count, rating_1_star, rating_2_star, rating_3_star, rating_4_star, rating_5_star, image_url, image_small_url
FROM temp;

INSERT INTO Author (Author_Name)
SELECT DISTINCT unnest(string_to_array(authors, ','))
FROM temp;

INSERT INTO Books_Authors (isbn13, Author_ID)
SELECT t.isbn13, a.Author_ID
FROM temp t
JOIN Author a ON a.Author_Name = ANY(string_to_array(t.authors, ','));

DROP TABLE IF EXISTS temp;
