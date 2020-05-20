const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// Buscar repositórios
app.get("/repositories", (request, response) => {
  const { title } = request.query;

  const result = title 
  ? repositories.filter( repositorie => repositorie.title.includes(title)) 
  : repositories;

  return response.json(result);
});

// Criar repositório
app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  
  const repositorie = { id: uuid(), title, url, techs, likes: 0 }
  
  repositories.push(repositorie);
  
  response.json(repositorie);
});

//Alterar repositorio
app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex( repositorie => repositorie.id === id);

  if ( repositorieIndex < 0 ) {
    return response.status(404).send({
      Error: 'Repositorie not found! :-('
    });
  }

  const repositorie = repositories[repositorieIndex];
  
  repositorie.title = title;
  repositorie.url = url;
  repositorie.techs = techs;

  return response.json(repositorie);
});

// Apagar repositorio
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex( repositorie => repositorie.id === id);

  if ( repositorieIndex < 0 ) {
    return response.status(404).send({
      Error: 'Repositorie not found! :-('
    });
  }

  repositories.splice(repositorieIndex,1);

  return response.status(204).send();

});

//Dar um like
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex( repositorie => repositorie.id === id);

  if ( repositorieIndex < 0 ) {
    return response.status(404).send({
      Error: 'Repositorie not found! :-('
    });
  }

  const repositorie = repositories[repositorieIndex];

  repositorie.likes++;

  return response.json(repositorie);

});

module.exports = app;
