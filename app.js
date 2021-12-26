const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());
const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializingDBAndServer = async (request, response) => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log("Server Running at http://localhost:3001/");
    });
  } catch (error) {
    console.log(`DB Error : ${error.message}`);
    process.exit(1);
  }
};

initializingDBAndServer();

//API 1

app.get("/movies/", async (request, response) => {
  const getMovies = `
        SELECT movie_name
        FROM movie;`;
  const moviesList = await db.all(getMovies);
  response.send(moviesList);
});

//API 2

app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const addMovie = `
        INSERT INTO 
            movie(director_id, movie_name, lead_actor)
        VALUES 
            (
                '${directorId}',
                '${movieName}',
                '${leadActor}'
            );`;
  const responseDB = await db.run(addMovie);
  response.send("Movie Successfully Added");
});

//API 3

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovie = `
        SELECT *
        FROM movie
        WHERE movie_id = ${movieId};`;
  const responseMovie = await db.get(getMovie);
  response.send(responseMovie);
});

//API 4

app.put("/movies/:movieId/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const { movieId } = request.params;
  const addMovie = `
        UPDATE 
            movie
        SET
                director_id = '${directorId}',
                movie_name ='${movieName}',
                lead_actor = '${leadActor}'
        WHERE 
            movie_id = ${movieId};`;
  const responseDB = await db.run(addMovie);
  response.send("Movie Details Updated");
});

//API 5

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const delMovie = `
        DELETE FROM 
            movie
        WHERE 
            movie_id = ${movieId};`;
  const responseDB = db.run(delMovie);
  response.send("Movie Removed");
});

//API 6

app.get("/directors/", async (request, response) => {
  const directorsList = `
        SELECT 
            *
        FROM director;`;
  const responseList = await db.all(directorsList);
  response.send(responseList);
});

// API 7

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const query = `
        SELECT movie_name
        FROM movie
        WHERE director_id = ${directorId};`;
  const responseDb = await db.all(query);
  response.send(responseDb);
});

module.exports = app;
