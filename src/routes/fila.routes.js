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

let historico = []

function ordenarFila(lista) {
  return [...lista].sort((a, b) => {
    if (a.prioridade === b.prioridade) {
      return a.id - b.id
    }

    return a.prioridade ? -1 : 1
  })
}

// Listar a fila
router.get("/", (req, res) => {
  const filaOrdenada = ordenarFila(fila)

  res.status(200).json({
    mensagem: "Fila de atendimento do EduFila",
    quantidade: filaOrdenada.length,
    fila: filaOrdenada
  })
})

// Chamar o próximo estudante
router.patch("/chamar-proximo", (req, res) => {
  const aguardando = fila.filter(
    (item) => item.status === "aguardando"
  )

  if (aguardando.length === 0) {
    return res.status(404).json({
      mensagem: "Não há estudantes aguardando atendimento"
    })
  }

  const filaOrdenada = ordenarFila(aguardando)
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

// Adiar atendimento
router.patch("/:codigo/adiar", (req, res) => {
  const codigo = req.params.codigo.toUpperCase()

  const senha = fila.find(
    (item) => item.codigo.toUpperCase() === codigo
  )

  if (!senha) {
    return res.status(404).json({
      mensagem: "Senha não encontrada"
    })
  }

  senha.status = "aguardando"
  senha.prioridade = false
  senha.horarioAdiamento = new Date().toISOString()

  const maiorId = Math.max(...fila.map((item) => item.id))
  senha.id = maiorId + 1

  res.status(200).json({
    mensagem: "Atendimento adiado com sucesso",
    senha
  })
})

// Finalizar atendimento
router.patch("/:codigo/finalizar", (req, res) => {
  const codigo = req.params.codigo.toUpperCase()

  const senha = fila.find(
    (item) => item.codigo.toUpperCase() === codigo
  )

  if (!senha) {
    return res.status(404).json({
      mensagem: "Senha não encontrada"
    })
  }

  if (senha.status !== "em_atendimento") {
    return res.status(400).json({
      mensagem: "A senha precisa estar em atendimento para ser finalizada"
    })
  }

  senha.status = "finalizado"
  senha.horarioFinalizacao = new Date().toISOString()

  historico.push({
    ...senha
  })

  fila = fila.filter(
    (item) => item.codigo !== codigo
  )

  res.status(200).json({
    mensagem: "Atendimento finalizado com sucesso",
    atendimento: senha
  })
})

// Histórico de atendimentos
router.get("/historico/listar", (req, res) => {
  res.status(200).json({
    mensagem: "Histórico de atendimentos do EduFila",
    quantidade: historico.length,
    historico
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

  const filaOrdenada = ordenarFila(fila)

  const posicao =
    filaOrdenada.findIndex(
      (item) => item.codigo === senha.codigo
    ) + 1

  res.status(200).json({
    mensagem: "Senha encontrada",
    posicao,
    senha
  })
})

module.exports = router