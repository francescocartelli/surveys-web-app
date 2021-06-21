'use strict';

const { response } = require('express')
const { body, param, validationResult } = require('express-validator')
const express = require('express')
const morgan = require('morgan')
const dao = require('./dao')

// init express
const app = new express();
const port = 3001;

app.use(morgan('dev'))
app.use(express.json())

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

/* ------ */
/* SURVEY */
/* ------ */

app.get('/api/surveys', async (req, res) => {
  try {
    const surveys = await dao.getSurveys()
    res.json(surveys)
  } catch (error) {
    res.status(500).json(error)
  }
})

app.get('/api/survey/:id', param('id').isNumeric(), async (req, res) => {
  const id = req.params.id
  try {
    let survey = await dao.getSurvey(id)
    survey.questions = []

    const questions = await dao.getQuestions(id)
    for(const q of questions) {
      const answers = await dao.getAnswers(q.id)
      survey.questions.push({...q, answers})
    }
    res.json(survey)
  } catch (error) {
    if(error.error === "Survey not found!") res.status(404).json(error)
    else res.status(500).json(error)
  }
})

app.post('/api/survey', async (req, res) => {
  const survey = req.body
  const questions = survey.questions
  try {
    const sId = await dao.insertSurvey(survey)
    for (const q of questions) {
      let qId = await dao.insertQuestion(sId, q)
      for (const a of q.answers) await dao.insertAnswer(qId, a)
    }
    res.end()
  } catch (error) {
    console.log("-> " + error)
    res.status(500).json(error)
  }
})