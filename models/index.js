const mongoose = require('mongoose');

// adicionar material
const MaterialSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: String,
  arquivo: { type: String, required: true },
  dataUpload: { type: Date, default: Date.now }
});

// adicionar nova matéria
const MateriaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'Professor' },
  materiais: [MaterialSchema],
  alunos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Aluno' }],
});

// adicionar usuário (aluno ou professor)
const UsuarioSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  nome: { type: String, required: true },
  tipo: { type: String, enum: ['aluno', 'professor'], required: true },
});

const Aluno = mongoose.model('Aluno', UsuarioSchema);
const Professor = mongoose.model('Professor', UsuarioSchema);
const Materia = mongoose.model('Materia', MateriaSchema);


module.exports = { Aluno, Professor, Materia };