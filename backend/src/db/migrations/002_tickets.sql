CREATE TABLE tickets (
  id         BIGINT PRIMARY KEY AUTO_INCREMENT,
  number     VARCHAR(10) NOT NULL,
  draw_date  DATE NOT NULL,
  price      DECIMAL(10,2) NOT NULL,
  `set`      VARCHAR(10),
  series     VARCHAR(10),
  status     ENUM('available', 'reserved', 'sold') DEFAULT 'available',
  owner_id   BIGINT,
  created_at DATETIME DEFAULT NOW(),
  FOREIGN KEY (owner_id) REFERENCES users(id)
);