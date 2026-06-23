CREATE TABLE wallet_transactions (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id    BIGINT NOT NULL,
  type       ENUM('deposit','withdrawal','purchase','refund','payout','promptpay','wave','usdt') NOT NULL,
  amount     DECIMAL(15,2) NOT NULL,
  ref        VARCHAR(100),
  created_at DATETIME DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE audit_logs (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id    BIGINT,
  method     VARCHAR(10),
  path       VARCHAR(255),
  status     INT,
  ip         VARCHAR(45),
  created_at DATETIME DEFAULT NOW()
);