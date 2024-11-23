const db = require('../db');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');

module.exports.addAdmin = (req,res) => {
     const restaurant_id = req.params.id;
     const { adminData, Location_id } = req.body; 

     const { Admin_Name, Email_address,Account_Password, Phone_no} = adminData;

     console.log('Hit add admin ',Location_id ,Admin_Name, Email_address,Account_Password, Phone_no);
     
     const salt = bcrypt.genSaltSync(10);
     const hash = bcrypt.hashSync(Account_Password, salt);
     const admin_q = 'INSERT INTO restaurant_admin (Location_id,Admin_name,email_address,account_password,phone_no) VALUES(?,?,?,?,?)';

     db.query(admin_q,[Location_id ,Admin_Name, Email_address,hash, Phone_no],(err,result)=>{
        if(err){
            console.log('Admin error',err.message);
            return res.status(500).json({ error: 'Database query failed', details: err.message });
        }
        const admin_id = result.insertId;
        const set_q = 'UPDATE restaurant SET r_admin = ? where restaurant_id = ?';
        db.query(set_q,[admin_id,restaurant_id],(err1,result1) =>{
            if(err1){
                console.log('updating error');
                return res.status(500).json({ error: 'Database query failed', details: err.message });
            }
            res.status(200).json({admin_id});
        })
     })
}

module.exports.getOwnedRestaurants = (req, res) => {
    console.log('Hit owned restaurants');
        const {owner_id} = req.query;
        console.log(owner_id,' found');
        const query = 
         `select * from restaurant r
          join locations loc
          on r.location_id = loc.location_id
          where r.owner_id = ?`;
        
          db.query(query, [owner_id], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database query failed', details: err.message });
            }
            if (result.length === 0) return res.status(400).json({ message: 'No restaurants owned' });
            console.log(result);
            return res.status(200).json({ ownedRestaurants: result });
        });
};

module.exports.AddRestaurant = (req, res) => {
    const { Restaurant_name, OpensAt, ClosesAt,Owner_id,Address,Loc_Contact_No } = req.body;
    console.log('Add Restaurant hit');
    const Restaurant_Image = `http://localhost:8800/images/${req.file.filename}`;
    console.log(Restaurant_name, OpensAt, ClosesAt,Owner_id,Address,Loc_Contact_No );

    const loc_q = 'INSERT INTO Locations (Address,Contact_no) VALUES (?,?)';

    db.query(loc_q,[Address,Loc_Contact_No],(err1,result1) => {
        if (err1) {
            console.log('err',err1.message);
            return res.status(500).json({ error: "Database query failed", details: err1.message });
        }
        const Location_id = result1.insertId;
        const query = `
        INSERT INTO Restaurant 
        (Restaurant_Name, OpensAt, ClosesAt, Restaurant_Image, Owner_id,Location_id) 
        VALUES (?, ?, ?, ?, ?,?)`;
        console.log(Restaurant_Image);
        db.query(query, [Restaurant_name, OpensAt, ClosesAt, Restaurant_Image, Owner_id,Location_id], (err2, result2) => {
          if (err2) {
            console.log('err');
            return res.status(500).json({ error: "Database query failed", details: err2.message });
          }
          console.log(result2);
          return res.status(200).json({ restaurantId: result2.insertId });
      });
    })
  };

  module.exports.addMenu = (req, res) => {
    console.log('Add menu hit');
    const restaurant_id = req.params.id;

    const checkQuery = 'SELECT menu_id FROM restaurant WHERE restaurant_id = ?';

    db.query(checkQuery, [restaurant_id], (err, results) => {
        if (err) {
            console.log('error here');
            return res.status(500).json({ error: 'Database query failed', details: err.message });
        }

        if (results.length > 0 && results[0].menu_id) {
            console.log('Restaurant already has a menu assigned');
            return res.status(400).json({ message: 'Restaurant already has a menu assigned' });
        }

        const insertMenuQuery = 'INSERT INTO menu () VALUES ()'; 
        
        db.query(insertMenuQuery, (err, menuResult) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to create menu', details: err.message });
            }

            console.log('Menu created successfully with ID:', menuResult.insertId);

            const updateRestaurantMenuQuery = 'UPDATE restaurant SET menu_id = ? WHERE restaurant_id = ?';
            db.query(updateRestaurantMenuQuery, [menuResult.insertId, restaurant_id], (err, updateResult) => {
                if (err) {
                    console.log('Error updating restaurant menu:', err);
                    return res.status(500).json({ error: 'Failed to update restaurant menu', details: err.message });
                }

                console.log('Restaurant menu updated successfully');
                return res.status(200).json({
                    message: 'Menu created and assigned to restaurant successfully',
                    menu_id: menuResult.insertId
                });
            });
        });
    });
};


//insertId is used for auto increments ids

module.exports.addMenuItem = (req, res) => {
    console.log('hit add item');
    const restaurant_id = req.params.id;  
 
    const { name,price,cuisine,menu_id } = req.body;
    const Item_image = req.file ? `http://localhost:8800/images/${restaurant_id}/${req.file.filename}` : null; // Handle file upload

    if (!Item_image) {
        console.log('no image found');
         return res.status(400).json({ error: 'Image file is required' });
    }

    const insert_query = 'INSERT INTO menu_items (Dish_Name, Item_Price, Item_image, Cuisine, Menu_id) VALUES (?, ?, ?, ?, ?)';

     db.query(insert_query, [name, price, Item_image, cuisine, menu_id], (err, menuResult) => {
         if (err) {
            return res.status(500).json({ error: 'Failed to add menu item', details: err.message });
        }
        console.log('menu item added');
        return res.status(201).json({ message: 'Menu item added successfully', item_id: menuResult.insertId });
    });

};


module.exports.deleteMenu = (req, res) => {
    console.log('Delete menu hit');
    const restaurant_id = req.params.id;

    const checkQuery = 'SELECT menu_id FROM restaurant WHERE restaurant_id = ?';

    db.query(checkQuery, [restaurant_id], (err, results) => {
        if (err) {
            console.log('Error in check query');
            return res.status(500).json({ error: 'Database query failed', details: err.message });
        }

        if (results.length === 0 || results[0].menu_id === null) {
            console.log('No menu found');
            return res.status(400).json({ message: 'No menu found, try adding one' });
        }

        const menu_id = results[0].menu_id;

        const updateRestaurantQuery = 'UPDATE restaurant SET menu_id = NULL WHERE restaurant_id = ?';

        db.query(updateRestaurantQuery, [restaurant_id], (err, updateResult) => {
            if (err) {
                console.log('Error updating restaurant to set menu_id to NULL');
                return res.status(500).json({ error: 'Failed to update restaurant', details: err.message });
            }

            console.log('Restaurant menu_id set to NULL');

            const deleteMenuQuery = 'DELETE FROM menu WHERE menu_id = ?';

            db.query(deleteMenuQuery, [menu_id], (err, deleteResult) => {
                if (err) {
                    console.log('Error deleting menu');
                    return res.status(500).json({ error: 'Failed to delete menu', details: err.message });
                }

                console.log('Menu deleted');
                return res.status(200).json({ message: 'Menu deleted successfully' });
            });
        });
    });
};


module.exports.updateTimings = (req,res) => {
    console.log('hit update timings')
    restaurant_id = req.params.id;
    const {OpensAt,ClosesAt} = req.body;
    console.log(OpensAt,ClosesAt)
    updateQuery = 'UPDATE restaurant set OpensAt = ?, ClosesAt =? WHERE Restaurant_id = ?';

    db.query(updateQuery,[OpensAt,ClosesAt,restaurant_id],(err,result) =>{
        if (err) {
            console.log('Error updating restaurant timings');
            return res.status(500).json({ error: 'Failed to update restaurant', details: err.message });
        }
        return res.status(200).json({ message: 'Timings updated successfully' });

    });
}

module.exports.ChangeImage = (req, res) => {
    const restaurant_id = req.params.id;
    console.log('Update Restaurant image hit');
    
    const Restaurant_Image = `http://localhost:8800/images/${req.file.filename}`;
  
    const imageQuery = 'SELECT Restaurant_Image FROM Restaurant WHERE Restaurant_Id = ?';
    
    db.query(imageQuery, [restaurant_id], (err, result) => {
      if (err) {
        console.error('Error fetching current image:', err);
        return res.status(500).send('Error fetching current image.');
      }
  
      if (result.length === 0) {
        return res.status(404).send('Restaurant not found.');
      }
  
      const oldImagePath = result[0].Restaurant_Image.split('/images/')[1];
  
      const oldImageFullPath = path.join(__dirname, '../images', oldImagePath);
  
      fs.unlink(oldImageFullPath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Error deleting old image:', unlinkErr);
          return res.status(500).send('Error deleting old image.');
        }
  
        console.log('Old image deleted successfully.');
  
        const updateQuery = 'UPDATE Restaurant SET Restaurant_Image = ? WHERE Restaurant_Id = ?';
        
        db.query(updateQuery, [Restaurant_Image, restaurant_id], (updateErr, updateResult) => {
          if (updateErr) {
            console.error('Error updating restaurant image:', updateErr);
            return res.status(500).send('Error updating restaurant image.');
          }
            console.log('Restaurant image updated successfully');
          return res.status(200).send('Restaurant image updated successfully!');
        });
      });
    });
  };

  module.exports.addLocation = (req, res) => {
    console.log('hit add location');
    const { Restaurant_Name, OpensAt, closesAt, Restaurant_Image, Owner_id, Address, Contact_No } = req.body;
    console.log(Restaurant_Name, OpensAt, closesAt, Restaurant_Image, Owner_id, Address, Contact_No );
    const insertQuery = 'INSERT INTO Locations (Address, Contact_No) VALUES (?, ?)';

    db.query(insertQuery, [Address, Contact_No], (err, result) => {
        if (err) {
            console.error('Error adding location:', err.message);
            return res.status(500).json({ error: 'Failed to add location', details: err.message });
        }
        const location_id = result.insertId;

        const q = `
            INSERT INTO Restaurant 
            (Restaurant_name, OpensAt, ClosesAt, Restaurant_Image, Owner_id, Location_id) 
            VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(q, [Restaurant_Name, OpensAt, closesAt, Restaurant_Image, Owner_id, location_id], (err1, result1) => {
            if (err1) {
                console.error('Error adding restaurant:', err1.message);
                return res.status(500).json({ error: 'Failed to add restaurant', details: err1.message });
            }

            return res.status(200).json({ message: 'Restaurant added successfully', resId: result1.insertId });
        });
    });
};


module.exports.getLocations = (req,res) => {
    const restaurant_id = req.params.id;
    query = 'SELECT * from locations where restaurant_id = ?';

    db.query(query,[restaurant_id],(err,result) =>{
        if (err) {
            console.log('Error fetching locations');
            return res.status(500).json({ error: 'Failed to get location', details: err.message });
        }
        return res.status(200).json(result);
    });
}

module.exports.deleteItem = (req,res) => {
    console.log('Delete menu item hit');
    const restaurant_id = req.params.id;
    const {item_id} = req.body;
    let query = 'SELECT * from Menu_Items where item_id = ?';
    
    db.query(query,[item_id],(err,result) =>{
        if (err) {
            console.log('Error fetching the item to delete');
            return res.status(500).json({ error: 'Failed to delete item', details: err.message });
        }
        else{
            //first delete the picture from the /images folder
            const img = result[0].Item_image;
            const filename = img.split('/').pop(); 
            const img_path = path.join(__dirname, '..', 'images', restaurant_id, filename);
            fs.unlink(img_path, (err) => {
                if (err) {
                    console.error('Error deleting the old image:', err);
                    return res.status(500).send({ message: 'Error deleting the old image' });
                } 
                query = 'delete from Menu_Items where item_id = ?';
                db.query(query,[item_id],(err,result2) =>{
                    if(err){
                      console.log('Cannot delete the requested item', item_id);
                      return res.status(500).json({ error: 'Failed to delete item', details: err.message });
                    }
                    return res.status(200).json(result2);
                });
            });
        }
    });

}


module.exports.updateItem = (req, res) => {
    console.log('Received request to update ', req.body);
    
    const { Item_id, Dish_Name, Item_Price, Cuisine } = req.body;
    const new_path = `http://localhost:8800/images/${req.params.id}/${req.file.filename}`;
    
    let query = 'SELECT Item_image FROM Menu_Items WHERE item_id = ?';
    
    db.query(query, [Item_id], (err, result) => {
        if (err) {
            return res.status(500).send({ message: 'Error retrieving item from database', error: err });
        }
        
        if (result.length > 0) {
            const old_image = result[0].Item_image;
            const old_image_filename = old_image.split('/').pop(); 
            const old_image_path = path.join(__dirname, '..', 'images', req.params.id, old_image_filename);

            console.log(old_image_path);
            fs.unlink(old_image_path, (err) => {
                if (err) {
                    console.error('Error deleting the old image:', err);
                    return res.status(500).send({ message: 'Error deleting the old image' });
                }  
                let updateQuery = 'UPDATE Menu_Items SET Dish_Name = ?, Item_Price = ?, Cuisine = ?, Item_image = ? WHERE item_id = ?';
                db.query(updateQuery, [Dish_Name, Item_Price, Cuisine, new_path, Item_id], (err, result) => {
                    if (err) {
                        return res.status(500).send({ message: 'Error updating item in database', error: err });
                    }  
                    return res.status(200).send({ message: 'Item updated successfully' });
                });
            });
        } else {
            return res.status(404).send({ message: 'Item not found' });
        }
    });
};


module.exports.updateLocation = (req,res) => {
    
}

module.exports.deleteLocation = (req,res) => {
    
}