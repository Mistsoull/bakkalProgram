/**
 * Tedarikçiler Sayfa Yönetimi
 * apiService.js tabanlı, clean code prensipleriyle yazılmış tedarikçi yönetim modülü
 */

// DOM Element Referansları
let suppliersTable;
let suppliersDataTable;
let addSupplierForm;
let editSupplierForm;
let addSupplierModal;
let editSupplierModal;

// Bootstrap Modal Instances
let addModalInstance;
let editModalInstance;

/**
 * Tedarikçi türlerine göre ikon haritası
 */
const SUPPLIER_ICON_MAP = {
    'gıda': 'fas fa-utensils text-success',
    'market': 'fas fa-shopping-cart text-primary',
    'süt': 'fas fa-glass-whiskey text-info',
    'ekmek': 'fas fa-bread-slice text-warning',
    'et': 'fas fa-drumstick-bite text-danger',
    'temizlik': 'fas fa-soap text-secondary',
    'teknoloji': 'fas fa-laptop text-primary',
    'kırtasiye': 'fas fa-pen text-secondary',
    'default': 'fas fa-building text-primary'
};

/**
 * Tedarikçi adına göre uygun ikon döndürür
 * @param {string} supplierName - Tedarikçi adı
 * @returns {string} - Font Awesome ikon sınıfı
 */
function getSupplierIcon(supplierName) {
    if (!supplierName) return SUPPLIER_ICON_MAP.default;
    
    const normalizedName = supplierName.toLowerCase()
        .replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u')
        .replace(/ç/g, 'c').replace(/ı/g, 'i').replace(/ö/g, 'o')
        .trim();
    
    // Kısmi eşleşme ara
    for (const [key, icon] of Object.entries(SUPPLIER_ICON_MAP)) {
        if (normalizedName.includes(key) || key.includes(normalizedName)) {
            return icon;
        }
    }
    
    return SUPPLIER_ICON_MAP.default;
}

// DOM yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', function() {
    waitForDependencies();
});

/**
 * jQuery ve DataTables bağımlılıklarını bekle
 */
function waitForDependencies() {
    if (typeof $ === 'undefined' || typeof $.fn.DataTable === 'undefined' || typeof $.fn.DataTable.Buttons === 'undefined') {
        setTimeout(waitForDependencies, 100);
    } else {
        initializeElements();
        setupEventListeners();
        loadSuppliers();
    }
}

/**
 * DOM element referanslarını başlat
 */
function initializeElements() {
    // DataTable
    suppliersTable = document.getElementById('suppliers-datatable');
    
    // Forms
    addSupplierForm = document.getElementById('add-supplier-form');
    editSupplierForm = document.getElementById('edit-supplier-form');
    
    // Modals
    addSupplierModal = document.getElementById('addSupplierModal');
    editSupplierModal = document.getElementById('editSupplierModal');
    
    // Bootstrap Modal Instances
    if (addSupplierModal) {
        addModalInstance = new bootstrap.Modal(addSupplierModal);
    }
    if (editSupplierModal) {
        editModalInstance = new bootstrap.Modal(editSupplierModal);
    }
    
    // DataTable'ı başlat
    if (suppliersTable) {
        initializeDataTable();
    }
}

/**
 * DataTable'ı başlat
 */
function initializeDataTable() {
    if (!suppliersTable) return;
    
    try {
        console.log('Suppliers DataTable başlatılıyor...');
        
        suppliersDataTable = $(suppliersTable).DataTable({
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
                        columns: [0, 1, 2, 3],
                        format: {
                            body: function (data, row, column, node) {
                                return data.replace(/<.*?>/g, '').trim();
                            }
                        }
                    }
                },
                {
                    extend: 'csv',
                    text: '<i class="fas fa-file-csv me-1"></i>CSV',
                    filename: 'tedarikciler_' + new Date().toISOString().slice(0,10),
                    exportOptions: {
                        columns: [0, 1, 2, 3],
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
                    filename: 'tedarikciler_' + new Date().toISOString().slice(0,10),
                    title: 'Tedarikçi Listesi',
                    exportOptions: {
                        columns: [0, 1, 2, 3],
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
                    filename: 'tedarikciler_' + new Date().toISOString().slice(0,10),
                    title: 'Tedarikçi Listesi',
                    orientation: 'landscape',
                    pageSize: 'A4',
                    exportOptions: {
                        columns: [0, 1, 2, 3],
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
                    title: 'Tedarikçi Listesi',
                    exportOptions: {
                        columns: [0, 1, 2, 3],
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
            order: [[1, 'asc']], // Firma adına göre alfabetik sırala (1. index şimdi firma adı)
            columnDefs: [
                {
                    targets: [4], // İşlemler sütunu (en son)
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
        
        console.log('Suppliers DataTable başarıyla başlatıldı');
        
    } catch (error) {
        console.error('Suppliers DataTable başlatılamadı:', error);
    }
}

/**
 * Olay dinleyicilerini kur
 */
function setupEventListeners() {
    // Add form submit
    if (addSupplierForm) {
        addSupplierForm.addEventListener('submit', handleAddFormSubmit);
    }
    
    // Edit form submit
    if (editSupplierForm) {
        editSupplierForm.addEventListener('submit', handleEditFormSubmit);
    }
}

/**
 * API'den tedarikçileri yükle ve DataTable'a ekle
 */
async function loadSuppliers() {
    if (!suppliersDataTable) {
        console.warn('DataTable henüz başlatılmamış');
        return;
    }

    try {
        showLoadingState();

        const response = await window.apiService.fetchGetAll('Suppliers');
        const suppliers = response.items || response;
        
        console.log('Tedarikçiler:', suppliers);

        suppliersDataTable.clear();

        if (suppliers && suppliers.length > 0) {
            suppliers.forEach(supplier => {
                const rowData = createSupplierRowData(supplier);
                suppliersDataTable.row.add(rowData);
            });
        } else {
            showEmptyState();
        }

        suppliersDataTable.draw();

    } catch (error) {
        console.error('Tedarikçiler yüklenemedi:', error);
        showErrorState();
        showNotification(`Tedarikçiler yüklenirken bir hata oluştu: ${error.message}`, 'error');
    }
}

/**
 * DataTable için yükleniyor durumunu göster
 */
function showLoadingState() {
    if (!suppliersDataTable) return;
    
    try {
        suppliersDataTable.processing(true);
    } catch (error) {
        console.warn('DataTable processing durumu ayarlanamadı:', error);
    }
}

/**
 * DataTable için boş durum göster
 */
function showEmptyState() {
    console.log('Henüz tedarikçi bulunmuyor');
}

/**
 * DataTable için hata durumu göster
 */
function showErrorState() {
    if (!suppliersDataTable) return;
    
    suppliersDataTable.clear().draw();
    showNotification('Veri yüklenirken hata oluştu. Lütfen internet bağlantınızı kontrol edin ve sayfayı yenileyin.', 'error');
}

/**
 * DataTable için tedarikçi satır verisi oluştur
 * @param {Object} supplier - API'den gelen tedarikçi verisi
 * @returns {Array} - DataTable satır verisi
 */
function createSupplierRowData(supplier) {
    console.log('Tedarikçi verisi işleniyor:', supplier);

    const supplierIcon = getSupplierIcon(supplier.companyName || supplier.nameSurname);

    return [
        // İletişim Kişisi (en başa)
        `<div class="fs-3">
            <i class="fas fa-user text-secondary me-2"></i>
            ${supplier.nameSurname ? escapeHtml(supplier.nameSurname) : '<span class="text-muted">-</span>'}
        </div>`,
        
        // Firma Adı (sadece firma adı)
        `<div class="d-flex align-items-center">
            <div class="me-3">
                <i class="${supplierIcon} fs-5"></i>
            </div>
            <div>
                <h6 class="fs-4 fw-semibold mb-0">${escapeHtml(supplier.companyName)}</h6>
            </div>
        </div>`,
        
        // İletişim (sadece telefon)
        `<div class="fs-3">
            <i class="fas fa-phone text-primary me-2"></i>
            ${supplier.phoneNumber ? escapeHtml(supplier.phoneNumber) : '<span class="text-muted">-</span>'}
        </div>`,
        
        // Not
        `<div class="fs-3">${supplier.note ? escapeHtml(supplier.note) : '<span class="text-muted">-</span>'}</div>`,
        
        // İşlemler
        `<div class="d-flex gap-1">
            <button class="btn btn-outline-warning btn-sm" onclick="editSupplier('${supplier.id}')" title="Düzenle">
                <i class="ti ti-edit fs-6"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="deleteSupplier('${supplier.id}', '${escapeHtml(supplier.companyName)}')" title="Sil">
                <i class="ti ti-trash fs-6"></i>
            </button>
        </div>`
    ];
}

/**
 * Yeni tedarikçi ekleme form gönderimini işle
 * @param {Event} event - Form gönderim olayı
 */
async function handleAddFormSubmit(event) {
    event.preventDefault();

    const companyName = document.getElementById('supplier-name-input').value.trim();
    const phoneNumber = document.getElementById('supplier-phone-input').value.trim();
    const nameSurname = document.getElementById('supplier-contact-input').value.trim();
    const note = document.getElementById('supplier-address-input').value.trim();

    // Girdiyi doğrula
    if (!companyName) {
        showNotification('Lütfen firma adını giriniz.', 'warning');
        document.getElementById('supplier-name-input').focus();
        return;
    }

    const submitButton = addSupplierForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="ti ti-loader-2 me-2 spin"></i>Kaydediliyor...';
    submitButton.disabled = true;

    try {
        const supplierData = {
            companyName: companyName,
            nameSurname: nameSurname || '',
            phoneNumber: phoneNumber || '',
            note: note ? note.trim() : null
        };

        console.log('Gönderilen tedarikçi verisi:', supplierData);

        const newSupplier = await window.apiService.fetchPost('Suppliers', supplierData);

        if (newSupplier) {
            // Formu temizle
            addSupplierForm.reset();

            // Modal'ı kapat
            addModalInstance.hide();

            // Başarı mesajı göster
            showNotification('Tedarikçi başarıyla eklendi!', 'success');

            // Tabloyu yenile
            loadSuppliers();
        }
    } catch (error) {
        console.error('Tedarikçi ekleme hatası:', error);
        showNotification(error.message || 'Tedarikçi eklenirken bir hata oluştu.', 'error');
    } finally {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    }
}

/**
 * Tedarikçi düzenleme form gönderimini işle
 * @param {Event} event - Form gönderim olayı
 */
async function handleEditFormSubmit(event) {
    event.preventDefault();

    const supplierId = document.getElementById('edit-supplier-id').value;
    const companyName = document.getElementById('edit-supplier-name-input').value.trim();
    const phoneNumber = document.getElementById('edit-supplier-phone-input').value.trim();
    const nameSurname = document.getElementById('edit-supplier-contact-input').value.trim();
    const note = document.getElementById('edit-supplier-address-input').value.trim();

    // Girdiyi doğrula
    if (!companyName) {
        showNotification('Lütfen firma adını giriniz.', 'warning');
        document.getElementById('edit-supplier-name-input').focus();
        return;
    }

    const submitButton = editSupplierForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="ti ti-loader-2 me-2 spin"></i>Güncelleniyor...';
    submitButton.disabled = true;

    try {
        const supplierData = {
            id: supplierId,
            companyName: companyName,
            nameSurname: nameSurname || '',
            phoneNumber: phoneNumber || '',
            note: note || null
        };

        const updatedSupplier = await window.apiService.fetchPut('Suppliers', supplierData);

        if (updatedSupplier) {
            // Modal'ı kapat
            editModalInstance.hide();

            // Başarı mesajı göster
            showNotification('Tedarikçi başarıyla güncellendi!', 'success');
            
            // Tabloyu yenile
            loadSuppliers();
        }
    } catch (error) {
        console.error('Tedarikçi güncellenemedi:', error);
        showNotification(`Tedarikçi güncellenirken bir hata oluştu: ${error.message}`, 'error');
    } finally {
        submitButton.innerHTML = originalButtonText;
        submitButton.disabled = false;
    }
}

/**
 * Tedarikçiyi düzenle
 * @param {string} supplierId - Tedarikçi ID'si (Guid)
 */
async function editSupplier(supplierId) {
    try {
        const supplier = await window.apiService.fetchGetById('Suppliers', supplierId);
        
        // Edit form alanlarını doldur
        document.getElementById('edit-supplier-id').value = supplier.id;
        document.getElementById('edit-supplier-name-input').value = supplier.companyName || '';
        document.getElementById('edit-supplier-phone-input').value = supplier.phoneNumber || '';
        document.getElementById('edit-supplier-contact-input').value = supplier.nameSurname || '';
        document.getElementById('edit-supplier-address-input').value = supplier.note || '';
        
        // Modal'ı aç
        editModalInstance.show();
        
    } catch (error) {
        console.error('Tedarikçi bilgileri alınamadı:', error);
        showNotification('Tedarikçi bilgileri yüklenemedi.', 'error');
    }
}

/**
 * Onaylamalı tedarikçi silme
 * @param {string} supplierId - Tedarikçi ID'si (Guid)
 * @param {string} supplierName - Onay için tedarikçi adı
 */
async function deleteSupplier(supplierId, supplierName) {
    let confirmed = false;
    
    if (typeof Swal !== 'undefined') {
        const result = await Swal.fire({
            title: 'Tedarikçi Silme Onayı',
            html: `<strong>"${supplierName}"</strong> tedarikçisini silmek istediğinizden emin misiniz?<br><br><small class="text-muted">Bu işlem geri alınamaz.</small>`,
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
        confirmed = confirm(`"${supplierName}" tedarikçisini silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz.`);
    }
    
    if (!confirmed) return;

    try {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Siliniyor...',
                text: 'Tedarikçi siliniyor, lütfen bekleyin.',
                icon: 'info',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        }
        
        await window.apiService.fetchDelete(`Suppliers/${supplierId}`);
        
        console.log(`Tedarikçi silindi: ${supplierId}`);
        
        if (typeof Swal !== 'undefined') {
            await Swal.fire({
                title: 'Başarılı!',
                text: `"${supplierName}" tedarikçisi başarıyla silindi.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            showNotification('Tedarikçi başarıyla silindi!', 'success');
        }
        
        // Tabloyu yenile
        loadSuppliers();
        
    } catch (error) {
        console.error('Tedarikçi silinemedi:', error);
        
        let errorMessage = 'Tedarikçi silinirken bir hata oluştu.';
        
        if (error.message.includes('404')) {
            errorMessage = 'Tedarikçi bulunamadı. Sayfa yenilenecek.';
            setTimeout(() => loadSuppliers(), 2000);
        } else if (error.message.includes('403')) {
            errorMessage = 'Bu işlem için yetkiniz yok.';
        } else if (error.message.includes('500')) {
            errorMessage = 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
        }
        
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Hata!',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'Tamam'
            });
        } else {
            showNotification(errorMessage, 'error');
        }
    }
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
}

/**
 * XSS'i önlemek için HTML kaçış
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
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Spinner animasyonu için CSS ekle
const style = document.createElement('style');
style.textContent = `
    .spin {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .table th, .table td {
        vertical-align: middle;
    }
    
    .btn-group-sm .btn {
        padding: 0.25rem 0.5rem;
        font-size: 0.875rem;
    }
`;
document.head.appendChild(style);

// Global erişim için fonksiyonları dışa aktar
window.editSupplier = editSupplier;
window.deleteSupplier = deleteSupplier;

console.log('Suppliers module loaded successfully');
