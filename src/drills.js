const knex = require('knex');
require('dotenv').config();

const knexInstance = knex({
    client: 'pg',
    connection: process.env.DB_URL
});

function searchByString(searchTerm){
    knexInstance
        .select('name')
        .from('shopping_list')
        .where('name', 'ILIKE', `%${searchTerm}%`)
        .then(result => {
            console.log(result)
        });
}

//searchByString('chicken');

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

//pagination(2);

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

//addedDaysFrom(7);

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