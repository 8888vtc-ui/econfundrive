// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V2.0 - TRACKING.JS (Google Tag Manager)
// OPTIMIZED: Event queuing for reliability, prevents data loss
// ═══════════════════════════════════════════════════════════

// OPTIMIZATION: Event Queue System
const trackingState = {
    initialized: false,
    queuedEvents: []
};

/**
 * Flush queued events to dataLayer
 * Called after GTM is initialized
 */
function flushQueuedEvents() {
    if (window.dataLayer && trackingState.queuedEvents.length > 0) {
        console.log(\`📤 Flushing \${trackingState.queuedEvents.length} queued events\`);
        trackingState.queuedEvents.forEach(event => {
            window.dataLayer.push(event);
        });
        trackingState.queuedEvents = [];
    }
}

/**
 * Initialize Google Tag Manager
 * Only if user accepted analytics cookies
 */
function initGTM() {
    if (getCookie('analytics') === 'true' && !trackingState.initialized) {
        (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
            const f=d.getElementsByTagName(s)[0];
            const j=d.createElement(s);
            const dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;

            // OPTIMIZATION: Flush queued events after GTM loads
            j.onload = function() {
                trackingState.initialized = true;
                flushQueuedEvents();
                console.log('✅ Google Tag Manager initialized + events flushed');
            };

            f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-NMMBXS4T');
    }
}

/**
 * Track WhatsApp Click
 * @param {string} location - Where CTA was clicked (hero, mid, end)
 * OPTIMIZED: Queues events if GTM not yet loaded
 */
function trackWhatsAppClick(location) {
    const event = {
        'event': 'whatsapp_click',
        'location': location,
        'page': window.location.pathname
    };

    if (window.dataLayer && trackingState.initialized) {
        window.dataLayer.push(event);
        console.log(\`📊 WhatsApp click tracked: \${location}\`);
    } else {
        // Queue for later if GTM not ready
        trackingState.queuedEvents.push(event);
        console.log(\`⏳ WhatsApp click queued: \${location}\`);
    }
}

// Auto-init if consent already given
document.addEventListener('DOMContentLoaded', function() {
    if (getCookie('analytics') === 'true') {
        initGTM();
    }
});

// Global exposure
window.initGTM = initGTM;
window.trackWhatsAppClick = trackWhatsAppClick;
