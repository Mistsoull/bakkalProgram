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
            this.loadTodayOrdersTable()
        ]);
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
     * Bugünkü siparişler tablosunu yükler ve gösterir
     */
    async loadTodayOrdersTable() {
        const tableBody = this.utils?.getElement('todayOrdersTableBody') || document.getElementById('todayOrdersTableBody');
        
        if (!tableBody) {
            this.config?.warn('todayOrdersTableBody elementi bulunamadı');
            return;
        }

        try {
            const orders = await this.service.getTodayOrders();
            this.renderOrdersTable(orders, tableBody);
            this.config?.log(`Siparişler tablosu güncellendi: ${orders.length} sipariş`);
        } catch (error) {
            this.config?.error('Siparişler tablosu yüklenirken hata', error);
            this.renderEmptyTable(tableBody);
        }
    }

    /**
     * Siparişler tablosunu render eder
     * @param {Array} orders - Sipariş listesi
     * @param {HTMLElement} tableBody - Tablo body elementi
     */
    renderOrdersTable(orders, tableBody) {
        if (!orders || orders.length === 0) {
            this.renderEmptyTable(tableBody);
            return;
        }

        tableBody.innerHTML = '';

        orders.forEach(order => {
            const row = this.createOrderRow(order);
            tableBody.appendChild(row);
        });
    }

    /**
     * Tek bir sipariş satırı oluşturur
     * @param {Object} order - Sipariş verisi
     * @returns {HTMLElement} Tablo satırı elementi
     */
    createOrderRow(order) {
        const row = document.createElement('tr');
        const customerFullName = this.getCustomerFullName(order);
        const statusBadge = this.getStatusBadge(order);
        const avatarPath = this.config?.DEFAULT_AVATAR_PATH || '../assets/images/profile/user-1.jpg';

        row.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${avatarPath}" class="rounded-circle" width="40" height="40">
                    <div class="ms-3">
                        <h6 class="fs-4 fw-semibold mb-0">${customerFullName}</h6>
                        <span class="fw-normal">Müşteri</span>
                    </div>
                </div>
            </td>
            <td>
                <p class="mb-0 fw-normal">${this.utils?.safeString(order.productName, 'Bilinmeyen Ürün') || order.productName || 'Bilinmeyen Ürün'}</p>
            </td>
            <td>
                <p class="mb-0 fw-normal">${this.utils?.safeNumber(order.quantity) || order.quantity || 0} adet</p>
            </td>
            <td>
                ${statusBadge}
            </td>
            <td>
                ${this.createActionDropdown(order.id)}
            </td>
        `;

        return row;
    }

    /**
     * Müşteri tam adını döndürür
     * @param {Object} order - Sipariş verisi
     * @returns {string} Müşteri tam adı
     */
    getCustomerFullName(order) {
        if (this.utils) {
            const name = this.utils.safeString(order.customerName);
            const surname = this.utils.safeString(order.customerSurname);
            const fullName = `${name} ${surname}`.trim();
            return fullName || 'Bilinmeyen Müşteri';
        }
        
        // Fallback without utils
        const name = order.customerName || '';
        const surname = order.customerSurname || '';
        const fullName = `${name} ${surname}`.trim();
        return fullName || 'Bilinmeyen Müşteri';
    }

    /**
     * Sipariş durumuna göre badge oluşturur
     * @param {Object} order - Sipariş verisi
     * @returns {string} HTML badge
     */
    getStatusBadge(order) {
        if (order.isPaid) {
            return '<span class="badge bg-success-subtle text-success">Ödendi</span>';
        } else {
            return '<span class="badge bg-danger-subtle text-danger">Ödenmedi</span>';
        }
    }

    /**
     * İşlemler dropdown'unu oluşturur
     * @param {string} orderId - Sipariş ID'si
     * @returns {string} HTML dropdown
     */
    createActionDropdown(orderId) {
        return `
            <div class="dropdown dropstart">
                <a href="javascript:void(0)" class="text-muted" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="ti ti-dots-vertical fs-6"></i>
                </a>
                <ul class="dropdown-menu">
                    <li>
                        <a class="dropdown-item d-flex align-items-center gap-3" href="javascript:void(0)" onclick="window.dashboardUI.viewOrder('${orderId}')">
                            <i class="fs-4 ti ti-eye"></i>Görüntüle
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item d-flex align-items-center gap-3" href="javascript:void(0)" onclick="window.dashboardUI.deliverOrder('${orderId}')">
                            <i class="fs-4 ti ti-check"></i>Teslim Et
                        </a>
                    </li>
                </ul>
            </div>
        `;
    }

    /**
     * Boş tablo gösterimi
     * @param {HTMLElement} tableBody - Tablo body elementi
     */
    renderEmptyTable(tableBody) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <p class="mb-0 text-muted">Bugün teslim edilecek sipariş bulunmuyor.</p>
                </td>
            </tr>
        `;
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
     * Sipariş görüntüleme işlemi (placeholder)
     * @param {string} orderId - Sipariş ID'si
     */
    async viewOrder(orderId) {
        this.config?.log(`Sipariş görüntüleniyor: ${orderId}`);
        // TODO: Sipariş detay modal'ı açma implementasyonu
        alert(`Sipariş ID: ${orderId} - Görüntüleme özelliği yakında eklenecek.`);
    }

    /**
     * Sipariş teslim etme işlemi (placeholder)
     * @param {string} orderId - Sipariş ID'si
     */
    async deliverOrder(orderId) {
        try {
            this.config?.log(`Sipariş teslim ediliyor: ${orderId}`);
            
            // Kullanıcıdan onay al
            const confirmed = confirm('Bu siparişi teslim edildi olarak işaretlemek istediğinizden emin misiniz?');
            if (!confirmed) return;

            // TODO: Sipariş durumu güncelleme API çağrısı
            const success = await this.service.updateOrderStatus(orderId, { isDelivered: true });
            
            if (success) {
                alert('Sipariş başarıyla teslim edildi olarak işaretlendi.');
                await this.refreshData(); // Tabloyu yenile
            } else {
                alert('Sipariş güncellenirken bir hata oluştu.');
            }
        } catch (error) {
            this.config?.error('Sipariş teslim edilirken hata', error);
            alert('Sipariş teslim edilirken bir hata oluştu.');
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
