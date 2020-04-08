# Get Meals API

To set up the database:
1. Make sure you are in psql in your command line.
2. Run the SQL command `CREATE USER foodles;`.
3. Run the SQL command `CREATE DATABASE get_meals OWNER foodles;`.
4. Ensure your .env file is created and has the line `DB_URL="postgresql://foodles@localhost/get_meals"`.
5. Exit psql and run the command `npm run migrate` to create the tables in the database.
6. To seed the database with a few locations, run `psql -U foodles -d get_meals -f ./seeds/seed.locations.sql` in your command line.

By [Sejin Hwang](https://github.com/seejins), [John Lee](https://github.com/johlee92), [Victoria Moore](https://github.com/JaggerSofia), [Peggy Sturman](https://github.com/glamazon), and [Zack Zboncak](https://github.com/zzboncak).