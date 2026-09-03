const express = require("express")

const router = express.Router()

router.get("/", (req, res) => {
  res.status(200).json({
    mensagem: "Lista de usuários do EduFila",
    usuarios: []
  })
})

module.exports = router