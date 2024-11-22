/*
Module name: orderController.js
Date of the code (latest update): 11/21/24
-----------------------------------------------------------------------------------------------
Programmer: Kevin Volkov /student, CSUN COMP 380, Group #6/
-----------------------------------------------------------------------------------------------
Description: populates 'items' table if it is empty (first-time run), uses 'faker' package to 
             generate random data. Uses randomly image files from the public/uploads directory
            
*/

const { faker } = require('@faker-js/faker'); // package for random data generation
const Item = require('../models/Item');//this is correct path notice '..', was a bug here. 
                                       //get Item schema/structure as a type/class

/* 
 @function: populateItemsIfEmpty 
 @purpose:  populates 'items' table if it is empty (first-time run)
 @called_from: app.js
 @input: none
 @output: populates 'items' table if it is empty (first-time run)
 @algorithm: uses 'faker' package to generate random data. Uses randomly image files from the 
             public/uploads directory
*/
// Function to populate items if the table is empty
async function populateItemsIfEmpty() {
    try {
        const itemCount = await Item.count(); // Get the count of items in the table

        const itemImages = [
            'placeholder1.jpg',
            'placeholder2.jpg',
            'placeholder3.jpg',
            'placeholder4.jpg',
            'placeholder5.jpg',
            'placeholder6.jpg',
            'placeholder7.jpg',
            'placeholder8.jpg',
            'placeholder9.jpg',
            'placeholder10.jpg',
            // Add more image filenames as placeholders
          ];


        if (itemCount === 0) {
            const itemsToInsert = [];

            for (let i = 0; i < 100; i++) { // Insert up to 100 random items:

                var index=Math.floor(Math.random() * (itemImages.length-1));//Random stock from 0 to 2
                //console.log(i+" adding image index="+index+" file=["+itemImages[index]+"]");


                const newItem = {
                    name: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    price: parseFloat(faker.commerce.price()), // Random price
                    stock: Math.floor(Math.random() * 100) + 1, // Random stock from 1 to 100
                    itemImage: itemImages[index]// Assign random placeholder images

                };
                itemsToInsert.push(newItem);
            }

            // Bulk insert all the generated items
            await Item.bulkCreate(itemsToInsert);
            console.log('Inserted 100 demo items into the Items table');
        } else {
            console.log('Items table already populated');
        }
    } catch (error) {
        console.error('Error populating Items table:', error);
    }
}

module.exports = populateItemsIfEmpty;
