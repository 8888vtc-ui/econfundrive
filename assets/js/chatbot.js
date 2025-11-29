// Widget bot DeepSeek - front-end

const chatbotToggle = document.querySelector(".chatbot-toggle");
const chatbotPanel = document.querySelector(".chatbot-panel");
const chatbotForm = document.querySelector(".chatbot-form");
const chatbotInput = document.querySelector(".chatbot-input");
const chatbotMessages = document.querySelector(".chatbot-messages");

if (chatbotToggle && chatbotPanel) {
  chatbotToggle.addEventListener("click", () => {
    chatbotPanel.classList.toggle("open");
  });
}

function appendMessage(role, text) {
  if (!chatbotMessages) return;
  const div = document.createElement("div");
  div.className = `chat-msg ${role}`;
  div.textContent = text;
  chatbotMessages.appendChild(div);
  chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

if (chatbotForm && chatbotInput) {
  chatbotForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const content = chatbotInput.value.trim();
    if (!content) return;
    appendMessage("user", content);
    chatbotInput.value = "";

    appendMessage("bot", "Je réfléchis à la meilleure option VTC pour vous…");

    try {
      const response = await fetch("/.netlify/functions/deepseek-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });

      if (!response.ok) {
        throw new Error("Erreur réseau");
      }
      const data = await response.json();
      const answer = data.answer || "Je suis désolé, je n’ai pas pu générer de réponse pour le moment.";
      // Remplacer le placeholder précédent
      const loadingNodes = chatbotMessages.querySelectorAll(".chat-msg.bot");
      const lastLoading = loadingNodes[loadingNodes.length - 1];
      if (lastLoading && lastLoading.textContent.startsWith("Je réfléchis")) {
        lastLoading.textContent = answer;
      } else {
        appendMessage("bot", answer);
      }
    } catch (error) {
      appendMessage("bot", "Une erreur s’est produite. Merci de réessayer dans quelques instants.");
      console.error(error);
    }
  });
}
