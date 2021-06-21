async function getSurveys() {
    const response = await fetch('api/surveys')
    const surveys = await response.json()

    if (response.ok) return surveys
    else throw new Error(JSON.stringify({
        status: response.status,
        error: "Error in get all surveys"
    }))
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

async function publishSurvey(surveyTitle, questions, pubdate) {
    const response = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ title: surveyTitle, questions: questions, pubdate: pubdate })
    })

    if (!response.ok) {
        throw new Error(JSON.stringify({ status: response.status, error: response.important }))
    }
}

const API = { getSurveys, getSurvey, publishSurvey }

export default API