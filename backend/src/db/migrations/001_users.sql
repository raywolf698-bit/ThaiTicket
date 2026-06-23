CREATE TABLE users (
  id          BIGINT PRIMARY KEY AUTO_INCREMENT,
  phone       VARCHAR(20) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name        VARCHAR(100),
  country     VARCHAR(10),
  role        ENUM('user', 'agent', 'admin') DEFAULT 'user',
  kyc_status  ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
  is_banned   BOOLEAN DEFAULT FALSE,
  created_at  DATETIME DEFAULT NOW()
);

CREATE TABLE wallets (
  id       BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id  BIGINT UNIQUE NOT NULL,
  balance  DECIMAL(15,2) DEFAULT 0.00,
  FOREIGN KEY (user_id) REFERENCES users(id)
);