const API_URL = 'http://localhost:4242/tasks'

export async function getTasks() {
    const respose = await fetch(API_URL)
    return respose.json()
}

export async function createTask(description) {
    const respose = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            description: description,
            completed: false
        })
    })

    return respose.json()
    
}