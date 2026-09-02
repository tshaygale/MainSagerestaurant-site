/*
# Add more menu items (Brunch & Breakfast category, plus more dishes)

1. Data only — no schema changes
- Adds a new "Brunch" category with 6 dishes
- Adds 2 more Starters, 2 more Mains, 2 more Desserts, 2 more Drinks
- All items use real Pexels image URLs
*/

INSERT INTO menu_items (name, description, price, category, image_url, tags, is_featured, sort_order) VALUES

-- New Brunch category
('Avocado Smash Toast', 'Sourdough, smashed avocado, chili oil, poached eggs, microgreens', 13.00, 'Brunch', 'https://images.pexels.com/photos/793772/pexels-photo-793772.jpeg', '{"Vegetarian","Chef''s Pick"}', true, 1),
('Berry Pancake Stack', 'Fluffy buttermilk pancakes, mixed berries, maple syrup, vanilla cream', 12.50, 'Brunch', 'https://images.pexels.com/photos/10084717/pexels-photo-10084717.jpeg', '{"Vegetarian"}', false, 2),
('Mediterranean Breakfast', 'Eggs, olives, feta, tomato, cucumber, warm bread, herbal tea', 15.00, 'Brunch', 'https://images.pexels.com/photos/35047345/pexels-photo-35047345.jpeg', '{"Vegetarian","Gluten-Free"}', false, 3),
('Eggs Florentine', 'Poached eggs, sauteed spinach, hollandaise, English muffin', 13.50, 'Brunch', 'https://images.pexels.com/photos/6240845/pexels-photo-6240845.jpeg', '{"Vegetarian"}', false, 4),
('Heart Pancakes & Bacon', 'Heart-shaped pancakes, crispy bacon, coffee', 14.00, 'Brunch', 'https://images.pexels.com/photos/15538239/pexels-photo-15538239.jpeg', '{}', false, 5),
('Brunch Board', 'Avocado toast, eggs, fruit bowl, latte art, cappuccino', 18.00, 'Brunch', 'https://images.pexels.com/photos/12061487/pexels-photo-12061487.jpeg', '{"Vegetarian","Chef''s Pick"}', true, 6),

-- Additional Starters
('Salmon Tartare', 'Dill, capers, shallot, rye crisp, citrus', 16.00, 'Starters', 'https://images.pexels.com/photos/38431244/pexels-photo-38431244.jpeg', '{"Gluten-Free"}', false, 5),
('Veggie Dumplings', 'Garden vegetable dumplings, rich soy reduction, caviar', 14.00, 'Starters', 'https://images.pexels.com/photos/18229217/pexels-photo-18229217.jpeg', '{"Vegetarian"}', false, 6),

-- Additional Mains
('Grilled Sea Bass', 'Whole sea bass, fennel, citrus, olive oil, herbs', 28.00, 'Mains', 'https://images.pexels.com/photos/6046747/pexels-photo-6046747.jpeg', '{"Gluten-Free"}', false, 6),
('Beef Carpaccio Plate', 'Thinly sliced beef, arugula, cherry tomato, parmesan', 25.00, 'Mains', 'https://images.pexels.com/photos/20051271/pexels-photo-20051271.jpeg', '{"Gluten-Free"}', false, 7),

-- Additional Desserts
('Panna Cotta', 'Vanilla bean cream, strawberry coulis, shortbread', 9.00, 'Desserts', 'https://images.pexels.com/photos/10134248/pexels-photo-10134248.jpeg', '{"Vegetarian"}', false, 4),
('Berry Cheesecake', 'Baked cheesecake, raspberry sauce, pistachio crumb', 10.50, 'Desserts', 'https://images.pexels.com/photos/37418881/pexels-photo-37418881.jpeg', '{"Vegetarian"}', false, 5),

-- Additional Drinks
('Cappuccino', 'Double espresso, steamed milk, cocoa dust', 4.00, 'Drinks', 'https://images.pexels.com/photos/2074124/pexels-photo-2074124.jpeg', '{}', false, 5),
('Iced Latte', 'Espresso, cold milk, ice, light agave', 5.50, 'Drinks', 'https://images.pexels.com/photos/24532332/pexels-photo-24532332.jpeg', '{"Vegan"}', false, 6)

ON CONFLICT DO NOTHING;
