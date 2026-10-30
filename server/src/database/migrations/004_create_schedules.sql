CREATE TABLE IF NOT EXISTS schedules (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,

    name VARCHAR(150) NOT NULL,
    start TIME NOT NULL,
    end TIME NOT NULL,
    class VARCHAR(100) NOT NULL,
    dosen VARCHAR(150) NOT NULL,
    ruangan VARCHAR(100) NOT NULL,
    hari VARCHAR(20) NOT NULL,
    jam_dibuat DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    type ENUM('akademik', 'non-akademik') NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    INDEX idx_schedule_user (user_id),

    CONSTRAINT fk_schedule_user
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
) ENGINE=InnoDB;