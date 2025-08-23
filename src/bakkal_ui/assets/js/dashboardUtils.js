/**
 * Utility Helper Modülü
 * Dashboard için yardımcı fonksiyonlar ve konfigürasyonlar
 */

/**
 * Dashboard Konfigürasyon Sınıfı
 */
class DashboardConfig {
    constructor() {
        // Environment detection
        this.isDevelopment = window.location.hostname === 'localhost' || 
                           window.location.hostname === '127.0.0.1' ||
                           window.location.protocol === 'file:'; // file:// protokolü için eklendi
        
        // API Configuration
        this.API_BASE_URL = this.isDevelopment ? 'http://localhost:5278/api' : 'http://ilgazmountainbakkal.com.tr/api';
        
        // Timing Configuration
        this.REFRESH_INTERVAL_MS = 300000; // 5 minutes
        this.REQUEST_TIMEOUT_MS = 10000; // 10 seconds
        
        // UI Configuration
        this.DEFAULT_AVATAR_PATH = '../assets/images/profile/user-1.jpg';
        this.ITEMS_PER_PAGE = 10;

        // Debug environment detection
        this.log(`Environment: ${this.isDevelopment ? 'Development' : 'Production'}`);
        this.log(`API Base URL: ${this.API_BASE_URL}`);
        this.log(`Current hostname: ${window.location.hostname}`);
        this.log(`Current protocol: ${window.location.protocol}`);
    }

    /**
     * Development ortamında console log'u enable eder
     * @param {string} message - Log mesajı
     * @param {any} data - Ek data
     */
    log(message, data = null) {
        if (this.isDevelopment) {
            if (data) {
                console.log(`[Dashboard] ${message}`, data);
            } else {
                console.log(`[Dashboard] ${message}`);
            }
        }
    }

    /**
     * Hata log'u (her zaman gösterilir)
     * @param {string} message - Hata mesajı
     * @param {Error} error - Hata objesi
     */
    error(message, error = null) {
        if (error) {
            console.error(`[Dashboard Error] ${message}`, error);
        } else {
            console.error(`[Dashboard Error] ${message}`);
        }
    }

    /**
     * Uyarı log'u (her zaman gösterilir)
     * @param {string} message - Uyarı mesajı
     */
    warn(message) {
        console.warn(`[Dashboard Warning] ${message}`);
    }
}

/**
 * Utility Helper Sınıfı
 */
class DashboardUtils {
    /**
     * Tarih formatını güvenli bir şekilde döndürür
     * @param {Date|string} date - Tarih
     * @returns {string} YYYY-MM-DD formatında tarih
     */
    static formatDate(date = null) {
        try {
            const targetDate = date ? new Date(date) : new Date();
            return targetDate.toISOString().split('T')[0];
        } catch (error) {
            console.error('Tarih formatlanırken hata:', error);
            return new Date().toISOString().split('T')[0];
        }
    }

    /**
     * String'i güvenli bir şekilde trim eder
     * @param {string} str - Trim edilecek string
     * @param {string} fallback - Default değer
     * @returns {string} Temizlenmiş string
     */
    static safeString(str, fallback = '') {
        if (!str || typeof str !== 'string') return fallback;
        return str.trim();
    }

    /**
     * Number'ı güvenli bir şekilde döndürür
     * @param {any} value - Sayıya çevrilecek değer
     * @param {number} fallback - Default değer
     * @returns {number} Sayı değeri
     */
    static safeNumber(value, fallback = 0) {
        const num = Number(value);
        return isNaN(num) ? fallback : num;
    }

    /**
     * Element'in DOM'da olup olmadığını kontrol eder
     * @param {string} elementId - Element ID'si
     * @returns {HTMLElement|null} Element veya null
     */
    static getElement(elementId) {
        const element = document.getElementById(elementId);
        if (!element) {
            console.warn(`Element bulunamadı: ${elementId}`);
        }
        return element;
    }

    /**
     * Async fonksiyonları güvenli bir şekilde çalıştırır
     * @param {Function} asyncFn - Async fonksiyon
     * @param {string} errorMessage - Hata mesajı
     * @returns {Promise<any>} Sonuç veya null
     */
    static async safeAsync(asyncFn, errorMessage = 'Bilinmeyen hata') {
        try {
            return await asyncFn();
        } catch (error) {
            console.error(errorMessage, error);
            return null;
        }
    }

    /**
     * Debounce fonksiyonu
     * @param {Function} func - Debounce edilecek fonksiyon
     * @param {number} wait - Bekleme süresi (ms)
     * @returns {Function} Debounced fonksiyon
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Global erişim için instance'ları oluştur
window.dashboardConfig = new DashboardConfig();
window.dashboardUtils = DashboardUtils;
