// Netlify Function pour traiter les demandes de réservation
exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Seulement POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    
    // Validation des champs requis
    const required = ['depart', 'arrivee', 'date', 'heure', 'passagers', 'telephone', 'email'];
    for (const field of required) {
      if (!data[field] || data[field].trim() === '') {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: `Champ requis manquant: ${field}` })
        };
      }
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Email invalide' })
      };
    }

    // Validation captcha simple
    if (data.captcha !== '5') {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Captcha incorrect' })
      };
    }

    // Validation date (ne doit pas être dans le passé)
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'La date ne peut pas être dans le passé' })
      };
    }

    // Préparer le contenu de l'email
    const emailContent = `
NOUVELLE DEMANDE DE RÉSERVATION VTC

═══════════════════════════════════════

TRAJET:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Départ: ${data.depart}
Arrivée: ${data.arrivee}
Date: ${data.date}
Heure: ${data.heure}

DÉTAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Passagers: ${data.passagers}
Bagages: ${data.bagages || 'Non spécifié'}

Options: ${data.options || 'Aucune'}

CONTACT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Téléphone: ${data.telephone}
Email: ${data.email}

MESSAGE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.message || 'Aucun message'}

═══════════════════════════════════════
Demande reçue le ${new Date().toLocaleString('fr-FR', { 
  timeZone: 'Europe/Paris',
  dateStyle: 'full',
  timeStyle: 'long'
})}
`;

    // Email de confirmation au client
    const confirmationEmail = `
Bonjour,

Nous avons bien reçu votre demande de réservation VTC.

DÉTAILS DE VOTRE TRAJET:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Départ: ${data.depart}
Arrivée: ${data.arrivee}
Date: ${data.date} à ${data.heure}
Passagers: ${data.passagers}
${data.bagages ? `Bagages: ${data.bagages}` : ''}

Nous vous répondrons dans les plus brefs délais avec un devis et une confirmation de disponibilité.

Pour toute question urgente, contactez-nous:
📞 06 16 55 28 11
💬 WhatsApp (bouton en bas à droite du site)

Cordialement,
David - ECOFUNDRIVE
Chauffeur privé VTC Côte d'Azur
`;

    // Envoi email via Resend (si configuré) ou fallback
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const TO_EMAIL = process.env.BOOKING_EMAIL || '8888VTC@gmail.com';

    if (RESEND_API_KEY) {
      try {
        // Email au propriétaire
        const ownerResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'ECOFUNDRIVE <noreply@ecofundrive.com>',
            to: TO_EMAIL,
            reply_to: data.email,
            subject: `🚗 Nouvelle réservation VTC - ${data.depart} → ${data.arrivee}`,
            text: emailContent
          })
        });

        if (!ownerResponse.ok) {
          const errorText = await ownerResponse.text();
          console.error('Erreur envoi email propriétaire:', errorText);
        }

        // Email de confirmation au client
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'ECOFUNDRIVE <noreply@ecofundrive.com>',
            to: data.email,
            subject: '✅ Confirmation de votre demande de réservation VTC',
            text: confirmationEmail
          })
        });
      } catch (emailError) {
        console.error('Erreur envoi email:', emailError);
        // On continue même si l'email échoue
      }
    }

    // Log pour debugging (visible dans Netlify Functions logs)
    console.log('Nouvelle réservation reçue:', {
      depart: data.depart,
      arrivee: data.arrivee,
      date: data.date,
      email: data.email
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true,
        message: 'Votre demande a été envoyée avec succès. Vous recevrez une confirmation par email.'
      })
    };

  } catch (error) {
    console.error('Erreur traitement réservation:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erreur serveur. Veuillez réessayer ou nous contacter directement au 06 16 55 28 11.' 
      })
    };
  }
};

