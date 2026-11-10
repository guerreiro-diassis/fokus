const API_URL = 'http://localhost:4242/tasks'

export async function getTasks() {
    try {
        const respose = await fetch(API_URL)
        return respose.json()        
    } catch (error) {
        alert('Ops... algo deu errado!')
        return []
    }

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

export async function uptadeTask(id, data) {
    const respose = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    return respose.json()
    
}

export async function deleteTask(id) {
    return fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
    })
}