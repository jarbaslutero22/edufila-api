const express = require("express")

const router = express.Router()

let setores = [
  {
    id: 1,
    nome: "Secretaria Acadêmica",
    descricao: "Atendimento relacionado à vida acadêmica do estudante",
    ativo: true
  },
  {
    id: 2,
    nome: "Coordenação do Curso",
    descricao: "Atendimento relacionado à coordenação e orientação acadêmica",
    ativo: true
  },
  {
    id: 3,
    nome: "Atendimento ao Estudante",
    descricao: "Atendimento geral e suporte aos estudantes",
    ativo: true
  },
  {
    id: 4,
    nome: "Setor Administrativo",
    descricao: "Atendimento para demandas administrativas",
    ativo: true
  }
]

router.get("/", (req, res) => {
  res.status(200).json({
    mensagem: "Lista de setores do EduFila",
    setores
  })
})

router.post("/", (req, res) => {
  const { nome, descricao } = req.body

  if (!nome || !descricao) {
    return res.status(400).json({
      mensagem: "Nome e descrição do setor são obrigatórios"
    })
  }

  const setorExistente = setores.find(
    (setor) => setor.nome.toLowerCase() === nome.toLowerCase()
  )

  if (setorExistente) {
    return res.status(409).json({
      mensagem: "Já existe um setor com este nome"
    })
  }

  const novoSetor = {
    id: setores.length + 1,
    nome,
    descricao,
    ativo: true
  }

  setores.push(novoSetor)

  res.status(201).json({
    mensagem: "Setor cadastrado com sucesso",
    setor: novoSetor
  })
})

router.put("/:id", (req, res) => {
  const id = Number(req.params.id)
  const { nome, descricao, ativo } = req.body

  const setor = setores.find((setor) => setor.id === id)

  if (!setor) {
    return res.status(404).json({
      mensagem: "Setor não encontrado"
    })
  }

  if (nome !== undefined) {
    setor.nome = nome
  }

  if (descricao !== undefined) {
    setor.descricao = descricao
  }

  if (ativo !== undefined) {
    setor.ativo = ativo
  }

  res.status(200).json({
    mensagem: "Setor atualizado com sucesso",
    setor
  })
})

module.exports = router