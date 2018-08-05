var mysql = require("mysql");
var inquirer = require("inquirer");
var choice = [];
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "dt2bkb9m",
    database: "bamazon_db"
});

// initialPrompt();
selectItems();

function initialPrompt() {
    inquirer.prompt([

        {
            type: "list",
            name: "change",
            message: "Select the product you wish to purchase:",
            choices: choice
        },
        {
            type: "input",
            name: "quantity",
            message: "Enter the quantity you'd like to purchase:"
        }

    ]).then(function (user) {
        // console.log(user.change);
        connection.query(
            "SELECT * FROM products WHERE product_name='" + user.change + "'",
            function (err, res) {
                if (res[0].quantity > user.quantity) {
                    connection.query("UPDATE products SET quantity ='" + (res[0].quantity - user.quantity) + "' WHERE product_name='" + user.change + "'");
                    console.log("====================================");
                    console.log("\nYour card has been charged $" + (user.quantity * res[0].price) + ".")
                    console.log("We now have only " + (res[0].quantity - user.quantity) + " " + user.change + "s left in stock.\n");
                    console.log("====================================\n");
                    connection.end();
                } else {
                    console.log("====================================");
                    console.log("\nSorry, we don't have enough " + user.change + "s in stock to fulfill your request. Enter a quantity smaller than " + res[0].quantity + " to proceed with your order. \n");
                    console.log("====================================\n");
                    connection.end();
                }
            }
        );
    });
}

function selectItems() {
    connection.query(
        "SELECT product_name FROM products",
        function (err, res) {
            // console.log(res);
            // choice = res;
            // console.log(choice);
            for (let i = 0; i < res.length; i++) {
                choice.push(res[i].product_name);
                var arr = res[i].product_name;
                // console.log('arr:', arr);
            }
            // console.log(res);
            // console.log('choice:', choice);
            initialPrompt()
        }
    );
    // connection.end();
}

function forSale() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            choice.push(res[i]);
            // var arr = res[i].product_name;
            // console.log('arr:', arr);
        }
        // console.log(res);
        console.log('choice:', choice);
        // console.log(item[0].id);
        connection.end();
    });
}