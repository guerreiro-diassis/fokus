const API_URL = 'http://localhost:4242/tasks'

export async function getTasks() {
    const respose = await fetch(API_URL)
    return respose.json()
}