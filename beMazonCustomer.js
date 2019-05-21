//packages required     
const mysql = require("mysql");
const inquirer = require("inquirer");
const {printTable} = require('console-table-printer');

// connection information for the beMazon database
var db_connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "beMazon_db"
});


// connect to mysql server and beMazon database
db_connection.connect(function(err) {
  if (err) throw err;
  // call Start ordering function
  startOrdering();
});

//show user current stock items
function showInventory() {
    console.log("Selecting all products in stock...\n");
    db_connection.query("SELECT * FROM products WHERE stock_quantity > 0", function(err, res) {
      if (err) throw err;
      printTable(res);    
    });
}

//start order function
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
        updateQty();
      }
      else{
        endOrder();
      }
    }); 
}

//check if user wants to place new order
function orderMore(){
    inquirer
    .prompt([
      {
        name: "newOrder",
        type: "confirm",
        message: "Place a new order?"
      }
    ])
    .then(function(addItems) {
      if(addItems.newOrder === true){
        db_connection.query("SELECT * FROM products WHERE stock_quantity > 0", function(err, res) {
          if (err) throw err;
          printTable(res);  
          updateQty();
        });
      }
      else{
        endOrder();
      }
    }); 
}

//when user is done ordering
function endOrder(){
  db_connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("Thank you for shopping");
    db_connection.end();
  }
)};

//update database with order details
function updateQty(){
  db_connection.query("SELECT * FROM products WHERE stock_quantity > 0", function(err, results) {
    if (err) throw err;
    // once you have the products, prompt the user for order
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
            var orderTotal = parseInt(answer.quantity) * results[i].price;
            console.log("Your order total is $" + orderTotal  + ". Thank you for shopping!");
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
        db_connection.query(queryUpdate, function(err, res) {
          if (err) throw err;
          });
      }
      else {
         console.log("We do not have that item. Select Y to try again");
      }
      orderMore();
    });
  });
}
 