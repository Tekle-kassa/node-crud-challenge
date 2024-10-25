const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(cors());
app.use(bodyParser.json());

let persons = [
  {
    id: "1",
    name: "Sam",
    age: 26,
    hobbies: [],
  },
]; //This is your in memory database

app.set("db", persons);
//TODO: Implement crud of person

app.get("/person", (req, res, next) => {
  try {
    res.status(200).json(persons);
  } catch (error) {
    next(error);
  }
});

app.get("/person/:personId", (req, res) => {
  try {
    const person = persons.find((p) => p.id === req.params.personId);
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }
    res.status(200).json(person);
  } catch (error) {
    next(error);
  }
});

app.post("/person", (req, res) => {
  try {
    const { name, age, hobbies } = req.body;
    console.log(req.body);
    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ error: "Name is required and must be a string" });
    }
    if (typeof age !== "number" || age < 0) {
      return res
        .status(400)
        .json({ error: "Age is required and must be a positive number" });
    }
    if (!Array.isArray(hobbies)) {
      return res
        .status(400)
        .json({ error: "Hobbies must be an array of strings" });
    }
    const newPerson = {
      id: uuidv4(),
      name,
      age,
      hobbies: hobbies || [],
    };
    persons.push(newPerson);
    res.status(201).json(newPerson);
  } catch (error) {
    next(error);
  }
});

app.put("/person/:personId", (req, res) => {
  try {
    const { personId } = req.params;
    const { name, age, hobbies } = req.body;

    const personIndex = persons.findIndex((p) => p.id === personId);
    if (personIndex === -1) {
      return res.status(404).json({ error: "Person not found" });
    }

    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ error: "Name is required and must be a string" });
    }
    if (typeof age !== "number" || age < 0) {
      return res
        .status(400)
        .json({ error: "Age is required and must be a positive number" });
    }
    if (!Array.isArray(hobbies)) {
      return res
        .status(400)
        .json({ error: "Hobbies must be an array of strings" });
    }

    persons[personIndex] = { id: personId, name, age, hobbies };
    res.json(persons[personIndex]);
  } catch (error) {
    next(error);
  }
});

app.delete("/person/:personId", (req, res) => {
  try {
    const { personId } = req.params;
    const personIndex = persons.findIndex((p) => p.id === personId);
    if (personIndex === -1) {
      return res.status(404).json({ error: "Person not found" });
    }

    persons.splice(personIndex, 1);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use((req, res) => {
  res.status(404).json({ message: "Resource not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

if (require.main === module) {
  app.listen(3000, () => console.log("Server running on port 3000"));
}
module.exports = app;
