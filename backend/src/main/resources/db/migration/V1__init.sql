-- Flyway baseline migration (tables simplified)
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(100),
  password VARCHAR(255) NOT NULL,
  state VARCHAR(20) DEFAULT 'ACTIVE',
  register_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS category (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20),
  description VARCHAR(500),
  state VARCHAR(20) DEFAULT 'ACTIVE',
  user_id BIGINT,
  CONSTRAINT fk_user_category FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS "transaction" (
  id BIGSERIAL PRIMARY KEY,
  date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  amount DECIMAL(19,2) NOT NULL,
  description VARCHAR(500),
  type VARCHAR(20),
  state VARCHAR(20) DEFAULT 'ACTIVE',
  user_id BIGINT,
  CONSTRAINT fk_user_transaction FOREIGN KEY (user_id) REFERENCES users(id),
  category_id BIGINT,
  CONSTRAINT fk_category_transaction FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE IF NOT EXISTS budget (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255),
  month INT,
  year INT,
  limit_amount DECIMAL(19,2),
  user_id BIGINT,
  CONSTRAINT fk_user_budget FOREIGN KEY (user_id) REFERENCES users(id),
  category_id BIGINT,
  CONSTRAINT fk_category_budget FOREIGN KEY (category_id) REFERENCES category(id)
);

CREATE TABLE IF NOT EXISTS recovery_token (
  id BIGSERIAL PRIMARY KEY,
  token VARCHAR(255) NOT NULL,
  generated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  expiry_date TIMESTAMP,
  user_id BIGINT,
  CONSTRAINT fk_user_recovery_token FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS session(
  id BIGSERIAL PRIMARY KEY,
  token VARCHAR(255) NOT NULL,
  generated_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expiry_date TIMESTAMP,
  state VARCHAR(20) DEFAULT 'ACTIVE',
  user_id BIGINT,
  CONSTRAINT fk_user_session FOREIGN KEY (user_id) REFERENCES users(id)
);
