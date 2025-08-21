/**
 * Veresiye Yönetimi Modülü
 * Clean Architecture backend entegrasyonu ile veresiye listeleme, ekleme ve silme işlemleri
 * Employee ve Customer entegrasyonu ile dropdown ve manuel giriş desteği
 */

// DOM Element Referansları
let onCreditTable;
let onCreditDataTable;
const addOnCreditForm = document.getElementById('add-oncredit-form');

// Form elementleri
const creditTypeEmployee = document.getElementById('creditTypeEmployee');
const creditTypeCustomer = document.getElementById('creditTypeCustomer');
const employeeSection = document.getElementById('employeeSection');
const customerSection = document.getElementById('customerSection');

// Employee elements
const onCreditEmployeeSelect = document.getElementById('oncredit-employee-select');
const onCreditEmployeeNameInput = document.getElementById('oncredit-employee-name-input');
const onCreditEmployeeSurnameInput = document.getElementById('oncredit-employee-surname-input');

// Customer elements
const onCreditCustomerSelect = document.getElementById('oncredit-customer-select');
const onCreditCustomerNameInput = document.getElementById('oncredit-customer-name-input');
const onCreditCustomerSurnameInput = document.getElementById('oncredit-customer-surname-input');

// Common elements
const onCreditTotalAmountInput = document.getElementById('oncredit-total-amount-input');
const onCreditNoteInput = document.getElementById('oncredit-note-input');

// Summary elements
const totalAmountElement = document.getElementById('total-amount');
const unpaidAmountElement = document.getElementById('unpaid-amount');
const paidAmountElement = document.getElementById('paid-amount');

// Modal instance
let addOnCreditModal = null;

// Avatar resim yolları
const avatarImages = [
    '../assets/images/profile/user-1.jpg',
    '../assets/images/profile/user-2.jpg',
    '../assets/images/profile/user-3.jpg',
    '../assets/images/profile/user-4.jpg',
    '../assets/images/profile/user-5.jpg',
    '../assets/images/profile/user-6.jpg',
    '../assets/images/profile/user-7.jpg',
    '../assets/images/profile/user-8.jpg'
];

/**
 * Rastgele avatar resmi döndürür
 */
function getRandomAvatar() {
    return avatarImages[Math.floor(Math.random() * avatarImages.length)];
}

/**
 * DataTable'ı başlat
 */
function initializeDataTable() {
    if (!onCreditTable) return;
    
    try {
        console.log('OnCredit DataTable başlatılıyor...');
        
        // jQuery ve DataTables yüklenene kadar bekle
        if (typeof $ === 'undefined' || typeof $.fn.DataTable === 'undefined' || typeof $.fn.DataTable.Buttons === 'undefined') {
            console.log('jQuery veya DataTables henüz yüklenmedi, bekleniyor...');
            setTimeout(initializeDataTable, 100);
            return;
        }

        // Mevcut DataTable'ı temizle
        if (onCreditDataTable) {
            onCreditDataTable.destroy();
            onCreditDataTable = null;
        }
        
        console.log('jQuery sürümü:', $.fn.jquery);
        console.log('DataTables mevcut:', !!$.fn.DataTable);
        console.log('Buttons mevcut:', !!$.fn.DataTable.Buttons);
        
        onCreditDataTable = $(onCreditTable).DataTable({
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
                        columns: [0, 1, 2, 3, 4], // Kişi, Tip, Tutar, Not, Durum
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
                    filename: 'veresiye_kayitlari_' + new Date().toISOString().slice(0,10),
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4],
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
                    filename: 'veresiye_kayitlari_' + new Date().toISOString().slice(0,10),
                    title: 'Veresiye Kayıtları',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4],
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
                    filename: 'veresiye_kayitlari_' + new Date().toISOString().slice(0,10),
                    title: 'Veresiye Kayıtları',
                    orientation: 'landscape',
                    pageSize: 'A4',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4],
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
                    title: 'Veresiye Kayıtları',
                    exportOptions: {
                        columns: [0, 1, 2, 3, 4],
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
            order: [[0, 'asc']], // Kişi adına göre alfabetik sırala
            columnDefs: [
                {
                    targets: [5], // İşlemler sütunu
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
                
                // Event delegation için click handler'ları yeniden ata
                bindTableEventHandlers();
            }
        });
        
        // Button stillerini uygula - products.js'teki gibi
        $('.dt-buttons .btn').removeClass('dt-button').addClass('me-2 mb-2');
        
        console.log('OnCredit DataTable başarıyla başlatıldı');
        console.log('Buttons mevcut:', !!onCreditDataTable.buttons);
        
    } catch (error) {
        console.error('DataTable başlatılırken hata oluştu:', error);
    }
}

/**
 * Tablo event handler'larını bağla
 */
function bindTableEventHandlers() {
    // Payment status toggle butonları
    $(onCreditTable).off('click', '.payment-toggle-btn').on('click', '.payment-toggle-btn', function(e) {
        e.preventDefault();
        const onCreditId = $(this).data('id');
        const newStatus = $(this).data('status');
        togglePaymentStatus(onCreditId, newStatus);
    });
    
    // Delete butonları
    $(onCreditTable).off('click', '.delete-btn').on('click', '.delete-btn', function(e) {
        e.preventDefault();
        const onCreditId = $(this).data('id');
        handleDeleteOnCredit(onCreditId);
    });
}
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
 * Para formatlaması
 */
function formatCurrency(amount) {
    if (typeof amount !== 'number') {
        amount = parseFloat(amount) || 0;
    }
    return `₺${amount.toFixed(2)}`;
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
 * Kişi türünü badge ile gösterir
 */
function getPersonTypeBadge(hasEmployee, hasCustomer) {
    if (hasEmployee) {
        return '<span class="badge bg-primary-subtle text-primary"><i class="fas fa-user-tie me-1"></i>Çalışan</span>';
    } else if (hasCustomer) {
        return '<span class="badge bg-info-subtle text-info"><i class="fas fa-user-friends me-1"></i>Müşteri</span>';
    } else {
        return '<span class="badge bg-secondary-subtle text-secondary">Bilinmiyor</span>';
    }
}

/**
 * Veresiye türüne göre bölümü gösterir/gizler
 */
function toggleCreditSections() {
    console.log('toggleCreditSections çağrıldı');
    
    if (!creditTypeEmployee || !creditTypeCustomer || !employeeSection || !customerSection) {
        console.error('Radio butonlar veya section elementler bulunamadı');
        return;
    }
    
    const isEmployee = creditTypeEmployee.checked;
    console.log('Seçilen tip:', isEmployee ? 'Employee' : 'Customer');
    
    if (isEmployee) {
        employeeSection.style.display = 'block';
        customerSection.style.display = 'none';
        
        // Employee alanlarını zorunlu yap
        if (onCreditEmployeeNameInput) {
            onCreditEmployeeNameInput.setAttribute('required', 'required');
        }
        if (onCreditCustomerNameInput) {
            onCreditCustomerNameInput.removeAttribute('required');
        }
        
        // Customer alanlarını temizle
        if (onCreditCustomerSelect) onCreditCustomerSelect.value = '';
        if (onCreditCustomerNameInput) onCreditCustomerNameInput.value = '';
        if (onCreditCustomerSurnameInput) onCreditCustomerSurnameInput.value = '';
    } else {
        employeeSection.style.display = 'none';
        customerSection.style.display = 'block';
        
        // Customer alanlarını zorunlu yap
        if (onCreditCustomerNameInput) {
            onCreditCustomerNameInput.setAttribute('required', 'required');
        }
        if (onCreditEmployeeNameInput) {
            onCreditEmployeeNameInput.removeAttribute('required');
        }
        
        // Employee alanlarını temizle
        if (onCreditEmployeeSelect) onCreditEmployeeSelect.value = '';
        if (onCreditEmployeeNameInput) onCreditEmployeeNameInput.value = '';
        if (onCreditEmployeeSurnameInput) onCreditEmployeeSurnameInput.value = '';
    }
}

/**
 * API'den employee listesini çeker ve dropdown'ı doldurur
 */
async function loadEmployeesForDropdown() {
    try {
        console.log('Çalışanlar dropdown için yükleniyor...');
        
        if (!onCreditEmployeeSelect) {
            console.error('onCreditEmployeeSelect elementi bulunamadı');
            return;
        }
        
        const response = await apiService.fetchGetAll('Employees');
        
        let employees = [];
        if (response && response.items && Array.isArray(response.items)) {
            employees = response.items;
        } else if (Array.isArray(response)) {
            employees = response;
        }
        
        console.log('API\'den gelen çalışan verisi:', employees);
        
        // Dropdown'ı temizle
        onCreditEmployeeSelect.innerHTML = '<option value="">Çalışan Seç (Opsiyonel)</option>';
        
        // Çalışanları dropdown'a ekle
        employees.forEach(employee => {
            const option = document.createElement('option');
            option.value = employee.id;
            option.textContent = `${employee.name} ${employee.surname} - ${employee.position || 'Pozisyon Belirtilmemiş'}`;
            option.dataset.employeeName = employee.name;
            option.dataset.employeeSurname = employee.surname || '';
            onCreditEmployeeSelect.appendChild(option);
        });
        
        console.log(`${employees.length} çalışan dropdown'a eklendi.`);
        
    } catch (error) {
        console.error('Çalışanlar yüklenirken hata:', error);
        showToast('error', 'Hata!', 'Çalışanlar yüklenirken bir hata oluştu: ' + error.message);
    }
}

/**
 * API'den customer listesini çeker ve dropdown'ı doldurur
 */
async function loadCustomersForDropdown() {
    try {
        console.log('Müşteriler dropdown için yükleniyor...');
        
        if (!onCreditCustomerSelect) {
            console.error('onCreditCustomerSelect elementi bulunamadı');
            return;
        }
        
        const response = await apiService.fetchGetAll('Customers');
        
        let customers = [];
        if (response && response.items && Array.isArray(response.items)) {
            customers = response.items;
        } else if (Array.isArray(response)) {
            customers = response;
        }
        
        console.log('API\'den gelen müşteri verisi:', customers);
        
        // Dropdown'ı temizle
        onCreditCustomerSelect.innerHTML = '<option value="">Müşteri Seç (Opsiyonel)</option>';
        
        // Müşterileri dropdown'a ekle
        customers.forEach(customer => {
            const option = document.createElement('option');
            option.value = customer.id;
            option.textContent = `${customer.name} ${customer.surname}`;
            option.dataset.customerName = customer.name;
            option.dataset.customerSurname = customer.surname || '';
            onCreditCustomerSelect.appendChild(option);
        });
        
        console.log(`${customers.length} müşteri dropdown'a eklendi.`);
        
    } catch (error) {
        console.error('Müşteriler yüklenirken hata:', error);
        showToast('error', 'Hata!', 'Müşteriler yüklenirken bir hata oluştu: ' + error.message);
    }
}

/**
 * API'den veresiye listesini çeker ve DataTable'a yerleştirir
 */
async function loadOnCredits() {
    try {
        console.log('Veresiye kayıtları yükleniyor...');
        
        const response = await apiService.fetchGetAll('OnCredits');
        
        let onCredits = [];
        if (response && response.items && Array.isArray(response.items)) {
            onCredits = response.items;
        } else if (Array.isArray(response)) {
            onCredits = response;
        }
        
        console.log('API\'den gelen veresiye verisi:', onCredits);
        
        // DataTable hazır olana kadar bekle
        const waitForDataTable = () => {
            return new Promise((resolve) => {
                const checkDataTable = () => {
                    if (onCreditDataTable && typeof onCreditDataTable.clear === 'function') {
                        resolve();
                    } else {
                        setTimeout(checkDataTable, 50);
                    }
                };
                checkDataTable();
            });
        };
        
        await waitForDataTable();
        
        // DataTable varsa clear yap
        if (onCreditDataTable) {
            onCreditDataTable.clear();
        }
        
        // Her veresiye kaydı için DataTable row'u oluştur
        onCredits.forEach(onCredit => {
            const avatarImg = getRandomAvatar();
            
            // Kişi bilgisini belirle (Employee veya Customer)
            let personName = '';
            let personSubtitle = '';
            let hasEmployee = false;
            let hasCustomer = false;
            
            if (onCredit.employeeName) {
                hasEmployee = true;
                personName = onCredit.employeeSurname ? 
                    `${onCredit.employeeName} ${onCredit.employeeSurname}` : 
                    onCredit.employeeName;
                personSubtitle = 'Otel Çalışanı';
            } else if (onCredit.customerName) {
                hasCustomer = true;
                personName = onCredit.customerSurname ? 
                    `${onCredit.customerName} ${onCredit.customerSurname}` : 
                    onCredit.customerName;
                personSubtitle = 'Müşteri';
            } else {
                personName = 'Bilinmiyor';
                personSubtitle = 'Tanımlanmamış';
            }
            
            // DataTable row data
            const rowData = [
                // Kişi
                `<div class="d-flex align-items-center">
                    <img src="${avatarImg}" class="rounded-circle" width="40" height="40" alt="Person Avatar">
                    <div class="ms-3">
                        <h6 class="fs-4 fw-semibold mb-0">${escapeHtml(personName)}</h6>
                        <span class="fw-normal text-muted">${escapeHtml(personSubtitle)}</span>
                    </div>
                </div>`,
                
                // Tip
                getPersonTypeBadge(hasEmployee, hasCustomer),
                
                // Tutar
                `<h6 class="fs-4 fw-semibold mb-0 ${onCredit.isPaid ? 'text-success' : 'text-warning'}">${formatCurrency(onCredit.totalAmount)}</h6>`,
                
                // Not
                onCredit.note ? 
                    `<p class="mb-0 fw-normal">${escapeHtml(onCredit.note)}</p>` : 
                    '<span class="text-muted">Not yok</span>',
                
                // Durum
                getPaymentStatusBadge(onCredit.isPaid),
                
                // İşlemler
                `<div class="d-flex gap-1">
                    <button class="btn btn-outline-warning btn-sm payment-toggle-btn" 
                            data-id="${onCredit.id}" 
                            data-status="${!onCredit.isPaid}"
                            title="${onCredit.isPaid ? 'Ödenmedi Yap' : 'Ödendi Yap'}">
                        <i class="ti ti-${onCredit.isPaid ? 'refresh' : 'check'} fs-6"></i>
                    </button>
                    <button class="btn btn-outline-danger btn-sm delete-btn" 
                            data-id="${onCredit.id}" 
                            title="Sil">
                        <i class="ti ti-trash fs-6"></i>
                    </button>
                </div>`
            ];
            
            // DataTable'a row ekle
            if (onCreditDataTable) {
                onCreditDataTable.row.add(rowData);
            }
        });
        
        // DataTable'ı yeniden çiz
        if (onCreditDataTable) {
            onCreditDataTable.draw();
            console.log('DataTable yeniden çizildi');
        }
        
        // Özeti güncelle
        updateSummary(onCredits);
        
        console.log(`${onCredits.length} veresiye kaydı başarıyla DataTable'a yüklendi.`);
        
    } catch (error) {
        console.error('Veresiye kayıtları yüklenirken hata:', error);
        showToast('error', 'Hata!', 'Veresiye kayıtları yüklenirken bir hata oluştu: ' + error.message);
    }
}

/**
 * Özet bilgilerini günceller
 */
function updateSummary(onCredits) {
    let totalAmount = 0;
    let paidAmount = 0;
    let unpaidAmount = 0;
    
    onCredits.forEach(onCredit => {
        const amount = parseFloat(onCredit.totalAmount) || 0;
        totalAmount += amount;
        
        if (onCredit.isPaid) {
            paidAmount += amount;
        } else {
            unpaidAmount += amount;
        }
    });
    
    totalAmountElement.textContent = formatCurrency(totalAmount);
    paidAmountElement.textContent = formatCurrency(paidAmount);
    unpaidAmountElement.textContent = formatCurrency(unpaidAmount);
}

/**
 * Yeni veresiye ekleme form submit olayı
 */
function handleAddOnCreditForm(event) {
    event.preventDefault();
    
    const isEmployee = creditTypeEmployee.checked;
    
    // Form verilerini al
    const onCreditData = {
        employeeName: isEmployee ? (onCreditEmployeeNameInput.value.trim() || null) : null,
        employeeSurname: isEmployee ? (onCreditEmployeeSurnameInput.value.trim() || null) : null,
        customerName: !isEmployee ? (onCreditCustomerNameInput.value.trim() || null) : null,
        customerSurname: !isEmployee ? (onCreditCustomerSurnameInput.value.trim() || null) : null,
        note: onCreditNoteInput.value.trim() || null,
        isPaid: false, // Yeni veresiye kayıtları her zaman ödenmemiş olarak başlar
        totalAmount: parseFloat(onCreditTotalAmountInput.value) || 0,
        employeeId: isEmployee ? (onCreditEmployeeSelect.value || null) : null,
        customerId: !isEmployee ? (onCreditCustomerSelect.value || null) : null
    };
    
    // Basit validasyon
    if (isEmployee && !onCreditData.employeeName) {
        onCreditEmployeeNameInput.focus();
        onCreditEmployeeNameInput.classList.add('is-invalid');
        showToast('error', 'Hata!', 'Çalışan adı zorunludur.');
        return;
    }
    
    if (!isEmployee && !onCreditData.customerName) {
        onCreditCustomerNameInput.focus();
        onCreditCustomerNameInput.classList.add('is-invalid');
        showToast('error', 'Hata!', 'Müşteri adı zorunludur.');
        return;
    }
    
    if (onCreditData.totalAmount <= 0) {
        onCreditTotalAmountInput.focus();
        onCreditTotalAmountInput.classList.add('is-invalid');
        showToast('error', 'Hata!', 'Geçerli bir tutar giriniz.');
        return;
    }
    
    console.log('Gönderilecek veresiye verisi:', onCreditData);
    console.log('JSON string:', JSON.stringify(onCreditData, null, 2));
    
    // Submit butonunu devre dışı bırak
    const submitBtn = addOnCreditForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Kaydediliyor...';
    submitBtn.disabled = true;
    
    // API'ye POST isteği gönder
    apiService.fetchPost('OnCredits', onCreditData)
        .then(response => {
            console.log('Veresiye kaydı başarıyla eklendi:', response);
            
            // Listeyi yeniden yükle
            loadOnCredits();
            
            // Formu temizle ve modalı kapat
            addOnCreditForm.reset();
            addOnCreditModal.hide();
            
            // Radio butonları ve section'ları sıfırla
            creditTypeEmployee.checked = true;
            toggleCreditSections();
            
            // Başarı mesajı göster
            showToast('success', 'Başarılı!', 'Veresiye kaydı başarıyla eklendi.');
            
            // Input validasyon sınıflarını temizle
            const inputs = [onCreditEmployeeNameInput, onCreditEmployeeSurnameInput, 
                          onCreditCustomerNameInput, onCreditCustomerSurnameInput, 
                          onCreditTotalAmountInput];
            inputs.forEach(input => {
                if (input) input.classList.remove('is-invalid', 'is-valid');
            });
        })
        .catch(error => {
            console.error('Veresiye kaydı eklenirken hata:', error);
            showToast('error', 'Hata!', 'Veresiye kaydı eklenirken bir hata oluştu: ' + error.message);
        })
        .finally(() => {
            // Submit butonunu yeniden etkinleştir
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        });
}

/**
 * Ödeme durumunu değiştirir
 */
async function togglePaymentStatus(onCreditId, newStatus) {
    const statusText = newStatus ? 'ödendi' : 'ödenmedi';
    
    if (!confirm(`Bu veresiye kaydının durumunu "${statusText}" olarak değiştirmek istediğinizden emin misiniz?`)) {
        return;
    }
    
    try {
        // Önce mevcut kayıt verilerini al
        console.log('Veresiye verisi alınıyor:', onCreditId);
        const onCreditResponse = await apiService.fetchGet(`OnCredits/${onCreditId}`);
        
        console.log('Mevcut veresiye verisi:', onCreditResponse);
        
        // Mevcut verileri koruyarak sadece isPaid'i güncelle
        const updateData = {
            id: onCreditId,
            employeeName: onCreditResponse.employeeName,
            employeeSurname: onCreditResponse.employeeSurname,
            customerName: onCreditResponse.customerName,
            customerSurname: onCreditResponse.customerSurname,
            note: onCreditResponse.note,
            isPaid: newStatus,
            totalAmount: onCreditResponse.totalAmount,
            employeeId: onCreditResponse.employeeId,
            customerId: onCreditResponse.customerId
        };
        
        console.log('Gönderilecek güncelleme verisi:', updateData);
        
        await apiService.fetchPut('OnCredits', updateData);
        
        console.log('Veresiye ödeme durumu başarıyla güncellendi:', onCreditId, newStatus);
        
        // Listeyi yeniden yükle
        loadOnCredits();
        
        showToast('success', 'Başarılı!', `Veresiye kaydı "${statusText}" olarak güncellendi.`);
        
    } catch (error) {
        console.error('Veresiye ödeme durumu güncellenirken hata:', error);
        showToast('error', 'Hata!', 'Veresiye ödeme durumu güncellenirken bir hata oluştu: ' + error.message);
    }
}

/**
 * Veresiye silme fonksiyonu (DataTable ile)
 */
function handleDeleteOnCredit(onCreditId) {
    if (!onCreditId) {
        console.error('Veresiye ID bulunamadı');
        return;
    }
    
    // Kullanıcıdan onay al
    if (!confirm('Bu veresiye kaydını silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz.')) {
        return;
    }
    
    // API'ye DELETE isteği gönder
    apiService.fetchDelete(`OnCredits/${onCreditId}`)
        .then(() => {
            console.log('Veresiye kaydı başarıyla silindi:', onCreditId);
            
            // Listeyi yeniden yükle
            loadOnCredits();
            
            // Başarı mesajı göster
            showToast('success', 'Başarılı!', 'Veresiye kaydı başarıyla silindi.');
        })
        .catch(error => {
            console.error('Veresiye kaydı silinirken hata:', error);
            showToast('error', 'Hata!', 'Veresiye kaydı silinirken bir hata oluştu: ' + error.message);
        });
}

/**
 * Dropdown seçimlerini input'lara yansıtır
 */
function setupDropdownHandlers() {
    // Employee seçimi değiştiğinde
    if (onCreditEmployeeSelect) {
        onCreditEmployeeSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption.dataset.employeeName) {
                onCreditEmployeeNameInput.value = selectedOption.dataset.employeeName;
                onCreditEmployeeSurnameInput.value = selectedOption.dataset.employeeSurname || '';
                
                onCreditEmployeeNameInput.classList.remove('is-invalid');
                onCreditEmployeeNameInput.classList.add('is-valid');
                if (selectedOption.dataset.employeeSurname) {
                    onCreditEmployeeSurnameInput.classList.add('is-valid');
                }
            } else if (this.value === '') {
                onCreditEmployeeNameInput.value = '';
                onCreditEmployeeSurnameInput.value = '';
                onCreditEmployeeNameInput.classList.remove('is-valid', 'is-invalid');
                onCreditEmployeeSurnameInput.classList.remove('is-valid', 'is-invalid');
            }
        });
    }
    
    // Customer seçimi değiştiğinde
    if (onCreditCustomerSelect) {
        onCreditCustomerSelect.addEventListener('change', function() {
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption.dataset.customerName) {
                onCreditCustomerNameInput.value = selectedOption.dataset.customerName;
                onCreditCustomerSurnameInput.value = selectedOption.dataset.customerSurname || '';
                
                onCreditCustomerNameInput.classList.remove('is-invalid');
                onCreditCustomerNameInput.classList.add('is-valid');
                if (selectedOption.dataset.customerSurname) {
                    onCreditCustomerSurnameInput.classList.add('is-valid');
                }
            } else if (this.value === '') {
                onCreditCustomerNameInput.value = '';
                onCreditCustomerSurnameInput.value = '';
                onCreditCustomerNameInput.classList.remove('is-valid', 'is-invalid');
                onCreditCustomerSurnameInput.classList.remove('is-valid', 'is-invalid');
            }
        });
    }
}

/**
 * Input validasyon olaylarını ayarla
 */
function setupInputValidation() {
    const inputs = [onCreditEmployeeNameInput, onCreditEmployeeSurnameInput,
                   onCreditCustomerNameInput, onCreditCustomerSurnameInput,
                   onCreditTotalAmountInput];
    
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
 * Toast notification göster
 */
function showToast(type, title, message) {
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
function initializeOnCreditPage() {
    console.log('Veresiye sayfası başlatılıyor...');
    console.log('jQuery mevcut:', typeof $ !== 'undefined');
    console.log('DataTables mevcut:', typeof $.fn !== 'undefined' && typeof $.fn.DataTable !== 'undefined');
    console.log('Buttons mevcut:', typeof $.fn !== 'undefined' && typeof $.fn.DataTable !== 'undefined' && typeof $.fn.DataTable.Buttons !== 'undefined');
    
    // jQuery ve DataTables yüklenene kadar bekle
    if (typeof $ === 'undefined' || typeof $.fn.DataTable === 'undefined' || typeof $.fn.DataTable.Buttons === 'undefined') {
        console.log('jQuery veya DataTables henüz yüklenmedi, bekleniyor...');
        setTimeout(initializeOnCreditPage, 200);
        return;
    }

    console.log('Tüm kütüphaneler yüklendi, devam ediliyor...');

    // Mevcut DataTable'ı temizle
    if (onCreditDataTable) {
        onCreditDataTable.destroy();
        onCreditDataTable = null;
    }

    // DataTable tablosunu al
    onCreditTable = document.getElementById('oncredit-datatable');
    
    // Element kontrolü
    if (!addOnCreditForm) {
        console.error('Form elementi bulunamadı');
        return;
    }
    
    if (!onCreditTable) {
        console.error('DataTable elementi bulunamadı');
        return;
    }
    
    // DataTable'ı başlat
    setTimeout(() => {
        initializeDataTable();
        
        // DataTable başlatıldıktan sonra verileri yükle
        setTimeout(() => {
            // Promise.all ile asenkron işlemleri başlat
            console.log('API verilerini yüklemeye başlıyorum...');
            Promise.all([
                loadEmployeesForDropdown(),
                loadCustomersForDropdown(),
                loadOnCredits()
            ]).then(() => {
                console.log('Tüm veriler başarıyla yüklendi.');
            }).catch(error => {
                console.error('Veriler yüklenirken hata:', error);
                showToast('error', 'Hata!', 'Sayfa verileri yüklenirken bir hata oluştu.');
            });
        }, 200);
    }, 100);
    
    // DOM elementlerinin varlığını kontrol et
    const requiredElements = {
        creditTypeEmployee,
        creditTypeCustomer,
        employeeSection,
        customerSection,
        onCreditEmployeeSelect,
        onCreditCustomerSelect
    };
    
    for (const [name, element] of Object.entries(requiredElements)) {
        if (!element) {
            console.error(`${name} elementi bulunamadı`);
        }
    }
    
    // Modal'ı başlat
    const modalElement = document.getElementById('addOnCreditModal');
    if (modalElement) {
        addOnCreditModal = new bootstrap.Modal(modalElement);
        
        // Modal açıldığında varsayılan duruma getir
        modalElement.addEventListener('shown.bs.modal', function() {
            if (creditTypeEmployee) {
                creditTypeEmployee.checked = true;
                toggleCreditSections();
                if (onCreditEmployeeNameInput) {
                    onCreditEmployeeNameInput.focus();
                }
            }
        });
    }
    
    // Credit type radio butonlarına event listener ekle
    if (creditTypeEmployee && creditTypeCustomer) {
        creditTypeEmployee.addEventListener('change', toggleCreditSections);
        creditTypeCustomer.addEventListener('change', toggleCreditSections);
        console.log('Radio buton event listener\'ları eklendi');
    }
    
    // Credit type radio butonlarına event listener ekle
    if (creditTypeEmployee && creditTypeCustomer) {
        creditTypeEmployee.addEventListener('change', toggleCreditSections);
        creditTypeCustomer.addEventListener('change', toggleCreditSections);
        console.log('Radio buton event listener\'ları eklendi');
    }
    
    // Form submit olayını dinle
    if (addOnCreditForm) {
        addOnCreditForm.addEventListener('submit', handleAddOnCreditForm);
    }
    
    // Dropdown handler'larını ayarla
    setupDropdownHandlers();
    
    // Input validasyonu ayarla
    setupInputValidation();
    
    // İlk açılışta employee section'ı göster
    toggleCreditSections();
    
    console.log('Veresiye sayfası başarıyla başlatıldı.');
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', function() {
    initializeOnCreditPage();
});

// Global erişim için window objesine ekle (debugging için)
window.onCreditModule = {
    loadOnCredits,
    loadEmployeesForDropdown,
    loadCustomersForDropdown,
    togglePaymentStatus,
    updateSummary,
    formatCurrency,
    getPaymentStatusBadge,
    getPersonTypeBadge,
    toggleCreditSections
};
