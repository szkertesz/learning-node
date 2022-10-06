const addMessages = message => {
    const msgContainer = document.getElementById('messages')
    msgContainer.insertAdjacentHTML("beforeend", `
                <h3>${message.name}</h3>
                <p>${message.message}</p>
            `)
}
const nameInput = document.getElementById('name-input')
const messageInput = document.getElementById('message-input')
const sendButton = document.querySelector('[data-send]')
sendButton.addEventListener('click', () => {
    postMessage('http://localhost:3000/messages', { name: nameInput.value, message: messageInput.value })
})

const getMessages = async () => {
    try {
        const response = await fetch('http://localhost:3000/messages')
        const data = response.json()
        return data
    } catch (error) {
        console.log('Fetch error: ', error)
    }
}
const postMessage = async (url, message) => {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message)
        })
        console.log(response)
    } catch (error) {
        console.log('Fetch error: ', error)
    }
}

(async () => {
    const messages = await getMessages()
    messages.forEach(message => {
        addMessages(message)
    });
})()