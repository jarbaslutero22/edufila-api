const express = require("express")
const bcrypt = require("bcryptjs")

const router = express.Router()

let usuarios = []

router.get("/", (req, res) => {
  const usuariosSemSenha = usuarios.map(({ senha, ...usuario }) => usuario)

  res.status(200).json({
    mensagem: "Lista de usuários do EduFila",
    usuarios: usuariosSemSenha
  })
})

router.post("/", async (req, res) => {
  try {
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

    const senhaCriptografada = await bcrypt.hash(senha, 10)

    const novoUsuario = {
      id: usuarios.length + 1,
      nome,
      email,
      senha: senhaCriptografada,
      perfil
    }

    usuarios.push(novoUsuario)

    res.status(201).json({
      mensagem: "Usuário cadastrado com sucesso",
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        perfil: novoUsuario.perfil
      }
    })
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro interno ao cadastrar usuário"
    })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body

    if (!email || !senha) {
      return res.status(400).json({
        mensagem: "Informe e-mail e senha"
      })
    }

    const usuario = usuarios.find(
      (usuario) => usuario.email === email
    )

    if (!usuario) {
      return res.status(401).json({
        mensagem: "E-mail ou senha inválidos"
      })
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha)

    if (!senhaValida) {
      return res.status(401).json({
        mensagem: "E-mail ou senha inválidos"
      })
    }

    res.status(200).json({
      mensagem: "Login realizado com sucesso",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    })
  } catch (erro) {
    res.status(500).json({
      mensagem: "Erro interno ao realizar login"
    })
  }
})

module.exports = router