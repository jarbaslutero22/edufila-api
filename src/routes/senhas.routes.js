const express = require("express")

const router = express.Router()

let senhas = []
let proximoNumero = 1

router.get("/", (req, res) => {
  res.status(200).json({
    mensagem: "Lista de senhas do EduFila",
    senhas
  })
})

router.post("/", (req, res) => {
  const { estudante, setorId, prioridade = false } = req.body

  if (!estudante || !setorId) {
    return res.status(400).json({
      mensagem: "Estudante e setor são obrigatórios"
    })
  }

  const codigo = `A${String(proximoNumero).padStart(3, "0")}`

  const novaSenha = {
    id: proximoNumero,
    codigo,
    estudante,
    setorId: Number(setorId),
    prioridade: Boolean(prioridade),
    status: "aguardando",
    dataHora: new Date().toISOString()
  }

  senhas.push(novaSenha)
  proximoNumero++

  res.status(201).json({
    mensagem: "Senha gerada com sucesso",
    senha: novaSenha
  })
})

module.exports = router