//save the MySQL and Inquirer npm packages in your homework file

// screenshots (and well-written READMEs) are extremely 
/////important in the context of GitHub, 
/////this will be part of the grading.
//must be markdown type file https://guides.github.com/features/mastering-markdown/
//require MySQL 
//Inquirer npm packages
//include screenshots, a gif, and/or a video of the app working 
//include these screenshots in a `README.md` file.
///////This includes views of the prompts and the responses after their selection

//1-4 File beMazon.sql is the MySQL Database called `beMazon`.
// Table inside of beMazon called `products`.
// The products table have the following columns:
 //item_id, product_name, department_name, price, stock_quantity

const beMazon = require("mysql");
const inquirer = require("inquirer");
const {printTable} = require('console-table-printer');

// create the connection information for the sql database
var beMazon_DB = beMazon.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "beMazon_DB"
});


// connect to mysql server and sql database
beMazon_DB.connect(function(err) {
  if (err) throw err;
  // Start ordering process to prompt the user
  startOrdering();
});

//show user current stock items
function showInventory() {
    console.log("Selecting all products...\n");
    beMazon_DB.query("SELECT * FROM products WHERE stock_quantity >= 0", function(err, res) {
      if (err) throw err;
      console.log(res);
      printTable(res);
      updateQty();
    });
}

function startOrdering(){
    inquirer
    .prompt([
      {
        name: "startOrder",
        type: "confirm",
        message: "Do you want to place an order?"
      }
    ])
    .then(function(answer) {
      if(answer.startOrder === true){
        showInventory();
      }
      else{
        endOrder();
      }
    }); 
}

function orderMore(){
    inquirer
    .prompt([
      {
        name: "needMore",
        type: "confirm",
        message: "Add more items?"
      }
    ])
    .then(function(addItems) {
        console.log("passedTest1");
      if(addItems.needMore === true){
          console.log("passedTest2");
        showInventory();
      }
      else{
        endOrder();
      }
    }); 
}

function endOrder(){
    console.log("Thank you for shopping");
    beMazon_DB.end();
}

//update database w order details
function updateQty(){
    // query the database for all products
    beMazon_DB.query("SELECT * FROM products WHERE stock_quantity >= 0", function(err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
        .prompt([
        {
            name: "item",
            type: "number",
            message: "What is the ID of the item you want to purchase?"
        },
        {
            name: "quantity",
            type: "number",
            message: "How many do you want?"
        }
        ])
        .then(function(answer) {
            // get the information of the chosen item
            var orderedProduct;
            var remainQty;   
            for (var i = 0; i < results.length; i++) {
               if (results[i].item_id === answer.item) {
                    orderedProduct = answer.item;
                    //check to see if there is stock
                    if(results[i].stock_quantity >= parseInt(answer.quantity)){
                        remainQty = results[i].stock_quantity - parseInt(answer.quantity);
                    }
                    //If cannot fulfill order
                    else{
                        remainQty = results[i].stock_quantity;
                        console.log("Sorry, we can't fill your order, We have " + remainQty + " left.");
                    }
                }
            }
            // when product is ordered
            if (orderedProduct) {      
                const queryUpdate = "UPDATE products SET stock_quantity = " + remainQty + " WHERE item_id = " + orderedProduct;
                console.log(queryUpdate);      
                beMazon_DB.query(queryUpdate, function(err, res) {
                   if (err) throw err;
                });
            }
            else {
                console.log("Checkout Error");
            }
            orderMore();
        });
    });
}
 