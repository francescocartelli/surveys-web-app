# Surveys

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

* **default route**: Wrong page. Contains a link to the 'home' page.

## APIs
### getSurveys
URL: `/api/surveys`

Method: GET

Description: Get all the basic informations for the surveys to be displayed in the 'home' page.

Request body: _None_

Responses: 
* `200 OK` (success) 
* `500 Internal Server Error` (generic error).

Response body: An array of objects, each one describing a survey.
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

Request body: user (admin), contains id of the admin (hidden). Managed by PassportJS.

Response:
* `200 OK` (success) 
* `500 Internal Server Error` (generic error).

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
URL: `/api/posurvey/:id`

Method: GET

Description: Get a survey for a user form.

Request body: None

Responses:
* `200 OK` (success) 
* `500 Internal Server Error` (generic error).

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

Request body: user (admin), contains id of the admin (hidden). Managed by PassportJS.

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

Responses: 
* `200 OK` (success)
* `500 Internal Server Error` (generic error).

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

Responses: 
* `200 OK` (success)
* `500 Internal Server Error` (generic error)

Response body: None, error if status is 500.

### logIn (credentials):
URL: `/api/sessions`

Method: POST

Description: Login an admin by using the provided credentials.

Request body: user credentials (username and password).

Responses: 
* `200 OK` (success)
* `401 Unauthorized` (wrong credentials).

### logOut:
URL: `/api/sessions/current`

Method: DELETE

Description: Logout a previously logged admin.

Request body: None

Responses: 
* `200 OK` (success)
* `500 Internal Server Error` (generic error).

### getUserInfo
URL: `/api/sessions/current`

Method: GET

Description: Check if admin il logged and fetch it's parameters.

Request body: None

Responses: 
* `200 OK` (success)
* `401 Unauthorized` (admin not logged in).

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

## Main React Components
### Answers
Component used for displaying an answer for a closed question.</br>
Contains a number which identifies the specific answer in a question, the text of the answers, and a control which can be a CheckBox or a RadioButton.<br>
If answer belong to a question which has min=1 and max=1 number of answers the control is a RadioButton otherwise is a CheckBox.

### ClosedQuestion
Component used for display the survey questions.</br>
Contains a number which identifies the question in the surveys, a text used for the question statement, a list of answers displayed by the Answers component and several other labels used for error visualization.</br>
A question with min<>0 number of answers required, shows a message respresenting the constraint.</br>
A question with max<>1 number of answers allowed, shows a message respresenting the constraint.</br>
The validity, in terms of answers checked by the user, is represented by an icon.<br>
The icon can be an exclamation mark for a invalid user response or a check sign for a correct user response.</br>
Question can be also used for results visualization in Result component, the questions are set into readonly mode.

### OpenQuestion
Component used for display the survey questions.
Used in SurveyForm for allowing user to respond.
Used in Results (in readonly mode) for displaying users answers.<br>
It contains the same components of a Closed Question, except for the answers list which is a textarea.<br>
Open question has no upper constraint for a user response. <br> It only has min threshold of response required (1 for mandatory question, 0 for optional question).

### UserForm
Component used by a user for entering the responses in a specific form.<br>
Shows a list of questions that can be open or closed ended.<br>
Once a user finish the survey completion, the survey can be submitted.<br>
If any question do not satisfied it's validity constraint an modal is displayed and an error alert shows the invalid questions.
If all questions satisfies the constraints the survey is submitted.

### Modals
Different modals used for error or information visualization.<br>
UserModal is also used for entering the username in a userform.

### Home
Home page for the application.<br>
Shows a list of published surveys in a card visualization ready to be answered by a user.

### Dashboard
Home page for the admins.<br>
Shows a list of a specific admin published surveys in a card visualization.<br>
The card shows the survey title and the number of received responses.
The page shows also a button that can redirect the admin to the SurveyEditor component.

### SurveyEditor
Component used by the admins for editing a new survey.<br>
It allows the admin to create open or closed questions and answers, decide their validity contraints in terms of allowed responses.<br>
It also allow an admin to reorder the questions and to delete an unwanted question.

### Results
Page used for displaying the user responses.<br>
Responses are visualized one by one for each user.<br>
Navigation throght the pages is guaranteed by a button which allow the user to go to next response. Backward navigation is achieved by the browser back button.

### Editor Image


## Login credentials (username - password)
* **fancyPineapple** - *watermelon09*
* **atomicYorkshire** - *mongodb1*
* **space05star** - *kevin187*
* **veryCoolMom** - *marisa88*

### Surveys
* **Tipical Demographic Survey**: made by *fancyPineapple* 
* **Job Satisfaction**: mady by *fancyPineapple*
* **Student perception survey**: made by *veryCoolMom*
* **Electric vehicle**: made by *veryCoolMom*
* **Film general audience**: made by *space05star*
* **General Gaming Survey** : made by *atomicYorkshire*

