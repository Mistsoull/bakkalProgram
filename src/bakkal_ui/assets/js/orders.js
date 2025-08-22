/**
 * Sipariş Yönetimi Modülü
 * Clean Architecture backend entegrasyonu ile sipariş listeleme, ekleme ve silme işlemleri
 * Ürün ve müşteri entegrasyonu ile dropdown ve manuel giriş desteği
 * DataTable entegrasyonu ile gelişmiş tablo işlevselliği
 */

// DOM Element Referansları
let ordersTable;
let ordersDataTable;
const addOrderForm = document.getElementById('add-order-form');
const orderProductNameInput = document.getElementById('order-product-name-input');
const orderQuantityInput = document.getElementById('order-quantity-input');
const orderCustomerNameInput = document.getElementById('order-customer-name-input');
const orderCustomerSurnameInput = document.getElementById('order-customer-surname-input');
const orderDeliveryDateInput = document.getElementById('order-delivery-date-input');
const orderProductSelect = document.getElementById('order-product-select');
const orderCustomerSelect = document.getElementById('order-customer-select');
const orderPaymentStatusSelect = document.getElementById('order-payment-status-select');

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
 * DataTable'ı başlat
 */
function initializeDataTable() {
    if (!ordersTable) return;
    
    try {
        console.log('Orders DataTable başlatılıyor...');
        console.log('jQuery sürümü:', $.fn.jquery);
        console.log('DataTables mevcut:', !!$.fn.DataTable);
        console.log('Buttons mevcut:', !!$.fn.DataTable.Buttons);
        
        ordersDataTable = $(ordersTable).DataTable({
            responsive: true,
            pageLength: 10,
            lengthMenu: [[10, 25, 50, 100], [10, 25, 50, 100]],
            processing: true,
            search: {
                caseInsensitive: true
            },
            dom: '<"row"<"col-sm-6"B><"col-sm-6"f>>' +
                 '<"row"<"col-sm-12"tr>>' +
                 '<"row"<"col-sm-5"i><"col-sm-7"p>>',
            buttons: [
                {
                    extend: 'copy',
                    text: '<i class="fas fa-copy me-1"></i>Kopyala',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5], // Müşteri, ürün, miktar, tarih, durum
                        format: {
                            body: function (data, row, column, node) {
                                // HTML etiketlerini temizle
                                return data.replace(/<.*?>/g, '').trim();
                            }
                        }
                    }
                },
                {
                    extend: 'csv',
                    text: '<i class="fas fa-file-csv me-1"></i>CSV',
                    filename: 'siparisler_' + new Date().toISOString().slice(0,10),
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5],
                        format: {
                            body: function (data, row, column, node) {
                                return data.replace(/<.*?>/g, '').trim();
                            }
                        }
                    }
                },
                {
                    extend: 'excel',
                    text: '<i class="fas fa-file-excel me-1"></i>Excel',
                    filename: 'siparisler_' + new Date().toISOString().slice(0,10),
                    title: 'Sipariş Listesi',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5],
                        format: {
                            body: function (data, row, column, node) {
                                return data.replace(/<.*?>/g, '').trim();
                            }
                        }
                    }
                },
                {
                    extend: 'pdf',
                    text: '<i class="fas fa-file-pdf me-1"></i>PDF',
                    filename: 'siparisler_' + new Date().toISOString().slice(0,10),
                    title: 'Sipariş Listesi',
                    orientation: 'landscape',
                    pageSize: 'A4',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5],
                        format: {
                            body: function (data, row, column, node) {
                                return data.replace(/<.*?>/g, '').trim();
                            }
                        }
                    }
                },
                {
                    extend: 'print',
                    text: '<i class="fas fa-print me-1"></i>Yazdır',
                    title: 'Sipariş Listesi',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4, 5],
                        format: {
                            body: function (data, row, column, node) {
                                return data.replace(/<.*?>/g, '').trim();
                            }
                        }
                    }
                }
            ],
            language: {
                "decimal": "",
                "emptyTable": "Tabloda herhangi bir veri mevcut değil",
                "info": "_TOTAL_ kayıttan _START_ - _END_ arası gösteriliyor",
                "infoEmpty": "Kayıt yok",
                "infoFiltered": "(_MAX_ kayıt içerisinden bulunan)",
                "infoPostFix": "",
                "thousands": ".",
                "lengthMenu": "_MENU_ kayıt göster",
                "loadingRecords": "Yükleniyor...",
                "processing": "İşleniyor...",
                "search": "Ara:",
                "searchPlaceholder": "Arama yapın",
                "zeroRecords": "Eşleşen kayıt bulunamadı",
                "paginate": {
                    "first": "İlk",
                    "last": "Son",
                    "next": "Sonraki",
                    "previous": "Önceki"
                },
                "aria": {
                    "sortAscending": ": artan sütun sıralamasını aktifleştir",
                    "sortDescending": ": azalan sütun sıralamasını aktifleştir"
                }
            },
            order: [[3, 'desc']], // Teslimat tarihine göre azalan sırala (en yeni üstte)
            columnDefs: [
                {
                    targets: [6], // İşlemler sütunu
                    orderable: false,
                    searchable: false,
                    width: "140px",
                    className: "text-center"
                }
            ],
            drawCallback: function() {
                // DataTable yeniden çizildiğinde tooltip'leri yeniden başlat
                const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
                tooltipTriggerList.map(function (tooltipTriggerEl) {
                    return new bootstrap.Tooltip(tooltipTriggerEl);
                });
            }
        });
        
        // Button stillerini uygula
        $('.dt-buttons .btn').removeClass('dt-button').addClass('me-2 mb-2');
        
        console.log('Orders DataTable başarıyla başlatıldı');
        console.log('Buttons mevcut:', !!ordersDataTable.buttons);
        
    } catch (error) {
        console.error('Orders DataTable başlatılamadı:', error);
        // Hata durumunda basit bir export butonu ekle
        setTimeout(() => {
            if ($('.dt-buttons').length === 0) {
                const table = $(ordersTable);
                const simpleButtons = `
                    <div class="mb-3">
                        <button class="btn btn-outline-primary btn-sm me-2" onclick="alert('Export özelliği yüklenemedi')">
                            <i class="fas fa-download me-1"></i>Export
                        </button>
                    </div>
                `;
                table.closest('.table-responsive').before(simpleButtons);
            }
        }, 500);
    }
}

/**
 * DOM element referanslarını başlat
 */
function initializeElements() {
    // DataTable tablosunu al
    ordersTable = document.getElementById('orders-datatable');
    
    // DataTable'ı başlat
    if (ordersTable) {
        initializeDataTable();
    }
}

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
 * Ödeme durumunu badge ile gösterir
 */
function getPaymentStatusBadge(isPaid) {
    if (isPaid) {
        return '<span class="badge bg-success-subtle text-success">Ödendi</span>';
    } else {
        return '<span class="badge bg-danger-subtle text-danger">Ödenmedi</span>';
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
 * API'den sipariş listesini çeker ve DataTable'a yerleştirir
 */
async function loadOrders() {
    if (!ordersDataTable) {
        console.warn('DataTable henüz başlatılmamış');
        return;
    }

    try {
        console.log('Siparişler yükleniyor...');
        
        // Yükleniyor durumunu göster
        showLoadingState();
        
        const response = await apiService.fetchGetAll('Orders');
        
        // API yanıtının yapısını kontrol et
        let orders = [];
        if (response && response.items && Array.isArray(response.items)) {
            orders = response.items;
        } else if (Array.isArray(response)) {
            orders = response;
        }
        
        console.log('API\'den gelen sipariş verisi:', orders);
        
        // DataTable'ı temizle
        ordersDataTable.clear();

        if (orders && orders.length > 0) {
            // Her sipariş için satır verisi oluştur ve tabloya ekle
            orders.forEach(order => {
                const rowData = createOrderRowData(order);
                ordersDataTable.row.add(rowData);
            });
        } else {
            showEmptyState();
        }

        // DataTable'ı yeniden çiz
        ordersDataTable.draw();
        
        console.log(`${orders.length} sipariş başarıyla yüklendi.`);
        
    } catch (error) {
        console.error('Siparişler yüklenirken hata:', error);
        console.error('Hata detayları:', {
            message: error.message,
            stack: error.stack,
            url: `${window.apiService ? 'API Servisi mevcut' : 'API Servisi mevcut değil'}`
        });
        showErrorState();
        // Kullanıcı dostu hata mesajı göster
        showToast('error', 'Hata!', `Siparişler yüklenirken bir hata oluştu: ${error.message}`);
    }
}

/**
 * DataTable için yükleniyor durumunu göster
 */
function showLoadingState() {
    if (!ordersDataTable) return;
    
    try {
        // DataTable için loading processing özelliğini kullan
        ordersDataTable.processing(true);
    } catch (error) {
        console.warn('DataTable processing durumu ayarlanamadı:', error);
    }
}

/**
 * DataTable için boş durum göster (DataTable otomatik olarak halleder)
 */
function showEmptyState() {
    // DataTable otomatik olarak "No data available" mesajı gösterir
    console.log('Henüz sipariş bulunmuyor');
}

/**
 * DataTable için hata durumu göster
 */
function showErrorState() {
    if (!ordersDataTable) return;
    
    // DataTable'ı temizle ve hata mesajı göster
    ordersDataTable.clear().draw();
    showToast('error', 'Hata!', 'Veri yüklenirken hata oluştu. Lütfen internet bağlantınızı kontrol edin ve sayfayı yenileyin.');
}

/**
 * DataTable için sipariş satır verisi oluştur
 * @param {Object} order - API'den gelen sipariş verisi
 * @returns {Array} - DataTable satır verisi
 */
function createOrderRowData(order) {
    // Debug: Sipariş verisini logla
    console.log('Sipariş verisi:', order);
    
    const avatarImg = getRandomAvatar();
    const fullCustomerName = order.customerSurname ? 
        `${order.customerName} ${order.customerSurname}` : 
        order.customerName;

    return [
        // Müşteri Adı Soyadı
        `<div class="d-flex align-items-center">
            <img src="${avatarImg}" class="rounded-circle" width="40" height="40" alt="Customer Avatar">
            <div class="ms-3">
                <h6 class="fs-4 fw-semibold mb-0">${escapeHtml(fullCustomerName)}</h6>
                <span class="fw-normal text-muted">Müşteri</span>
            </div>
        </div>`,
        
        // Ürün
        `<p class="mb-0 fw-normal">${escapeHtml(order.productName)}</p>`,
        
        // Miktar
        `<span class="badge bg-info-subtle text-info">${order.quantity} adet</span>`,
        
        // Teslimat Tarihi
        `<p class="mb-0 fw-normal">${formatDate(order.deliveryDate)}</p>`,
        
        // Durum
        `${getStatusBadge(order.isDelivered)}`,
        
        // Ödeme Durumu
        `${getPaymentStatusBadge(order.isPaid)}`,
        
        // İşlemler
        `<div class="d-flex justify-content-center gap-1">
            <button class="btn btn-outline-success btn-sm" onclick="toggleOrderStatus('${order.id}', ${!order.isDelivered})" title="${order.isDelivered ? 'Bekliyor Yap' : 'Teslim Et'}">
                <i class="fas fa-${order.isDelivered ? 'undo' : 'check'}"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="deleteOrder('${order.id}', '${escapeHtml(fullCustomerName)}')" title="Sil">
                <i class="fas fa-trash"></i>
            </button>
        </div>`
    ];
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
        isPaid: orderPaymentStatusSelect.value === 'true',
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
    if (!orderPaymentStatusSelect.value) {
        orderPaymentStatusSelect.focus();
        orderPaymentStatusSelect.classList.add('is-invalid');
        showToast('error', 'Hata!', 'Ödeme durumu seçimi zorunludur.');
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
            
            // DataTable'a yeni siparişi ekle
            if (ordersDataTable) {
                const newRowData = createOrderRowData(response);
                ordersDataTable.row.add(newRowData).draw(false);
            }
            
            // Formu temizle ve modalı kapat
            addOrderForm.reset();
            addOrderModal.hide();
            
            // Başarı mesajı göster
            showToast('success', 'Başarılı!', 'Sipariş başarıyla eklendi.');
            
            // Input validasyon sınıflarını temizle
            [orderProductNameInput, orderQuantityInput, orderCustomerNameInput, orderCustomerSurnameInput, orderDeliveryDateInput, orderPaymentStatusSelect].forEach(input => {
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
 * Onaylamalı sipariş silme
 * @param {string} orderId - Sipariş ID'si (Guid)
 * @param {string} customerName - Onay için müşteri adı
 */
async function deleteOrder(orderId, customerName) {
    // SweetAlert2 kullanılabilirse modern onay penceresi, yoksa standart confirm
    let confirmed = false;
    
    if (typeof Swal !== 'undefined') {
        const result = await Swal.fire({
            title: 'Sipariş Silme Onayı',
            html: `<strong>"${customerName}"</strong> müşterisinin siparişini silmek istediğinizden emin misiniz?<br><br><small class="text-muted">Bu işlem geri alınamaz.</small>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="fas fa-trash me-2"></i>Evet, Sil',
            cancelButtonText: '<i class="fas fa-times me-2"></i>İptal',
            reverseButtons: true,
            focusCancel: true
        });
        confirmed = result.isConfirmed;
    } else {
        // Fallback: Standart browser confirm
        confirmed = confirm(`"${customerName}" müşterisinin siparişini silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz.`);
    }
    
    if (!confirmed) return;

    try {
        // Loading bildirimi göster
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Siliniyor...',
                text: 'Sipariş siliniyor, lütfen bekleyin.',
                icon: 'info',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        }
        
        // API'ye DELETE isteği gönder
        await apiService.fetchDelete(`Orders/${orderId}`);
        
        console.log(`Sipariş silindi: ${orderId} - ${customerName}`);
        
        // Başarı bildirimi
        if (typeof Swal !== 'undefined') {
            await Swal.fire({
                title: 'Başarılı!',
                text: `"${customerName}" müşterisinin siparişi başarıyla silindi.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            showToast('success', 'Başarılı!', 'Sipariş başarıyla silindi!');
        }
        
        // DataTable'dan satırı kaldır
        if (ordersDataTable) {
            // Silinen siparişin satırını bul ve kaldır
            const table = ordersDataTable;
            let rowRemoved = false;
            
            table.rows().every(function(rowIdx, tableLoop, rowLoop) {
                const rowData = this.data();
                // İşlemler sütunundaki butonlardan ID'yi çek
                if (rowData[5] && rowData[5].includes(orderId)) {
                    this.remove();
                    rowRemoved = true;
                    return false; // Loop'u durdur
                }
            });
            
            if (rowRemoved) {
                table.draw(false); // Sayfa numarasını koruyarak yeniden çiz
                console.log('Sipariş tablodan kaldırıldı');
            } else {
                console.warn('Silinecek sipariş tabloda bulunamadı, tabloyu yeniliyoruz');
                // Bulunamazsa tüm tabloyu yenile
                loadOrders();
            }
        }
        
    } catch (error) {
        console.error('Sipariş silinemedi:', error);
        
        // Hata türüne göre mesaj belirle
        let errorMessage = 'Sipariş silinirken bir hata oluştu.';
        
        if (error.message.includes('404')) {
            errorMessage = 'Sipariş bulunamadı. Sayfa yenilenecek.';
            // 404 durumunda tabloyu yenile
            setTimeout(() => loadOrders(), 2000);
        } else if (error.message.includes('403')) {
            errorMessage = 'Bu işlem için yetkiniz yok.';
        } else if (error.message.includes('500')) {
            errorMessage = 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
        }
        
        // Hata bildirimi
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Hata!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Tamam'
            });
        } else {
            showToast('error', 'Hata!', errorMessage);
        }
    }
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
        
        // DataTable'ı yeniden yükle (gerçek uygulamada sadece ilgili satırı güncelleyebiliriz)
        loadOrders();
        
        showToast('success', 'Başarılı!', `Sipariş durumu "${statusText}" olarak güncellendi.`);
        
    } catch (error) {
        console.error('Sipariş durumu güncellenirken hata:', error);
        showToast('error', 'Hata!', 'Sipariş durumu güncellenirken bir hata oluştu: ' + error.message);
    }
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
    const inputs = [orderProductNameInput, orderQuantityInput, orderCustomerNameInput, orderCustomerSurnameInput, orderDeliveryDateInput, orderPaymentStatusSelect];
    
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
    
    if (!ordersTable) {
        console.error('DataTable elementi bulunamadı');
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
    
    // Dropdown handler'larını ayarla
    setupDropdownHandlers();
    
    // Input validasyonu ayarla
    setupInputValidation();
    
    // Default teslimat tarihini ayarla
    setDefaultDeliveryDate();
    
    console.log('Siparişler sayfası başarıyla başlatıldı.');
}

// DOM yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', function() {
    // jQuery ve DataTables yüklenene kadar bekle
    function waitForDependencies() {
        if (typeof $ === 'undefined' || typeof $.fn.DataTable === 'undefined' || typeof $.fn.DataTable.Buttons === 'undefined') {
            setTimeout(waitForDependencies, 100);
        } else {
            initializeElements();
            initializeOrdersPage();
        }
    }
    
    waitForDependencies();
});

// Global erişim için window objesine ekle (debugging için)
window.ordersModule = {
    loadOrders,
    loadProductsForDropdown,
    loadCustomersForDropdown,
    toggleOrderStatus,
    deleteOrder,
    formatDate,
    getStatusBadge,
    getPaymentStatusBadge,
    initializeDataTable
};

// XSS'i önlemek için HTML kaçış fonksiyonu global olarak erişilebilir hale getir
window.escapeHtml = escapeHtml;

// Manual export functions (fallback)
window.copyTableData = function() {
    if (ordersDataTable && ordersDataTable.buttons) {
        ordersDataTable.button('copy').trigger();
    } else {
        showToast('error', 'Hata!', 'Kopyalama özelliği yüklenemedi.');
    }
};

window.exportToCSV = function() {
    if (ordersDataTable && ordersDataTable.buttons) {
        ordersDataTable.button('csv').trigger();
    } else {
        showToast('error', 'Hata!', 'CSV export özelliği yüklenemedi.');
    }
};

window.exportToExcel = function() {
    if (ordersDataTable && ordersDataTable.buttons) {
        ordersDataTable.button('excel').trigger();
    } else {
        showToast('error', 'Hata!', 'Excel export özelliği yüklenemedi.');
    }
};

window.exportToPDF = function() {
    if (ordersDataTable && ordersDataTable.buttons) {
        ordersDataTable.button('pdf').trigger();
    } else {
        showToast('error', 'Hata!', 'PDF export özelliği yüklenemedi.');
    }
};

window.printTable = function() {
    if (ordersDataTable && ordersDataTable.buttons) {
        ordersDataTable.button('print').trigger();
    } else {
        showToast('error', 'Hata!', 'Yazdırma özelliği yüklenemedi.');
    }
};
