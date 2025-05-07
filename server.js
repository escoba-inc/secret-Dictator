const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

let players = {}; // { name: { role: 'fascist', ... } }

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Enviar datos del rol
app.post('/assign', (req, res) => {
  const { name, role } = req.body;
  players[name] = { role };

  res.redirect(`/player?name=${encodeURIComponent(name)}`);
});

// Mostrar rol
app.get('/player', (req, res) => {
  const name = req.query.name;
  const player = players[name];
  if (!player) return res.send("Jugador no encontrado.");

  const role = player.role;

  if (role === 'liberal') {
    return res.send(`<h1>${name}, eres Liberal</h1>`);
  }

  if (role === 'hitler') {
    return res.send(`<h1>${name}, eres Hitler</h1>`);
  }

  // Si es fascista, mostrar aliados
  const fascists = Object.keys(players)
    .filter(n => players[n].role === 'fascist' || players[n].role === 'hitler')
    .filter(n => n !== name);

  return res.send(`
    <h1>${name}, eres Fascista</h1>
    <p>Tus aliados son: ${fascists.join(', ')}</p>
  `);
});

// Reset
app.get('/reset', (req, res) => {
  players = {};
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});