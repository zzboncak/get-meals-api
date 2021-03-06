-- First truncate any data out of the table if it exists
truncate table locations CASCADE;

INSERT INTO locations (location_name, street_address, city, state, zip, open_hour, close_hour, website, location_description, location_type, location_longitude, location_latitude)
VALUES
('Highpoint Church', '1805 High Point Drive', 'Naperville', 'Illinois', 60563, '11:00 AM', '1:00 PM', 'www.highpoint.church', 'They pass out food and pantry goods', 'Other Non-Profit', -88.1231623, 41.8052875),
('Slavation Army St. Charles', '1710 S. 7th Avenue', 'St. Charles', 'Illinois', 60174, '10:00 AM', '2:00 PM', 'centralusa.salvationarmy.org/tricity/', 'They do the most good', 'Food Bank', -88.2945505, 41.9016531);