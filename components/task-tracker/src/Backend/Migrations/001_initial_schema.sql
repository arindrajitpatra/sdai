-- PostgreSQL Initial Database DDL Migration Script
-- Component: TaskTracker

CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(50) NOT NULL,
    description VARCHAR(500) NULL,
    priority VARCHAR(10) NOT NULL DEFAULT 'Medium',
    due_date DATE NOT NULL,
    status VARCHAR(15) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_tasks_priority CHECK (priority IN ('Low', 'Medium', 'High')),
    CONSTRAINT chk_tasks_status CHECK (status IN ('Pending', 'Completed'))
);

-- Index for status filtering and sorting optimization
CREATE INDEX IF NOT EXISTS idx_tasks_status_created_at ON tasks (status, created_at DESC);

-- Index for title search optimization
CREATE INDEX IF NOT EXISTS idx_tasks_title ON tasks (title);
