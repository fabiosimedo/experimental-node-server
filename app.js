const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const connection = require('./database/database');
const question = require('./database/Question');
const Questions = require('./database/Question');
const Question = require('./database/Question');
const Answer = require('./database/Answer')

connection
  .authenticate()
  .then(() => console.log('Conecção realizada'))
  .catch(e => console.log(e))

app.use(bodyParser.urlencoded({extended: false}));
//app.use(bodyParser.json);

app.set('view engine', 'ejs');
app.use(express.static('public'));


app.get('/', (req,res) => {
  Questions.findAll({ raw: true, order: [['id', 'DESC']] }).then(question => {
    res.render('index', { question });
  })
});

app.get('/questions', (req,res) => {
  res.render('questions');
});

app.post('/receivedquestions', (req,res) => {
  const title = req.body.title;
  const question = req.body.textArea;
  Questions.create({
    title: title,
    description: question
  })
  .then(() => res.redirect("/"))
  .catch(e => res.send("Houve um erro ao inserir os dados no banco. " + e.message))
});

app.get('/question/:id', (req,res) => {
  const id = req.params.id
  Question.findOne({ where: { id: id }})
  .then(question => {
    if(question != undefined) { 
      Answer.findAll({
        where: { questionId: question.id},
        order: [['id', 'DESC']]
      }).then(answers => {
        res.render('question', {
          question: question,
          answers: answers
        }) 
      })
    } else {
      res.redirect('/')
    }
  })
  .catch(e => res.send(`<h1 class="text-warning">Ocorreu um erro ${e.message}<h1>` ))
})

app.post('/answer', (req, res) => {
  const body = req.body.body
  const questionId = req.body.question
  Answer.create({
    body: body,
    questionId: questionId
  }).then(() => res.redirect(`/question/${questionId}`))
  .catch(e => res.send(`<h1 class="text-warning">Ocorreu um erro ${e.message}<h1>`))
})

app.listen(4000, (err) => {
  err ? console.log("Ocorreu um erro") : console.log("Servidor rodando normal");
});