const express = require("express")

const router = express.Router()

// Dados simulados de atendimentos finalizados
const atendimentos = [
  {
    codigo: "A001",
    estudante: "Ana Silva",
    setorId: 1,
    prioridade: false,
    status: "finalizado",
    horarioEntrada: "2026-09-05T10:00:00.000Z",
    horarioChamada: "2026-09-05T10:10:00.000Z",
    horarioFinalizacao: "2026-09-05T10:20:00.000Z"
  },
  {
    codigo: "A002",
    estudante: "Carlos Souza",
    setorId: 1,
    prioridade: true,
    status: "finalizado",
    horarioEntrada: "2026-09-05T10:05:00.000Z",
    horarioChamada: "2026-09-05T10:07:00.000Z",
    horarioFinalizacao: "2026-09-05T10:15:00.000Z"
  },
  {
    codigo: "A003",
    estudante: "Mariana Lima",
    setorId: 2,
    prioridade: false,
    status: "finalizado",
    horarioEntrada: "2026-09-05T11:00:00.000Z",
    horarioChamada: "2026-09-05T11:12:00.000Z",
    horarioFinalizacao: "2026-09-05T11:25:00.000Z"
  }
]

// Relatório geral
router.get("/", (req, res) => {
  const totalAtendimentos = atendimentos.length

  const prioritarios = atendimentos.filter(
    (item) => item.prioridade
  ).length

  const normais = totalAtendimentos - prioritarios

  res.status(200).json({
    mensagem: "Relatório geral do EduFila",
    totalAtendimentos,
    atendimentosPrioritarios: prioritarios,
    atendimentosNormais: normais,
    atendimentos
  })
})

// Relatório por setor
router.get("/setor/:setorId", (req, res) => {
  const setorId = Number(req.params.setorId)

  const dados = atendimentos.filter(
    (item) => item.setorId === setorId
  )

  res.status(200).json({
    mensagem: "Relatório de atendimentos por setor",
    setorId,
    quantidade: dados.length,
    atendimentos: dados
  })
})

// Indicadores
router.get("/indicadores", (req, res) => {
  if (atendimentos.length === 0) {
    return res.status(200).json({
      mensagem: "Nenhum atendimento disponível para gerar indicadores"
    })
  }

  const temposEspera = atendimentos.map((item) => {
    const entrada = new Date(item.horarioEntrada)
    const chamada = new Date(item.horarioChamada)

    return (chamada - entrada) / 60000
  })

  const temposAtendimento = atendimentos.map((item) => {
    const chamada = new Date(item.horarioChamada)
    const finalizacao = new Date(item.horarioFinalizacao)

    return (finalizacao - chamada) / 60000
  })

  const mediaEspera =
    temposEspera.reduce((total, tempo) => total + tempo, 0) /
    temposEspera.length

  const mediaAtendimento =
    temposAtendimento.reduce((total, tempo) => total + tempo, 0) /
    temposAtendimento.length

  res.status(200).json({
    mensagem: "Indicadores do EduFila",
    totalAtendimentos: atendimentos.length,
    tempoMedioEsperaMinutos: Number(mediaEspera.toFixed(2)),
    tempoMedioAtendimentoMinutos: Number(
      mediaAtendimento.toFixed(2)
    )
  })
})

module.exports = router