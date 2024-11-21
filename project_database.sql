CREATE DATABASE online_food_system;

USE online_food_system;

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



CREATE TABLE Orders (
    Order_id INT AUTO_INCREMENT PRIMARY KEY,
    Order_date DATE DEFAULT (CURRENT_DATE),  
    Order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  
    Order_date DATE DEFAULT SYSDATE,
    Order_Status VARCHAR(50) CHECK (Order_Status IN ('Placed', 'Preparing', 'Out for delivery', 'Delivered')), 
    Restaurant_id INT NOT NULL, 
    Review_id INT DEFAULT NULL,
    Address_id INT NOT NULL,
    Delivered_by_id INT DEFAULT NULL
);
ALTER TABLE Orders AUTO_INCREMENT = 75638;


CREATE TABLE Ordered_Items (
    Order_id INT NOT NULL,
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

ALTER TABLE Ordered_Items ADD CONSTRAINT Order_FK FOREIGN KEY(Order_id) REFERENCEs Orders(Order_id) ON DELETE cascade;
ALTER TABLE Ordered_Items ADD CONSTRAINT Item_FK FOREIGN KEY(Item_id) REFERENCES Menu_Items(Item_id) ON DELETE cascade;
ALTER TABLE Ordered_Items ADD CONSTRAINT comp_PK PRIMARY KEY(Order_id,Item_id);


delete from customer;
Select * from restaurant;
select * from locations;
select * from menu_items;
delete from menu_items where Item_id= 18032;
delete  from restaurant;
delete from locations;
delete from locations where location_id = 10101;
delete from menu_items;
select * from customer;
select * from delivery_rider;
drop table delivery_rider;