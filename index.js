const express = require('express');
const bodyParser = require('body-parser');

const templateIndex = require('./templates/index');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(express.static('public'));

const parts = [];
let partCount = 0;

app.get('/', (req, res) => {
  res.send(templateIndex({
    parts,
  }));
});

app.post('/add', (req, res) => {
  parts.push({
    id: partCount,
    type: null,
    string: '',
  });

  partCount = partCount + 1;

  res.redirect('/');
});

app.post('/api/add', (req, res) => {
  parts.push({
    id: partCount,
    type: null,
    string: '',
  });

  partCount = partCount + 1;

  res.json(true);
});

app.post('/save/:id', (req, res) => {
  parts[req.params.id] = {
    id: req.params.id,
    type: req.body.type,
    string: req.body.string,
  };

  res.redirect('/');
});

app.post('/api/save/:id', (req, res) => {
  parts[req.params.id] = {
    id: req.params.id,
    type: req.body.type,
    string: req.body.string,
  };

  res.json(true);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Kleene listening on port ${process.env.PORT || 3000}`);
});

