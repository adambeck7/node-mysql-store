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

initialPrompt();

function initialPrompt() {
    inquirer.prompt([

        {
            type: "list",
            name: "change",
            message: "Would you like to:",
            choices: ["View products for sale", "View low inventory", "Increase inventory", "Add a new product", ]
        }

    ]).then(function (user) {

        // If the user guesses the password...
        if (user.change === "View products for sale") {
            console.log("==============================================");
            console.log("Retrieving current inventory:");
            console.log("==============================================");
            forSale();

        } else if (user.change === "View low inventory") {
            console.log("==============================================");
            console.log("Retrieving low inventory items");
            console.log("==============================================");
            lowInventory();
        } else if (user.change === "Increase inventory") {
            console.log("==============================================");
            console.log("Retrieving current inventory");
            console.log("==============================================");
            selectItems();
        } else if (user.change === "Add a new product") {
            console.log("==============================================");
            console.log("Retrieving current inventory");
            console.log("==============================================");
            addNewItem();
        }
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
            console.log('choice:', choice);
            increaseInventory()
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

function increaseInventory() {
    inquirer.prompt([{
            type: "list",
            name: "choice",
            message: "Choose a product to increase it's inventory:",
            choices: choice
        },
        {
            type: "input",
            name: "quantity",
            message: "Enter the new inventory:"
        }
    ]).then(function (user) {
        connection.query("UPDATE products SET ? WHERE product_name = '" + user.choice + "'", [{
            quantity: user.quantity
        }], function (err, res) {
            if (err) throw err;
            console.log(res);
            forSale();
            // connection.end();
        });
    });

}

function lowInventory() {
    connection.query("SELECT * FROM products WHERE quantity < ?", [20], function (err, res) {
        if (err) throw err;
        console.log(res);
        connection.end();
    });
}

function addNewItem() {
    console.log("Adding a new item...\n");
    inquirer.prompt([

        {
            type: "input",
            name: "item",
            message: "What item would you like to add?"
        },
        {
            type: "input",
            name: "department",
            message: "What department would you like to add your product to?"
        },
        {
            type: "input",
            name: "price",
            message: "What price would you like to set?"
        },
        {
            type: "input",
            name: "quantity",
            message: "How many items are you listing?"
        }

    ]).then(function (user) {
        connection.query(
            "INSERT INTO products SET ?", {
                product_name: user.item,
                department_name: user.department,
                price: user.price,
                quantity: user.quantity
            },
            function (err, res) {
                console.log(res);
            }
        );
        // console.log(query.sql);
        connection.end();
    });

}