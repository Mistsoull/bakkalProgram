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

/**
 * Tek veresiye ödeme durumunu değiştir
 * @param {string} creditId - Veresiye ID'si
 * @param {boolean} isPaid - Ödeme durumu
 */
window.toggleOnCreditStatus = async function(creditId, isPaid) {
    try {
        await apiService.fetchPut(`OnCredits/${creditId}/toggle-status`, { isPaid });
        
        showSuccessToast('Ödeme durumu başarıyla güncellendi!');
        await loadOnCredits(); // Tabloyu yeniden yükle
    } catch (error) {
        console.error('Ödeme durumu güncellenirken hata:', error);
        showErrorToast('Ödeme durumu güncellenirken hata oluştu!');
    }
};

/**
 * Tek veresiye sil
 * @param {string} creditId - Veresiye ID'si
 * @param {string} personName - Kişi adı
 */
window.deleteOnCredit = async function(creditId, personName) {
    if (confirm(`${personName} adlı kişinin veresiye kaydını silmek istediğinizden emin misiniz?`)) {
        try {
            await apiService.fetchDelete(`OnCredits/${creditId}`);
            
            showSuccessToast('Veresiye kaydı başarıyla silindi!');
            await loadOnCredits(); // Tabloyu yeniden yükle
        } catch (error) {
            console.error('Veresiye silinirken hata:', error);
            showErrorToast('Veresiye silinirken hata oluştu!');
        }
    }
};

/**
 * Başarı toast mesajı göster
 * @param {string} message - Gösterilecek mesaj
 */
function showSuccessToast(message) {
    showToast('success', 'Başarılı!', message);
}

/**
 * Hata toast mesajı göster
 * @param {string} message - Gösterilecek mesaj
 */
function showErrorToast(message) {
    showToast('error', 'Hata!', message);
}

/**
 * Grup detaylarını göster
 * @param {string} creditIds - Virgülle ayrılmış veresiye ID'leri
 */
window.showGroupDetails = function(creditIds) {
    const ids = creditIds.split(',');
    
    // Modal oluştur
    const modalHtml = `
        <div class="modal fade" id="groupDetailsModal" tabindex="-1" aria-labelledby="groupDetailsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="groupDetailsModalLabel">
                            <i class="fas fa-list-ul me-2"></i>Veresiye Grubu Detayları (${ids.length} veresiye)
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="groupDetailsContent">
                            <div class="text-center">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Yükleniyor...</span>
                                </div>
                                <p class="mt-2">Veresiye detayları yükleniyor...</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                        <button type="button" class="btn btn-success group-toggle-btn" data-ids="${creditIds}" data-status="true">
                            <i class="fas fa-check-double me-1"></i>Tümünü Ödendi İşaretle
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Eski modal varsa kaldır
    const existingModal = document.getElementById('groupDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Yeni modal ekle
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Modal'ı göster
    const modal = new bootstrap.Modal(document.getElementById('groupDetailsModal'));
    modal.show();
    
    // Veresiye detaylarını yükle
    loadGroupDetails(ids);
};

/**
 * Grup ödeme durumunu değiştir
 * @param {string} creditIds - Virgülle ayrılmış veresiye ID'leri
 * @param {boolean} isPaid - Ödeme durumu
 */
window.toggleGroupPaymentStatus = async function(creditIds, isPaid) {
    try {
        const ids = creditIds.split(',');
        const promises = ids.map(id => apiService.fetchPut(`OnCredits/${id}/toggle-status`, { isPaid }));
        
        await Promise.all(promises);
        
        showSuccessToast('Grup ödeme durumu başarıyla güncellendi!');
        await loadOnCredits(); // Tabloyu yeniden yükle
        
        // Modal'ı kapat
        const modal = bootstrap.Modal.getInstance(document.getElementById('groupDetailsModal'));
        if (modal) {
            modal.hide();
        }
    } catch (error) {
        console.error('Grup ödeme durumu güncellenirken hata:', error);
        showErrorToast('Grup ödeme durumu güncellenirken hata oluştu!');
    }
};

/**
 * Grup veresiye sil
 * @param {string} creditIds - Virgülle ayrılmış veresiye ID'leri
 * @param {string} personName - Kişi adı
 */
window.deleteOnCreditGroup = async function(creditIds, personName) {
    const ids = creditIds.split(',');
    
    if (confirm(`${personName} adlı kişinin ${ids.length} adet veresiye kaydını silmek istediğinizden emin misiniz?`)) {
        try {
            const promises = ids.map(id => apiService.fetchDelete(`OnCredits/${id}`));
            
            await Promise.all(promises);
            
            showSuccessToast('Grup veresiye kayıtları başarıyla silindi!');
            await loadOnCredits(); // Tabloyu yeniden yükle
        } catch (error) {
            console.error('Grup veresiye silinirken hata:', error);
            showErrorToast('Grup veresiye silinirken hata oluştu!');
        }
    }
};

/**
 * Modal içinden tek veresiye ödeme durumunu değiştir
 * @param {string} creditId - Veresiye ID'si
 * @param {boolean} isPaid - Ödeme durumu
 */
window.toggleSingleCreditFromModal = async function(creditId, isPaid) {
    console.log('toggleSingleCreditFromModal çağrıldı:', creditId, isPaid);
    try {
        await apiService.fetchPut(`OnCredits/${creditId}/toggle-status`, { isPaid });
        
        showSuccessToast('Ödeme durumu başarıyla güncellendi!');
        
        // Ana tabloyu yeniden yükle
        await loadOnCredits();
        
        // Modal'ı kapat
        const modal = bootstrap.Modal.getInstance(document.getElementById('groupDetailsModal'));
        if (modal) {
            modal.hide();
        }
    } catch (error) {
        console.error('Modal\'dan ödeme durumu güncellenirken hata:', error);
        showErrorToast('Ödeme durumu güncellenirken hata oluştu!');
    }
};

/**
 * Modal içinden tek veresiye sil
 * @param {string} creditId - Veresiye ID'si
 * @param {string} personName - Kişi adı
 */
window.deleteSingleCreditFromModal = async function(creditId, personName) {
    console.log('deleteSingleCreditFromModal çağrıldı:', creditId, personName);
    if (confirm(`${personName} adlı kişinin bu veresiye kaydını silmek istediğinizden emin misiniz?`)) {
        try {
            await apiService.fetchDelete(`OnCredits/${creditId}`);
            
            showSuccessToast('Veresiye kaydı başarıyla silindi!');
            
            // Ana tabloyu yeniden yükle  
            await loadOnCredits();
            
            // Modal'ı kapat
            const modal = bootstrap.Modal.getInstance(document.getElementById('groupDetailsModal'));
            if (modal) {
                modal.hide();
            }
        } catch (error) {
            console.error('Modal\'dan veresiye silinirken hata:', error);
            showErrorToast('Veresiye silinirken hata oluştu!');
        }
    }
};

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
 * HTML karakterlerini güvenli hale getir (XSS koruması)
 * @param {string} text - Temizlenecek metin
 * @returns {string} - Güvenli metin
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Tarihi kullanıcı dostu formatta göster
 * @param {string} dateString - ISO tarih string'i
 * @returns {string} - Formatlanmış tarih
 */
function formatDate(dateString) {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    } catch (error) {
        console.warn('Tarih format hatası:', error);
        return dateString;
    }
}

/**
 * Rastgele avatar resmi döndürür
 */
function getRandomAvatar() {
    return avatarImages[Math.floor(Math.random() * avatarImages.length)];
}

/**
 * Aynı kişiden birden fazla veresiye varsa bunları gruplar
 * @param {Array} credits - Veresiye listesi
 * @returns {Array} - Gruplandırılmış veresiye listesi
 */
function groupCreditsByPerson(credits) {
    const groupedCredits = {};
    
    credits.forEach(credit => {
        // Kişi tipine göre anahtar oluştur (müşteri/çalışan + ad + soyad)
        const personType = credit.customerId ? 'customer' : 'employee';
        const personName = credit.customerId ? credit.customerName : credit.employeeName;
        const personSurname = credit.customerId ? credit.customerSurname : credit.employeeSurname;
        const personKey = `${personType}_${personName}_${personSurname || ''}`.toLowerCase();
        
        if (!groupedCredits[personKey]) {
            groupedCredits[personKey] = {
                id: credit.id, // İlk veresiyenin ID'sini kullan
                personType: personType,
                personName: personName,
                personSurname: personSurname,
                customerId: credit.customerId,
                employeeId: credit.employeeId,
                credits: [],
                totalAmount: 0,
                allPaid: true,
                unpaidAmount: 0,
                paidAmount: 0
            };
        }
        
        const group = groupedCredits[personKey];
        group.credits.push(credit);
        group.totalAmount += credit.totalAmount;
        
        // Ödeme durumu kontrolü
        if (credit.isPaid) {
            group.paidAmount += credit.totalAmount;
        } else {
            group.allPaid = false;
            group.unpaidAmount += credit.totalAmount;
        }
    });
    
    return Object.values(groupedCredits);
}

/**
 * Gruplandırılmış veresiyeler için not listesi oluştur
 * @param {Array} credits - Aynı kişiye ait veresiyeler
 * @returns {string} - HTML formatında not listesi
 */
function createNotesList(credits) {
    const notes = credits
        .filter(credit => credit.note && credit.note.trim())
        .map(credit => escapeHtml(credit.note.trim()));
    
    if (notes.length === 0) {
        return '<span class="text-muted">Not yok</span>';
    }
    
    if (notes.length === 1) {
        return notes[0];
    }
    
    const uniqueNotes = [...new Set(notes)];
    return `<div class="notes-list">${uniqueNotes.map((note, index) => `${index + 1}. ${note}`).join('<br>')}</div>`;
}

/**
 * Gruplandırılmış veresiyeler için karma durum badge'i
 * @param {boolean} allPaid - Tüm veresiyeler ödenmiş mi?
 * @param {number} creditCount - Toplam veresiye sayısı
 * @param {Array} credits - Veresiye listesi (detaylı durum kontrolü için)
 * @returns {string} - HTML badge
 */
function getMixedPaymentStatusBadge(allPaid, creditCount, credits = []) {
    if (creditCount === 1) {
        // Tek veresiye varsa normal badge'i kullan
        return getPaymentStatusBadge(allPaid);
    }
    
    // Birden fazla veresiye için detaylı durum analizi
    let paidCount = 0;
    
    if (credits.length > 0) {
        paidCount = credits.filter(credit => credit.isPaid).length;
    }
    
    // Ödeme durumu badge'i
    if (paidCount === 0) {
        // Hiçbiri ödenmemiş
        return '<span class="badge bg-danger-subtle text-danger">Hiçbiri Ödenmedi</span>';
    } else if (paidCount === creditCount) {
        // Hepsi ödenmiş
        return '<span class="badge bg-success-subtle text-success">Tümü Ödendi</span>';
    } else {
        // Kısmi ödeme
        return `<span class="badge bg-warning-subtle text-warning">Kısmi Ödeme (${paidCount}/${creditCount})</span>`;
    }
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
                
                // Event delegation zaten document seviyesinde tanımlı, tekrar bağlamaya gerek yok
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
 * Tablo event handler'larını bağla (document bazında event delegation)
 */
function setupTableEventHandlers() {
    // Namespace ile event'leri temizle ve yeniden bağla
    $(document).off('click.onCredit');
    
    // Single payment status toggle butonları
    $(document).on('click.onCredit', '.toggle-btn', function(e) {
        e.preventDefault();
        const onCreditId = $(this).data('id');
        const newStatus = $(this).data('status');
        window.toggleOnCreditStatus(onCreditId, newStatus);
    });
    
    // Single delete butonları
    $(document).on('click.onCredit', '.delete-btn', function(e) {
        e.preventDefault();
        const onCreditId = $(this).data('id');
        const personName = $(this).data('name');
        window.deleteOnCredit(onCreditId, personName);
    });
    
    // Group details butonları
    $(document).on('click.onCredit', '.group-details-btn', function(e) {
        e.preventDefault();
        const creditIds = $(this).data('ids');
        window.showGroupDetails(creditIds);
    });
    
    // Group toggle butonları
    $(document).on('click.onCredit', '.group-toggle-btn', function(e) {
        e.preventDefault();
        const creditIds = $(this).data('ids');
        const status = $(this).data('status');
        window.toggleGroupPaymentStatus(creditIds, status);
    });
    
    // Group delete butonları
    $(document).on('click.onCredit', '.group-delete-btn', function(e) {
        e.preventDefault();
        const creditIds = $(this).data('ids');
        const personName = $(this).data('name');
        window.deleteOnCreditGroup(creditIds, personName);
    });
    
    // Modal içindeki single toggle butonları
    $(document).on('click.onCredit', '.modal-single-toggle-btn', function(e) {
        e.preventDefault();
        const creditId = $(this).data('id');
        const newStatus = $(this).data('status');
        window.toggleSingleCreditFromModal(creditId, newStatus);
    });
    
    // Modal içindeki single delete butonları
    $(document).on('click.onCredit', '.modal-single-delete-btn', function(e) {
        e.preventDefault();
        const creditId = $(this).data('id');
        const personName = $(this).data('name');
        window.deleteSingleCreditFromModal(creditId, personName);
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

        if (onCredits && onCredits.length > 0) {
            // Veresiyeleri kişilere göre gruplandır
            const groupedCredits = groupCreditsByPerson(onCredits);
            console.log('Gruplandırılmış veresiyeler:', groupedCredits);
            
            // Her gruplandırılmış veresiye için satır verisi oluştur ve tabloya ekle
            groupedCredits.forEach(creditGroup => {
                const rowData = createOnCreditRowData(creditGroup);
                onCreditDataTable.row.add(rowData);
            });
        }

        // DataTable'ı yeniden çiz
        onCreditDataTable.draw();
        
        // Özet istatistikleri güncelle
        updateSummaryStats(onCredits);
        
        console.log(`${onCredits.length} veresiye kaydı başarıyla yüklendi.`);
        
    } catch (error) {
        console.error('Veresiye kayıtları yüklenirken hata:', error);
        showErrorToast('Veriler yüklenirken hata oluştu. Lütfen sayfayı yenileyin.');
    }
}

/**
 * DataTable için veresiye satır verisi oluştur (hem tek hem de gruplandırılmış veresiyeler için)
 * @param {Object} creditOrGroup - API'den gelen veresiye verisi veya gruplandırılmış veresiye verisi
 * @returns {Array} - DataTable satır verisi
 */
function createOnCreditRowData(creditOrGroup) {
    console.log('Veresiye verisi:', creditOrGroup);
    
    const avatarImg = getRandomAvatar();
    
    // Gruplandırılmış veresiye mi yoksa tek veresiye mi kontrol et
    if (creditOrGroup.credits && Array.isArray(creditOrGroup.credits)) {
        // Gruplandırılmış veresiye
        const creditGroup = creditOrGroup;
        const fullPersonName = creditGroup.personSurname ? 
            `${creditGroup.personName} ${creditGroup.personSurname}` : 
            creditGroup.personName;
        
        const creditCount = creditGroup.credits.length;
        const personTypeText = creditGroup.personType === 'employee' ? 'Otel Çalışanı' : 'Müşteri';
        const statusBadge = getMixedPaymentStatusBadge(creditGroup.allPaid, creditCount, creditGroup.credits);
        
        return [
            // Kişi
            `<div class="d-flex align-items-center">
                <img src="${avatarImg}" class="rounded-circle" width="40" height="40" alt="Person Avatar">
                <div class="ms-3">
                    <h6 class="fs-4 fw-semibold mb-0">${escapeHtml(fullPersonName)}</h6>
                    <span class="fw-normal text-muted">${personTypeText} ${creditCount > 1 ? `(${creditCount} veresiye)` : ''}</span>
                </div>
            </div>`,
            
            // Tip
            getPersonTypeBadge(creditGroup.personType === 'employee', creditGroup.personType === 'customer'),
            
            // Tutar
            `<div class="d-flex flex-column">
                <span class="fw-semibold text-primary">₺${creditGroup.totalAmount.toFixed(2)}</span>
                ${creditCount > 1 ? `<small class="text-muted">${creditCount} adet toplam</small>` : ''}
            </div>`,
            
            // Not (gruplandırılmış)
            createNotesList(creditGroup.credits),
            
            // Durum
            statusBadge,
            
            // İşlemler
            createGroupActionButtons(creditGroup)
        ];
    } else {
        // Tek veresiye
        const credit = creditOrGroup;
        let personName = '';
        let personSubtitle = '';
        let hasEmployee = false;
        let hasCustomer = false;
        
        // Debug için verisini console'a yazdır
        console.log('Tek veresiye verisi işleniyor:', credit);
        console.log('employeeName:', credit.employeeName, 'customerName:', credit.customerName);
        console.log('employeeId:', credit.employeeId, 'customerId:', credit.customerId);
        
        // Sadece name alanlarına göre kontrol yap - ID'ler manuel girişlerde boş olabilir
        const hasValidEmployeeName = credit.employeeName && credit.employeeName.trim() !== '';
        const hasValidCustomerName = credit.customerName && credit.customerName.trim() !== '';
        
        if (hasValidEmployeeName) {
            hasEmployee = true;
            personName = credit.employeeSurname && credit.employeeSurname.trim() !== '' ? 
                `${credit.employeeName} ${credit.employeeSurname}` : 
                credit.employeeName;
            personSubtitle = 'Otel Çalışanı';
            console.log('Çalışan olarak belirlendi:', personName);
        } else if (hasValidCustomerName) {
            hasCustomer = true;
            personName = credit.customerSurname && credit.customerSurname.trim() !== '' ? 
                `${credit.customerName} ${credit.customerSurname}` : 
                credit.customerName;
            personSubtitle = 'Müşteri';
            console.log('Müşteri olarak belirlendi:', personName);
        } else {
            personName = 'Bilinmiyor';
            personSubtitle = 'Tanımlanmamış';
            console.log('Tanımlanmamış kişi:', credit);
        }

        return [
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
            `<span class="fw-semibold text-primary">₺${credit.totalAmount.toFixed(2)}</span>`,
            
            // Not
            credit.note ? escapeHtml(credit.note) : '<span class="text-muted">Not yok</span>',
            
            // Durum
            getPaymentStatusBadge(credit.isPaid),
            
            // İşlemler
            `<div class="d-flex justify-content-center gap-1">
                <button class="btn btn-outline-warning btn-sm toggle-btn" data-id="${credit.id}" data-status="${!credit.isPaid}" title="${credit.isPaid ? 'Ödenmedi Yap' : 'Ödendi İşaretle'}">
                    <i class="fas fa-${credit.isPaid ? 'undo' : 'check'}"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${credit.id}" data-name="${escapeHtml(personName)}" title="Sil">
                    <i class="fas fa-trash"></i>
                </button>
            </div>`
        ];
    }
}

/**
 * Gruplandırılmış veresiyeler için aksiyon butonları oluştur
 * @param {Object} creditGroup - Gruplandırılmış veresiye verisi
 * @returns {string} - HTML buton grubu
 */
function createGroupActionButtons(creditGroup) {
    const creditCount = creditGroup.credits.length;
    
    if (creditCount === 1) {
        // Tek veresiye varsa normal butonları göster
        const credit = creditGroup.credits[0];
        return `<div class="d-flex justify-content-center gap-1">
            <button class="btn btn-outline-warning btn-sm toggle-btn" data-id="${credit.id}" data-status="${!credit.isPaid}" title="${credit.isPaid ? 'Ödenmedi Yap' : 'Ödendi İşaretle'}">
                <i class="fas fa-${credit.isPaid ? 'undo' : 'check'}"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm delete-btn" data-id="${credit.id}" data-name="${escapeHtml(creditGroup.personName)}" title="Sil">
                <i class="fas fa-trash"></i>
            </button>
        </div>`;
    } else {
        // Birden fazla veresiye varsa grup işlem butonları göster
        const creditIds = creditGroup.credits.map(c => c.id).join(',');
        return `<div class="d-flex justify-content-center gap-1">
            <button class="btn btn-outline-info btn-sm group-details-btn" data-ids="${creditIds}" title="Detayları Göster">
                <i class="fas fa-eye"></i>
            </button>
            <button class="btn btn-outline-warning btn-sm group-toggle-btn" data-ids="${creditIds}" data-status="true" title="Tümünü Ödendi İşaretle">
                <i class="fas fa-check-double"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm group-delete-btn" data-ids="${creditIds}" data-name="${escapeHtml(creditGroup.personName)}" title="Tümünü Sil">
                <i class="fas fa-trash"></i>
            </button>
        </div>`;
    }
}

/**
 * Modal içinden tek veresiye ödeme durumunu değiştir
 * @param {string} creditId - Veresiye ID'si
 * @param {boolean} isPaid - Ödeme durumu
 */
window.toggleSingleCreditFromModal = async function(creditId, isPaid) {
    console.log('toggleSingleCreditFromModal çağrıldı:', creditId, isPaid);
    try {
        await apiService.fetchPut(`OnCredits/${creditId}/toggle-status`, { isPaid });
        
        showSuccessToast('Ödeme durumu başarıyla güncellendi!');
        
        // Ana tabloyu yeniden yükle
        await loadOnCredits();
        
        // Modal'ı kapat
        const modal = bootstrap.Modal.getInstance(document.getElementById('groupDetailsModal'));
        if (modal) {
            modal.hide();
        }
    } catch (error) {
        console.error('Modal\'dan ödeme durumu güncellenirken hata:', error);
        showErrorToast('Ödeme durumu güncellenirken hata oluştu!');
    }
};

/**
 * Modal içinden tek veresiye sil
 * @param {string} creditId - Veresiye ID'si
 * @param {string} personName - Kişi adı
 */
window.deleteSingleCreditFromModal = async function(creditId, personName) {
    console.log('deleteSingleCreditFromModal çağrıldı:', creditId, personName);
    if (confirm(`${personName} adlı kişinin bu veresiye kaydını silmek istediğinizden emin misiniz?`)) {
        try {
            await apiService.fetchDelete(`OnCredits/${creditId}`);
            
            showSuccessToast('Veresiye kaydı başarıyla silindi!');
            
            // Ana tabloyu yeniden yükle  
            await loadOnCredits();
            
            // Modal'ı kapat
            const modal = bootstrap.Modal.getInstance(document.getElementById('groupDetailsModal'));
            if (modal) {
                modal.hide();
            }
        } catch (error) {
            console.error('Modal\'dan veresiye silinirken hata:', error);
            showErrorToast('Veresiye silinirken hata oluştu!');
        }
    }
};

/**
 * Grup detaylarını göster
 * @param {string} creditIds - Virgülle ayrılmış veresiye ID'leri
 */
window.showGroupDetails = function(creditIds) {
    const ids = creditIds.split(',');
    
    // Modal oluştur
    const modalHtml = `
        <div class="modal fade" id="groupDetailsModal" tabindex="-1" aria-labelledby="groupDetailsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="groupDetailsModalLabel">
                            <i class="fas fa-list-ul me-2"></i>Veresiye Grubu Detayları (${ids.length} veresiye)
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="groupDetailsContent">
                            <div class="text-center">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">Yükleniyor...</span>
                                </div>
                                <p class="mt-2">Veresiye detayları yükleniyor...</p>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Kapat</button>
                        <button type="button" class="btn btn-success group-toggle-btn" data-ids="${creditIds}" data-status="true">
                            <i class="fas fa-check-double me-1"></i>Tümünü Ödendi İşaretle
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Eski modal varsa kaldır
    const existingModal = document.getElementById('groupDetailsModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Yeni modal ekle
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Modal'ı göster
    const modal = new bootstrap.Modal(document.getElementById('groupDetailsModal'));
    modal.show();
    
    // Veresiye detaylarını yükle
    loadGroupDetails(ids);
};

/**
 * Grup veresiye detaylarını yükle
 * @param {Array} creditIds - Veresiye ID'leri array'i
 */
async function loadGroupDetails(creditIds) {
    try {
        const contentDiv = document.getElementById('groupDetailsContent');
        let detailsHtml = '<div class="row">';
        
        for (let i = 0; i < creditIds.length; i++) {
            const creditId = creditIds[i];
            
            // Her veresiye için ayrı API çağrısı
            try {
                const credit = await apiService.fetchGetById('OnCredits', creditId);
                
                // Kişi adını belirle
                let personName = '';
                let personType = '';
                if (credit.employeeName) {
                    personName = credit.employeeSurname ? 
                        `${credit.employeeName} ${credit.employeeSurname}` : 
                        credit.employeeName;
                    personType = 'Otel Çalışanı';
                } else if (credit.customerName) {
                    personName = credit.customerSurname ? 
                        `${credit.customerName} ${credit.customerSurname}` : 
                        credit.customerName;
                    personType = 'Müşteri';
                } else {
                    personName = 'Bilinmiyor';
                    personType = 'Tanımlanmamış';
                }
                
                detailsHtml += `
                    <div class="col-md-6 mb-3">
                        <div class="card border-primary">
                            <div class="card-header bg-primary-subtle">
                                <h6 class="card-title mb-0">
                                    <i class="fas fa-credit-card me-2"></i>Veresiye ${i + 1}
                                </h6>
                            </div>
                            <div class="card-body">
                                <div class="row g-2">
                                    <div class="col-6">
                                        <strong>Kişi:</strong>
                                    </div>
                                    <div class="col-6">
                                        ${escapeHtml(personName)}
                                    </div>
                                    <div class="col-6">
                                        <strong>Tip:</strong>
                                    </div>
                                    <div class="col-6">
                                        <span class="badge ${credit.employeeName ? 'bg-warning' : 'bg-info'}">${personType}</span>
                                    </div>
                                    <div class="col-6">
                                        <strong>Tutar:</strong>
                                    </div>
                                    <div class="col-6">
                                        <span class="fw-bold text-primary">₺${credit.totalAmount.toFixed(2)}</span>
                                    </div>
                                    <div class="col-6">
                                        <strong>Tarih:</strong>
                                    </div>
                                    <div class="col-6">
                                        ${formatDate(credit.createdDate)}
                                    </div>
                                    <div class="col-6">
                                        <strong>Durum:</strong>
                                    </div>
                                    <div class="col-6">
                                        ${getPaymentStatusBadge(credit.isPaid)}
                                    </div>
                                    ${credit.note ? `
                                    <div class="col-12">
                                        <strong>Not:</strong>
                                        <p class="mb-0 text-muted">${escapeHtml(credit.note)}</p>
                                    </div>
                                    ` : ''}
                                </div>
                                <div class="mt-3 d-flex gap-2">
                                    <button class="btn btn-sm ${credit.isPaid ? 'btn-outline-warning' : 'btn-outline-success'} modal-single-toggle-btn" 
                                            data-id="${credit.id}" data-status="${!credit.isPaid}">
                                        <i class="fas fa-${credit.isPaid ? 'undo' : 'check'} me-1"></i>
                                        ${credit.isPaid ? 'Ödenmedi Yap' : 'Ödendi İşaretle'}
                                    </button>
                                    <button class="btn btn-sm btn-outline-danger modal-single-delete-btn" 
                                            data-id="${credit.id}" data-name="${escapeHtml(personName)}">
                                        <i class="fas fa-trash me-1"></i>
                                        Sil
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            } catch (error) {
                console.error(`Veresiye ${creditId} detayı yüklenemedi:`, error);
                detailsHtml += `
                    <div class="col-md-6 mb-3">
                        <div class="alert alert-warning">
                            <i class="fas fa-exclamation-triangle me-2"></i>
                            Veresiye #${creditId} detayı yüklenemedi.
                        </div>
                    </div>
                `;
            }
        }
        
        detailsHtml += '</div>';
        contentDiv.innerHTML = detailsHtml;
        
    } catch (error) {
        console.error('Grup detayları yüklenirken hata:', error);
        document.getElementById('groupDetailsContent').innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle me-2"></i>
                Detaylar yüklenirken bir hata oluştu.
            </div>
        `;
    }
}

/**
 * Grup ödeme durumunu değiştir
 * @param {string} creditIds - Virgülle ayrılmış veresiye ID'leri
 * @param {boolean} isPaid - Ödeme durumu
 */
window.toggleGroupPaymentStatus = async function(creditIds, isPaid) {
    try {
        const ids = creditIds.split(',');
        const promises = ids.map(id => apiService.fetchPut(`OnCredits/${id}/toggle-status`, { isPaid }));
        
        await Promise.all(promises);
        
        showSuccessToast('Grup ödeme durumu başarıyla güncellendi!');
        await loadOnCredits(); // Tabloyu yeniden yükle
        
        // Modal'ı kapat
        const modal = bootstrap.Modal.getInstance(document.getElementById('groupDetailsModal'));
        if (modal) {
            modal.hide();
        }
    } catch (error) {
        console.error('Grup ödeme durumu güncellenirken hata:', error);
        showErrorToast('Grup ödeme durumu güncellenirken hata oluştu!');
    }
};

/**
 * Grup veresiye sil
 * @param {string} creditIds - Virgülle ayrılmış veresiye ID'leri
 * @param {string} personName - Kişi adı
 */
window.deleteOnCreditGroup = async function(creditIds, personName) {
    const ids = creditIds.split(',');
    
    if (confirm(`${personName} adlı kişinin ${ids.length} adet veresiye kaydını silmek istediğinizden emin misiniz?`)) {
        try {
            const promises = ids.map(id => apiService.fetchDelete(`OnCredits/${id}`));
            
            await Promise.all(promises);
            
            showSuccessToast('Grup veresiye kayıtları başarıyla silindi!');
            await loadOnCredits(); // Tabloyu yeniden yükle
        } catch (error) {
            console.error('Grup veresiye silinirken hata:', error);
            showErrorToast('Grup veresiye silinirken hata oluştu!');
        }
    }
};

/**
 * Özet istatistikleri güncelle
 * @param {Array} onCredits - Veresiye listesi
 */
function updateSummaryStats(onCredits) {
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
    
    // Eğer özet elementleri varsa güncelle
    if (typeof totalAmountElement !== 'undefined' && totalAmountElement) {
        totalAmountElement.textContent = formatCurrency(totalAmount);
    }
    if (typeof paidAmountElement !== 'undefined' && paidAmountElement) {
        paidAmountElement.textContent = formatCurrency(paidAmount);
    }
    if (typeof unpaidAmountElement !== 'undefined' && unpaidAmountElement) {
        unpaidAmountElement.textContent = formatCurrency(unpaidAmount);
    }
}

/**
 * Yeni veresiye ekleme form submit olayı
 */
function handleAddOnCreditForm(event) {
    event.preventDefault();
    
    const isEmployee = creditTypeEmployee.checked;
    
    // Debug: Hangi tip seçilmiş kontrol et
    console.log('creditTypeEmployee element:', creditTypeEmployee);
    console.log('creditTypeCustomer element:', creditTypeCustomer);
    console.log('creditTypeEmployee.checked:', creditTypeEmployee ? creditTypeEmployee.checked : 'NULL');
    console.log('creditTypeCustomer.checked:', creditTypeCustomer ? creditTypeCustomer.checked : 'NULL');
    console.log('isEmployee:', isEmployee);
    
    // Debug: Input elementlerinin varlığını kontrol et
    console.log('onCreditEmployeeNameInput element:', onCreditEmployeeNameInput);
    console.log('onCreditCustomerNameInput element:', onCreditCustomerNameInput);
    
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
    
    // Debug: Input değerlerini kontrol et
    console.log('onCreditEmployeeNameInput.value:', onCreditEmployeeNameInput ? onCreditEmployeeNameInput.value : 'NULL');
    console.log('onCreditCustomerNameInput.value:', onCreditCustomerNameInput ? onCreditCustomerNameInput.value : 'NULL');
    console.log('Form verisi:', onCreditData);
    
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
                // Çalışan seçildiğinde otomatik olarak çalışan radio butonunu seç
                if (creditTypeEmployee && !creditTypeEmployee.checked) {
                    console.log('Çalışan seçildi, çalışan radio butonu seçiliyor...');
                    creditTypeEmployee.checked = true;
                    creditTypeCustomer.checked = false;
                    toggleCreditSections();
                }
                
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
                // Müşteri seçildiğinde otomatik olarak müşteri radio butonunu seç
                if (creditTypeCustomer && !creditTypeCustomer.checked) {
                    console.log('Müşteri seçildi, müşteri radio butonu seçiliyor...');
                    creditTypeCustomer.checked = true;
                    creditTypeEmployee.checked = false;
                    toggleCreditSections();
                }
                
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

    // Müşteri alanlarına odaklanıldığında otomatik olarak müşteri radio butonunu seç
    const customerInputs = [onCreditCustomerNameInput, onCreditCustomerSurnameInput];
    customerInputs.forEach(input => {
        if (!input) return;
        
        input.addEventListener('focus', function() {
            if (creditTypeCustomer && !creditTypeCustomer.checked) {
                console.log('Müşteri alanına odaklanıldı, müşteri radio butonu seçiliyor...');
                creditTypeCustomer.checked = true;
                creditTypeEmployee.checked = false;
                toggleCreditSections();
            }
        });

        input.addEventListener('input', function() {
            if (this.value.trim() && creditTypeCustomer && !creditTypeCustomer.checked) {
                console.log('Müşteri alanına veri girildi, müşteri radio butonu seçiliyor...');
                creditTypeCustomer.checked = true;
                creditTypeEmployee.checked = false;
                toggleCreditSections();
            }
        });
    });

    // Çalışan alanlarına odaklanıldığında otomatik olarak çalışan radio butonunu seç
    const employeeInputs = [onCreditEmployeeNameInput, onCreditEmployeeSurnameInput];
    employeeInputs.forEach(input => {
        if (!input) return;
        
        input.addEventListener('focus', function() {
            if (creditTypeEmployee && !creditTypeEmployee.checked) {
                console.log('Çalışan alanına odaklanıldı, çalışan radio butonu seçiliyor...');
                creditTypeEmployee.checked = true;
                creditTypeCustomer.checked = false;
                toggleCreditSections();
            }
        });

        input.addEventListener('input', function() {
            if (this.value.trim() && creditTypeEmployee && !creditTypeEmployee.checked) {
                console.log('Çalışan alanına veri girildi, çalışan radio butonu seçiliyor...');
                creditTypeEmployee.checked = true;
                creditTypeCustomer.checked = false;
                toggleCreditSections();
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
    
    // Event handler'ları bağla
    setupTableEventHandlers();
    
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

// Debug: Fonksiyonların tanımlı olup olmadığını kontrol et
console.log('OnCredit JS yüklendi!');
console.log('toggleOnCreditStatus tanımlı mı?', typeof window.toggleOnCreditStatus);
console.log('deleteOnCredit tanımlı mı?', typeof window.deleteOnCredit);
console.log('toggleSingleCreditFromModal tanımlı mı?', typeof window.toggleSingleCreditFromModal);
console.log('deleteSingleCreditFromModal tanımlı mı?', typeof window.deleteSingleCreditFromModal);
console.log('showGroupDetails tanımlı mı?', typeof window.showGroupDetails);
