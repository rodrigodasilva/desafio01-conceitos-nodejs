const express = require("express");
const server = express();

server.use(express.json());

const projects = [];
let countRequest = 0;

/*
 * Middlewares
 */

server.use((req, res, next) => {
  countRequest++;
  console.log(`Request numbers: ${countRequest}`);
  return next();
});

function CheckIdExists(req, res, next) {
  const { id } = req.params;

  if (!projects.find(i => i.id === id)) {
    return res.status(400).json({ error: "Project code does not exists" });
  }

  return next();
}

/*
 * Rotas
 */

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

server.post("/projects/:id/tasks", CheckIdExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(i => i.id === id);

  project.tasks.push(title);

  return res.json(project);
});

server.put("/projects/:id", CheckIdExists, (req, res) => {
  const { id } = req.params;
  const newTitle = req.body.title;

  const project = projects.find(i => i.id === id);

  project.title = newTitle;

  return res.json(project);
});

server.delete("/projects/:id", CheckIdExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(i => i.id === id);

  projects.splice(index, 1);

  return res.send();
});

server.listen(3000);
