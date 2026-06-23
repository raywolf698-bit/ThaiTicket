CREATE TABLE draws (
  id               BIGINT PRIMARY KEY AUTO_INCREMENT,
  draw_date        DATE UNIQUE NOT NULL,
  winning_numbers  JSON NOT NULL,
  announced_at     DATETIME
);