CREATE TABLE onboarding_sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    current_step INT DEFAULT 0,
    max_steps INT DEFAULT 12,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);

CREATE TABLE onboarding_messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    onboarding_session_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    content LONGTEXT NOT NULL,
    step INT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);