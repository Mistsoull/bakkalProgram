/**
 * Dashboard UI Yönetim Modülü
 * Dashboard sayfasının kullanıcı arayüzü işlemlerini yönetir
 */

/**
 * Dashboard UI Yönetici Sınıfı
 */
class DashboardUIManager {
    constructor() {
        this.service = window.dashboardService;
        this.config = window.dashboardConfig;
        this.utils = window.dashboardUtils;
        this.refreshInterval = null;
        this.REFRESH_INTERVAL_MS = this.config?.REFRESH_INTERVAL_MS || 300000; // 5 dakika
    }

    /**
     * Dashboard'u başlatır
     */
    async initialize() {
        try {
            this.config?.log('Dashboard başlatılıyor...');
            await this.loadDashboardData();
            this.startAutoRefresh();
            this.config?.log('Dashboard başarıyla başlatıldı');
        } catch (error) {
            this.config?.error('Dashboard başlatılırken hata', error);
        }
    }

    /**
     * Dashboard verilerini yükler
     */
    async loadDashboardData() {
        await Promise.all([
            this.loadTodayOrderCount(),
            this.loadCreditStats()
        ]);
        
        // Orders DataTable'ı ayrıca orders.js tarafından yönetiliyor
        // Bu yüzden burada orders tablosunu yüklemeye gerek yok
    }

    /**
     * Bugünkü sipariş sayısını yükler ve gösterir
     */
    async loadTodayOrderCount() {
        const countElement = this.utils?.getElement('todayOrderCount') || document.getElementById('todayOrderCount');
        
        if (!countElement) {
            this.config?.warn('todayOrderCount elementi bulunamadı');
            return;
        }

        try {
            countElement.textContent = 'Yükleniyor...';
            const count = await this.service.getTodayOrderCount();
            countElement.textContent = count.toString();
            this.config?.log(`Sipariş sayısı güncellendi: ${count}`);
        } catch (error) {
            this.config?.error('Sipariş sayısı yüklenirken hata', error);
            countElement.textContent = '0';
        }
    }

    /**
     * Veresiye istatistiklerini yükler ve gösterir
     */
    async loadCreditStats() {
        const creditAmountElement = this.utils?.getElement('totalCreditDebt') || document.getElementById('totalCreditDebt');
        
        if (!creditAmountElement) {
            console.warn('totalCreditDebt elementi bulunamadı');
            this.config?.warn('totalCreditDebt elementi bulunamadı');
            return;
        }

        try {
            console.log('Veresiye istatistikleri yükleniyor...');
            creditAmountElement.textContent = 'Yükleniyor...';
            
            const stats = await this.service.getCreditStats();
            console.log('Dashboard\'a yüklenen stats:', stats);
            
            // Ödenmemiş toplam tutarı göster
            const formattedAmount = this.formatCurrency(stats.unpaidAmount);
            console.log('Formatlanmış tutar:', formattedAmount);
            
            creditAmountElement.textContent = formattedAmount;
            console.log('Element güncellendi, yeni içerik:', creditAmountElement.textContent);
            
            this.config?.log(`Veresiye borcu güncellendi: ${formattedAmount}`);
        } catch (error) {
            console.error('Veresiye borcu yüklenirken hata:', error);
            this.config?.error('Veresiye borcu yüklenirken hata', error);
            creditAmountElement.textContent = '₺0.00';
        }
    }

    /**
     * Para formatlaması
     * @param {number} amount - Miktar
     * @returns {string} Formatlanmış para
     */
    formatCurrency(amount) {
        if (typeof amount !== 'number') {
            amount = parseFloat(amount) || 0;
        }
        return `₺${amount.toFixed(2)}`;
    }

    /**
     * Otomatik yenileme başlatır
     */
    startAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }

        this.refreshInterval = setInterval(async () => {
            try {
                await this.loadDashboardData();
                this.config?.log('Dashboard verileri otomatik olarak yenilendi');
            } catch (error) {
                this.config?.error('Otomatik yenileme hatası', error);
            }
        }, this.REFRESH_INTERVAL_MS);

        this.config?.log(`Otomatik yenileme başlatıldı (${this.REFRESH_INTERVAL_MS / 1000} saniye)`);
    }

    /**
     * Otomatik yenilemeyi durdurur
     */
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
            this.config?.log('Otomatik yenileme durduruldu');
        }
    }

    /**
     * Dashboard verilerini manuel olarak yeniler
     */
    async refreshData() {
        try {
            await this.loadDashboardData();
            this.config?.log('Dashboard verileri manuel olarak yenilendi');
        } catch (error) {
            this.config?.error('Manuel yenileme hatası', error);
        }
    }

    /**
     * Component temizleme işlemi (sayfa değişirken çağrılabilir)
     */
    destroy() {
        this.stopAutoRefresh();
        this.config?.log('Dashboard UI Manager temizlendi');
    }
}

// Global erişim için dashboard UI manager instance'ı oluştur
window.dashboardUI = new DashboardUIManager();
