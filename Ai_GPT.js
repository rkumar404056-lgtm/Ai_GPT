let prompt = document.querySelector("#prompt")
let chatContainer = document.querySelector(".chat-container")
let imagebtn = document.querySelector("#button-image")
let imageinput = document.querySelector("#button-image input")


//  const express = require("expree");
//  const cors = require("cors");
//  const fetch = require("node-fetch");

//  const app = express();

// app.use(cors());
// app.use(express.json());


const Api_Url = "http://localhost:3000/api/chat"

let user = {
    user: null,
}

async function generateResponse(aichatbox) {
    let RequestOption = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [
                {parts: [{ text: user.data }

                ]
            }]
        })
    }

    try {
        let response = await fetch(Api_Url, RequestOption)
        let data = await response.json()
        console.log(data)

        let aiReply = data.candidates[0].content.parts[0].text

        aichatbox.querySelector(".ai-chat-area").innerHTML = aiReply

    } catch (error) {
        console.log(error)
        aichatbox.querySelector(".ai-chat-area").innerHTML = "Error getting response."
    }

    finally {
        chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})
    }
}

function createChatbox(html, classes) {
    let div = document.createElement("div")
    div.innerHTML = html
    div.classList.add(classes)
    return div
}

function handlechatResponse(message) {
    user.data = message
    let html = `<img src="user-ai.png" alt="" id="user-image" width="60px">
      <div class="user-chat-area">${user.data}</div>`
    prompt.value = ""
    let userChatbox = createChatbox(html, "user-chat-box")
    chatContainer.appendChild(userChatbox)

    chatContainer.scrollTo({top:chatContainer.scrollHeight,behavior:"smooth"})

    setTimeout(() => {
        let html = `<img src="ai-logo2.png" alt="" id="ai-image" width="60px">
      <div class="ai-chat-area">
        <img src="loding.gif" alt="" class="load" width="80px">
      </div>`
        let aiChatbox = createChatbox(html, "ai-chat-box")
        chatContainer.appendChild(aiChatbox)
        generateResponse(aiChatbox)
    }, 600)
}

prompt.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        handlechatResponse(prompt.value)
    }
})

imageinput.addEventListener("change",()=>{
    const file=imageinput.files[0]
    if(!file) return
    let reader = new FileReader()
    reader.onload=(e)=>{
        let base64string=e.target.result.split(",")[1]
        user.file={
            mime_type:file.type,
            data: base64string
        }
    }
    reader.readAsDataURL(file)
})

imagebtn.addEventListener("click",()=>{
    imagebtn.querySelector("input").click()
})