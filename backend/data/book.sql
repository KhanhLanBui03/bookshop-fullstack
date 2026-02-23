INSERT INTO books
(title, description, original_price, sale_price, rating, status, sold_count, stock, author_id, category_id, publisher_id, created_at, updated_at)
VALUES
('Clean Code', 'A Handbook of Agile Software Craftsmanship', 350000, 299000, 4.8, 'ACTIVE', 1520, 120, 5, 1, 1, NOW(), NOW()),
('Effective Java', 'Best practices for Java programming', 420000, 379000, 4.9, 'ACTIVE', 2100, 80, 5, 1, 1, NOW(), NOW()),
('Design Patterns', 'Reusable Object-Oriented Software', 450000, 399000, 4.7, 'ACTIVE', 980, 60, 5, 1, 1, NOW(), NOW()),
('Spring in Action', 'Comprehensive guide to Spring Framework', 390000, 349000, 4.6, 'ACTIVE', 870, 100, 5, 1, 1, NOW(), NOW()),
('Refactoring', 'Improving the Design of Existing Code', 430000, 389000, 4.8, 'ACTIVE', 1340, 75, 5, 1, 1, NOW(), NOW()),
('Domain-Driven Design', 'Tackling Complexity in Software', 500000, 459000, 4.7, 'ACTIVE', 760, 40, 5, 1, 1, NOW(), NOW()),
('The Pragmatic Programmer', 'Journey to Mastery', 380000, 329000, 4.9, 'ACTIVE', 1890, 95, 5, 1, 1, NOW(), NOW()),
('Microservices Patterns', 'Designing scalable systems', 470000, 420000, 4.5, 'ACTIVE', 640, 55, 5, 1, 1, NOW(), NOW()),
('You Don’t Know JS', 'Deep dive into JavaScript', 300000, 259000, 4.4, 'ACTIVE', 1200, 140, 5, 1, 1, NOW(), NOW()),
('System Design Interview', 'Insider guide to system design', 520000, 479000, 4.9, 'ACTIVE', 2300, 35, 5, 1, 1, NOW(), NOW()),

('Atomic Habits', 'Build good habits & break bad ones', 280000, 230000, 4.8, 'ACTIVE', 3100, 200, 5, 1, 1, NOW(), NOW()),
('Deep Work', 'Rules for focused success', 320000, 270000, 4.7, 'ACTIVE', 2100, 150, 5, 1, 1, NOW(), NOW()),
('Rich Dad Poor Dad', 'Personal finance classic', 250000, 210000, 4.6, 'ACTIVE', 4000, 300, 5, 1, 1, NOW(), NOW()),
('The Lean Startup', 'Startup methodology', 330000, 290000, 4.5, 'ACTIVE', 1850, 130, 5, 1, 1, NOW(), NOW()),
('Zero to One', 'Notes on startups', 310000, 260000, 4.4, 'ACTIVE', 1400, 90, 5, 1, 1, NOW(), NOW()),

('Harry Potter 1', 'The Philosopher’s Stone', 220000, 180000, 4.9, 'ACTIVE', 5000, 500, 5, 1, 1, NOW(), NOW()),
('Harry Potter 2', 'The Chamber of Secrets', 230000, 190000, 4.9, 'ACTIVE', 4700, 450, 5, 1, 1, NOW(), NOW()),
('Harry Potter 3', 'The Prisoner of Azkaban', 240000, 200000, 4.9, 'ACTIVE', 4500, 430, 5, 1, 1, NOW(), NOW()),
('Harry Potter 4', 'The Goblet of Fire', 260000, 220000, 4.9, 'ACTIVE', 4200, 410, 5, 1, 1, NOW(), NOW()),
('Harry Potter 5', 'The Order of the Phoenix', 270000, 230000, 4.8, 'ACTIVE', 3900, 390, 5, 1, 1, NOW(), NOW()),

('The Alchemist', 'Spiritual journey novel', 200000, 170000, 4.7, 'ACTIVE', 3600, 280, 5, 1, 1, NOW(), NOW()),
('The Power of Now', 'Guide to spiritual enlightenment', 290000, 240000, 4.6, 'ACTIVE', 1700, 120, 5, 1, 1, NOW(), NOW()),
('Thinking in Java', 'Comprehensive Java guide', 410000, 360000, 4.5, 'ACTIVE', 800, 60, 5, 1, 1, NOW(), NOW()),
('Head First Design Patterns', 'Visual learning approach', 370000, 320000, 4.8, 'ACTIVE', 1250, 85, 5, 1, 1, NOW(), NOW()),
('Clean Architecture', 'Software structure & design', 450000, 400000, 4.8, 'ACTIVE', 1500, 70, 5, 1, 1, NOW(), NOW()),

('Grokking Algorithms', 'Illustrated algorithms guide', 340000, 300000, 4.7, 'ACTIVE', 1100, 95, 5, 1, 1, NOW(), NOW()),
('Cracking the Coding Interview', 'Interview preparation book', 480000, 430000, 4.9, 'ACTIVE', 2600, 120, 5, 1, 1, NOW(), NOW()),
('Introduction to Algorithms', 'CLRS algorithm bible', 600000, 550000, 4.8, 'ACTIVE', 900, 45, 5, 1, 1, NOW(), NOW()),
('The Mythical Man-Month', 'Software project management', 360000, 310000, 4.4, 'ACTIVE', 700, 50, 5, 1, 1, NOW(), NOW()),
('Working Effectively with Legacy Code', 'Maintain legacy systems', 420000, 370000, 4.6, 'ACTIVE', 650, 40, 5, 1, 1, NOW(), NOW()),

('Code Complete', 'Practical handbook of construction', 520000, 470000, 4.9, 'ACTIVE', 1800, 65, 5, 1, 1, NOW(), NOW()),
('The Clean Coder', 'Professional programmer guide', 390000, 340000, 4.7, 'ACTIVE', 1300, 90, 5, 1, 1, NOW(), NOW()),
('Sapiens', 'Brief history of humankind', 300000, 250000, 4.8, 'ACTIVE', 3500, 200, 5, 1, 1, NOW(), NOW()),
('Homo Deus', 'Future of humanity', 320000, 270000, 4.6, 'ACTIVE', 2000, 150, 5, 1, 1, NOW(), NOW()),
('The Psychology of Money', 'Timeless lessons on wealth', 280000, 230000, 4.8, 'ACTIVE', 2800, 180, 5, 1, 1, NOW(), NOW()),

('The Art of Computer Programming', 'Donald Knuth classic', 800000, 750000, 5.0, 'ACTIVE', 500, 20, 5, 1, 1, NOW(), NOW()),
('Algorithms Unlocked', 'Understand algorithms easily', 350000, 300000, 4.4, 'ACTIVE', 750, 60, 5, 1, 1, NOW(), NOW()),
('Deep Learning', 'Neural networks & AI', 650000, 600000, 4.7, 'ACTIVE', 820, 55, 5, 1, 1, NOW(), NOW()),
('Artificial Intelligence Basics', 'Intro to AI concepts', 420000, 380000, 4.3, 'ACTIVE', 600, 70, 5, 1, 1, NOW(), NOW()),
('Machine Learning Yearning', 'Practical ML strategy', 300000, 260000, 4.5, 'ACTIVE', 950, 85, 5, 1, 1, NOW(), NOW()),

('Eloquent JavaScript', 'Modern JavaScript guide', 310000, 270000, 4.6, 'ACTIVE', 1400, 120, 5, 1, 1, NOW(), NOW()),
('Learning React', 'React fundamentals', 330000, 290000, 4.5, 'ACTIVE', 1600, 110, 5, 1, 1, NOW(), NOW()),
('Vue.js Guide', 'Build reactive web apps', 290000, 250000, 4.3, 'ACTIVE', 900, 100, 5, 1, 1, NOW(), NOW()),
('Node.js Design Patterns', 'Advanced Node.js concepts', 410000, 360000, 4.7, 'ACTIVE', 1000, 75, 5, 1, 1, NOW(), NOW()),
('Docker Deep Dive', 'Containerization explained', 380000, 330000, 4.6, 'ACTIVE', 870, 65, 5, 1, 1, NOW(), NOW());