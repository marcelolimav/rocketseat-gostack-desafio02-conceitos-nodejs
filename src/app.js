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
  
  const repository = { 
    id: uuid(), 
    title, 
    url, 
    techs, 
    likes: 0 
  }
  
  repositories.push(repository);
  
  response.json(repository);
});

//Alterar repositorio
app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id);

  if ( repositoryIndex < 0 ) {
    return response.status(400).send({
      Error: 'Repository not found! :-('
    });
  }

  const repository = repositories[repositoryIndex];
  
  repository.title = title;
  repository.url = url;
  repository.techs = techs;

  return response.json(repository);
});

// Apagar repositorio
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id);

  if ( repositoryIndex < 0 ) {
    return response.status(400).send({
      Error: 'Repository not found! :-('
    });
  }

  repositories.splice(repositoryIndex,1);

  return response.status(204).send();

});

//Dar um like
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id);

  if ( repositoryIndex < 0 ) {
    return response.status(400).send({
      Error: 'Repository not found! :-('
    });
  }

  const repository = repositories[repositoryIndex];

  repository.likes++;

  return response.json(repository);

});

module.exports = app;
