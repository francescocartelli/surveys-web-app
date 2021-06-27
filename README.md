## Routes:
* **/**, **/home**: Homepage of the website, visibile only for unlogged users. Contains a list of published surveys.<br/> If the user is logged and browse this page it is redirect to his personal 'dashboard'.

* **/survey/:id**: Survey form for the survey specified by the id.

* **/dashboard**: Personal 'home' for each administrator.<br/>
This page allows admin to navigate to the 'editor' and shows all the surveys published by the admin and their results. <br/>
Require login.

* **/editor**: Editor for a new survey. Allows an admin to create a new survey.<br/>
Require login.

* **/results/:idCS**: Allows an admin to display the result for a specific 'CompletedSurvey', idCS is the identifier of a survey completed by a user.<br/>
Navigation throught survey can be achieved by moving forward and backward in the responses made by the users.<br/>
Require login.

* **/login**: Application login.<br/>
Require unlogged session.<br/>
Redirect to 'home' if user is logged.

* **default route**: wrong page. Contains a link to the 'home' page.

## API's
### getSurveys
URL: `/api/surveys`

Method: GET

Description: Get all the basic informations for the surveys to be displayed in the 'home' page.

Request body: _None_

Response: `200 OK` (success) 
    or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a survey.
```
[{
    "id": 1,
    "title": "Best place for summer vacation 2021"
    "idAdmin": 1
  },
  {
    "id": 2,
    "title": "Are you a psychopath?"
    "idAdmin": 2
  },
...
]
```

### getAdminSurvey
URL: `/api/adminsurveys`

Method: GET

Description: Get surveys information for a specific admin.

Request body: user (admin), contains id of the admin (hidden)

Response: `200 OK` (success) 
    or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a survey.
```
[{
    "next": 8, // Id of the first result
    "id": 1
    "title": "Best place for summer vacation 2021"
    "idAdmin": 1
  },
  {
    "next": 45,
    "id": 5,
    "text": "Are you an horrible person?"
    "idAdmin": 1
  },
...
]
```

### getSurvey (surveyId)
URL: `/api/survey/:id`

Method: GET

Description: Get a survey for a user form.

Request body: None

Response: `200 OK` (success) 
    or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a survey, for a completed user form.
```
{
  "id": 11,
  "title": "Customer satisfaction",
  "idAdmin": 1,
  "questions": [
    {
      "id": 26,
      "idSurvey": 11,
      "text": "Do you often recommend a company to a friend?",
      "type": 0,
      "min": 1,
      "max": 1,
      "position": null,
      "answers": [
        {
          "id": 77,
          "idQuestion": 26,
          "text": "Yes, i do."
        },
        {
          "id": 78,
          "idQuestion": 26,
          "text": "No, i don't."
        },
        {
          "id": 79,
          "idQuestion": 26,
          "text": "Sometimes, I do."
        }
      ]
    },
    {
      "id": 27,
      "idSurvey": 11,
      "text": "What is the latest product you recommended to a friend?",
      "type": 1,
      "min": 1,
      "max": 1,
      "answers": []
    },
    ...
  ]
}
```

### getResults (idCompletedSurvey)
URL: `/api/results/:idCS`

Method: GET

Description: Get a response for a specific CompletedSurvey.

Request body: user (admin), contains id of the admin (hidden)

Response: 
* `200 OK` (success)
* `401 Unauthorized` (the admin manually typed the id of a survey that does not belong to him)
* `404 Not Found` (the id is not correlated to any CompletedSurvey)
* `500 Internal Server Error` (generic error).

Response body: A survey object with responses attached for a completed user form, values is the object that contains the user answers (closed answer -> id of the answer, open answer -> text).
```
{
  "id": 11,
  "title": "Customer satisfaction",
  "idAdmin": 1,
  "questions": [
    {
      "id": 26,
      "idSurvey": 11,
      "text": "Do you often recommend a company to a friend?",
      "type": 0,
      "min": 1,
      "max": 1,
      "position": null,
      "answers": [
        {
          "id": 77,
          "idQuestion": 26,
          "text": "Yes, i do."
        },
        {
          "id": 78,
          "idQuestion": 26,
          "text": "No, i don't."
        },
        {
          "id": 79,
          "idQuestion": 26,
          "text": "Sometimes, I do."
        }
      ],
      "values": [
        79
      ]
    },
    {
      "id": 27,
      "idSurvey": 11,
      "text": "What is the latest product you recommended to a friend?",
      "type": 1,
      "min": 1,
      "max": 1,
      "position": null,
      "answers": [],
      "values": "Toothpaste"
    },
    ...
  ],
  "username": "james ravioli",
  "next": null
}
```

### publishSurvey (surveyTitle, questions)
URL: `/api/survey`

Method: POST

Description: Publish a new survey.

Request body: new survey.
```
{
  "title": "Market Research - Product Testing Template",
  "questions": [
    {
      "id": 0,
      "text": "Name the last product you bought",
      "type": 1,
      "answers": [],
      "min": 1,
      "max": 1
    },
    {
      "id": 1,
      "text": "In what category does it belong?",
      "type": 0,
      "answers": [
        {
          "text": "Electronics"
        },
        {
          "text": "Automotive"
        },
        {
          "text": "Self Care"
        },
        {
          "text": "Other"
        }
      ],
      "min": 1,
      "max": 1
    }
  ]
}
```


### submitUserAnswers (idSurvey, username, userAnswers)
URL: `/api/answers`

Method: POST

Description: Submit user answers to a survey.

Request body: new answers.
```
{
  "idSurvey": "12",
  "username": "albert",
  "userAnswers": [
    {
      "id": 28,
      "type": 1,
      "values": "Smartphone"
    },
    {
      "id": 29,
      "type": 0,
      "values": [
        80
      ]
    },
    ...
  ]
}
```

Response: 
* `200 OK` (success)
* `500 Internal Server Error` (generic error).

Response body: None, error if status is 500.

## Database tables:
* **Admin**: used for keeping track of the admin credentials.

* **Survey**: contains the information about the surveys created by the admins.<br/>
Contains a reference to che admin that created it.

* **Question**: contains the questions within the surveys.<br/>
There are no tables dedicated to open or closed questions.<br/>
Each question (open or closed) is contained in this table. The type column allows you to identify its type (0 -> closed, 1 -> open).<br/>
Min and max columns refer to the constraints of the questions.<br/>
If question is closed, min and max limit the number of possibile answers.<br/>
If question is open, min refers to a mandatory or optional question, max has no purpose for open questions.<br/>
Questions contains a reference to the survey where they belong.
Each question belongs only to one survey.
Using the same table for all types of question, simplifies ordering procedure when
a survey is proposed to a user.

* **Answer**: contains the possible answers (closed answers) to a closed ended question.<br/>
Each answers contains a reference to the question were it belong.<br/>
One answer belongs only to a question.

* **CompletedSurvey**: contains the information for a survey that has been responded to a user.<br/>
Contains a non-unique username and a reference to the survey that has been answered.<br/>

* **UserClosedAnswer**: keeps track of an answer (closed answer) given by a user.<br/>
Contains a reference to a completedSurvey and AN ANSWER (closed answer) from a survey.<br/>

**eg.** *idCompletedSurvey: X, idAnswer: Y*<br/>
means that in the survey response X the user checked the answer Y<br/>
**eg.** *idCompletedSurvey: X, idAnswer: Z*<br/>
means that in the survey response X the user checked the answer Z<br/>

Answer Y and Z can belong to the same question (multiple-choice)<br/>
I only keep track of true answer, if user did not checked the answer, the is not existing<br/>

* **UserOpenAnswer**: contains the text provided by the user in an open ended question.<br/>
Contains a reference to a completedSurvey and A QUESTION (open question) from a survey.<br/>

**eg.** *idCompletedSurvey: X, idQuestion: Y, text: Z*<br/>
means that in the survey response X the user checked answered Z to the question Y<br/>

## Login credentials (username + password)
