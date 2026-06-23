CREATE TABLE orders (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id    BIGINT NOT NULL,
  ticket_id  BIGINT NOT NULL,
  amount     DECIMAL(10,2) NOT NULL,
  status     ENUM('pending', 'completed', 'refunded') DEFAULT 'pending',
  created_at DATETIME DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (ticket_id) REFERENCES tickets(id)
);