/**
 * Dashboard API Servis Modülü
 * Dashboard sayfası için özel API işlemlerini yönetir
 */

/**
 * Dashboard API Servis Sınıfı
 */
class DashboardService {
    constructor() {
        // Base API URL'ini configuration'dan al
        this.BASE_URL = window.dashboardConfig?.API_BASE_URL || 'http://localhost:5278/api';
        this.config = window.dashboardConfig;
        this.utils = window.dashboardUtils;
    }

    /**
     * Bugünün tarihini ISO formatında döndürür
     * @returns {string} YYYY-MM-DD formatında tarih
     */
    getTodayDate() {
        return this.utils ? this.utils.formatDate() : new Date().toISOString().split('T')[0];
    }

    /**
     * Özel GET isteği (base apiService'den farklı URL için)
     * @param {string} endpoint - API endpoint'i
     * @param {Object} params - Query parametreleri
     * @returns {Promise<any>} API yanıtı
     */
    async makeRequest(endpoint, params = {}) {
        try {
            const queryParams = new URLSearchParams(params);
            const url = `${this.BASE_URL}/${endpoint}?${queryParams.toString()}`;

            this.config?.log(`API isteği: ${endpoint}`, params);

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP hatası! durum: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            this.config?.log(`API yanıtı alındı: ${endpoint}`, data);
            return data;
        } catch (error) {
            this.config?.error(`${endpoint} için istek başarısız`, error);
            throw error;
        }
    }

    /**
     * Bugünkü toplam sipariş sayısını getirir
     * @param {string} date - İsteğe bağlı tarih (varsayılan: bugün)
     * @returns {Promise<number>} Sipariş sayısı
     */
    async getTodayOrderCount(date = null) {
        try {
            const targetDate = date || this.getTodayDate();
            const response = await this.makeRequest('Orders/GetTotalOrderCountByDay', { date: targetDate });
            // API'den gelen response'ta "totalOrderCount" field'ını kontrol et
            const count = this.utils ? this.utils.safeNumber(response.totalOrderCount || response.count) : (response.totalOrderCount || response.count || 0);
            this.config?.log(`Bugünkü sipariş sayısı: ${count}`);
            return count;
        } catch (error) {
            this.config?.error('Bugünkü sipariş sayısı alınırken hata', error);
            return 0;
        }
    }

    /**
     * Bugünkü siparişlerin listesini getirir
     * @param {string} date - İsteğe bağlı tarih (varsayılan: bugün)
     * @returns {Promise<Array>} Sipariş listesi
     */
    async getTodayOrders(date = null) {
        try {
            const targetDate = date || this.getTodayDate();
            const response = await this.makeRequest('Orders/GetTodaysOrders', { date: targetDate });
            const orders = Array.isArray(response) ? response : [];
            this.config?.log(`Bugünkü siparişler: ${orders.length} adet`);
            return orders;
        } catch (error) {
            this.config?.error('Bugünkü siparişler alınırken hata', error);
            return [];
        }
    }

    /**
     * Sipariş durumunu günceller (placeholder - gelecekte implementasyon için)
     * @param {string} orderId - Sipariş ID'si
     * @param {Object} updateData - Güncellenecek veri
     * @returns {Promise<boolean>} Başarı durumu
     */
    async updateOrderStatus(orderId, updateData) {
        try {
            // TODO: Sipariş güncelleme API'si implementasyonu
            this.config?.log(`Sipariş ${orderId} güncelleniyor`, updateData);
            return true;
        } catch (error) {
            this.config?.error('Sipariş güncellenirken hata', error);
            return false;
        }
    }
}

// Global erişim için dashboard service instance'ı oluştur
window.dashboardService = new DashboardService();
