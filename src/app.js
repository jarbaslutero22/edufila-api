const express = require("express")
const cors = require("cors")
require("dotenv").config()

const usuariosRoutes = require("./routes/usuarios.routes")
const setoresRoutes = require("./routes/setores.routes")
const senhasRoutes = require("./routes/senhas.routes")
const filaRoutes = require("./routes/fila.routes")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.json({
    sistema: "EduFila API",
    status: "online",
    mensagem: "API funcionando corretamente"
  })
})

app.use("/api/usuarios", usuariosRoutes)
app.use("/api/setores", setoresRoutes)
app.use("/api/senhas", senhasRoutes)
app.use("/api/fila", filaRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`EduFila API rodando em http://localhost:${PORT}`)
})