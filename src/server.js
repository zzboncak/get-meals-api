const app = require('./app');
const knex = require('knex');
const { PORT, DATABASE_URL } = require('./config');

/* 
Use this if connecting to a database
Be Sure to update the DATABASE_URL in the config.js file 
*/
/***************************************/
const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

app.set('db', db);
/***************************************/


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
});
