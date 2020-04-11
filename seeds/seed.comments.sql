-- First truncate any data out of the table if it exists
truncate table comments RESTART IDENTITY CASCADE;

INSERT INTO comments (location_id, comment_text, has_concern)
VALUES
(1, 'location 1 comment 1', false),
(1, 'location 1 comment 2', false),
(2, 'location 2 comment 1', false),
(2, 'location 2 comment 2', false);