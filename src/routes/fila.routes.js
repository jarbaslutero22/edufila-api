const express = require("express")

const router = express.Router()

let fila = [
  {
    id: 1,
    codigo: "A001",
    estudante: "Ana Silva",
    setorId: 1,
    prioridade: false,
    status: "aguardando",
    horarioEntrada: new Date().toISOString()
  },
  {
    id: 2,
    codigo: "A002",
    estudante: "Carlos Souza",
    setorId: 1,
    prioridade: true,
    status: "aguardando",
    horarioEntrada: new Date().toISOString()
  }
]

// Listar a fila
router.get("/", (req, res) => {
  const filaOrdenada = [...fila].sort((a, b) => {
    if (a.prioridade === b.prioridade) {
      return a.id - b.id
    }

    return a.prioridade ? -1 : 1
  })

  res.status(200).json({
    mensagem: "Fila de atendimento do EduFila",
    quantidade: filaOrdenada.length,
    fila: filaOrdenada
  })
})

// Consultar uma senha específica
router.get("/:codigo", (req, res) => {
  const codigo = req.params.codigo.toUpperCase()

  const senha = fila.find(
    (item) => item.codigo.toUpperCase() === codigo
  )

  if (!senha) {
    return res.status(404).json({
      mensagem: "Senha não encontrada na fila"
    })
  }

  const filaOrdenada = [...fila].sort((a, b) => {
    if (a.prioridade === b.prioridade) {
      return a.id - b.id
    }

    return a.prioridade ? -1 : 1
  })

  const posicao =
    filaOrdenada.findIndex((item) => item.codigo === senha.codigo) + 1

  res.status(200).json({
    mensagem: "Senha encontrada",
    posicao,
    senha
  })
})

// Chamar o próximo estudante da fila
router.patch("/chamar-proximo", (req, res) => {
  const aguardando = fila.filter(
    (item) => item.status === "aguardando"
  )

  if (aguardando.length === 0) {
    return res.status(404).json({
      mensagem: "Não há estudantes aguardando atendimento"
    })
  }

  const filaOrdenada = [...aguardando].sort((a, b) => {
    if (a.prioridade === b.prioridade) {
      return a.id - b.id
    }

    return a.prioridade ? -1 : 1
  })

  const proximo = filaOrdenada[0]

  const senha = fila.find(
    (item) => item.id === proximo.id
  )

  senha.status = "em_atendimento"
  senha.horarioChamada = new Date().toISOString()

  res.status(200).json({
    mensagem: "Próximo estudante chamado com sucesso",
    atendimento: senha
  })
})

module.exports = router