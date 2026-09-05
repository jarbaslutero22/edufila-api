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

module.exports = router