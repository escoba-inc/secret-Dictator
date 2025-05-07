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

const fs = require('fs');

app.get('/player', (req, res) => {
  const name = req.query.name;
  const player = players[name];
  if (!player) return res.send("Jugador no encontrado.");

  const role = player.role;
  let allies = '';

  if (role === 'fascist') {
    allies = Object.keys(players)
      .filter(n => (players[n].role === 'fascist' || players[n].role === 'hitler') && n !== name)
      .join(', ');
  }

  // Leer y personalizar la plantilla
  const filePath = path.join(__dirname, 'public', 'role-template.html');
  fs.readFile(filePath, 'utf8', (err, html) => {
    if (err) return res.status(500).send("Error cargando plantilla.");

    const customized = html
      .replace('__NAME__', name)
      .replace('__ROLE__', role)
      .replace('__ALLIES__', allies || '');

    res.send(customized);
  });
});


// Reset
app.get('/reset', (req, res) => {
  players = {};
  res.redirect('/');
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});