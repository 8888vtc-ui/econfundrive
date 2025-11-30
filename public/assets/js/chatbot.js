// Widget bot VTC - version simplifiée et optimisée
const chatbotToggle = document.querySelector(".chatbot-toggle");
const chatbotPanel = document.querySelector(".chatbot-panel");
const chatbotForm = document.querySelector(".chatbot-form");
const chatbotInput = document.querySelector(".chatbot-input");
const chatbotMessages = document.querySelector(".chatbot-messages");

// État de la conversation
const chatState = {
  isOpen: false,
  firstInteraction: true,
  isTyping: false,
  chatHistory: []
};

// Gestion du toggle du panneau de chat simplifiée
if (chatbotToggle && chatbotPanel) {
  chatbotToggle.addEventListener("click", (e) => {
    e.preventDefault();
    toggleChat();
  });
  
  // Fermer le chat en cliquant en dehors
  document.addEventListener('click', (e) => {
    if (chatState.isOpen && 
        !chatbotPanel.contains(e.target) && 
        !chatbotToggle.contains(e.target)) {
      toggleChat(false);
    }
  });
}

function toggleChat(forceState = null) {
  chatState.isOpen = forceState !== null ? forceState : !chatState.isOpen;
  
  if (chatState.isOpen) {
    chatbotPanel.classList.add("open");
    chatbotToggle.classList.add("active");
    
    // Message d'accueil uniquement à la première ouverture
    if (chatState.firstInteraction) {
      setTimeout(() => {
        appendMessage(
          'bot', 
          'Bonjour ! Je suis là pour vous aider. Comment puis-je vous assister aujourd\'hui ?',
          false,
          true
        );
        chatState.firstInteraction = false;
      }, 300);
    }
    
    // Focus sur le champ de saisie
    setTimeout(() => {
      if (chatbotInput) chatbotInput.focus();
    }, 100);
  } else {
    chatbotPanel.classList.remove("open");
    chatbotToggle.classList.remove("active");
  }
}

// Gestion de la soumission du formulaire simplifiée
if (chatbotForm && chatbotInput) {
  chatbotForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const content = chatbotInput.value.trim();
    
    if (!content || chatState.isTyping) return;
    
    // Ajouter le message de l'utilisateur
    appendMessage('user', content);
    chatbotInput.value = '';
    
    // Simuler un délai de frappe
    chatState.isTyping = true;
    
    // Réponse automatique basique
    setTimeout(() => {
      const response = generateResponse(content);
      appendMessage('bot', response);
      chatState.isTyping = false;
    }, 800);
  });
}

function generateResponse(userInput) {
  const input = userInput.toLowerCase();
  
  // Réponses contextuelles
  if (input.includes('bonjour') || input.includes('salut') || input.includes('coucou')) {
    return 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?';
  }
  
  if (input.includes('prix') || input.includes('tarif') || input.includes('combien')) {
    return 'Nos tarifs varient selon la distance et le type de véhicule. Pouvez-vous me préciser votre trajet ?';
  }
  
  if (input.includes('disponibilité') || input.includes('libre') || input.includes('heure')) {
    return 'Nous sommes disponibles 24/7 sur réservation. Quelle est la date et l\'heure qui vous conviennent ?';
  }
  
  if (input.includes('merci') || input.includes('au revoir') || input.includes('bye')) {
    return 'Je vous en prie ! N\'hésitez pas si vous avez d\'autres questions. Bonne journée !';
  }
  
  // Réponse par défaut
  return 'Je comprends que vous souhaitez des informations. Pour vous aider au mieux, vous pouvez me poser des questions sur nos services, nos tarifs ou nos disponibilités.';
}

function appendMessage(role, text, isInfoRequest = false, isFirstMessage = false) {
  if (!chatbotMessages) return Promise.resolve();
  
  // Création du conteneur du message
  const div = document.createElement("div");
  div.className = `chat-msg ${role} ${isInfoRequest ? 'info-request' : ''} ${isFirstMessage ? 'first-message' : ''}`;
  
  // Ajout du texte avec support des sauts de ligne
  const textNode = document.createElement('div');
  textNode.className = 'chat-msg-content';
  textNode.innerHTML = text.replace(/\n/g, '<br>');
  div.appendChild(textNode);
  
  // Ajout du message au DOM
  chatbotMessages.appendChild(div);
  div.scrollIntoView({ behavior: 'smooth', block: 'end' });
  
  // Animation de frappe pour les messages du bot
  if (role === 'bot') {
    div.classList.add('typing');
    setTimeout(() => div.classList.remove('typing'), 100);
  }
  
  // Ajout à l'historique
  chatState.chatHistory.push({ role, text, timestamp: new Date() });
  
  return new Promise(resolve => setTimeout(resolve, 300));
}

// Fonction pour générer le résumé de la conversation
function generateConversationSummary() {
  let summary = 'Résumé de la conversation avec le chatbot :\n\n';
  chatState.chatHistory.forEach(msg => {
    const prefix = msg.role === 'user' ? '👤 Vous : ' : '🤖 David : ';
    summary += `${prefix}${msg.text}\n`;
  });
  return encodeURIComponent(summary);
}

// Fonction pour envoyer les informations vers WhatsApp
function sendTravelerInfoToWhatsApp() {
  const phoneNumber = '33616552811';
  const message = encodeURIComponent(
    "📋 NOUVELLE DEMANDE DE RÉSERVATION VTC\n\n" +
    chatState.chatHistory
      .filter(msg => msg.role === 'user')
      .map(msg => `👤 Client: ${msg.text}`)
      .join('\n')
  );
  
  // Ouvrir WhatsApp dans un nouvel onglet
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  
  // Message de confirmation
  appendMessage('bot', 'J\'ai transmis votre demande. Notre équipe vous contactera rapidement sur WhatsApp pour finaliser la réservation.');
}

// Fonction pour traiter la réponse de l'utilisateur
async function processUserInput(content) {
  // Nettoyer le contenu
  content = content.trim();
  if (!content) return;
  
  // Enregistrer la réponse de l'utilisateur
  if (chatState.waitingForName) {
    chatState.userInfo.name = content;
    chatState.waitingForName = false;
    await appendMessage('bot', 'Merci ! Quel est votre numéro de téléphone ?', true);
  } 
  else if (chatState.waitingForPhone) {
    // Nettoyer le numéro de téléphone
    const phone = content.replace(/[^0-9+]/g, '');
    chatState.userInfo.phone = phone;
    chatState.waitingForPhone = false;
    await appendMessage('bot', 'Parfait ! Quelle est votre destination ?', true);
  } 
  else if (chatState.waitingForDestination) {
    chatState.userInfo.destination = content;
    chatState.waitingForDestination = false;
    // Les informations seront envoyées automatiquement par appendMessage
  } 
  else if (/bonjour|salut|bonsoir/i.test(content)) {
    // Démarrer la collecte des informations de manière plus naturelle
    await appendMessage('bot', 'Bonjour ! Je suis David, votre assistant VTC. Pour vous aider au mieux, j\'aurais besoin de quelques informations.');
    
    // Poser la première question après un court délai
    setTimeout(async () => {
      await appendMessage('bot', 'Pour commencer, quel est votre nom complet ?', true);
      chatState.waitingForName = true;
    }, 500);
  }
  else if (/prix|tarif|combien coûte|devis/i.test(content)) {
    await appendMessage('bot', 'Nos tarifs varient en fonction de la distance et du type de véhicule. Pour un devis précis, pourriez-vous me préciser :\n\n1. Votre lieu de prise en charge\n2. Votre destination\n3. La date et l\'heure du trajet\n\nJe pourrai ainsi vous fournir une estimation précise.');
  }
  else if (/disponib|libre|réserver|réserver/i.test(content)) {
    await appendMessage('bot', 'Pour vérifier ma disponibilité, j\'aurais besoin de quelques informations :\n\n1. Votre nom complet\n2. Votre numéro de téléphone\n3. Les détails de votre trajet (lieu de prise en charge, destination, date et heure)');
  }
  else {
    // Réponse par défaut plus élégante
    const defaultResponses = [
      'Je suis là pour vous aider avec votre réservation VTC. Dites-moi simplement où et quand vous souhaitez vous rendre !',
      'Pour vous aider au mieux, vous pouvez me dire votre destination et la date de votre trajet.',
      'Je peux vous aider à réserver un véhicule avec chauffeur. Avez-vous une destination précise en tête ?',
      'Pour commencer une réservation, dites-moi simplement votre lieu de départ et votre destination.'
    ];
    
    const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    await appendMessage('bot', randomResponse);
  }
}

if (chatbotForm && chatbotInput) {
  chatbotForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const content = chatbotInput.value.trim();
    if (!content) return;
    
    // Afficher le message de l'utilisateur
    appendMessage("user", content);
    chatbotInput.value = "";
    
    // Traiter la réponse
    processUserInput(content);

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
