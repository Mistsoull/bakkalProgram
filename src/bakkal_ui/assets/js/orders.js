/**
 * Sipariş Yönetimi Modülü
 * Clean Architecture backend entegrasyonu ile sipariş listeleme, ekleme ve silme işlemleri
 * Ürün ve müşteri entegrasyonu ile dropdown ve manuel giriş desteği
 */

// DOM Element Referansları
const ordersTableBody = document.getElementById('orders-table-body');
const addOrderForm = document.getElementById('add-order-form');
const orderProductNameInput = document.getElementById('order-product-name-input');
const orderQuantityInput = document.getElementById('order-quantity-input');
const orderCustomerNameInput = document.getElementById('order-customer-name-input');
const orderCustomerSurnameInput = document.getElementById('order-customer-surname-input');
const orderDeliveryDateInput = document.getElementById('order-delivery-date-input');
const orderProductSelect = document.getElementById('order-product-select');
const orderCustomerSelect = document.getElementById('order-customer-select');

// Modal instance
let addOrderModal = null;

// Avatar resim yolları (rastgele profil resimleri için)
const avatarImages = [
    '../assets/images/profile/user-1.jpg',
    '../assets/images/profile/user-2.jpg',
    '../assets/images/profile/user-3.jpg',
    '../assets/images/profile/user-4.jpg',
    '../assets/images/profile/user-5.jpg',
    '../assets/images/profile/user-6.jpg'
];

/**
 * Rastgele avatar resmi döndürür
 */
function getRandomAvatar() {
    return avatarImages[Math.floor(Math.random() * avatarImages.length)];
}

/**
 * String'i güvenli HTML'e çevirir (XSS koruması)
 */
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

/**
 * Tarih formatlaması (dd/mm/yyyy)
 */
function formatDate(dateString) {
    if (!dateString) return '';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    } catch (error) {
        console.error('Tarih formatlanırken hata:', error);
        return dateString;
    }
}

/**
 * Sipariş durumunu badge ile gösterir
 */
function getStatusBadge(isDelivered) {
    if (isDelivered) {
        return '<span class="badge bg-success-subtle text-success">Teslim Edildi</span>';
    } else {
        return '<span class="badge bg-warning-subtle text-warning">Bekliyor</span>';
    }
}

/**
 * API'den ürün listesini çeker ve dropdown'ı doldurur
 */
async function loadProductsForDropdown() {
    try {
        console.log('Ürünler dropdown için yükleniyor...');
        
        const response = await apiService.fetchGetAll('Products');
        
        // API yanıtının yapısını kontrol et
        let products = [];
        if (response && response.items && Array.isArray(response.items)) {
            products = response.items;
        } else if (Array.isArray(response)) {
            products = response;
        }
        
        console.log('API\'den gelen ürün verisi:', products);
        
        // Dropdown'ı temizle
        orderProductSelect.innerHTML = '<option value="">Ürün Seç (Opsiyonel)</option>';
        
        // Ürünleri dropdown'a ekle
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} - ${product.price}₺`;
            option.dataset.productName = product.name;
            orderProductSelect.appendChild(option);
        });
        
        console.log(`${products.length} ürün dropdown'a eklendi.`);
        
    } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
        showToast('error', 'Hata!', 'Ürünler yüklenirken bir hata oluştu: ' + error.message);
    }
}

/**
 * API'den müşteri listesini çeker ve dropdown'ı doldurur
 */
async function loadCustomersForDropdown() {
    try {
        console.log('Müşteriler dropdown için yükleniyor...');
        
        const response = await apiService.fetchGetAll('Customers');
        
        // API yanıtının yapısını kontrol et
        let customers = [];
        if (response && response.items && Array.isArray(response.items)) {
            customers = response.items;
        } else if (Array.isArray(response)) {
            customers = response;
        }
        
        console.log('API\'den gelen müşteri verisi:', customers);
        
        // Dropdown'ı temizle
        orderCustomerSelect.innerHTML = '<option value="">Müşteri Seç (Opsiyonel)</option>';
        
        // Müşterileri dropdown'a ekle
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = `${customer.name} ${customer.surname}`;
            option.dataset.customerName = `${customer.name} ${customer.surname}`;
            orderCustomerSelect.appendChild(option);
        });
        
        console.log(`${customers.length} müşteri dropdown'a eklendi.`);
        
    } catch (error) {
        console.error('Müşteriler yüklenirken hata:', error);
        showToast('error', 'Hata!', 'Müşteriler yüklenirken bir hata oluştu: ' + error.message);
    }
}

/**
 * API'den sipariş listesini çeker ve tabloya yerleştirir
 */
async function loadOrders() {
    try {
        console.log('Siparişler yükleniyor...');
        
        // Yükleniyor mesajı göster
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <div class="d-flex justify-content-center align-items-center">
                        <div class="spinner-border text-primary me-2" role="status" aria-hidden="true"></div>
                        <span>Siparişler yükleniyor...</span>
                    </div>
                </td>
            </tr>
        `;
        
        const response = await apiService.fetchGetAll('Orders');
        
        // API yanıtının yapısını kontrol et
        let orders = [];
        if (response && response.items && Array.isArray(response.items)) {
            orders = response.items;
        } else if (Array.isArray(response)) {
            orders = response;
        }
        
        console.log('API\'den gelen sipariş verisi:', orders);
        
        // Tabloyu temizle
        ordersTableBody.innerHTML = '';
        
        // Eğer sipariş yoksa
        if (orders.length === 0) {
            ordersTableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center py-4">
                        <i class="fas fa-inbox fs-1 text-muted mb-3"></i>
                        <h5 class="text-muted">Henüz sipariş bulunmuyor</h5>
                        <p class="text-muted">İlk siparişinizi eklemek için "Yeni Sipariş Ekle" butonunu kullanın.</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        // Her sipariş için tablo satırı oluştur
        orders.forEach(order => {
            const avatarImg = getRandomAvatar();
            const fullCustomerName = order.customerSurname ? 
                `${order.customerName} ${order.customerSurname}` : 
                order.customerName;
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <div class="d-flex align-items-center">
                        <img src="${avatarImg}" class="rounded-circle" width="40" height="40" alt="Customer Avatar">
                        <div class="ms-3">
                            <h6 class="fs-4 fw-semibold mb-0">${escapeHtml(fullCustomerName)}</h6>
                            <span class="fw-normal text-muted">Müşteri</span>
                        </div>
                    </div>
                </td>
                <td>
                    <p class="mb-0 fw-normal">${escapeHtml(order.productName)}</p>
                </td>
                <td>
                    <span class="badge bg-info-subtle text-info">${order.quantity} adet</span>
                </td>
                <td>
                    <p class="mb-0 fw-normal">${formatDate(order.deliveryDate)}</p>
                </td>
                <td>
                    ${getStatusBadge(order.isDelivered)}
                </td>
                <td>
                    <div class="d-flex justify-content-center gap-1">
                        <button class="btn btn-outline-success btn-sm" onclick="toggleOrderStatus('${order.id}', ${!order.isDelivered})" title="${order.isDelivered ? 'Bekliyor Yap' : 'Teslim Et'}">
                            <i class="fas fa-${order.isDelivered ? 'undo' : 'check'}"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${order.id}" title="Sil">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            
            ordersTableBody.appendChild(row);
        });
        
        console.log(`${orders.length} sipariş başarıyla yüklendi.`);
        
    } catch (error) {
        console.error('Siparişler yüklenirken hata:', error);
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-4">
                    <i class="fas fa-exclamation-triangle fs-1 text-danger mb-3"></i>
                    <h5 class="text-danger">Hata!</h5>
                    <p class="text-muted">Siparişler yüklenirken bir hata oluştu: ${error.message}</p>
                    <button class="btn btn-primary" onclick="loadOrders()">Tekrar Dene</button>
                </td>
            </tr>
        `;
        showToast('error', 'Hata!', 'Siparişler yüklenirken bir hata oluştu: ' + error.message);
    }
}

/**
 * Yeni sipariş ekleme form submit olayı
 */
function handleAddOrderForm(event) {
    event.preventDefault();
    
    // Form verilerini al
    const orderData = {
        productName: orderProductNameInput.value.trim(),
        quantity: parseInt(orderQuantityInput.value),
        customerName: orderCustomerNameInput.value.trim(),
        customerSurname: orderCustomerSurnameInput.value.trim() || null,
        deliveryDate: orderDeliveryDateInput.value,
        productId: orderProductSelect.value || null,
        customerId: orderCustomerSelect.value || null
    };
    
    // Basit validasyon
    if (!orderData.productName) {
        orderProductNameInput.focus();
        orderProductNameInput.classList.add('is-invalid');
        showToast('error', 'Hata!', 'Ürün adı zorunludur.');
        return;
    }
    if (!orderData.quantity || orderData.quantity < 1) {
        orderQuantityInput.focus();
        orderQuantityInput.classList.add('is-invalid');
        showToast('error', 'Hata!', 'Geçerli bir miktar giriniz.');
        return;
    }
    if (!orderData.customerName) {
        orderCustomerNameInput.focus();
        orderCustomerNameInput.classList.add('is-invalid');
        showToast('error', 'Hata!', 'Müşteri adı zorunludur.');
        return;
    }
    if (!orderData.deliveryDate) {
        orderDeliveryDateInput.focus();
        orderDeliveryDateInput.classList.add('is-invalid');
        showToast('error', 'Hata!', 'Teslimat tarihi zorunludur.');
        return;
    }
    
    console.log('Gönderilecek sipariş verisi:', orderData);
    
    // Submit butonunu devre dışı bırak
    const submitBtn = addOrderForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Kaydediliyor...';
    submitBtn.disabled = true;
    
    // API'ye POST isteği gönder
    apiService.fetchPost('Orders', orderData)
        .then(response => {
            console.log('Sipariş başarıyla eklendi:', response);
            
            // Yeni siparişi tabloya ekle
            addOrderToTable(response);
            
            // Formu temizle ve modalı kapat
            addOrderForm.reset();
            addOrderModal.hide();
            
            // Başarı mesajı göster
            showToast('success', 'Başarılı!', 'Sipariş başarıyla eklendi.');
            
            // Input validasyon sınıflarını temizle
            [orderProductNameInput, orderQuantityInput, orderCustomerNameInput, orderCustomerSurnameInput, orderDeliveryDateInput].forEach(input => {
                input.classList.remove('is-invalid', 'is-valid');
            });
            
            // Bugünün tarihini default olarak ayarla
            setDefaultDeliveryDate();
        })
        .catch(error => {
            console.error('Sipariş eklenirken hata:', error);
            showToast('error', 'Hata!', 'Sipariş eklenirken bir hata oluştu: ' + error.message);
        })
        .finally(() => {
            // Submit butonunu yeniden etkinleştir
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

/**
 * Yeni siparişi tabloya ekler
 */
function addOrderToTable(order) {
    // Eğer tablo boşsa, placeholder'ı kaldır
    if (ordersTableBody.innerHTML.includes('Henüz sipariş bulunmuyor') || 
        ordersTableBody.innerHTML.includes('Siparişler yükleniyor')) {
        ordersTableBody.innerHTML = '';
    }
    
    const avatarImg = getRandomAvatar();
    const fullCustomerName = order.customerSurname ? 
        `${order.customerName} ${order.customerSurname}` : 
        order.customerName;
    
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>
            <div class="d-flex align-items-center">
                <img src="${avatarImg}" class="rounded-circle" width="40" height="40" alt="Customer Avatar">
                <div class="ms-3">
                    <h6 class="fs-4 fw-semibold mb-0">${escapeHtml(fullCustomerName)}</h6>
                    <span class="fw-normal text-muted">Müşteri</span>
                </div>
            </div>
        </td>
        <td>
            <p class="mb-0 fw-normal">${escapeHtml(order.productName)}</p>
        </td>
        <td>
            <span class="badge bg-info-subtle text-info">${order.quantity} adet</span>
        </td>
        <td>
            <p class="mb-0 fw-normal">${formatDate(order.deliveryDate)}</p>
        </td>
        <td>
            ${getStatusBadge(order.isDelivered)}
        </td>
        <td>
            <div class="d-flex justify-content-center gap-1">
                <button class="btn btn-outline-success btn-sm" onclick="toggleOrderStatus('${order.id}', ${!order.isDelivered})" title="${order.isDelivered ? 'Bekliyor Yap' : 'Teslim Et'}">
                    <i class="fas fa-${order.isDelivered ? 'undo' : 'check'}"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${order.id}" title="Sil">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    // Yeni satırı tablonun başına ekle
    ordersTableBody.insertBefore(row, ordersTableBody.firstChild);
}

/**
 * Sipariş durumunu değiştirir (Teslim Et / Bekliyor Yap)
 */
async function toggleOrderStatus(orderId, newStatus) {
    const statusText = newStatus ? 'teslim edildi' : 'bekliyor';
    
    if (!confirm(`Bu siparişin durumunu "${statusText}" olarak değiştirmek istediğinizden emin misiniz?`)) {
        return;
    }
    
    try {
        // Önce mevcut sipariş verilerini al
        console.log('Sipariş verisi alınıyor:', orderId);
        const orderResponse = await apiService.fetchGet(`Orders/${orderId}`);
        
        console.log('Mevcut sipariş verisi:', orderResponse);
        
        // Mevcut verileri koruyarak sadece isDelivered'ı güncelle
        const updateData = {
            id: orderId,
            productName: orderResponse.productName,
            quantity: orderResponse.quantity,
            customerName: orderResponse.customerName,
            customerSurname: orderResponse.customerSurname || null,
            deliveryDate: orderResponse.deliveryDate,
            isDelivered: newStatus,
            productId: orderResponse.productId,
            customerId: orderResponse.customerId
        };
        
        console.log('Gönderilecek güncelleme verisi:', updateData);
        
        // Durumu güncelle
        await apiService.fetchPut('Orders', updateData);
        
        console.log('Sipariş durumu başarıyla güncellendi:', orderId, newStatus);
        
        // Sayfayı yeniden yükle (gerçek uygulamada sadece ilgili satırı güncelleyebiliriz)
        loadOrders();
        
        showToast('success', 'Başarılı!', `Sipariş durumu "${statusText}" olarak güncellendi.`);
        
    } catch (error) {
        console.error('Sipariş durumu güncellenirken hata:', error);
        showToast('error', 'Hata!', 'Sipariş durumu güncellenirken bir hata oluştu: ' + error.message);
    }
}

/**
 * Sipariş silme fonksiyonu (Event Delegation ile)
 */
function handleDeleteOrder(event) {
    if (!event.target.closest('.delete-btn')) return;
    
    const button = event.target.closest('.delete-btn');
    const orderId = button.dataset.id;
    
    if (!orderId) {
        console.error('Sipariş ID bulunamadı');
        return;
    }
    
    // Kullanıcıdan onay al
    if (!confirm('Bu siparişi silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz.')) {
        return;
    }
    
    // API'ye DELETE isteği gönder
    apiService.fetchDelete(`Orders/${orderId}`)
        .then(() => {
            console.log('Sipariş başarıyla silindi:', orderId);
            
            // Satırı tablodan kaldır
            const row = button.closest('tr');
            row.remove();
            
            // Eğer tablo boş kaldıysa placeholder göster
            if (ordersTableBody.children.length === 0) {
                ordersTableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center py-4">
                            <i class="fas fa-inbox fs-1 text-muted mb-3"></i>
                            <h5 class="text-muted">Henüz sipariş bulunmuyor</h5>
                            <p class="text-muted">İlk siparişinizi eklemek için "Yeni Sipariş Ekle" butonunu kullanın.</p>
                        </td>
                    </tr>
                `;
            }
            
            // Başarı mesajı göster
            showToast('success', 'Başarılı!', 'Sipariş başarıyla silindi.');
        })
        .catch(error => {
            console.error('Sipariş silinirken hata:', error);
            showToast('error', 'Hata!', 'Sipariş silinirken bir hata oluştu: ' + error.message);
        });
}

/**
 * Dropdown seçimlerini input'lara yansıtır
 */
function setupDropdownHandlers() {
    // Ürün seçimi değiştiğinde
    if (orderProductSelect) {
        orderProductSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption.dataset.productName) {
                orderProductNameInput.value = selectedOption.dataset.productName;
                orderProductNameInput.classList.remove('is-invalid');
                orderProductNameInput.classList.add('is-valid');
            } else if (this.value === '') {
                orderProductNameInput.value = '';
                orderProductNameInput.classList.remove('is-valid', 'is-invalid');
            }
        });
    }
    
    // Müşteri seçimi değiştiğinde
    if (orderCustomerSelect) {
        orderCustomerSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption.dataset.customerName) {
                // Müşteri adını ve soyadını ayrı ayrı doldur
                const fullName = selectedOption.dataset.customerName;
                const nameParts = fullName.split(' ');
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';
                
                orderCustomerNameInput.value = firstName;
                orderCustomerSurnameInput.value = lastName;
                
                orderCustomerNameInput.classList.remove('is-invalid');
                orderCustomerNameInput.classList.add('is-valid');
                if (lastName) {
                    orderCustomerSurnameInput.classList.remove('is-invalid');
                    orderCustomerSurnameInput.classList.add('is-valid');
                }
            } else if (this.value === '') {
                orderCustomerNameInput.value = '';
                orderCustomerSurnameInput.value = '';
                orderCustomerNameInput.classList.remove('is-valid', 'is-invalid');
                orderCustomerSurnameInput.classList.remove('is-valid', 'is-invalid');
            }
        });
    }
}

/**
 * Input validasyon olaylarını ayarla
 */
function setupInputValidation() {
    const inputs = [orderProductNameInput, orderQuantityInput, orderCustomerNameInput, orderCustomerSurnameInput, orderDeliveryDateInput];
    
    inputs.forEach(input => {
        if (!input) return;
        
        input.addEventListener('input', function() {
            this.classList.remove('is-invalid');
            if (this.value.trim()) {
                this.classList.add('is-valid');
            } else {
                this.classList.remove('is-valid');
            }
        });
    });
}

/**
 * Default teslimat tarihini ayarlar (bugün + 1 gün)
 */
function setDefaultDeliveryDate() {
    if (!orderDeliveryDateInput) return;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const year = tomorrow.getFullYear();
    const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    
    orderDeliveryDateInput.value = `${year}-${month}-${day}`;
}

/**
 * Toast notification göster
 */
function showToast(type, title, message) {
    // Basit bir toast implementasyonu
    const toast = document.createElement('div');
    toast.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} alert-dismissible fade show position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    toast.innerHTML = `
        <strong>${escapeHtml(title)}</strong> ${escapeHtml(message)}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(toast);
    
    // 5 saniye sonra otomatik kaldır
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, 5000);
}

/**
 * Sayfa yüklendiğinde çalışacak initialization fonksiyonu
 */
function initializeOrdersPage() {
    console.log('Siparişler sayfası başlatılıyor...');
    
    // Element kontrolü
    if (!addOrderForm) {
        console.error('Form elementi bulunamadı');
        return;
    }
    
    if (!ordersTableBody) {
        console.error('Tablo tbody elementi bulunamadı');
        return;
    }
    
    // Modal'ı başlat
    const modalElement = document.getElementById('addOrderModal');
    if (modalElement) {
        addOrderModal = new bootstrap.Modal(modalElement);
        
        // Modal açıldığında default tarih ayarla
        modalElement.addEventListener('shown.bs.modal', function() {
            setDefaultDeliveryDate();
            orderProductNameInput.focus();
        });
    }
    
    // Promise.all ile üç asenkron işlemi aynı anda başlat
    Promise.all([
        loadProductsForDropdown(),
        loadCustomersForDropdown(),
        loadOrders()
    ]).then(() => {
        console.log('Tüm veriler başarıyla yüklendi.');
    }).catch(error => {
        console.error('Veriler yüklenirken hata:', error);
        showToast('error', 'Hata!', 'Sayfa verileri yüklenirken bir hata oluştu.');
    });
    
    // Form submit olayını dinle
    addOrderForm.addEventListener('submit', handleAddOrderForm);
    
    // Silme işlemi için event delegation
    ordersTableBody.addEventListener('click', handleDeleteOrder);
    
    // Dropdown handler'larını ayarla
    setupDropdownHandlers();
    
    // Input validasyonu ayarla
    setupInputValidation();
    
    // Default teslimat tarihini ayarla
    setDefaultDeliveryDate();
    
    console.log('Siparişler sayfası başarıyla başlatıldı.');
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', function() {
    initializeOrdersPage();
});

// Global erişim için window objesine ekle (debugging için)
window.ordersModule = {
    loadOrders,
    loadProductsForDropdown,
    loadCustomersForDropdown,
    addOrderToTable,
    toggleOrderStatus,
    formatDate,
    getStatusBadge
};
