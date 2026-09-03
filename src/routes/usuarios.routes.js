const express = require("express")

const router = express.Router()

let usuarios = []

router.get("/", (req, res) => {
  res.status(200).json({
    mensagem: "Lista de usuários do EduFila",
    usuarios
  })
})

router.post("/", (req, res) => {
  const { nome, email, senha, perfil } = req.body

  if (!nome || !email || !senha || !perfil) {
    return res.status(400).json({
      mensagem: "Preencha todos os campos obrigatórios"
    })
  }

  const usuarioExistente = usuarios.find(
    (usuario) => usuario.email === email
  )

  if (usuarioExistente) {
    return res.status(409).json({
      mensagem: "Já existe um usuário cadastrado com este e-mail"
    })
  }

  const novoUsuario = {
    id: usuarios.length + 1,
    nome,
    email,
    senha,
    perfil
  }

  usuarios.push(novoUsuario)

  res.status(201).json({
    mensagem: "Usuário cadastrado com sucesso",
    usuario: novoUsuario
  })
})

module.exports = router