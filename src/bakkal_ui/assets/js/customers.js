/**
 * Müşteri Yönetimi Modülü
 * Clean Architecture backend entegrasyonu ile müşteri listeleme, ekleme ve silme işlemleri
 * DataTables kullanılarak gelişmiş tablo özellikleri
 */

// DOM Element Referansları
const customersTableBody = document.getElementById('customers-table-body');
const addCustomerForm = document.getElementById('add-customer-form');
const customerNameInput = document.getElementById('customer-name-input');
const customerSurnameInput = document.getElementById('customer-surname-input');
const customerPhoneInput = document.getElementById('customer-phone-input');
const customerNoteInput = document.getElementById('customer-note-input');

// DataTable instance
let customersDataTable = null;

// Modal instance
let addCustomerModal = null;

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
 * Telefon numarasını Türkiye formatına göre formatlar
 */
function formatPhoneNumber(phone) {
    if (!phone) return '';
    
    // Sadece rakamları al
    const numbers = phone.replace(/\D/g, '');
    
    // Türk telefon numarası formatı: 0XXX XXX XX XX
    if (numbers.length >= 10) {
        return numbers.replace(/(\d{4})(\d{3})(\d{2})(\d{2})/, '$1 $2 $3 $4');
    }
    
    return phone;
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
 * DataTables başlatma
 */
function initializeDataTable() {
    if (customersDataTable) {
        customersDataTable.destroy();
    }

    customersDataTable = $('#customers-datatable').DataTable({
        responsive: true,
        pageLength: 10,
        lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Tümü"]],
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.8/i18n/tr.json"
        },
        dom: 'Bfrtip',
        info: false,
        buttons: [
            {
                extend: 'copy',
                text: '<i class="fas fa-copy me-1"></i>Kopyala',
                exportOptions: {
                    columns: [0, 1, 2, 3], // Müşteri, telefon, not, durum
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
                filename: 'musteriler_' + new Date().toISOString().slice(0,10),
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
                filename: 'musteriler_' + new Date().toISOString().slice(0,10),
                title: 'Müşteri Listesi',
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
                filename: 'musteriler_' + new Date().toISOString().slice(0,10),
                title: 'Müşteri Listesi',
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
                title: 'Müşteri Listesi',
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
        columnDefs: [
            {
                targets: [4], // İşlemler sütunu
                orderable: false,
                searchable: false,
                className: "text-center"
            }
        ],
        order: [[0, 'asc']]
    });
}

/**
 * Müşteriyi DataTable'a ekler
 */
function addCustomerToDataTable(customer) {
    const avatarImg = getRandomAvatar();
    
    const rowData = [
        // Müşteri bilgisi
        `<div class="d-flex align-items-center">
            <img src="${avatarImg}" class="rounded-circle" width="40" height="40" alt="Customer Avatar">
            <div class="ms-3">
                <h6 class="fs-4 fw-semibold mb-0">${escapeHtml(customer.name)} ${escapeHtml(customer.surname)}</h6>
            </div>
        </div>`,
        
        // Telefon
        `<p class="mb-0 fw-normal">${escapeHtml(formatPhoneNumber(customer.phoneNumber))}</p>`,
        
        // Not
        customer.note ? 
            `<p class="mb-0 fw-normal">${escapeHtml(customer.note)}</p>` : 
            '<span class="text-muted">Not yok</span>',
        
        // Durum
        '<span class="badge bg-success-subtle text-success">Aktif</span>',
        
        // İşlemler
        `<div class="d-flex justify-content-center gap-1">
            <button class="btn btn-outline-warning btn-sm" onclick="editCustomer('${customer.id}')" title="Düzenle">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="deleteCustomer('${customer.id}', '${escapeHtml(customer.name)} ${escapeHtml(customer.surname)}')" title="Sil">
                <i class="fas fa-trash"></i>
            </button>
        </div>`
    ];

    // DataTable'a satır ekle
    customersDataTable.row.add(rowData).draw();
}

/**
 * API'den müşteri listesini çeker ve DataTable'a yerleştirir
 */
async function loadCustomers() {
    try {
        console.log('Müşteriler yükleniyor...');

        // API'den müşteri listesini al
        const response = await apiService.fetchGetAll('Customers');
        
        // API yanıtının yapısını kontrol et
        let customers = [];
        if (response && response.items && Array.isArray(response.items)) {
            customers = response.items;
        } else if (Array.isArray(response)) {
            customers = response;
        }

        console.log('API\'den gelen müşteri verisi:', customers);

        // DataTable'ı temizle
        if (customersDataTable) {
            customersDataTable.clear();
        }

        // Her müşteri için DataTable'a satır ekle
        customers.forEach(customer => {
            const avatarImg = getRandomAvatar();
            
            const rowData = [
                // Müşteri bilgisi
                `<div class="d-flex align-items-center">
                    <img src="${avatarImg}" class="rounded-circle" width="40" height="40" alt="Customer Avatar">
                    <div class="ms-3">
                        <h6 class="fs-4 fw-semibold mb-0">${escapeHtml(customer.name)} ${escapeHtml(customer.surname)}</h6>
                    </div>
                </div>`,
                
                // Telefon
                `<p class="mb-0 fw-normal">${escapeHtml(formatPhoneNumber(customer.phoneNumber))}</p>`,
                
                // Not
                customer.note ? 
                    `<p class="mb-0 fw-normal">${escapeHtml(customer.note)}</p>` : 
                    '<span class="text-muted">Not yok</span>',
                
                // Durum
                '<span class="badge bg-success-subtle text-success">Aktif</span>',
                
                // İşlemler
                `<div class="d-flex justify-content-center gap-1">
                    <button class="btn btn-outline-warning btn-sm" onclick="editCustomer('${customer.id}')" title="Düzenle">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm" onclick="deleteCustomer('${customer.id}', '${escapeHtml(customer.name)} ${escapeHtml(customer.surname)}')" title="Sil">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>`
            ];

            customersDataTable.row.add(rowData);
        });

        // Tablo yeniden çiz
        customersDataTable.draw();

        console.log(`${customers.length} müşteri başarıyla yüklendi.`);

    } catch (error) {
        console.error('Müşteriler yüklenirken hata:', error);
        showToast('error', 'Hata!', 'Müşteriler yüklenirken bir hata oluştu: ' + error.message);
    }
}

/**
 * Yeni müşteri ekleme form submit olayı
 */
function handleAddCustomerForm(event) {
    event.preventDefault();

    // Form verilerini al
    const customerData = {
        name: customerNameInput.value.trim(),
        surname: customerSurnameInput.value.trim(),
        phoneNumber: customerPhoneInput.value.trim(),
        note: customerNoteInput.value.trim()
    };

    // Basit validasyon
    if (!customerData.name) {
        customerNameInput.focus();
        customerNameInput.classList.add('is-invalid');
        return;
    }
    if (!customerData.surname) {
        customerSurnameInput.focus();
        customerSurnameInput.classList.add('is-invalid');
        return;
    }
    if (!customerData.phoneNumber) {
        customerPhoneInput.focus();
        customerPhoneInput.classList.add('is-invalid');
        return;
    }

    // Submit butonunu devre dışı bırak
    const submitBtn = addCustomerForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Kaydediliyor...';
    submitBtn.disabled = true;

    // API'ye POST isteği gönder
    apiService.fetchPost('Customers', customerData)
        .then(response => {
            console.log('Müşteri başarıyla eklendi:', response);
            
            // Yeni müşteriyi DataTable'a ekle
            addCustomerToDataTable(response);
            
            // Formu temizle ve modalı kapat
            addCustomerForm.reset();
            addCustomerModal.hide();
            
            // Başarı mesajı göster
            showToast('success', 'Başarılı!', 'Müşteri başarıyla eklendi.');
            
            // Input validasyon sınıflarını temizle
            [customerNameInput, customerSurnameInput, customerPhoneInput].forEach(input => {
                input.classList.remove('is-invalid', 'is-valid');
            });
        })
        .catch(error => {
            console.error('Müşteri eklenirken hata:', error);
            showToast('error', 'Hata!', 'Müşteri eklenirken bir hata oluştu: ' + error.message);
        })
        .finally(() => {
            // Submit butonunu yeniden etkinleştir
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

/**
 * Müşteri düzenleme fonksiyonu
 */
function editCustomer(customerId) {
    // Şimdilik basit alert, gelecekte modal ile düzenleme yapılabilir
    showToast('info', 'Bilgi', 'Müşteri düzenleme özelliği yakında eklenecek.');
    console.log('Düzenlenecek müşteri ID:', customerId);
}

/**
 * Müşteri silme fonksiyonu
 */
function deleteCustomer(customerId, customerName) {
    if (!customerId) {
        console.error('Müşteri ID bulunamadı');
        return;
    }

    // Kullanıcıdan onay al
    if (!confirm(`"${customerName}" adlı müşteriyi silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz.`)) {
        return;
    }

    // API'ye DELETE isteği gönder
    apiService.fetchDelete(`Customers/${customerId}`)
        .then(() => {
            console.log('Müşteri başarıyla silindi:', customerId);
            
            // DataTable'dan müşteriyi kaldır
            removeCustomerFromDataTable(customerId);
            
            // Başarı mesajı göster
            showToast('success', 'Başarılı!', 'Müşteri başarıyla silindi.');
        })
        .catch(error => {
            console.error('Müşteri silinirken hata:', error);
            showToast('error', 'Hata!', 'Müşteri silinirken bir hata oluştu: ' + error.message);
        });
}

/**
 * DataTable'dan müşteriyi kaldırır
 */
function removeCustomerFromDataTable(customerId) {
    if (!customersDataTable) return;

    // DataTable'daki satırları kontrol et ve ID'si eşleşen satırı kaldır
    customersDataTable.rows().every(function () {
        const rowData = this.data();
        const rowHtml = rowData[4]; // İşlemler sütunu
        
        // İşlemler sütunundaki butonlardan ID'yi çek
        if (rowHtml && rowHtml.includes(`onclick="deleteCustomer('${customerId}'`)) {
            this.remove();
            return false; // Loop'u durdur
        }
    });
    
    // Tabloyu yeniden çiz
    customersDataTable.draw();
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
 * Telefon numarası input formatlaması
 */
function setupPhoneFormatting() {
    if (!customerPhoneInput) return;
    
    customerPhoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, ''); // Sadece rakamları al
        
        // Türk telefon numarası formatı
        if (value.length >= 4) {
            value = value.replace(/(\d{4})(\d{0,3})(\d{0,2})(\d{0,2})/, function(match, p1, p2, p3, p4) {
                let formatted = p1;
                if (p2) formatted += ' ' + p2;
                if (p3) formatted += ' ' + p3;
                if (p4) formatted += ' ' + p4;
                return formatted;
            });
        }
        
        e.target.value = value;
    });
}

/**
 * Input validasyon olaylarını ayarla
 */
function setupInputValidation() {
    if (!customerNameInput || !customerSurnameInput || !customerPhoneInput) return;
    
    // Gerçek zamanlı validasyon
    [customerNameInput, customerSurnameInput, customerPhoneInput].forEach(input => {
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
 * Sayfa yüklendiğinde çalışacak initialization fonksiyonu
 */
function initializeCustomersPage() {
    console.log('Müşteriler sayfası başlatılıyor...');

    // Element kontrolü
    if (!addCustomerForm) {
        console.error('Form elementi bulunamadı');
        return;
    }

    // Modal'ı başlat
    const modalElement = document.getElementById('addCustomerModal');
    if (modalElement) {
        addCustomerModal = new bootstrap.Modal(modalElement);
    }

    // DataTable'ı başlat
    initializeDataTable();

    // Müşteri listesini yükle
    loadCustomers();

    // Form submit olayını dinle
    addCustomerForm.addEventListener('submit', handleAddCustomerForm);

    // Telefon formatlaması ayarla
    setupPhoneFormatting();

    // Input validasyonu ayarla
    setupInputValidation();

    console.log('Müşteriler sayfası başarıyla başlatıldı.');
}

// Sayfa yüklendiğinde çalıştır (jQuery ready)
$(document).ready(function() {
    initializeCustomersPage();
});

// Global erişim için window objesine ekle (debugging için)
window.customersModule = {
    loadCustomers,
    addCustomerToDataTable,
    removeCustomerFromDataTable,
    formatPhoneNumber,
    editCustomer,
    deleteCustomer
};
