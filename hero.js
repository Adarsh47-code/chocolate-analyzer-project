const mainButton = document.getElementById("main-button");
mainButton.addEventListener('click', function () {
    document.getElementById("LoadingMessage").innerHTML = "Analyzing your chocolate...";

    mainButton.style.display = "none";
    startAnalysis();
});

function fetchChocolateDetails(name) {
    fetch("chocolates.json")
        .then(Response => Response.json())
        .then(data => {
            if (data[name]) {
                const info = data[name]
                document.getElementById("LoadingMessage").innerHTML = `
    ${name}<br>
    <strong>Brand:</strong> ${info.brand}<br>
    <strong>Cocoa %:</strong> ${info.cocoa_percentage}<br>
    <strong>Flavour:</strong> ${info.flavor}<br>
    <strong>Country of Origin:</strong> ${info.country_of_origin}<br>
    `;
            }
            else {
                document.getElementById("LoadingMessage").innerHTML = "Chocolate not found, try another one!";
            }
        });

    const redBox = document.getElementById("roastBox");
    redBox.innerHTML = "Thinking a burn 🔥...";

    setTimeout(async () => {
        const roast = await getAIRoast(name)  //calling groq ai to roast the chocolate
        redBox.innerHTML = `<p id="finalRoast">${roast}</p>
        <button onclick="copyRoast()" style="background:none; border:none; cursor:pointer; font-size:1.2rem">📋</button>
        `;

        mainButton.style.display = "block";
    }, 3000);
};

function copyRoast() {
    const text = document.getElementById("finalRoast").innerText;
    navigator.clipboard.writeText(text);
    alert("Roast Copied! Go destroyes someone's feelings.");
}

function startAnalysis() {
    const name = document.getElementById("chocolate-name").value.toLowerCase().trim();
    setTimeout(() => {
        fetchChocolateDetails(name)
    }, 3000);
};

async function getAIRoast(name) {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer YOUR_GROQ-API_KEY_HERE`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",   // this is kinda their fast model and also free (for brokes)
            temperature: 0.8,     
            messages: [
                { role: "system", content: "You are a ruthless, world-class chocolate hater. Your goal is to absolutely destroy the user's choice of chocolate with a brutal 1-sentence roast. Use heavy sarcasm, call it out for being 'mid' or 'trash', and don't be afraid to be a little disrespectful. Use emojis to mock them and don't use wax example" },
                { role: "user", content: `Roast this chocolate: ${name}` }
            ]
        })
    })
    const data = await response.json();
    return data.choices[0].message.content;
}
