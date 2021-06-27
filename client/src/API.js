async function getSurveys() {
    const response = await fetch('api/surveys')
    const surveys = await response.json()

    if (response.ok) return surveys
    else throw new Error("Error in get all surveys")
}

async function getAdminSurveys() {
    const response = await fetch('api/adminsurveys')
    const surveys = await response.json()

    if (response.ok) return surveys
    else throw new Error("Error in get all surveys")
}

async function getSurvey(id) {
    const response = await fetch('/api/survey/' + id)
    const survey = await response.json()

    if (response.ok) return survey
    else {
        if (response.status === 404)
            throw new Error("The survey you are looking for has not been found.")
        else
            throw new Error("Error in get all surveys")
    }
}

async function getResults(idCompletedSurvey) {
    const response = await fetch('/api/results/' + idCompletedSurvey)
    const survey = await response.json()

    if (response.ok) return survey
    else {
        if (response.status === 401)
            throw new Error("You are not authorized to see the results you requested.")
        else if (response.status === 404)
            throw new Error("The answers you are looking for were not found.")
        else
            throw new Error("Error in get all responses")
    }
}

async function publishSurvey(surveyTitle, questions) {
    const response = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ title: surveyTitle, questions: questions })
    })

    if (!response.ok) {
        throw new Error("An error occured on survey publication.")
    }
}

async function submitUserAnswers(idSurvey, username, userAnswers) {
    const response = await fetch('/api/answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ idSurvey: idSurvey, username: username, userAnswers: userAnswers })
    })

    alert(JSON.stringify({ idSurvey: idSurvey, username: username, userAnswers: userAnswers }))

    if (!response.ok) {
        throw new Error("Something went wrong in answers submission.")
    }
}

async function logIn(credentials) {
    let response = await fetch('/api/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: credentials.username,
            password: credentials.password
        }),
    })
    if (response.ok) {
        const user = await response.json();
        return user;
    } else {
        try {
            const errDetail = await response.json();
            throw errDetail.message;
        } catch (err) {
            throw err;
        }
    }
}

async function getUserInfo() {
    const response = await fetch('/api/sessions/current');
    const userInfo = await response.json();

    if (response.ok) {
        return userInfo
    } else {
        throw userInfo
    }
}

async function logOut() {
    await fetch('/api/sessions/current', { method: 'DELETE' });
}


const API = { getSurveys, getAdminSurveys, getSurvey, getResults, publishSurvey, submitUserAnswers, logIn, getUserInfo, logOut }

export default API