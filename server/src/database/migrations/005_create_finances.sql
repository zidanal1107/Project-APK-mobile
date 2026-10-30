CREATE TABLE IF NOT EXISTS finances (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,

    title VARCHAR(150) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    type ENUM('pemasukan', 'pengeluaran') NOT NULL,
    kategori VARCHAR(100) NOT NULL,
    date DATE NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_finance_user (user_id),

    CONSTRAINT fk_finance_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;