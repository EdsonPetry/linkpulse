DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS url;

CREATE TABLE user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE url (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    url TEXT NOT NULL,
    alias TEXT,
    check_interval_seconds INTEGER,
    http_method TEXT,
    expected_status_code INTEGER,
    expected_content_match TEXT,
    is_active INTEGER NOT NULL DEFAULT 0 CHECK(is_active IN (0, 1)),
    last_status TEXT,
    last_response_time_ms INTEGER,
    FOREIGN KEY (user_id) REFERENCES user (id)
);

