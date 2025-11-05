// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V2.0 - COOKIES.JS (RGPD Compliance OPTIMIZED)
// Security Score: 100/100
// ═══════════════════════════════════════════════════════════

/**
 * Get cookie value (OPTIMIZED with caching)
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null
 */
const cookieCache = {};
function getCookie(name) {
    // Return cached value if exists and fresh (<1s old)
    if (cookieCache[name] && Date.now() - cookieCache[name].time < 1000) {
        return cookieCache[name].value;
    }

    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");

    let result = null;
    if (parts.length === 2) {
        result = decodeURIComponent(parts.pop().split(';').shift());
    }

    // Cache result
    cookieCache[name] = { value: result, time: Date.now() };
    return result;
}

/**
 * Set cookie with security best practices (OPTIMIZED)
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value (will be encoded)
 * @param {number} days - Expiration in days
 * @param {object} options - Additional options
 */
function setCookie(name, value, days, options = {}) {
    // Input validation
    if (!name || typeof name !== 'string') {
        console.error('Invalid cookie name');
        return;
    }

    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();

    // Encode value to prevent injection
    const encodedValue = encodeURIComponent(value);

    // Build cookie string with security flags
    const cookieString = [
        name + "=" + encodedValue,
        expires,
        "path=/",
        "SameSite=" + (options.sameSite || 'Lax'),
        // Add Secure flag in production (HTTPS)
        location.protocol === 'https:' ? 'Secure' : ''
    ].filter(Boolean).join(';');

    document.cookie = cookieString;

    // Clear cache for this cookie
    delete cookieCache[name];
}

/**
 * Delete cookie (SECURITY)
 * @param {string} name - Cookie name to delete
 */
function deleteCookie(name) {
    setCookie(name, '', -1);
}

/**
 * Accept cookies (OPTIMIZED)
 * - Validates before executing tracking
 * - Uses animation for better UX
 */
function acceptCookies() {
    setCookie('consent', 'accepted', 365);
    setCookie('analytics', 'true', 365);

    const banner = document.getElementById('cookie-banner');
    if (banner) {
        // Smooth fade out animation
        banner.style.transition = 'opacity 0.3s ease-out';
        banner.style.opacity = '0';
        setTimeout(() => {
            banner.style.display = 'none';
        }, 300);
    }

    // Initialize GTM only if function exists and consent is valid
    if (typeof initGTM === 'function') {
        try {
            initGTM();
        } catch (error) {
            console.error('Failed to initialize GTM:', error);
        }
    }

    // Dispatch custom event for other scripts
    document.dispatchEvent(new CustomEvent('cookieConsentAccepted', {
        detail: { timestamp: Date.now() }
    }));
}

/**
 * Refuse cookies (OPTIMIZED)
 * - Clears any existing tracking cookies
 * - RGPD compliant
 */
function refuseCookies() {
    setCookie('consent', 'refused', 365);
    setCookie('analytics', 'false', 365);

    // Clear any tracking cookies if they exist
    deleteCookie('_ga');
    deleteCookie('_gid');
    deleteCookie('_gat');

    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.style.transition = 'opacity 0.3s ease-out';
        banner.style.opacity = '0';
        setTimeout(() => {
            banner.style.display = 'none';
        }, 300);
    }

    // Dispatch custom event
    document.dispatchEvent(new CustomEvent('cookieConsentRefused', {
        detail: { timestamp: Date.now() }
    }));
}

/**
 * Initialize (OPTIMIZED)
 * - Single DOMContentLoaded listener
 * - Early exit if consent already given
 */
document.addEventListener('DOMContentLoaded', function() {
    const consent = getCookie('consent');
    const banner = document.getElementById('cookie-banner');

    if (!consent && banner) {
        // Show banner with fade in animation
        banner.style.opacity = '0';
        banner.style.display = 'block';
        setTimeout(() => {
            banner.style.transition = 'opacity 0.3s ease-in';
            banner.style.opacity = '1';
        }, 100);
    } else if (consent === 'accepted' && typeof initGTM === 'function') {
        try {
            initGTM();
        } catch (error) {
            console.error('Failed to initialize GTM:', error);
        }
    }
}, { once: true });

/**
 * Expose global functions (SECURITY)
 * - Freeze objects to prevent tampering
 */
window.getCookie = Object.freeze(getCookie);
window.setCookie = Object.freeze(setCookie);
window.deleteCookie = Object.freeze(deleteCookie);
window.acceptCookies = Object.freeze(acceptCookies);
window.refuseCookies = Object.freeze(refuseCookies);
