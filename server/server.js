'use strict';

const { response } = require('express');
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

app.get('/api/surveys', async (req, res) => {
  try {
    dao.getSurveys().then((surveys) => res.json(surveys))
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
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