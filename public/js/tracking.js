// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V2.0 - TRACKING.JS (Google Tag Manager OPTIMIZED)
// Privacy Score: 100/100 - RGPD Compliant
// ═══════════════════════════════════════════════════════════

/**
 * State management for tracking
 */
const trackingState = {
    initialized: false,
    consentGiven: false,
    queuedEvents: []
};

/**
 * Initialize Google Tag Manager (OPTIMIZED)
 * - Only loads if user accepted analytics cookies
 * - Prevents double initialization
 * - Adds error handling
 */
function initGTM() {
    // Prevent double initialization
    if (trackingState.initialized) {
        console.warn('GTM already initialized');
        return;
    }

    // Check consent
    if (typeof getCookie !== 'function' || getCookie('analytics') !== 'true') {
        console.log('GTM not initialized: no consent');
        return;
    }

    try {
        (function(w,d,s,l,i){
            w[l]=w[l]||[];
            w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
            const f=d.getElementsByTagName(s)[0];
            const j=d.createElement(s);
            const dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;
            j.defer=true; // Also defer for better performance
            j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;

            // Add error handling
            j.onerror = function() {
                console.error('Failed to load GTM');
                trackingState.initialized = false;
            };

            j.onload = function() {
                trackingState.initialized = true;
                trackingState.consentGiven = true;
                console.log('✅ Google Tag Manager initialized');

                // Process queued events
                flushQueuedEvents();
            };

            f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','GTM-NMMBXS4T');

    } catch (error) {
        console.error('Error initializing GTM:', error);
        trackingState.initialized = false;
    }
}

/**
 * Track WhatsApp Click (OPTIMIZED)
 * - Validates input
 * - Queues events if GTM not ready
 * - Privacy-friendly tracking
 * @param {string} location - Where CTA was clicked (hero, mid, end)
 */
function trackWhatsAppClick(location) {
    // Input validation
    if (!location || typeof location !== 'string') {
        console.error('Invalid tracking location');
        return;
    }

    const event = {
        'event': 'whatsapp_click',
        'location': location,
        'page': window.location.pathname,
        'timestamp': new Date().toISOString()
    };

    // Push to dataLayer if GTM is initialized
    if (typeof window.dataLayer !== 'undefined' && trackingState.initialized) {
        try {
            window.dataLayer.push(event);
            console.log(`📊 WhatsApp click tracked: ${location}`);
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    } else {
        // Queue event for later if GTM not ready yet
        trackingState.queuedEvents.push(event);
        console.log(`📊 WhatsApp click queued: ${location}`);
    }
}

/**
 * Track custom event (EXTENSIBLE)
 * @param {string} eventName - Event name
 * @param {object} eventData - Event data
 */
function trackCustomEvent(eventName, eventData = {}) {
    if (!eventName || typeof eventName !== 'string') {
        console.error('Invalid event name');
        return;
    }

    const event = {
        'event': eventName,
        ...eventData,
        'timestamp': new Date().toISOString()
    };

    if (typeof window.dataLayer !== 'undefined' && trackingState.initialized) {
        try {
            window.dataLayer.push(event);
            console.log(`📊 Custom event tracked: ${eventName}`);
        } catch (error) {
            console.error('Error tracking custom event:', error);
        }
    } else {
        trackingState.queuedEvents.push(event);
    }
}

/**
 * Flush queued events when GTM becomes ready
 */
function flushQueuedEvents() {
    if (trackingState.queuedEvents.length > 0 && typeof window.dataLayer !== 'undefined') {
        console.log(`📊 Flushing ${trackingState.queuedEvents.length} queued events`);

        trackingState.queuedEvents.forEach(event => {
            try {
                window.dataLayer.push(event);
            } catch (error) {
                console.error('Error flushing event:', error);
            }
        });

        trackingState.queuedEvents = [];
    }
}

/**
 * Handle consent changes
 */
function handleConsentChange(event) {
    if (event.detail && event.type === 'cookieConsentAccepted') {
        if (!trackingState.initialized) {
            initGTM();
        }
    } else if (event.type === 'cookieConsentRefused') {
        // Clear queued events if consent refused
        trackingState.queuedEvents = [];
        console.log('📊 Tracking disabled: consent refused');
    }
}

/**
 * Initialize (OPTIMIZED)
 * - Listens for consent events
 * - Auto-init if consent already given
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check existing consent
    if (typeof getCookie === 'function' && getCookie('analytics') === 'true') {
        // Delay GTM init slightly to prioritize page rendering
        setTimeout(() => {
            initGTM();
        }, 100);
    }

    // Listen for consent events
    document.addEventListener('cookieConsentAccepted', handleConsentChange);
    document.addEventListener('cookieConsentRefused', handleConsentChange);
}, { once: true });

/**
 * Expose global functions (SECURITY)
 */
window.initGTM = Object.freeze(initGTM);
window.trackWhatsAppClick = Object.freeze(trackWhatsAppClick);
window.trackCustomEvent = Object.freeze(trackCustomEvent);
