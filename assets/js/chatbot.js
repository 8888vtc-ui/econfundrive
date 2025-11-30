// Widget bot VTC - front-end

const chatbotToggle = document.querySelector(".chatbot-toggle");
const chatbotPanel = document.querySelector(".chatbot-panel");
const chatbotForm = document.querySelector(".chatbot-form");
const chatbotInput = document.querySelector(".chatbot-input");
const chatbotMessages = document.querySelector(".chatbot-messages");

// État de la conversation
const chatState = {
  isOpen: false,
  waitingForName: false,
  waitingForPhone: false,
  waitingForDestination: false,
  firstInteraction: true,
  userInfo: {
    name: '',
    phone: '',
    destination: ''
  },
  chatHistory: []
};

// Gestion du toggle du panneau de chat
if (chatbotToggle && chatbotPanel) {
  chatbotToggle.addEventListener("click", (e) => {
    e.preventDefault();
    chatState.isOpen = !chatState.isOpen;
    
    if (chatState.isOpen) {
      chatbotPanel.classList.add("open");
      chatbotToggle.classList.add("active");
      
      // Ajouter un message d'accueil uniquement à la première ouverture
      if (chatState.firstInteraction) {
        setTimeout(() => {
          appendMessage(
            'bot', 
            'Bonjour ! Comment puis-je vous aider pour votre réservation VTC ?',
            false,
            true
          );
          chatState.firstInteraction = false;
        }, 500);
      }
      
      // Focus sur le champ de saisie
      setTimeout(() => {
        if (chatbotInput) chatbotInput.focus();
      }, 100);
    } else {
      chatbotPanel.classList.remove("open");
      chatbotToggle.classList.remove("active");
    }
  });
  
  // Fermer le chat en cliquant en dehors
  document.addEventListener('click', (e) => {
    if (chatState.isOpen && 
        !chatbotPanel.contains(e.target) && 
        !chatbotToggle.contains(e.target)) {
      chatState.isOpen = false;
      chatbotPanel.classList.remove("open");
      chatbotToggle.classList.remove("active");
    }
  });
}

// Gestion de la soumission du formulaire
if (chatbotForm && chatbotInput) {
  chatbotForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const content = chatbotInput.value.trim();
    
    if (!content) return;
    
    // Ajouter le message de l'utilisateur
    appendMessage('user', content);
    chatbotInput.value = '';
    
    // Traiter la réponse
    processUserInput(content);
  });
}

function appendMessage(role, text, isInfoRequest = false, isFirstMessage = false) {
  if (!chatbotMessages) return;
  
  // Création du conteneur du message
  const div = document.createElement("div");
  div.className = `chat-msg ${role} ${isInfoRequest ? 'info-request' : ''} ${isFirstMessage ? 'first-message' : ''}`;
  
  // Ajout du texte avec support des sauts de ligne
  const textNode = document.createElement('div');
  textNode.innerHTML = text.replace(/\n/g, '<br>');
  div.appendChild(textNode);
  
  // Ajout du message au DOM
  chatbotMessages.appendChild(div);
  
  // Animation d'apparition avec un léger délai pour un effet en cascade
  setTimeout(() => {
    div.classList.add('visible');
    // Défilement vers le bas après l'animation
    setTimeout(() => {
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }, 50);
  }, 10);
  
  // Ajout du message à l'historique
  chatState.chatHistory.push({ role, text, timestamp: new Date() });
  
  // Mise à jour de l'état pour les demandes d'information
  if (isInfoRequest && role === 'bot') {
    chatState.waitingForName = text.includes('nom');
    chatState.waitingForPhone = text.includes('téléphone') || text.includes('télephone');
    chatState.waitingForDestination = text.includes('destination');
  }
  
  // Envoi automatique vers WhatsApp si toutes les infos sont collectées
  if (role === 'user' && chatState.waitingForDestination && chatState.userInfo.destination) {
    // Petit délai avant l'envoi pour une meilleure expérience utilisateur
    setTimeout(sendTravelerInfoToWhatsApp, 1000);
  }
  
  // Retourner la promesse de l'animation
  return new Promise(resolve => {
    setTimeout(resolve, 300); // Durée de l'animation
  });
}

// Fonction pour générer le résumé de la conversation
function generateConversationSummary() {
  let summary = 'Résumé de la conversation avec le chatbot :\n\n';
  chatHistory.forEach(msg => {
    const prefix = msg.role === 'user' ? '👤 Vous : ' : '🤖 David : ';
    summary += `${prefix}${msg.text}\n`;
  });
  return encodeURIComponent(summary);
}

// Fonction pour envoyer les informations du voyageur vers WhatsApp
function sendTravelerInfoToWhatsApp() {
  const phoneNumber = '33616552811'; // Votre numéro de téléphone
  
  // Créer le message avec les informations du voyageur
  const message = encodeURIComponent(
    "📋 NOUVELLE DEMANDE DE RÉSERVATION VTC\n\n" +
    `👤 Nom: ${chatState.userInfo.name}\n` +
    `📞 Téléphone: ${chatState.userInfo.phone}\n` +
    `📍 Destination: ${chatState.userInfo.destination}\n\n` +
    "📝 Détails de la conversation:\n" +
    chatState.chatHistory
      .filter(msg => msg.role === 'user' || msg.role === 'bot')
      .map(msg => `${msg.role === 'user' ? '👤 Client' : '🤖 Bot'}: ${msg.text}`)
      .join('\n')
  );
  
  // Créer un iframe pour l'ouverture en arrière-plan
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  
  // Ouvrir WhatsApp dans l'iframe (ne sera pas visible)
  iframe.src = `https://wa.me/${phoneNumber}?text=${message}`;
  
  // Nettoyer après un court délai
  setTimeout(() => {
    document.body.removeChild(iframe);
  }, 1000);
  
  // Réinitialiser l'état
  chatState.waitingForName = false;
  chatState.waitingForPhone = false;
  chatState.waitingForDestination = false;
  
  // Afficher un message de confirmation
  appendMessage('bot', 'Merci ! Votre demande a été transmise à notre service client. Nous vous recontacterons rapidement sur WhatsApp pour confirmer votre réservation.');
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
