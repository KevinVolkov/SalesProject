const { faker } = require('@faker-js/faker'); // For random data generation
const Item = require('../models/Item');//this is correct path notice '..'

// Function to populate items if the table is empty
async function populateItemsIfEmpty() {
    try {
        const itemCount = await Item.count(); // Get the count of items in the table

        if (itemCount === 0) {
            const itemsToInsert = [];

            for (let i = 0; i < 100; i++) { // Insert up to 100 random items
                const newItem = {
                    name: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    price: parseFloat(faker.commerce.price()), // Random price
                    stock: Math.floor(Math.random() * 100) + 1 // Random stock from 1 to 100
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
