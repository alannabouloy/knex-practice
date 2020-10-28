const knex = require('knex');
require('dotenv').config();

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
});
/*
1. Get all items that contain text

A function that takes one parameter for searchTerm which will be any string
The function will query the shopping_list table using Knex methods and select the rows which have a name that contains the searchTerm using a case insensitive match. */
function searchByString(searchTerm){
    knexInstance
        .select('name')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        });
}

searchByString('chicken');

/* 2. Get all items paginated

A function that takes one parameter for pageNumber which will be a number
The function will query the shopping_list table using Knex methods and select the pageNumber page of rows paginated to 6 items per page.*/


function pagination(pageNumber){
    const productsPerPage = 6;
    const offset = productsPerPage * (pageNumber - 1);

    knexInstance
        .select('id', 'name', 'price', 'date_added', 'checked', 'category')
        .from('shopping_list')
        .limit(productsPerPage)
        .offset(offset)
        .then(result => {
            console.log(result)
        });
}

pagination(2);

/* 
3. Get all items added after date

A function that takes one parameter for daysAgo which will be a number representing a number of days.
This function will query the shopping_list table using Knex methods and select the rows which have a date_added that is greater than the daysAgo.*/

function addedDaysFrom(daysAgo){
    knexInstance
        .select('id', 'name', 'price', 'date_added', 'checked', 'category')
        .from('shopping_list')
        .where('date_added', 
            '<',
             knexInstance.raw(`now() - '?? days' ::INTERVAL`, daysAgo)
        )
        .then(result => {
            console.log(result);
        })
}

addedDaysFrom(7);

/* 
4. Get the total cost for each category

A function that takes no parameters
The function will query the shopping_list table using Knex methods and select the rows grouped by their category and showing the total price for each category.*/

function totalPriceForEachCategory(){
    knexInstance
        .select('category')
        .from('shopping_list')
        .sum('price AS total_price')
        .groupBy('category')
        .then(result => {
            console.log(result)
        });
}

totalPriceForEachCategory();