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
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex( repository => 
    repository.id === id
  );

  if ( repositoryIndex === -1 ) {
    return response.status(400).send({
      error: 'Repository does not exists.'
    }); 
  }
  
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

// Apagar repositorio
app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id);

  if ( repositoryIndex >= 0 ) {
    repositories.splice(repositoryIndex,1);
  } else {
    return response.status(400).send({
      error: 'Repository does not exists.'
    });
  }
  
  return response.status(204).send();

});

//Dar um like
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex( repository => repository.id === id);

  if ( repositoryIndex === -1 ) {
    return response.status(400).send({
      error: 'RRepository does not exists.'
    });
  }

  repositories[repositoryIndex].likes ++;

  return response.json(repositories[repositoryIndex]);

});

module.exports = app;
