// ═══════════════════════════════════════════════════════════
// ECOFUNDRIVE V2.0 - TRUSTINDEX.JS (Reviews Widget)
// ═══════════════════════════════════════════════════════════

/**
 * Lazy Load Trustindex Widget
 * Loads after 1 second to improve initial page load
 */
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        const script = document.createElement('script');
        script.src = 'https://cdn.trustindex.io/loader.js?6e6475e260715241c236fb004f3';
        script.async = true;
        script.defer = true;
        
        script.onload = function() {
            console.log('✅ Trustindex widget loaded');
        };
        
        script.onerror = function() {
            console.warn('⚠️ Trustindex widget failed to load');
        };
        
        document.body.appendChild(script);
    }, 1000); // Wait 1 second before loading
});
