const app = require('./app');
const { PORT/*, DB_URL*/ } = require('./config');

/* 
Use this if connecting to a database
Be Sure to update the DB_URL in the config.js file 
*/
/***************************************/
// const db = knex({
//   client: 'pg',
//   connection: DB_URL,
// });

// app.set('db', db);
/***************************************/


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
});
