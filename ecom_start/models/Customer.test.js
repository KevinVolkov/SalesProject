/*
Module name: Customer.test.js (../models/Customer.test.js)
Date of the code (latest update): 11/30/24
-----------------------------------------------------------------------------------------------
Programmers: Kevin Volkov, Irvin Merino, Joaquin Banting /students, CSUN COMP 380, Group #6/
-----------------------------------------------------------------------------------------------
Description: Jtest unit testing module for the class "Customer" (Customer Model)
            
*/


require('dotenv').config();
const sequelize = require('../config/db'); // Use the test DB: Kevin: I am using the same db
//const CustomerModel = require('../models/Customer');
const Customer = require('../models/Customer');

describe('"Customer" Model/Class Unit Tests', () => {
    //let Customer;

    beforeAll(async () => {
        // Initialize the Customer model
        //Customer = CustomerModel(sequelize);
        //Customer = defineCustomer(sequelize);
        await sequelize.sync({ force: true }); // Drops and recreates all tables
    });

    afterAll(async () => {
        await sequelize.close();
    });

    test('should create a new customer with valid data', async () => {

        const customer = new Customer({
            name: 'Kevin Volkov',
            email: 'kevin@example.com',
            password: 'hashedpassword',
            orders: 'order1;order2',
            address: "123 Main Street"
        });



        expect(customer.name).toBe('Kevin Volkov');
        expect(customer.email).toBe('kevin@example.com');
        expect(customer.orders).toEqual(['order1', 'order2']); // Uses custom getter
    });

    test('should handle empty orders gracefully', async () => {

        const customer = new Customer({
            name: 'Irvin Merino',
            email: 'irvin@example.com',
            password: 'hashedpassword',
            address: "123 Main Street"
        });


        expect(customer.orders).toEqual([]);
    });

    test('should correctly update orders using setter', async () => {
        
        const customer = new Customer({
            name: 'Joaquin',
            email: 'joaquin@example.com',
            password: 'hashedpassword',
            address: "123 Main Street"
        });
        
        
        

        customer.orders = "order2;order3"; // Uses custom setter
        await customer.save();

        const updatedCustomer = await Customer.findByPk(customer.id);
        expect(updatedCustomer.orders).toEqual(['order2', 'order3']);
    });
});
