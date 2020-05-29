const express = require("express");
const cors = require("cors");

const { uuid, isUuid}  = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function ValidationRepositoryID(request, response, next){
  const { id } = request.params;
  if(!isUuid(id)){
    return response.status(400).json({ error: 'Invalid repository ID.'})
  }

  const repositoryIndex = repositories.findIndex( repository => 
    repository.id === id
  );

  if ( repositoryIndex === -1 ) {
    return response.status(400).send({ error: 'Repository does not exists.' }); 
  }

  request._idIndex = repositoryIndex;
  request._idRepository = id;
  
  return next();
}

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
app.put("/repositories/:id", ValidationRepositoryID, (request, response) => {
  const {  title, url, techs } = request.body;

  const repository = {
    id: request._idRepository,
    title,
    url,
    techs,
    likes: repositories[request._idIndex].likes,
  };

  repositories[request._idIndex] = repository;

  return response.json(repository);
});

// Apagar repositorio
app.delete("/repositories/:id", ValidationRepositoryID, (request, response) => {

  repositories.splice(request._idIndex,1);
  return response.status(204).send();

});

//Dar um like
app.post("/repositories/:id/like", ValidationRepositoryID, (request, response) => {

  repositories[request._idIndex].likes ++;

  return response.json(repositories[request._idIndex]);

});

module.exports = app;
