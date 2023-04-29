const jsonServer = require("json-server");
const auth = require("json-server-auth");
const cors = require("cors");
const port = process.env.PORT || 3001;
const app = jsonServer.create();
const router = jsonServer.router("db.json");
app.db = router.db;
const rules = auth.rewriter({
  users: 600,
  tasks: 600,
});
app.use(cors());
app.use(rules);
app.use(auth);
// Define a rota para criação de uma nova tarefa
app.post("/tasks", async (req, res) => {
  const { name, description, type } = req.body;
  const userId = req.user.id;
  const task = {
    name,
    description,
    type,
    userId,
  };
  const result = await app.db.get("tasks").push(task).write();
  res.status(201).send(result);
});
app.use(router);
app.listen(port, () => {
  console.log("Server is running on port:", port);
});
