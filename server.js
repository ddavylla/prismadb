const express = require('express');
const mongoose = require('mongoose');
const { Aluno, Professor, Materia } = require('./models');
const bcrypt = require('bcryptjs');
const app = express();
app.use(express.json());

// conexão com MongoDB
mongoose.connect('mongodb://localhost:27017/prisma')
  .then(()=>console.log('Conectado'))
  .catch(err => console.error('Erro na conexão:', err));


app.post('/alunos', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.senha, 10);
    const aluno = new Aluno({
      ...req.body,
      senha: hashedPassword
    });
    await aluno.save();
    res.status(201).send(aluno);
  } catch (err) {
    res.status(400).send(err.message);
  }
});


app.post('/professores', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.senha, 10);
    const professor = new Professor({
      ...req.body,
      senha: hashedPassword
    });
    await professor.save();
    res.status(201).send(professor);
  } catch (err) {
    res.status(400).send(err.message);
  }
});


app.post('/materias', async (req, res) => {
  try {
    const professor = await Professor.findById(req.body.professor);
    if (!professor) {// verifica se é o professor
      return res.status(404).send('Professor não encontrado');
    }

    const materia = new Materia(req.body);
    await materia.save();
    res.status(201).send(materia);

  } catch (err) {
    res.status(400).send(err.message);
  }
});

// adicionar o conteúdo de uma matéria
app.post('/materias/:id/materiais', async (req, res) => {
  try {
    const materia = await Materia.findById(req.params.id);// busca a matéria pelo ID 
    if (!materia) {
      return res.status(404).send('Matéria não encontrada');
    }

    materia.materiais.push(req.body);
    await materia.save();
    res.status(201).send(materia);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// listar todas as matérias 
app.get('/materias', async (req, res) => {
  try {
    const materias = await Materia.find()
      .populate('professor', 'nome email')
      .populate('alunos', 'nome email');
    res.send(materias);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});