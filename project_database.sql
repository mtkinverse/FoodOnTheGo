CREATE DATABASE online_food_system;

USE online_food_system;

 ------------------------------------------------ tables / entities --------------------------------------------

CREATE TABLE OTP (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expiration_time DATETIME NOT NULL,
  UNIQUE KEY unique_email (email)
);


CREATE TABLE Customer(
   Customer_id INT AUTO_INCREMENT PRIMARY KEY,
   Customer_Name VARCHAR(100) NOT NULL,
   Email_address VARCHAR(100) NOT NULL UNIQUE,
   Account_Password VARCHAR(100) NOT NULL,
   phone_no VARCHAR(20) NOT NULL UNIQUE
);
ALTER TABLE Customer AUTO_INCREMENT = 99190;

CREATE TABLE Restaurant_Owner (
   Owner_id INT AUTO_INCREMENT PRIMARY KEY,
   Owner_Name VARCHAR(100) NOT NULL,
   Email_address VARCHAR(100) NOT NULL UNIQUE,
   Account_Password VARCHAR(100) NOT NULL,
   Phone_no VARCHAR(20) NOT NULL 
);
ALTER TABLE Restaurant_Owner AUTO_INCREMENT = 1500; -- id starts from 1500
ALTER TABLE Restaurant_Owner MODIFY Phone_no VARCHAR(20) UNIQUE;


CREATE TABLE Restaurant (
    Restaurant_id INT AUTO_INCREMENT PRIMARY KEY,
    Restaurant_Name VARCHAR(100) NOT NULL,
    OpensAt TIME NOT NULL,
    ClosesAt TIME NOT NULL,
    Restaurant_Image Varchar(50) NOT NULL,
    Rating DECIMAL(2,1) DEFAULT 5, -- ratings like 4.5,4.7
    Owner_id INT,
    Location_id INT,
    Menu_id INT DEFAULT NULL -- resta urant created,can be added later
);
ALTER TABLE Restaurant AUTO_INCREMENT = 6500; -- ids start from 6500
ALTER TABLE Restaurant ADD COLUMN open_status bool DEFAULT TRUE;
ALTER TABLE Restaurant ADD COLUMN r_admin INT DEFAULT NULL;
ALTER TABLE Restaurant ADD CONSTRAINT location_fk FOREIGN KEY(Location_id) REFERENCES Locations(Location_id);
ALTER TABLE Restaurant ADD CONSTRAINT admin_fk FOREIGN KEY(r_admin) REFERENCES restaurant_admin(admin_id);


CREATE TABLE Locations (
    Location_id INT AUTO_INCREMENT PRIMARY KEY,
    Address VARCHAR(100) NOT NULL,
    Contact_No VARCHAR(20) NOT NULL
);
ALTER TABLE Locations MODIFY Contact_No VARCHAR(20) UNIQUE;
ALTER TABLE Locations AUTO_INCREMENT = 10100 ; -- ids start from 10100

CREATE TABLE Restaurant_Admin (
   Admin_id INT AUTO_INCREMENT PRIMARY KEY,
   Location_id INT NOT NULL,
   Admin_Name VARCHAR(100) NOT NULL,
   Email_address VARCHAR(100) NOT NULL UNIQUE,
   Account_Password VARCHAR(100) NOT NULL,
   Phone_no VARCHAR(20) NOT NULL
);
ALTER TABLE Restaurant_Admin AUTO_INCREMENT = 9150;
ALTER TABLE Restaurant_Admin MODIFY Phone_no VARCHAR(20) UNIQUE;


CREATE TABLE Menu 
(
    Menu_id INT AUTO_INCREMENT PRIMARY KEY
);

ALTER TABLE Menu AUTO_INCREMENT = 45301;

CREATE TABLE Menu_Items (
    Item_id INT AUTO_INCREMENT PRIMARY KEY,
    Dish_Name VARCHAR(50) NOT NULL,
    Item_Price FLOAT NOT NULL,
    Item_image Varchar(100) NOT NULL,
    Cuisine VARCHAR(50) NOT NULL,
    Menu_id INT NOT NULL
);
ALTER TABLE Menu_Items AUTO_INCREMENT = 18029;
ALTER TABLE MEnu_Items ADD COLUMN Category VARCHAR(50);

select * from restaurant_owner;
select * from restaurant;
select * from customer;

show tables;

CREATE TABLE DeliveryAddress(
    Address_id INT AUTO_INCREMENT PRIMARY KEY,
    Address VARCHAR(100) NOT NULL,
    PhoneNo VARCHAR(20) NOT NULL,
    NearbyPoint VARCHAR(50) DEFAULT NULL
);
ALTER TABLE DeliveryAddress AUTO_INCREMENT = 23838;
alter table DeliveryAddress add latitude FLOAT not null;
alter table DeliveryAddress add longitude FLOAT not null;


CREATE TABLE Delivery_Rider(
    Rider_id INT AUTO_INCREMENT PRIMARY KEY,
    Rider_name VARCHAR(100) NOT NULL,
    Email_address VARCHAR(100) NOT NULL UNIQUE,
    Account_Password VARCHAR(100) NOT NULL,
    Phone_No VARCHAR(20) NOT NULL,
    BikeNo VARCHAR(20) DEFAULT NULL,
    Available BOOLEAN DEFAULT TRUE,
    Restaurant_id INT DEFAULT NULL
);
ALTER TABLE Delivery_Rider AUTO_INCREMENT = 102922;
ALTER TABLE Delivery_Rider ADD COLUMN Restaurant_id INT DEFAULT NULL;
ALTER TABLE Delivery_Rider ADD CONSTRAINT Restaurant_fk Foreign key (Restaurant_id) REFERENCES Restaurant(Restaurant_id);
ALTER TABLE Delivery_Rider MODIFY Phone_no VARCHAR(20) UNIQUE;
ALTER TABLE Delivery_Rider MODIFY BikeNo VARCHAR(20) UNIQUE;

drop table Rider_Tips;
CREATE TABLE Rider_Tips (
    rider_id INT NOT NULL,
    tips INT DEFAULT 0,    
    tip_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (rider_id, tip_date)
);

ALTER TABLE Rider_Tips ADD CONSTRAINT rid_fk FOREIGN KEY(rider_id) REFERENCES delivery_rider(rider_id);



CREATE TABLE Orders (
    Customer_id INT NOT NULL,
    Order_id INT AUTO_INCREMENT PRIMARY KEY,
    Order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    Order_Status VARCHAR(50) CHECK (Order_Status IN ('Placed', 'Preparing', 'Out for delivery', 'Delivered')), 
    Restaurant_id INT NOT NULL, 
    Review_id INT DEFAULT NULL,
    Address_id INT NOT NULL,
    Delivered_by_id INT DEFAULT NULL
);
ALTER TABLE Orders AUTO_INCREMENT = 75638;

-- isse status update ka time ajayega display user ko hoga
ALTER TABLE Orders ADD COLUMN Instructions VARCHAR(100);
ALTER TABLE Orders ADD COLUMN promo_id INT DEFAULT NULL;
ALTER TABLE Orders ADD CONSTRAINT promo_fk foreign key(promo_id) REFERENCES promos(promo_id) ON DELETE SET NULL;
ALTER TABLE Orders ADD COLUMN total_amount FLOAT DEFAULT 0;
ALTER TABLE Orders ADD COLUMN rider_tip INT DEFAULT 0;

select * from orders;
select * from rider_tips;

CREATE TABLE Ordered_Items (
    Order_id INT default NULL,
    Item_id INT NOT NULL,
    quantity FLOAT NOT NULL
);

ALTER TABLE Ordered_Items ADD COLUMN price FLOAT; -- to manage the discounted price!

CREATE TABLE Order_Review(
    Review_id INT AUTO_INCREMENT PRIMARY KEY,
    Review_Description VARCHAR(100),
    Rating DECIMAL(2,1) NOT NULL
);
ALTER TABLE Order_Review AUTO_INCREMENT = 73638;

drop table promos;
CREATE TABLE Promos (
    promo_id INT PRIMARY KEY AUTO_INCREMENT,
    restaurant_id INT,
    promo_code VARCHAR(100),
    promo_value FLOAT, 
    start_date DATE,
    end_date DATE,
    usage_limit INT
);

ALTER TABLE Promos ADD CONSTRAINT r_fk foreign key(restaurant_id) REFERENCES Restaurant(restaurant_id) ON DELETE CASCADE;
ALTER TABLE Promos AUTO_INCREMENT = 8829292;
ALTER TABLE Promos ADD COLUMN Min_Total FLOAT ;

drop table Discount;
CREATE TABLE Discount(
   discount_id INT PRIMARY KEY AUTO_INCREMENT,
   discount_value FLOAT,
   restaurant_id INT,
   start_date DATE,
   end_date DATE
);

ALTER TABLE Discount AUTO_INCREMENT =3733378;
ALTER TABLE Discount ADD CONSTRAINT res_fk FOREIGN KEY(restaurant_id) REFERENCES Restaurant(restaurant_id) ON DELETE CASCADE;


CREATE TABLE Complaints(
    Complaint_id int AUTO_INCREMENT PRIMARY KEY,
    Restaurant_id INT NOT NULL,
    Customer_id INT NOT NULL,
    Order_id INT NOT NULL,
    Status varchar(20) CHECK (status IN ('Lodged','Pending','Addressed')),
    Complaint_Desc varchar(200)
);
ALTER TABLE Complaints AUTO_INCREMENT = 3000;
------------------------------------------------ triggers & procedures -----------------------

CREATE TRIGGER delete_order_address
AFTER DELETE ON orders
FOR EACH ROW
BEGIN
    DELETE FROM deliveryaddress
    WHERE address_id = OLD.Address_id;
END
/

CREATE TRIGGER deleted_ordered_items
AFTER DELETE ON orders
FOR EACH ROW
BEGIN
    DELETE FROM ordered_items
    WHERE order_id = OLD.order_id;
END
/

CREATE TRIGGER delete_location
AFTER DELETE ON restaurant
FOR EACH ROW
BEGIN
    DELETE FROM locations
    WHERE location_id = OLD.location_id;
END
/

CREATE TRIGGER assign_menu_to_restaurant
BEFORE INSERT ON Restaurant
FOR EACH ROW
BEGIN
    INSERT INTO Menu () 
    VALUES ();

   SET NEW.Menu_id = LAST_INSERT_ID();
END
/

CREATE TRIGGER delete_restaurant_menu 
BEFORE DELETE ON Restaurant
FOR EACH ROW
BEGIN
      DELETE from Menu where menu_id = OLD.menu_id;
END
/

CREATE TRIGGER AssignRestaurantToRider
BEFORE INSERT ON Delivery_Rider
FOR EACH ROW
BEGIN
    DECLARE available_restaurant_id INT;

    SELECT r.Restaurant_id 
    INTO available_restaurant_id
    FROM Restaurant r
    LEFT JOIN Delivery_Rider dr ON r.Restaurant_id = dr.Restaurant_id
    GROUP BY r.Restaurant_id
    ORDER BY COUNT(dr.Rider_id) ASC -- Order by the number of riders, ascending
    LIMIT 1;

    -- Assign the restaurant ID to the new rider
    IF available_restaurant_id IS NOT NULL THEN
        SET NEW.Restaurant_id = available_restaurant_id;
    ELSE
        -- Handle the case where no restaurants are available
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'No restaurants with available rider slots';
    END IF;
END;

/

create trigger order_placement
before insert on orders
for each row
BEGIN
    DECLARE currentTime TIME;
    DECLARE opensAt TIME;
    DECLARE closesAt TIME;
    SET currentTime = CURRENT_TIME();

    SELECT OpensAt, ClosesAt INTO opensAt, closesAt
    FROM Restaurant
    WHERE Restaurant_id = NEW.Restaurant_id;

    IF currentTime < opensAt OR currentTime > closesAt THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Order cannot be placed as the restaurant is closed.';
    END IF;
END;
/

drop procedure if exists PlaceOrder;
CREATE PROCEDURE PlaceOrder(
    IN p_Customer_id INT,
    IN p_Restaurant_id INT,
    IN p_Address VARCHAR(100),
    IN p_NearbyPoint VARCHAR(50),
    OUT p_Order_id INT
)
BEGIN
    DECLARE tempPhoneNO VARCHAR(20);
    DECLARE tempAddress_id INT;
    DECLARE isOpen INT;

    DECLARE exit handler FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_Order_id = NULL;
    END;

    START TRANSACTION;

    SELECT 
        CASE 
            WHEN OpensAt <= CURRENT_TIMESTAMP AND ClosesAt > CURRENT_TIMESTAMP THEN 1 
            ELSE 0 
        END 
    INTO isOpen 
    FROM Restaurant 
    WHERE Restaurant_id = p_Restaurant_id;

    IF isOpen = 0 OR isOpen IS NULL THEN
        SET p_Order_id = NULL;
        ROLLBACK;
    else
        SELECT phone_No INTO tempPhoneNo 
        FROM customer 
        WHERE Customer_id = p_Customer_id;
    
        INSERT INTO DeliveryAddress (Address, phoneNo, nearbyPoint) 
        VALUES (p_Address, tempPhoneNo, p_NearbyPoint); 
    
        SET tempAddress_id = LAST_INSERT_ID();
    
        INSERT INTO Orders (Customer_id, Restaurant_id, Address_id, Order_Status)
        VALUES (p_Customer_id, p_Restaurant_id, tempAddress_id, 'Placed');
    
        SET p_Order_id = LAST_INSERT_ID();
    
        COMMIT;
    END IF;
END;
/

CREATE TRIGGER updateRestaurantRating AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    -- Declare the variable to hold the average rating
    DECLARE avgRating DECIMAL(2,1);

    -- Check if the review_id has been set (indicating a new review has been added)
    IF NEW.review_id IS NOT NULL AND OLD.review_id IS NULL THEN
        -- Calculate the average rating for the restaurant based on all reviews of its orders
        SELECT AVG(rating) INTO avgRating
        FROM order_review o
        JOIN orders ord ON o.review_id = ord.review_id
        WHERE ord.restaurant_id = NEW.restaurant_id;

        -- Update the restaurant's rating with the calculated average
        UPDATE Restaurant
        SET Rating = avgRating
        WHERE Restaurant_id = NEW.restaurant_id;
    END IF;
END
/

-------------------------------- FOREIGN KEYS

ALTER TABLE Menu_Items ADD CONSTRAINT Menuid_FK FOREIGN KEY (Menu_id) REFERENCES Menu(Menu_id) ON DELETE CASCADE;
ALTER TABLE Restaurant ADD CONSTRAINT Owner_FK FOREIGN KEY(Owner_id) REFERENCES Restaurant_Owner(Owner_id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE Restaurant ADD CONSTRAINT Menu_FK FOREIGN KEY(Menu_id) REFERENCES Menu(Menu_id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE Orders ADD CONSTRAINT O_R_FK FOREIGN KEY(Restaurant_id) REFERENCES Restaurant(Restaurant_id) ON DELETE cascade;
ALTER TABLE Orders ADD CONSTRAINT Review_FK FOREIGN KEY(Review_id) REFERENCES Order_Review(Review_id) ON DELETE SET NULL;
ALTER TABLE Orders ADD CONSTRAINT Address_FK FOREIGN KEY(Address_id) REFERENCES DeliveryAddress(Address_id) ON DELETE cascade;
ALTER TABLE Orders ADD CONSTRAINT delivery_id FOREIGN KEY(Delivered_by_id) REFERENCES Delivery_Rider(Rider_id) ON DELETE SET NULL;
ALTER TABLE Orders ADD CONSTRAINT Customer_fk FOREIGN KEY(Customer_id) REFERENCES Customer(Customer_id) ON DELETE cascade;
ALTER TABLE Ordered_Items ADD CONSTRAINT Order_FK FOREIGN KEY(Order_id) REFERENCEs Orders(Order_id) ON DELETE cascade;
ALTER TABLE Ordered_Items ADD CONSTRAINT Item_FK FOREIGN KEY(Item_id) REFERENCES Menu_Items(Item_id) ON DELETE cascade;
ALTER TABLE Ordered_Items ADD CONSTRAINT comp_PK PRIMARY KEY(Order_id,Item_id);


----------------------------- testing queries
