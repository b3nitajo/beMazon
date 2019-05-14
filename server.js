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

var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  // Your port
  port: 3306
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});


//1. Create a MySQL Database called `bamazon`.

//2. Then create a Table inside of that database called `products`.

3//. The products table should have each of the following columns:

 //  * item_id (unique id for each product)

 //  * product_name (Name of product)

 //  * department_name

  // * price (cost to customer)

 //  * stock_quantity (how much of the product is available in stores)

//4. Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).

//5. Then create a Node application called `bamazonCustomer.js`. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.

//6. The app should then prompt users with two messages.

  // * The first should ask them the ID of the product they would like to buy.
  // * The second message should ask how many units of the product they would like to buy.

//7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.

  // * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.

//8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
 //  * This means updating the SQL database to reflect the remaining quantity.
 //  * Once the update goes through, show the customer the total cost of their purchase.