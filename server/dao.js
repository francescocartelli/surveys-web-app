'use strict';

const sqlite = require('sqlite3');
// const bcrypt = require('bcrypt');

// open the database
const db = new sqlite.Database('tasks.db', (err) => { if (err) throw err; });

// Get all tasks
exports.getAllTasks = (user_id) => {
  const SQL_GETALLTASKS = 'SELECT * FROM tasks WHERE USER=?';

  return new Promise((resolve, reject) => {
    db.all(SQL_GETALLTASKS, [user_id], (err, rows) => {
      if (err)
        reject(err);
      else if (rows === undefined)
        reject({ error: 'Empty DB!' });
      else {
        resolve(rows);
      }
    });
  });
}


// Get task by id
exports.getTaskById = (id, user_id) => {

  const SQL_GETBYID = 'SELECT * FROM tasks WHERE id=? and USER=?';

  return new Promise((resolve, reject) => {
    db.get(SQL_GETBYID, [id, user_id], (err, row) => {
      if (err)
        reject(err);
      else if (row === undefined)
        reject({ error: 'Invalid task ID!' });
      else {
        const task = {
          id: row.id, description: row.description, important: row.important,
          private: row.private, deadline: row.deadline, completed: row.completed,
          user: row.user
        };
        resolve(task);
      }
    });
  });
}

// Get tasks
exports.getTasks = (properties, user_id) => {
  let SQL_QUERY = 'SELECT * FROM tasks where USER=?'
  let values = []

  Object.keys(properties).forEach((property, i) => {
    if (property === 'minDeadline')
      SQL_QUERY += ' AND deadline>=?'
    else if (property === 'maxDeadline')
      SQL_QUERY += ' AND deadline<=?'
    else
      SQL_QUERY += ' AND ' + property + "=?"

    values.push(properties[property])
  })

  return new Promise((resolve, reject) => {
    db.all(SQL_QUERY, [user_id, ...values], (err, rows) => {
      if (err) {
        reject(err);
      } else if (rows === undefined) {
        reject({ error: "No such tasks with specified properties!" })
      } else {
        resolve(rows)
      }
    })
  })
}


//insertNewTask
exports.createTask = (desc, important, priv, pdeadline, completed, user) => {
  const SQL_INSERT = 'INSERT INTO TASKS ' +
    '(ID, DESCRIPTION, IMPORTANT, PRIVATE, DEADLINE, COMPLETED, USER) ' +
    'VALUES ((SELECT MAX(ID)+1 FROM TASKS), ?, ?, ?, ?, ?, ?)';
  return new Promise((resolve, reject) => {
    let deadline = pdeadline;
    if (!pdeadline)
      deadline = null;
    db.run(SQL_INSERT, [desc, important, priv, deadline, completed, user], (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(true)
      }

    });
  });
}


//updateTask
exports.updateTask = (id, desc, important, priv, pdeadline, completed, user) => {
  const SQL_UPDATE = 'UPDATE TASKS SET' +
    ' DESCRIPTION=?, IMPORTANT=?, PRIVATE=?, DEADLINE=?, COMPLETED=?, USER=? ' +
    ' WHERE ID=?';

  return new Promise((resolve, reject) => {
    let deadline = pdeadline;
    if (!pdeadline)
      deadline = null;
    db.run(SQL_UPDATE, [desc, important, priv, deadline, completed, user, id], (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    })
  });
}

//markTask
exports.markTask = (id, completed, user_id) => {
  const SQL_MARK = 'UPDATE TASKS SET COMPLETED=? WHERE USER=? AND ID=?';

  return new Promise((resolve, reject) => {
    db.run(SQL_MARK, [completed, user_id, id], (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    })
  });
}

//deleteTask
exports.deleteTask = (id, user_id) => {
  const SQL_DELETE = 'DELETE FROM TASKS WHERE ID=? AND USER=?';

  return new Promise((resolve, reject) => {
    db.run(SQL_DELETE, [id, user_id], (err) => {
      if (err)
        reject(err);
      else
        resolve(true);
    })
  });

}

//user validation
exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.get(sql, [email], (err, row) => {
      if (err)
        reject(err); // DB error
      else if (row === undefined) {
        resolve(false); // user not found
      } else {
        bcrypt.compare(password, row.hash).then(result => {
          if (result) { // password matches
            resolve({ id: row.id, username: row.email, name: row.name });
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
    const sql = 'SELECT * FROM users WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err)
        reject(err); // DB error
      else if (row === undefined)
        resolve(false); // user not found
      else {
        resolve({ id: row.id, email: row.email, name: row.name });
      }
    })
  })
}