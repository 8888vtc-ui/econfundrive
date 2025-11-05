// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V2.0 - COOKIES.JS (RGPD Compliance)
// OPTIMIZED: XSS protection, Secure flag, cookie caching
// ═══════════════════════════════════════════════════════════

// OPTIMIZATION: Cookie cache (1s TTL to avoid repeated document.cookie parsing)
const cookieCache = {};
const COOKIE_CACHE_TTL = 1000; // 1 second

function getCookie(name) {
    // Check cache first
    if (cookieCache[name] && Date.now() - cookieCache[name].time < COOKIE_CACHE_TTL) {
        return cookieCache[name].value;
    }

    // Parse from document.cookie
    const value = \`; \${document.cookie}\`;
    const parts = value.split(\`; \${name}=\`);
    let result = null;

    if (parts.length === 2) {
        result = decodeURIComponent(parts.pop().split(';').shift());
    }

    // Store in cache
    cookieCache[name] = {
        value: result,
        time: Date.now()
    };

    return result;
}

function setCookie(name, value, days, options = {}) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

    // OPTIMIZATION: URL encode value for XSS protection
    const encodedValue = encodeURIComponent(value);

    // Build cookie string with security flags
    const cookieString = [
        \`\${name}=\${encodedValue}\`,
        \`expires=\${date.toUTCString()}\`,
        'path=/',
        \`SameSite=\${options.sameSite || 'Lax'}\`,
        location.protocol === 'https:' ? 'Secure' : '' // Secure flag on HTTPS only
    ].filter(Boolean).join(';');

    document.cookie = cookieString;

    // Invalidate cache
    delete cookieCache[name];
}

function acceptCookies() {
    setCookie('consent', 'accepted', 365);
    setCookie('analytics', 'true', 365);
    
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.style.display = 'none';
    }
    
    if (typeof initGTM === 'function') {
        initGTM();
    }
}

function refuseCookies() {
    setCookie('consent', 'refused', 365);
    setCookie('analytics', 'false', 365);
    
    const banner = document.getElementById('cookie-banner');
    if (banner) {
        banner.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const consent = getCookie('consent');
    const banner = document.getElementById('cookie-banner');
    
    if (!consent && banner) {
        banner.style.display = 'block';
    } else if (consent === 'accepted' && typeof initGTM === 'function') {
        initGTM();
    }
});

// Global exposure
window.getCookie = getCookie;
window.acceptCookies = acceptCookies;
window.refuseCookies = refuseCookies;
