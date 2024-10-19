/// https://blog.alexdevero.com/react-express-sqlite-app/

// Import path module
const { log } = require("console");
const path = require("path");

// Get the location of database.sqlite file
const dbPath = path.resolve(__dirname, "db/database.sqlite");

// Create connection to SQLite database
const knex = require("knex")({
  client: "sqlite3",
  connection: {
    filename: dbPath,
  },
  useNullAsDefault: true,
});

// Function to create the "games" table
async function createGamesTable() {
  const exists = await knex.schema.hasTable("games");
  // If no "games" table exists
  // create new, with "id", "author", "title",
  // "pubDate", "rating", and image columns
  // and use "id" as a primary identification
  // and increment "id" with every new record (game)

  if (!exists) {
    await knex.schema
      .createTable("games", (table) => {
        table.increments("id").primary();
        table.string("author"); // author of game, account identifier google unique id
        table.string("author_ID");
        table.string("title"); // Title of the game
        table.string("pubDate"); // Date posted
        table.integer("rating"); // Rating
        table.string("description");
      })
      .catch((error) => {
        console.error(`There was an error creating table: ${error}`);
      });
    console.log("Table 'games' created");
  } else {
    console.log("Table 'games' already exists");
  }
}

// Function to create the "users" table
async function createUsersTable() {
  const exists = await knex.schema.hasTable("users");
  // If no "user" table exists
  // create new, with "sub", "name",
  // "given_name", and "picture"
  // and use "sub" as a primary identification, google identifier
  if (!exists) {
    await knex.schema
      .createTable("users", (table) => {
        table.string("sub").primary(); // google unique account identifier
        table.string("name"); // account name, what is seen when sharing content
        table.string("given_name"); // name of pernonalization and formal identification
        table.string("picture"); // user picture - http link
      })
      .catch((error) => {
        console.error(`There was an error creating table: ${error}`);
      });
    console.log("Table 'users' created");
  } else {
    console.log("Table 'users' already exists");
  }
}

async function dropGamesTable() {
  try {
    const exists = await knex.schema.hasTable("games");
    console.log(`Table 'games' exists before drop: ${exists}`);

    await knex.schema.dropTableIfExists("games");
    console.log("Attempted to drop table 'games'");

    const afterDrop = await knex.schema.hasTable("games");
    console.log(`Table 'games' exists after drop attempt: ${afterDrop}`);
  } catch (error) {
    console.error(`Error during drop operation: ${error.message}`);
  } finally {
    await knex.destroy(); // Ensure connection is closed
  }
}

async function setupDatabase() {
  try {
    reset = false;
    if ((await knex.schema.hasTable("users")) && reset) {
      await dropGamesTable();
      return;
    }
    await createGamesTable();
    await createUsersTable();
    knex
      .select("*")
      .from("games")
      .then((data) => console.log("data:", data))
      .catch((err) => console.log(err));
    knex
      .select("*")
      .from("users")
      .then((data) => console.log("data:", data))
      .catch((err) => console.log(err));
    console.log("database ready");
  } catch (error) {
    console.error(`error with setting up the database ${error}`);
  }
}

setupDatabase();
// Run the function
// Export the database

// Export the database
module.exports = knex;
