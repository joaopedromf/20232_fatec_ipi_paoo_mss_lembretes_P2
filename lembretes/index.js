require('dotenv').config()
//usamos para definir endpoints
//para receber requisições HTTP
const express = require('express')
//usamos para enviar requisições HTTP
const axios = require('axios')
const app = express();
//middleware
app.use(express.json())

/*
  {
    "1": {"id": "1", "texto": "Fazer café"},
    "2": {"id": "2", "texto": "Ver um filme"}
  }
*/
const lembretes = {}
let id = 1

const funcoes = {
  LembreteClassificado: async (lembrete) => {
    lembretes[lembrete.id].status = lembrete.status
    await axios.post('http://localhost:10000/eventos', {
      type: 'LembreteAtualizado',
      payload: lembrete
    })
  }
}

//GET /lembretes
app.get('/lembretes', (req, res) => res.send(lembretes))  

//POST /eventos
app.post('/eventos', (req, res) => {
  try{
    const evento = req.body
    console.log(evento)
    funcoes[evento.type](evento.payload)
  }
  catch(e){}
  res.status(200).end() 
})

//POST /lembretes {texto: "Fazer cafe"}
app.post('/lembretes', async (req, res) => {
  const texto = req.body.texto
  const lembrete = {id, texto}
  lembretes[id] = lembrete
  id++
  //isso é a emissão de um evento
  //ou seja, só uma requisição HTTP
  await axios.post('http://localhost:10000/eventos', {
    type: "LembreteCriado",
    payload: lembrete,
    status: "aguardando"
  })
  // HTTP 201 Created
  res.status(201).send(lembrete)
})

app.listen(
  process.env.PORT,
  () => console.log(`Lembretes: ${process.env.PORT}`)
)