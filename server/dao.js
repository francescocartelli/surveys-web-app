'use strict'

const sqlite = require('sqlite3')
const bcrypt = require('bcrypt')

// open the database
const db = new sqlite.Database('surveys.db', (err) => { if (err) throw err })

exports.getSurvey = (idSurvey) => {
  const sql_query = 'SELECT * FROM Survey where id = ?'

  return new Promise((resolve, reject) => {
    db.get(sql_query, [idSurvey], (err, row) => {
      if (err)
        reject(err)
      else if (row === undefined)
        reject({ error: 'Survey not found!' })
      else
        resolve(row)
    })
  })
}

exports.getQuestions = (idSurvey) => {
  const sql_query = 'SELECT * FROM Question where idSurvey = ?'

  return new Promise((resolve, reject) => {
    db.all(sql_query, [idSurvey], (err, rows) => {
      if (err)
        reject(err)
      else if (rows === undefined)
        reject({ error: 'Empty DB!' })
      else
        resolve(rows)
    })
  })
}

exports.getAnswers = (idQuestion) => {
  const sql_query = 'SELECT * FROM Answer where idQuestion = ?'

  return new Promise((resolve, reject) => {
    db.all(sql_query, [idQuestion], (err, rows) => {
      if (err)
        reject(err)
      else if (rows === undefined)
        reject({ error: 'Empty DB!' })
      else
        resolve(rows)
    })
  })
}

exports.getSurveys = () => {
  const sql_getSurveys = 'SELECT * FROM survey'

  return new Promise((resolve, reject) => {
    db.all(sql_getSurveys, [], (err, rows) => {
      if (err)
        reject(err);
      else if (rows === undefined)
        reject({ error: 'Empty DB!' });
      else {
        resolve(rows);
      }
    })
  })
}

const getIdSurvey = () => {
  const sql_getId = "select max(id) as num from Survey"
  return new Promise((resolve, reject) => {
    db.get(sql_getId, [], (err, row) => {
      if (err) reject(err)
      else if (row === undefined) reject(err)
      else resolve(row.num)
    })
  })
}

const getIdQuerstion = () => {
  const sql_getId = "select max(id) as num from Question"
  return new Promise((resolve, reject) => {
    db.get(sql_getId, [], (err, row) => {
      if (err) reject(err)
      else if (row === undefined) reject(err)
      else resolve(row.num)
    })
  })
}

exports.insertSurvey = async (survey) => {
  const surveyId = await getIdSurvey() + 1
  const sql_query = "INSERT INTO Survey(id, title, pubdate) VALUES(?, ?, ?)"

  return new Promise((resolve, reject) => {
    db.run(sql_query, [surveyId, survey.title, survey.pubdate], (error) => {
      if (error) {
        reject(error)
      } else {
        resolve(surveyId)
      }
    })
  })
}

exports.insertQuestion = async (idSurvey, question) => {
  const idQuestion = await getIdQuerstion() + 1

  const sql_query = "INSERT INTO Question(id, idSurvey, text, type, min, max) VALUES (?, ?, ?, ?, ?, ?)"
  return new Promise((resolve, reject) => {
    db.run(sql_query, [idQuestion, idSurvey, question.text, question.type, question.min, question.max], (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(idQuestion)
      }
    })
  })
}

exports.insertAnswer = async (idQuestion, answer) => {
  const sql_query = "INSERT INTO Answer(idQuestion, text) VALUES (?, ?)"

  return new Promise((resolve, reject) => {
    db.run(sql_query, [idQuestion, answer.text], (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(true)
      }
    })
  })
}

const getIdCompletedSurvey = () => {
  const sql_getId = "select max(id) as num from CompletedSurvey"
  return new Promise((resolve, reject) => {
    db.get(sql_getId, [], (err, row) => {
      if (err) reject(err)
      else if (row === undefined) reject(err)
      else resolve(row.num)
    })
  })
}

exports.insertCompletedSurvey = async (idSurvey, username) => {
  const compSurveyId = await getIdCompletedSurvey() + 1
  const sql_query = "INSERT INTO CompletedSurvey(id, idSurvey, username) VALUES (?, ?, ?)"
  return new Promise((resolve, reject) => {
    db.run(sql_query, [compSurveyId, idSurvey, username], (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(compSurveyId)
      }
    })
  })
}

exports.insertUserClosedAnswer = async (idAnswer, idCS) => {
  const sql_query = "INSERT INTO UserClosedAnswer(idAnswer, idCompletedSurvey) VALUES (?, ?)"
  return new Promise((resolve, reject) => {
    db.run(sql_query, [idAnswer, idCS], (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(true)
      }
    })
  })
}

exports.insertUserOpenAnswer = async (idCS, idQuestion, text) => {
  const sql_query = "INSERT INTO UserOpenAnswer(idCompletedSurvey, idQuestion, text) VALUES (?, ?, ?)"
  return new Promise((resolve, reject) => {
    db.run(sql_query, [idCS, idQuestion, text], (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(true)
      }
    })
  })
}

//user validation
exports.getUser = (username, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Admin WHERE username = ?';
    db.get(sql, [username], (err, row) => {
      if (err)
        reject(err); // DB error
      else if (row === undefined) {
        resolve(false); // user not found
      } else {
        bcrypt.compare(password, row.hash).then(result => {
          if (result) { // password matches
            resolve({ id: row.id, username: row.username });
          } else {
            resolve(false); // password not matching
          }
        }).catch((err) => { console.error(err) })
      }
    })
  })
}

exports.getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Admin WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err)
        reject(err); // DB error
      else if (row === undefined)
        resolve(false); // user not found
      else {
        resolve({ id: row.id, username: row.username });
      }
    })
  })
}