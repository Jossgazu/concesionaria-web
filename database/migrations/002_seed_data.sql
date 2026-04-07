-- Seed data for Concesionaria Web
-- Reference data for vehicle attributes

-- Sample users (for testing)
INSERT INTO users (id, email, password_hash, name, phone, role, bio) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@concesionaria.com', '$2a$10$dummyhash', 'Admin User', '+1234567890', 'admin', 'System administrator'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'seller@concesionaria.com', '$2a$10$dummyhash', 'John Seller', '+1234567891', 'seller', 'Trusted car dealer since 2015'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'buyer@concesionaria.com', '$2a$10$dummyhash', 'Jane Buyer', '+1234567892', 'buyer', 'Car enthusiast');

-- Sample vehicles (for testing)
INSERT INTO vehicles (id, seller_id, brand, model, year, mileage, price, body_type, fuel_type, transmission, color, description, status, verified) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Toyota', 'Camry', 2023, 15000, 28500.00, 'sedan', 'gasoline', 'automatic', 'Silver', 'Like new Toyota Camry, single owner, full service history', 'active', true),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Honda', 'CR-V', 2022, 25000, 33500.00, 'suv', 'hybrid', 'automatic', 'Blue', 'Honda CR-V Hybrid EX-L, leather seats, sunroof', 'active', true),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Tesla', 'Model 3', 2023, 8000, 44900.00, 'sedan', 'electric', 'automatic', 'White', 'Tesla Model 3 Long Range, Autopilot, premium audio', 'active', true);

-- Sample vehicle images
INSERT INTO vehicle_images (vehicle_id, image_url, is_primary, sort_order) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'https://example.com/camry-1.jpg', true, 1),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'https://example.com/camry-2.jpg', false, 2),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 'https://example.com/crv-1.jpg', true, 1),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'https://example.com/model3-1.jpg', true, 1);

-- Sample vehicle specs
INSERT INTO vehicle_specs (vehicle_id, engine, horsepower, torque, displacement, transmission_type, drivetrain, seats, doors, fuel_tank_capacity, safety_features, comfort_features) VALUES
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', '2.5L 4-Cylinder', 203, '182 lb-ft', 2.50, 'Automatic', 'FWD', 5, 4, 60.0, '["ABS", "EBD", "Traction Control", "Lane Departure Warning"]', '["Apple CarPlay", "Android Auto", "Backup Camera", "Keyless Entry"]'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', '2.0L Hybrid', 212, '232 lb-ft', 2.00, 'CVT', 'AWD', 5, 4, 53.0, '["Honda Sensing", "Collision Mitigation", "Road Departure Mitigation"]', '["Leather Seats", "Sunroof", "Power Liftgate", "Wireless Charging"]'),
('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66', 'Electric Motor', 346, '389 lb-ft', 0.0, 'Single-Speed', 'AWD', 5, 4, 0.0, '["Autopilot", "Collision Avoidance", "8 Cameras"]', '["15-inch Touchscreen", "Premium Audio", "Glass Roof", "Heated Seats"]');

-- Sample ratings
INSERT INTO ratings (rater_id, rated_user_id, vehicle_id, score, comment) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 5, 'Excellent seller, car was exactly as described!'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a55', 4, 'Good transaction, slightly delayed response time');

-- Sample favorites
INSERT INTO favorites (user_id, vehicle_id) VALUES
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66');

-- Sample notifications
INSERT INTO notifications (user_id, type, title, content, link) VALUES
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'rating', 'New Rating Received', 'You received a 5-star rating from Jane Buyer', '/dashboard/ratings'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'vehicle', 'Price Drop Alert', 'Tesla Model 3 is now priced lower!', '/vehicles/f0eebc99-9c0b-4ef8-bb6d-6bb9bd380a66');
