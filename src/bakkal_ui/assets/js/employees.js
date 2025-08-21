/**
 * Çalışan Yönetimi Modülü
 * Clean Architecture backend entegrasyonu ile çalışan listeleme, ekleme ve silme işlemleri
 * DataTables kullanılarak gelişmiş tablo özellikleri
 */

// DOM Element Referansları
const employeesTableBody = document.getElementById('employees-table-body');
const addEmployeeForm = document.getElementById('add-employee-form');
const employeeNameInput = document.getElementById('employee-name-input');
const employeeSurnameInput = document.getElementById('employee-surname-input');
const employeePhoneInput = document.getElementById('employee-phone-input');

// DataTable instance
let employeesDataTable = null;

// Modal instance
let addEmployeeModal = null;

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
    if (employeesDataTable) {
        employeesDataTable.destroy();
    }

    employeesDataTable = $('#employees-datatable').DataTable({
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
                    columns: [0, 1, 2], // Çalışan, telefon, durum
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
                filename: 'calisanlar_' + new Date().toISOString().slice(0,10),
                exportOptions: {
                    columns: [0, 1, 2],
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
                filename: 'calisanlar_' + new Date().toISOString().slice(0,10),
                title: 'Çalışan Listesi',
                exportOptions: {
                    columns: [0, 1, 2],
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
                filename: 'calisanlar_' + new Date().toISOString().slice(0,10),
                title: 'Çalışan Listesi',
                orientation: 'landscape',
                pageSize: 'A4',
                exportOptions: {
                    columns: [0, 1, 2],
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
                title: 'Çalışan Listesi',
                exportOptions: {
                    columns: [0, 1, 2],
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
                targets: [3], // İşlemler sütunu
                orderable: false,
                searchable: false,
                className: "text-center"
            }
        ],
        order: [[0, 'asc']]
    });
}

/**
 * Çalışanı DataTable'a ekler
 */
function addEmployeeToDataTable(employee) {
    const avatarImg = getRandomAvatar();
    
    const rowData = [
        // Çalışan bilgisi
        `<div class="d-flex align-items-center">
            <img src="${avatarImg}" class="rounded-circle" width="40" height="40" alt="Employee Avatar">
            <div class="ms-3">
                <h6 class="fs-4 fw-semibold mb-0">${escapeHtml(employee.name)} ${escapeHtml(employee.surname)}</h6>
            </div>
        </div>`,
        
        // Telefon
        `<p class="mb-0 fw-normal">${escapeHtml(formatPhoneNumber(employee.phoneNumber))}</p>`,
        
        // Durum
        '<span class="badge bg-success-subtle text-success">Aktif</span>',
        
        // İşlemler
        `<div class="d-flex justify-content-center gap-1">
            <button class="btn btn-outline-warning btn-sm" onclick="editEmployee('${employee.id}')" title="Düzenle">
                <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="deleteEmployee('${employee.id}', '${escapeHtml(employee.name)} ${escapeHtml(employee.surname)}')" title="Sil">
                <i class="fas fa-trash"></i>
            </button>
        </div>`
    ];

    // DataTable'a satır ekle
    employeesDataTable.row.add(rowData).draw();
}

/**
 * API'den çalışan listesini çeker ve DataTable'a yerleştirir
 */
async function loadEmployees() {
    try {
        console.log('Çalışanlar yükleniyor...');

        // Yükleniyor durumunu göster
        showLoadingState();

        // API'den çalışan listesini al
        const response = await apiService.fetchGetAll('Employees');
        
        // API yanıtının yapısını kontrol et
        let employees = [];
        if (response && response.items && Array.isArray(response.items)) {
            employees = response.items;
        } else if (Array.isArray(response)) {
            employees = response;
        }

        console.log('API\'den gelen çalışan verisi:', employees);

        // DataTable'ı temizle
        if (employeesDataTable) {
            employeesDataTable.clear();
        }

        if (employees && employees.length > 0) {
            // Her çalışan için DataTable'a satır ekle
            employees.forEach(employee => {
                const avatarImg = getRandomAvatar();
                
                const rowData = [
                    // Çalışan bilgisi
                    `<div class="d-flex align-items-center">
                        <img src="${avatarImg}" class="rounded-circle" width="40" height="40" alt="Employee Avatar">
                        <div class="ms-3">
                            <h6 class="fs-4 fw-semibold mb-0">${escapeHtml(employee.name)} ${escapeHtml(employee.surname)}</h6>
                        </div>
                    </div>`,
                    
                    // Telefon
                    `<p class="mb-0 fw-normal">${escapeHtml(formatPhoneNumber(employee.phoneNumber))}</p>`,
                    
                    // Durum
                    '<span class="badge bg-success-subtle text-success">Aktif</span>',
                    
                    // İşlemler
                    `<div class="d-flex justify-content-center gap-1">
                        <button class="btn btn-outline-warning btn-sm" onclick="editEmployee('${employee.id}')" title="Düzenle">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-danger btn-sm" onclick="deleteEmployee('${employee.id}', '${escapeHtml(employee.name)} ${escapeHtml(employee.surname)}')" title="Sil">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>`
                ];

                employeesDataTable.row.add(rowData);
            });
        } else {
            showEmptyState();
        }

        // Tablo yeniden çiz
        employeesDataTable.draw();

        console.log(`${employees.length} çalışan başarıyla yüklendi.`);

    } catch (error) {
        console.error('Çalışanlar yüklenirken hata:', error);
        showErrorState();
        showToast('error', 'Hata!', 'Çalışanlar yüklenirken bir hata oluştu: ' + error.message);
    }
}

/**
 * DataTable için yükleniyor durumunu göster
 */
function showLoadingState() {
    if (!employeesDataTable) return;
    
    try {
        // DataTable için loading processing özelliğini kullan
        employeesDataTable.processing(true);
    } catch (error) {
        console.warn('DataTable processing durumu ayarlanamadı:', error);
    }
}

/**
 * DataTable için boş durum göster (DataTable otomatik olarak halleder)
 */
function showEmptyState() {
    // DataTable otomatik olarak "No data available" mesajı gösterir
    console.log('Henüz çalışan bulunmuyor');
}

/**
 * DataTable için hata durumu göster
 */
function showErrorState() {
    if (!employeesDataTable) return;
    
    // DataTable'ı temizle ve hata mesajı göster
    employeesDataTable.clear().draw();
    showNotification('Veri yüklenirken hata oluştu. Lütfen internet bağlantınızı kontrol edin ve sayfayı yenileyin.', 'error');
}

/**
 * Yeni çalışan ekleme form submit olayı
 */
function handleAddEmployeeForm(event) {
    event.preventDefault();

    // Form verilerini al
    const employeeData = {
        name: employeeNameInput.value.trim(),
        surname: employeeSurnameInput.value.trim(),
        phoneNumber: employeePhoneInput.value.trim()
    };

    // Basit validasyon
    if (!employeeData.name) {
        employeeNameInput.focus();
        employeeNameInput.classList.add('is-invalid');
        return;
    }
    if (!employeeData.surname) {
        employeeSurnameInput.focus();
        employeeSurnameInput.classList.add('is-invalid');
        return;
    }
    if (!employeeData.phoneNumber) {
        employeePhoneInput.focus();
        employeePhoneInput.classList.add('is-invalid');
        return;
    }

    // Submit butonunu devre dışı bırak
    const submitBtn = addEmployeeForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Kaydediliyor...';
    submitBtn.disabled = true;

    // API'ye POST isteği gönder
    apiService.fetchPost('Employees', employeeData)
        .then(response => {
            console.log('Çalışan başarıyla eklendi:', response);
            
            // Yeni çalışanı DataTable'a ekle
            addEmployeeToDataTable(response);
            
            // Formu temizle ve modalı kapat
            addEmployeeForm.reset();
            addEmployeeModal.hide();
            
            // Başarı mesajı göster
            showToast('success', 'Başarılı!', 'Çalışan başarıyla eklendi.');
            
            // Input validasyon sınıflarını temizle
            [employeeNameInput, employeeSurnameInput, employeePhoneInput].forEach(input => {
                input.classList.remove('is-invalid', 'is-valid');
            });
        })
        .catch(error => {
            console.error('Çalışan eklenirken hata:', error);
            showToast('error', 'Hata!', 'Çalışan eklenirken bir hata oluştu: ' + error.message);
        })
        .finally(() => {
            // Submit butonunu yeniden etkinleştir
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

/**
 * Çalışan düzenleme fonksiyonu
 */
function editEmployee(employeeId) {
    // Şimdilik basit alert, gelecekte modal ile düzenleme yapılabilir
    showToast('info', 'Bilgi', 'Çalışan düzenleme özelliği yakında eklenecek.');
    console.log('Düzenlenecek çalışan ID:', employeeId);
}

/**
 * Çalışan silme fonksiyonu
 */
async function deleteEmployee(employeeId, employeeName) {
    if (!employeeId) {
        console.error('Çalışan ID bulunamadı');
        return;
    }

    // SweetAlert2 kullanılabilirse modern onay penceresi, yoksa standart confirm
    let confirmed = false;
    
    if (typeof Swal !== 'undefined') {
        const result = await Swal.fire({
            title: 'Çalışan Silme Onayı',
            html: `<strong>"${employeeName}"</strong> çalışanını silmek istediğinizden emin misiniz?<br><br><small class="text-muted">Bu işlem geri alınamaz.</small>`,
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
        confirmed = confirm(`"${employeeName}" çalışanını silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz.`);
    }
    
    if (!confirmed) return;

    try {
        // Loading bildirimi göster
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Siliniyor...',
                text: 'Çalışan siliniyor, lütfen bekleyin.',
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
        await apiService.fetchDelete(`Employees/${employeeId}`);
        
        console.log(`Çalışan silindi: ${employeeId} - ${employeeName}`);
        
        // Başarı bildirimi
        if (typeof Swal !== 'undefined') {
            await Swal.fire({
                title: 'Başarılı!',
                text: `"${employeeName}" çalışanı başarıyla silindi.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            showToast('success', 'Başarılı!', 'Çalışan başarıyla silindi.');
        }
        
        // DataTable'dan çalışanı kaldır
        if (employeesDataTable) {
            // Silinen çalışanın satırını bul ve kaldır
            const table = employeesDataTable;
            let rowRemoved = false;
            
            table.rows().every(function(rowIdx, tableLoop, rowLoop) {
                const rowData = this.data();
                // İşlemler sütunundaki butonlardan ID'yi çek
                if (rowData[3] && rowData[3].includes(employeeId)) {
                    this.remove();
                    rowRemoved = true;
                    return false; // Loop'u durdur
                }
            });
            
            if (rowRemoved) {
                table.draw(false); // Sayfa numarasını koruyarak yeniden çiz
                console.log('Çalışan tablodan kaldırıldı');
            } else {
                console.warn('Silinecek çalışan tabloda bulunamadı, tabloyu yeniliyoruz');
                // Bulunamazsa tüm tabloyu yenile
                loadEmployees();
            }
        }
        
    } catch (error) {
        console.error('Çalışan silinemedi:', error);
        
        // Hata türüne göre mesaj belirle
        let errorMessage = 'Çalışan silinirken bir hata oluştu.';
        
        if (error.message.includes('404')) {
            errorMessage = 'Çalışan bulunamadı. Sayfa yenilenecek.';
            // 404 durumunda tabloyu yenile
            setTimeout(() => loadEmployees(), 2000);
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
 * Kullanıcıya bildirim göster (Products'tan alınan gelişmiş versiyon)
 * @param {string} message - Bildirim mesajı
 * @param {string} type - Bildirim türü (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Bildirim elementi oluştur
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Sayfaya ekle
    document.body.appendChild(notification);

    // 5 saniye sonra otomatik kaldır
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 5000);
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
    if (!employeePhoneInput) return;
    
    employeePhoneInput.addEventListener('input', function(e) {
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
    if (!employeeNameInput || !employeeSurnameInput || !employeePhoneInput) return;
    
    // Gerçek zamanlı validasyon
    [employeeNameInput, employeeSurnameInput, employeePhoneInput].forEach(input => {
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
function initializeEmployeesPage() {
    console.log('Çalışanlar sayfası başlatılıyor...');

    // Element kontrolü
    if (!addEmployeeForm) {
        console.error('Form elementi bulunamadı');
        return;
    }

    // Modal'ı başlat
    const modalElement = document.getElementById('addEmployeeModal');
    if (modalElement) {
        addEmployeeModal = new bootstrap.Modal(modalElement);
    }

    // DataTable'ı başlat
    initializeDataTable();

    // Çalışan listesini yükle
    loadEmployees();

    // Form submit olayını dinle
    addEmployeeForm.addEventListener('submit', handleAddEmployeeForm);

    // Telefon formatlaması ayarla
    setupPhoneFormatting();

    // Input validasyonu ayarla
    setupInputValidation();

    console.log('Çalışanlar sayfası başarıyla başlatıldı.');
}

// Sayfa yüklendiğinde çalıştır (jQuery ready)
$(document).ready(function() {
    initializeEmployeesPage();
});

// Global erişim için window objesine ekle (debugging için)
window.employeesModule = {
    loadEmployees,
    addEmployeeToDataTable,
    formatPhoneNumber,
    editEmployee,
    deleteEmployee,
    showNotification,
    showLoadingState,
    showEmptyState,
    showErrorState
};
