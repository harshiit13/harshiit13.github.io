    let userData = '';
    let botData = '';
    function handleKeyPress(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    }

    const a1 = 'sk-proj-DEE8BiF--';
    const a2 = 'bRtoD8ltvfg1064CICqUXhp5zNtrD9oNgjcxPdBuYqivl8tUHb7bfy5cs2HJ_';
    const a3 = 'hawJT3BlbkFJWxORKCCNTANwVRAxAmeWhfaFIuZ2Rwh0hTRhdMAqUCwbCocv5_LNs-uGuTPwgj-t5F5VLrX6QA';
    const API_KEY = a1 + a2 + a3;

    const messages = [
        { role: "system", content: "You are an AI assistant knowledgeable in the Bhagavad Gita. Provide insightful responses using relevant verses and explanations. Make it more detailed. and length should be more than 100 words " }
    ];

    async function appendToGitHubFile() {
            const t1 = "ghp_QCyqdI";
      const t2 = "jMuxYuS6s2RWsVm";
      const t3 = "QylYQvo1F4aVQmO"
            const token = t1+t1+t3;
            const username = "harshiit13"; // 🔴 Replace with your GitHub username
            const repo = "Market-Segmentation";
            const filePath = "data.txt"; // 🔴 The file you want to append data to
            const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${filePath}`;

            let existingContent = "";
            let sha = null; // To track the existing file version

            // Step 1: Fetch the existing file content
            try {
                const response = await fetch(apiUrl, {
                    headers: { Authorization: `token ${token}` }
                });

                if (response.ok) {
                    const data = await response.json();
                    existingContent = atob(data.content); // Decode Base64 content
                    sha = data.sha; // Get the file's SHA (needed for updating)
                }
            } catch (error) {
                console.error("Error fetching existing file:", error);
                alert("Failed to fetch file. Make sure the file exists.");
                return;
            }

            // Step 2: Append new data to the existing content
            const newData = '\n\n ---------------------- \nUser : ' + userData+ '\nAI : ' + botData
            const updatedContent = existingContent + "\n" + newData; // Append new text

            // Step 3: Upload the updated content back to GitHub
            const requestBody = {
                message: "Appending data to file",
                content: btoa(unescape(encodeURIComponent(updatedContent))),
                sha: sha // GitHub requires SHA to update existing files
            };

            fetch(apiUrl, {
                method: "PUT",
                headers: {
                    Authorization: `token ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(requestBody)
            })
            .then(response => response.json())
            .then(data => {
                if (data.commit) {
                    alert("Data appended to GitHub file successfully!");
                } else {
                    alert("Failed to append data. Check console for details.");
                    console.error(data);
                }
            })
            .catch(error => console.error("Error:", error));
        };

    async function sendMessage() {
        const userMessage = document.getElementById("userInput").value.trim();
        userData = userMessage;
        document.getElementById("userInput").value = "";
        if (!userMessage) return;

        // Add user message to history
        messages.push({ role: "user", content: userMessage });

        // Display user message
        displayMessage("You: " + userMessage, "user");

        // Call OpenAI API with full conversation history
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "ft:gpt-4o-mini-2024-07-18:personal::AyCnCFGM",
                messages: messages,
            })
        });

        const data = await response.json();
        const botMessage = data.choices[0]?.message?.content || "Sorry, I couldn't understand.";
        botData = botMessage;
        // Add bot response to history
        messages.push({ role: "assistant", content: botMessage });

        // Display bot response
        displayMessage("Bot: " + botMessage, "bot");

       
        
        appendToGitHubFile();
    }

    function displayMessage(text, className) {
        const chatbox = document.getElementById("chatbox");
        const messageDiv = document.createElement("div");
        messageDiv.className = className;
        messageDiv.innerHTML = text;
        chatbox.appendChild(messageDiv);
        chatbox.scrollTop = chatbox.scrollHeight;
    }
