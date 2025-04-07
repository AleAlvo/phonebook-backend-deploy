const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

morgan.token("body", function (req) {
	return JSON.stringify(req.body);
});

app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"));

let entries = [
	{ id: 1, name: "John Doe", number: "123-456-7890" },
	{ id: 2, name: "Jane Smith", number: "987-654-3210" },
	{ id: 3, name: "Alice Johnson", number: "555-555-5555" },
];

const generateId = () => {
	const maxId = entries.length > 0 ? Math.max(...entries.map((entry) => entry.id)) : 0;
	return maxId + 1;
};

app.get("/api/persons", (req, res) => {
	res.json(entries);
});

app.get("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	const entry = entries.find((entry) => entry.id === id);

	if (entry) {
		res.json(entry);
	} else {
		res.status(404).end();
	}
});

app.delete("/api/persons/:id", (req, res) => {
	const id = Number(req.params.id);
	entries = entries.filter((entry) => entry.id !== id);

	res.status(204).end();
});

app.post("/api/persons", (req, res) => {
	const body = req.body;

	if (!body.name || !body.number) {
		return res.status(400).json({
			error: "info missing",
		});
	}

	const nameExists = entries.some((entry) => entry.name === body.name);
	if (nameExists) {
		return res.status(400).json({
			error: "name must be unique",
		});
	}

	const entry = {
		name: body.name,
		number: body.number,
		id: generateId(),
	};

	entries = entries.concat(entry);

	res.json(entry);
});

app.get("/info", (req, res) => {
	const requestTime = new Date().toString();
	const entriesCount = entries.length;

	const htmlResponse = `
    <p>Phonebook has info for ${entriesCount} people</p>
    <p>${requestTime}</p>
  `;

	res.send(htmlResponse);
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
