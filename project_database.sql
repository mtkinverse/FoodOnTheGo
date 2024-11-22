CREATE DATABASE online_food_system;

USE online_food_system;

SHOW TRIGGERS WHERE `Table` = 'customer';
DROP TRIGGER  assign_cart_to_customer;
CREATE TABLE Customer(
   Customer_id INT AUTO_INCREMENT PRIMARY KEY,
   Customer_Name VARCHAR(100) NOT NULL,
   Email_address VARCHAR(100) NOT NULL UNIQUE,
   Account_Password VARCHAR(100) NOT NULL,
   phone_no VARCHAR(20) NOT NULL UNIQUE
);
ALTER TABLE Customer AUTO_INCREMENT = 99190;

select * from Customer;

CREATE TABLE Restaurant_Owner (
   Owner_id INT AUTO_INCREMENT PRIMARY KEY,
   Owner_Name VARCHAR(100) NOT NULL,
   Email_address VARCHAR(100) NOT NULL UNIQUE,
   Account_Password VARCHAR(100) NOT NULL,
   Phone_no VARCHAR(20) NOT NULL
);
ALTER TABLE Restaurant_Owner AUTO_INCREMENT = 1500; -- id starts from 1500

CREATE TABLE Restaurant (
    Restaurant_id INT AUTO_INCREMENT PRIMARY KEY,
    Restaurant_Name VARCHAR(100) NOT NULL,
    OpensAt TIME NOT NULL,
    ClosesAt TIME NOT NULL,
    Restaurant_Image Varchar(50) NOT NULL,
    Rating DECIMAL(2,1) DEFAULT 5, -- ratings like 4.5,4.7
    Owner_id INT,
    Menu_id INT DEFAULT NULL -- resta urant created,can be added later
);
ALTER TABLE Restaurant AUTO_INCREMENT = 6500; -- ids start from 6500

ALTER TABLE Restaurant ADD COLUMN num_locations INT DEFAULT 0;



CREATE TABLE Locations (
    Location_id INT AUTO_INCREMENT PRIMARY KEY,
    Address VARCHAR(100) NOT NULL,
    Contact_No VARCHAR(20) NOT NULL,
    Open_Status BOOLEAN DEFAULT FALSE,
    Restaurant_id INT NOT NULL
);
ALTER TABLE Locations AUTO_INCREMENT = 10100 ; -- ids start from 10100


CREATE TRIGGER update_num_locations_after_insert
AFTER INSERT ON Locations
FOR EACH ROW
BEGIN
    -- Update the num_locations for the corresponding restaurant
    UPDATE Restaurant
    SET num_locations = num_locations + 1
    WHERE Restaurant_id = NEW.Restaurant_id;
END;
/

CREATE TRIGGER update_num_locations_after_delete
AFTER DELETE ON Locations
FOR EACH ROW
BEGIN
    -- Update the num_locations for the corresponding restaurant
    UPDATE Restaurant
    SET num_locations = num_locations - 1
    WHERE Restaurant_id = OLD.Restaurant_id;
END;
/

SHOW TRIGGERS LIKE 'Locations';


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


CREATE TRIGGER delete_order_address
AFTER DELETE ON orders
FOR EACH ROW
BEGIN
    DELETE FROM deliveryaddress
    WHERE address_id = OLD.Address_id;
END
/



CREATE TABLE DeliveryAddress(
    Address_id INT AUTO_INCREMENT PRIMARY KEY,
    Address VARCHAR(100) NOT NULL,
    PhoneNo VARCHAR(20) NOT NULL,
    NearbyPoint VARCHAR(50) DEFAULT NULL
);

ALTER TABLE DeliveryAddress AUTO_INCREMENT = 23838;



CREATE TABLE Delivery_Rider(
    Rider_id INT AUTO_INCREMENT PRIMARY KEY,
    Rider_name VARCHAR(100) NOT NULL,
    Email_address VARCHAR(100) NOT NULL UNIQUE,
    Account_Password VARCHAR(100) NOT NULL,
    Phone_No VARCHAR(20) NOT NULL,
    BikeNo VARCHAR(20) DEFAULT NULL,
    Available BOOLEAN DEFAULT TRUE
);
ALTER TABLE Delivery_Rider AUTO_INCREMENT = 102922;


--order_date dropped ,can be extracted from order_time (timestamp)
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

ALTER TABLE Orders drop column order_date;

drop trigger if exists order_placement;
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

    DECLARE exit handler FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SET p_Order_id = NULL;
    END;

    START TRANSACTION;

    SELECT phone_No INTO tempPhoneNo 
    FROM customer 
    WHERE Customer_id = p_Customer_id;

    INSERT INTO DeliveryAddress (Address, phoneNo, nearbyPoint) 
    VALUES (p_Address, tempPhoneNo, p_NearbyPoint); 
-- Bhai y ese nahi ho rha
--    select address_id into tempAddress_id from deliveryAddress where phoneNo = tempPhoneNo;
    set tempAddress_id  = LAST_INSERT_ID();

    INSERT INTO Orders (Customer_id, Restaurant_id, Address_id, Order_Status)
    VALUES (p_Customer_id, p_Restaurant_id, tempAddress_id, 'Placed');
    
    SET p_Order_id = LAST_INSERT_ID();

    COMMIT;

END;
/

CREATE TABLE Ordered_Items (
    Order_id INT default NULL,
    Item_id INT NOT NULL,
    quantity FLOAT NOT NULL
);

CREATE TABLE Order_Review(
    Review_id INT AUTO_INCREMENT PRIMARY KEY,
    Review_Description VARCHAR(100),
    Rating DECIMAL(2,1) NOT NULL
);
ALTER TABLE Order_Review AUTO_INCREMENT = 73638;



ALTER TABLE Menu_Items ADD CONSTRAINT Menuid_FK FOREIGN KEY (Menu_id) REFERENCES Menu(Menu_id) ON DELETE CASCADE;

ALTER TABLE Restaurant ADD CONSTRAINT Owner_FK FOREIGN KEY(Owner_id) REFERENCES Restaurant_Owner(Owner_id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE Restaurant ADD CONSTRAINT Menu_FK FOREIGN KEY(Menu_id) REFERENCES Menu(Menu_id) ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE Restaurant DROP FOREIGN KEY Menu_FK;

ALTER TABLE Locations ADD CONSTRAINT Restaurant_FK FOREIGN KEY(Restaurant_id) REFERENCES Restaurant(Restaurant_id) ON DELETE CASCADE;

ALTER TABLE Orders ADD CONSTRAINT O_R_FK FOREIGN KEY(Restaurant_id) REFERENCES Restaurant(Restaurant_id) ON DELETE cascade;
ALTER TABLE Orders ADD CONSTRAINT Review_FK FOREIGN KEY(Review_id) REFERENCES Order_Review(Review_id) ON DELETE SET NULL;
ALTER TABLE Orders ADD CONSTRAINT Address_FK FOREIGN KEY(Address_id) REFERENCES DeliveryAddress(Address_id) ON DELETE cascade;
ALTER TABLE Orders ADD CONSTRAINT delivery_id FOREIGN KEY(Delivered_by_id) REFERENCES Delivery_Rider(Rider_id) ON DELETE SET NULL;
ALTER TABLE Orders ADD CONSTRAINT Customer_fk FOREIGN KEY(Customer_id) REFERENCES Customer(Customer_id) ON DELETE cascade;

ALTER TABLE Ordered_Items ADD CONSTRAINT Order_FK FOREIGN KEY(Order_id) REFERENCEs Orders(Order_id) ON DELETE cascade;
ALTER TABLE Ordered_Items ADD CONSTRAINT Item_FK FOREIGN KEY(Item_id) REFERENCES Menu_Items(Item_id) ON DELETE cascade;
ALTER TABLE Ordered_Items ADD CONSTRAINT comp_PK PRIMARY KEY(Order_id,Item_id);


select * from customer;
select * from delivery_rider;
select * from restaurant_owner;
delete from customer;
Select * from restaurant;
select * from locations;
select * from menu_items;
select * from menu;
delete from menu_items where Item_id= 18032;
delete  from restaurant;
delete from locations;
delete from locations where location_id = 10101;
delete from menu_items;
select * from customer;
select * from delivery_rider;
drop table delivery_rider;

select * from orders;
select * from ordered_items;
delete from orders;
delete from ordered_items;
select * from deliveryaddress;
delete from deliveryaddress;

delete from restaurant;

   select o.order_id,o.order_status,r.restaurant_name,o.customer_id,DATE(o.order_time) AS order_date, 
             TIME(o.order_time) AS order_time,i.item_id,i.dish_name,oo.quantity,i.item_price * oo.quantity AS extended_total
      from orders o join restaurant r
      on o.restaurant_id = r.restaurant_id
      join menu_items i on i.menu_id = r.menu_id
      join ordered_items oo on i.item_id = oo.item_id
      where o.customer_id = 99195
      order by order_date DESC;