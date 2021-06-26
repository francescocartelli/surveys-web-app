'use strict';

const { response } = require('express')
const { body, param, validationResult } = require('express-validator')
const express = require('express')
const morgan = require('morgan')
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const session = require('express-session');

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

/* -------- */
/* PASSPORT */
/* -------- */

passport.use(new passportLocal.Strategy((username, password, done) => {
  // verification callback for authentication
  dao.getUser(username, password).then(user => {
    if (user)
      done(null, user);
    else
      done(null, false, { message: 'Username or password wrong' });
  }).catch(err => {
    done(err);
  })
}))

passport.serializeUser((user, done) => {
  done(null, user.id);
})

passport.deserializeUser((id, done) => {
  dao.getUserById(id)
    .then(user => done(null, user))// this will be available in req.user
    .catch(err => done(err, null))
})

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated())
    return next();
  return res.status(401).json({ error: 'Unauthenticated user!' });
}

/* ------- */
/* SESSION */
/* ------- */

// initialize and configure HTTP sessions
app.use(session({
  secret: 'this and that and other',
  resave: false,
  saveUninitialized: false
}))

// tell passport to use session cookies
app.use(passport.initialize())
app.use(passport.session())

/* -------------- */
/* AUTHENTICATION */
/* -------------- */

// Login
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user)
      return res.status(401).json(info)

    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err)

      // req.user contains the authenticated user, we send all the user info back
      // this is coming from userDao.getUser()
      return res.json(req.user)
    })
  })(req, res, next)
})

// Logout
app.delete('/api/sessions/current', isLoggedIn, (req, res) => {
  console.log("logout")
  req.logout()
  res.end()
})

// Current User
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    console.log("islogged")
    res.status(200).json(req.user)
  } else {
    console.log("isnotlogged")
    res.status(401).json({ error: 'Unauthenticated user!' })
  }
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

app.get('/api/adminsurveys', isLoggedIn, async (req, res) => {
  try {
    const idAdmin = req.user.id
    const surveys = await dao.getAdminSurveys(idAdmin)
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

app.get('/api/results/:id/:idCS', isLoggedIn, param('id').isNumeric(), async (req, res) => {
  try {
    const id = req.params.id
    const idCS = req.params.idCS
    
    let survey = await dao.getSurvey(id)
    survey.questions = []

    const questions = await dao.getQuestions(id)
    for (const q of questions) {
      const answers = await dao.getAnswers(q.id)
      let userAnswers = null
      if(q.type === 0) {
        const ans = await dao.getUserClosedAnswers(q.id, idCS)
        userAnswers = ans.map(a => a.idAnswer)
      } else {
        const ans = await dao.getUserOpenAnswers(q.id, idCS)
        userAnswers = ans.text ? ans.text : ""
      }
      survey.questions.push({ ...q, answers, values: userAnswers })
    }
    res.json(survey)
  } catch (error) {
    if (error.error === "Survey not found!") res.status(404).json(error)
    else res.status(500).json(error)
  }
})

app.post('/api/survey', isLoggedIn, async (req, res) => {
  try {
    const survey = req.body
    const questions = survey.questions
    const idAdmin = req.user.id

    const sId = await dao.insertSurvey(survey, idAdmin)
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