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

    /**
     * Toplam veresiye borcu bilgilerini getirir
     * @returns {Promise<Object>} Veresiye istatistikleri
     */
    async getCreditStats() {
        try {
            console.log('getCreditStats çağrıldı, API isteği başlatılıyor...');
            
            // apiService kullan (eğer mevcut ise)
            let response;
            if (window.apiService && window.apiService.fetchGetAll) {
                console.log('apiService kullanılıyor...');
                response = await window.apiService.fetchGetAll('OnCredits');
            } else {
                // OnCredits için pagination parametreleri ekle (apiService ile aynı format)
                const paginationParams = {
                    pageIndex: 0,
                    pageSize: 1000  // Tüm veriler için büyük bir değer
                };
                
                response = await this.makeRequest('OnCredits', paginationParams);
            }
            
            console.log('OnCredits API yanıtı:', response);
            
            let credits = [];
            if (response && response.items && Array.isArray(response.items)) {
                credits = response.items;
                console.log('API response.items kullanıldı, array uzunluğu:', credits.length);
            } else if (Array.isArray(response)) {
                credits = response;
                console.log('API response direkt array, uzunluğu:', credits.length);
            } else {
                console.warn('API yanıtı beklenmedik formatta:', response);
            }

            console.log('İşlenecek veresiye sayısı:', credits.length);
            console.log('İlk 3 veresiye örneği:', credits.slice(0, 3));

            // Veresiye istatistiklerini hesapla
            let totalAmount = 0;
            let paidAmount = 0;
            let unpaidAmount = 0;
            let totalCredits = credits.length;
            let paidCredits = 0;
            let unpaidCredits = 0;

            credits.forEach(credit => {
                const amount = parseFloat(credit.totalAmount) || 0;
                totalAmount += amount;

                console.log(`Veresiye ID: ${credit.id}, Tutar: ${amount}, Ödendi: ${credit.isPaid}`);

                if (credit.isPaid) {
                    paidAmount += amount;
                    paidCredits++;
                } else {
                    unpaidAmount += amount;
                    unpaidCredits++;
                }
            });

            const stats = {
                totalAmount,
                paidAmount,
                unpaidAmount,
                totalCredits,
                paidCredits,
                unpaidCredits
            };

            console.log('Hesaplanan veresiye istatistikleri:', stats);
            this.config?.log('Veresiye istatistikleri:', stats);
            return stats;
        } catch (error) {
            console.error('getCreditStats hatası:', error);
            this.config?.error('Veresiye istatistikleri alınırken hata', error);
            return {
                totalAmount: 0,
                paidAmount: 0,
                unpaidAmount: 0,
                totalCredits: 0,
                paidCredits: 0,
                unpaidCredits: 0
            };
        }
    }
}

// Global erişim için dashboard service instance'ı oluştur
window.dashboardService = new DashboardService();
