'use strict';

const { response } = require('express')
const { body, param, validationResult } = require('express-validator')
const express = require('express')
const morgan = require('morgan')
const dao = require('./dao')

// init express
const app = new express()
const port = 3001

app.use(morgan('dev'))
app.use(express.json())

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
})

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
  try {
    const id = req.params.id

    let survey = await dao.getSurvey(id)
    survey.questions = []

    const questions = await dao.getQuestions(id)
    for (const q of questions) {
      const answers = await dao.getAnswers(q.id)
      survey.questions.push({ ...q, answers })
    }
    res.json(survey)
  } catch (error) {
    if (error.error === "Survey not found!") res.status(404).json(error)
    else res.status(500).json(error)
  }
})

app.post('/api/survey', async (req, res) => {
  try {
    const survey = req.body
    const questions = survey.questions

    const sId = await dao.insertSurvey(survey)
    for (const q of questions) {
      let qId = await dao.insertQuestion(sId, q)
      for (const a of q.answers) await dao.insertAnswer(qId, a)
    }
    res.end()
  } catch (error) {
    res.status(500).json(error)
  }
})

app.post('/api/answers', async (req, res) => {
  try {
    const body = req.body
    const idSurvey = body.idSurvey
    const username = body.username
    const userAnswers = body.userAnswers

    const csId = await dao.insertCompletedSurvey(idSurvey, username)
    for (const a of userAnswers) {
      if (a.type === 0) {
        for (const value of a.values) {
          dao.insertUserClosedAnswer(value, csId)
        }
      } else {
        dao.insertUserOpenAnswer(csId, a.id, a.values)
      }
    }

    res.end()
  } catch (error) {
    res.status(500).json(error)
  }
})