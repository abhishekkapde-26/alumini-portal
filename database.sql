CREATE TABLE alumni (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    year_of_passing INT,
    sector VARCHAR(100),
    achievements TEXT,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
