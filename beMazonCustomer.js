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

const beMazon_DB = require("mysql");
const inquirer = require("inquirer");
const {printTable} = require('console-table-printer');

// create the connection information for the sql database
var connection = beMazon_DB.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "beMazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  startOrdering();
});

//show user current stock items
function showInventory() {
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products WHERE stock_quantity >= 0", function(err, res) {
      if (err) throw err;
    
      console.log(res);
      printTable(res);
      updateQty();
      //connection.end();
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
    connection.end();
}

//update database w order details
function updateQty(){
    // query the database for all products
    connection.query("SELECT * FROM products WHERE stock_quantity >= 0", function(err, results) {
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
                    remainQty = results[i].stock_quantity - parseInt(answer.quantity);
                    console.log(orderedProduct + '|' + remainQty);
                    break;
                }
                else{
                    console.log("Can't find that product, Try again");
                    showInventory();
                }
            }
    
            // when product is ordered
            if (orderedProduct) {      
            const queryUpdate = "UPDATE products SET stock_quantity = " + remainQty + " WHERE item_id = " + orderedProduct;
            console.log(queryUpdate);      
            connection.query(queryUpdate, function(err, res) {
                if (err) throw err;
               
                }
                );
            }
            else {
            console.log("CheckoutError");
          //  orderMore();
            }
        });
    });
}
 
//7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

  // * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

//8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
 //  * This means updating the SQL database to reflect the remaining quantity.
 //  * Once the update goes through, show the customer the total cost of their purchase.*/