/**
 * Kategoriler Sayfa Yönetimi
 * Kategoriler sayfası için kategori listeleme ve form gönderimi işlemlerini yönetir
 */

// DOM Element Referansları
let categoriesTable;
let categoriesDataTable;
let addCategoryForm;
let categoryNameInput;
let addCategoryButton;

// DOM yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', function() {
    // jQuery ve DataTables yüklenene kadar bekle
    function waitForDependencies() {
        if (typeof $ === 'undefined' || typeof $.fn.DataTable === 'undefined' || typeof $.fn.DataTable.Buttons === 'undefined') {
            console.warn('jQuery, DataTables veya Buttons henüz yüklenmedi, 200ms sonra tekrar denenecek');
            setTimeout(waitForDependencies, 200);
        } else {
            console.log('Tüm bağımlılıklar yüklendi, başlatılıyor...');
            initializeElements();
            setupEventListeners();
            loadCategories();
        }
    }
    
    waitForDependencies();
});

/**
 * DOM element referanslarını başlat
 */
function initializeElements() {
    // DataTable tablosunu al
    categoriesTable = document.getElementById('categories-datatable');
    
    // Kategori ekleme formu için - kategoriler sayfasındaysak modal oluşturacağız
    // veya add-category sayfasındaysak mevcut formu kullanacağız
    addCategoryForm = document.getElementById('categoryForm') || document.getElementById('add-category-form');
    categoryNameInput = document.getElementById('categoryName') || document.getElementById('category-name-input');
    addCategoryButton = document.querySelector('button[type="submit"]') || document.getElementById('add-category-button');
    
    // DataTable'ı başlat
    if (categoriesTable) {
        initializeDataTable();
    }
}

/**
 * DataTable'ı başlat
 */
function initializeDataTable() {
    if (!categoriesTable) return;
    
    try {
        console.log('DataTable başlatılıyor...');
        console.log('jQuery sürümü:', $.fn.jquery);
        console.log('DataTables mevcut:', !!$.fn.DataTable);
        console.log('Buttons mevcut:', !!$.fn.DataTable.Buttons);
        
        categoriesDataTable = $(categoriesTable).DataTable({
            responsive: true,
            pageLength: 25,
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
                        columns: [0, 1, 2],
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
                    filename: 'kategoriler_' + new Date().toISOString().slice(0,10),
                    exportOptions: {
                        columns: [0, 1, 2], // Sadece kategori adı, ürün sayısı ve tarih sütunları
                        format: {
                            body: function (data, row, column, node) {
                                // HTML etiketlerini temizle
                                return data.replace(/<.*?>/g, '').trim();
                            }
                        }
                    }
                },
                {
                    extend: 'excel',
                    text: '<i class="fas fa-file-excel me-1"></i>Excel',
                    filename: 'kategoriler_' + new Date().toISOString().slice(0,10),
                    title: 'Kategori Listesi',
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
                    filename: 'kategoriler_' + new Date().toISOString().slice(0,10),
                    title: 'Kategori Listesi',
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
                    title: 'Kategori Listesi',
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
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/tr.json'
            },
            order: [[2, 'desc']], // Eklenme tarihine göre azalan sıralama
            columnDefs: [
                {
                    targets: [3], // İşlemler sütunu
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
        
        console.log('DataTable başarıyla başlatıldı');
        console.log('Buttons mevcut:', !!categoriesDataTable.buttons);
        
    } catch (error) {
        console.error('DataTable başlatılamadı:', error);
        // Hata durumunda basit bir export butonu ekle
        setTimeout(() => {
            if ($('.dt-buttons').length === 0) {
                const table = $(categoriesTable);
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
 * Olay dinleyicilerini kur
 */
function setupEventListeners() {
    // Bu sayfada form varsa, gönderim işleyicisini kur
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', handleFormSubmit);
    }
}

/**
 * API'den kategorileri yükle ve DataTable'a ekle
 * @param {number} pageIndex - Sayfa indeksi (varsayılan: 0)
 * @param {number} pageSize - Sayfa boyutu (kategoriler için varsayılan: 1000)
 */
async function loadCategories(pageIndex = 0, pageSize = 1000) {
    if (!categoriesDataTable) {
        console.warn('DataTable henüz başlatılmamış');
        return;
    }

    try {
        // Yükleniyor durumunu göster
        showLoadingState();

        // API'den sayfalama ile kategorileri çek
        const response = await window.apiService.fetchGetAll('Categories');
        
        console.log('API Yanıtı:', response); // Debug log

        // Sayfalanmış yanıtı işle - yanıt items dizisi içerebilir veya doğrudan dizi olabilir
        const categories = response.items || response;
        
        console.log('Kategoriler:', categories); // Debug log

        // DataTable'ı temizle
        categoriesDataTable.clear();

        if (categories && categories.length > 0) {
            // DataTable'a kategorileri ekle
            categories.forEach(category => {
                try {
                    const rowData = createCategoryRowData(category);
                    categoriesDataTable.row.add(rowData);
                } catch (rowError) {
                    console.error('Kategori satırı eklenirken hata:', rowError, category);
                }
            });

            // Yanıtta sayfalama bilgisi varsa, burada işleyebilirsiniz
            if (response.totalCount !== undefined) {
                console.log(`${response.totalCount} kategoriden ${categories.length} tanesi yüklendi`);
                // TODO: Gerekirse sayfalama kontrolleri ekle
            }
        }

        // DataTable'ı yeniden çiz
        categoriesDataTable.draw();

    } catch (error) {
        console.error('Kategoriler yüklenemedi:', error);
        console.error('Hata detayları:', {
            message: error.message,
            stack: error.stack,
            url: `${window.apiService ? 'API Servisi mevcut' : 'API Servisi mevcut değil'}`
        });
        showErrorState();
        // Kullanıcı dostu hata mesajı göster
        showNotification(`Kategoriler yüklenirken bir hata oluştu: ${error.message}`, 'error');
    }
}

/**
 * DataTable için yükleniyor durumunu göster
 */
function showLoadingState() {
    if (!categoriesDataTable) return;
    
    try {
        // DataTable için loading processing özelliğini kullan
        categoriesDataTable.processing(true);
    } catch (error) {
        console.warn('DataTable processing durumu ayarlanamadı:', error);
    }
}

/**
 * DataTable için boş durum göster (DataTable otomatik olarak halleder)
 */
function showEmptyState() {
    // DataTable otomatik olarak "No data available" mesajı gösterir
    console.log('Henüz kategori bulunmuyor');
}

/**
 * DataTable için hata durumu göster
 */
function showErrorState() {
    if (!categoriesDataTable) return;
    
    // DataTable'ı temizle ve hata mesajı göster
    categoriesDataTable.clear().draw();
    showNotification('Veri yüklenirken hata oluştu. Lütfen internet bağlantınızı kontrol edin ve sayfayı yenileyin.', 'error');
}

/**
 * DataTable için kategori satır verisi oluştur
 * @param {Object} category - API'den gelen kategori verisi
 * @returns {Array} - DataTable satır verisi
 */
function createCategoryRowData(category) {
    // Tarih formatla (varsa)
    const formatDate = (dateString) => {
        if (!dateString) return new Date().toLocaleDateString('tr-TR');
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    };

    // Kategori ikonları haritası
    const categoryIcons = {
        'Ekmek & Unlu Mamüller': 'fas fa-bread-slice text-warning',
        'İçecekler': 'fas fa-glass-whiskey text-primary',
        'Şekerleme': 'fas fa-candy-cane text-danger',
        'Kırtasiye': 'fas fa-newspaper text-secondary',
        'Donmuş Gıda': 'fas fa-ice-cream text-info',
        'default': 'fas fa-tag text-muted'
    };

    const iconClass = categoryIcons[category.name] || categoryIcons.default;

    return [
        // Kategori Adı
        `<div class="d-flex align-items-center">
            <div class="me-3">
                <i class="${iconClass} fs-6"></i>
            </div>
            <div>
                <h6 class="fs-4 fw-semibold mb-0">${escapeHtml(category.name)}</h6>
            </div>
        </div>`,
        
        // Ürün Sayısı
        `<span class="badge bg-info-subtle text-info">${category.products?.length || 0} ürün</span>`,
        
        // Eklenme Tarihi
        `<p class="mb-0 fw-normal">${formatDate(category.createdDate)}</p>`,
        
        // İşlemler
        `<div class="d-flex gap-1">
            <button class="btn btn-outline-warning btn-sm" onclick="editCategory('${category.id}')" title="Düzenle">
                <i class="ti ti-edit fs-6"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="deleteCategory('${category.id}', '${escapeHtml(category.name)}')" title="Sil">
                <i class="ti ti-trash fs-6"></i>
            </button>
        </div>`
    ];
}

/**
 * Yeni kategori ekleme için form gönderimini işle
 * @param {Event} event - Form gönderim olayı
 */
async function handleFormSubmit(event) {
    event.preventDefault();

    if (!categoryNameInput || !addCategoryButton) return;

    const categoryName = categoryNameInput.value.trim();

    // Girdiyi doğrula
    if (!categoryName) {
        showNotification('Lütfen kategori adını giriniz.', 'warning');
        categoryNameInput.focus();
        return;
    }

    // Buton durumunu güncelle
    const originalButtonText = addCategoryButton.innerHTML;
    addCategoryButton.innerHTML = '<i class="ti ti-loader-2 me-2 spin"></i>Kaydediliyor...';
    addCategoryButton.disabled = true;

    try {
        // API'ye POST isteği gönder
        const newCategory = await window.apiService.fetchPost('Categories', {
            name: categoryName
        });

        // Başarı işlemi
        if (newCategory) {
            // Formu temizle
            categoryNameInput.value = '';
            categoryNameInput.classList.remove('is-valid', 'is-invalid');

            // Başarı mesajı göster
            showNotification('Kategori başarıyla eklendi!', 'success');

            // Kategoriler listesi sayfasındaysak, DataTable'a yeni satır ekle
            if (categoriesDataTable && window.location.pathname.includes('categories.html')) {
                // Yeni kategoriyi DataTable'a ekle
                const newRowData = createCategoryRowData(newCategory);
                categoriesDataTable.row.add(newRowData).draw();
            } else if (window.location.pathname.includes('add-category.html')) {
                // Kategori ekleme sayfasındaysak, listeye yönlendir
                setTimeout(() => {
                    window.location.href = 'categories.html';
                }, 1500);
            }
        }
    } catch (error) {
        console.error('Kategori eklenemedi:', error);
        showNotification('Kategori eklenirken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
    } finally {
        // Buton durumunu eski haline getir
        addCategoryButton.innerHTML = originalButtonText;
        addCategoryButton.disabled = false;
    }
}

/**
 * Kategori detaylarını görüntüle
 * @param {string} categoryId - Kategori ID'si (Guid)
 */
function viewCategory(categoryId) {
    // Görüntüleme fonksiyonunu uygula
    showNotification(`Kategori ${categoryId} görüntüleme özelliği yakında eklenecek.`, 'info');
}

/**
 * Kategoriyi düzenle
 * @param {string} categoryId - Kategori ID'si (Guid)
 */
function editCategory(categoryId) {
    // Düzenleme fonksiyonunu uygula
    showNotification(`Kategori ${categoryId} düzenleme özelliği yakında eklenecek.`, 'info');
}

/**
 * Onaylamalı kategori silme
 * @param {string} categoryId - Kategori ID'si (Guid)
 * @param {string} categoryName - Onay için kategori adı
 */
async function deleteCategory(categoryId, categoryName) {
    const confirmed = confirm(`"${categoryName}" kategorisini silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz.`);
    
    if (!confirmed) return;

    try {
        await window.apiService.fetchDelete(`Categories/${categoryId}`);
        
        // DataTable'dan satırı kaldır
        if (categoriesDataTable) {
            // Silinen kategoriyi DataTable'dan bul ve kaldır
            categoriesDataTable.rows().every(function(rowIdx, tableLoop, rowLoop) {
                const rowData = this.data();
                // İşlemler sütunundaki kategori ID'sini kontrol et (onclick="deleteCategory('id')" içinden)
                if (rowData[3] && rowData[3].includes(`'${categoryId}'`)) {
                    this.remove();
                    return false; // Döngüyü sonlandır
                }
            });
            categoriesDataTable.draw();
        }

        showNotification('Kategori başarıyla silindi.', 'success');
    } catch (error) {
        console.error('Kategori silinemedi:', error);
        showNotification('Kategori silinirken bir hata oluştu. Lütfen tekrar deneyin.', 'error');
    }
}

/**
 * Kullanıcıya bildirim göster
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
        if (notification && notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

/**
 * XSS'i önlemek için HTML kaçış
 * @param {string} text - Kaçışılacak metin
 * @returns {string} - Kaçışılmış metin
 */
function escapeHtml(text) {
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
`;
document.head.appendChild(style);

// Global erişim için dışa aktar
window.categoriesModule = {
    loadCategories,
    handleFormSubmit,
    viewCategory,
    editCategory,
    deleteCategory,
    initializeDataTable
};

// Manual export functions (fallback)
window.copyTableData = function() {
    if (categoriesDataTable && categoriesDataTable.buttons) {
        categoriesDataTable.button('.buttons-copy').trigger();
    } else {
        // Fallback: manuel kopyalama
        const table = document.getElementById('categories-datatable');
        const text = Array.from(table.querySelectorAll('tbody tr')).map(row => 
            Array.from(row.cells).slice(0, 3).map(cell => cell.textContent.trim()).join('\t')
        ).join('\n');
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Tablo verisi kopyalandı!', 'success');
        });
    }
};

window.exportToCSV = function() {
    if (categoriesDataTable && categoriesDataTable.buttons) {
        categoriesDataTable.button('.buttons-csv').trigger();
    } else {
        // Fallback: manuel CSV export
        const table = document.getElementById('categories-datatable');
        const rows = Array.from(table.querySelectorAll('tbody tr'));
        const csvContent = 'Kategori Adı,Ürün Sayısı,Eklenme Tarihi\n' + 
            rows.map(row => 
                Array.from(row.cells).slice(0, 3).map(cell => 
                    '"' + cell.textContent.trim().replace(/"/g, '""') + '"'
                ).join(',')
            ).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kategoriler_' + new Date().toISOString().slice(0,10) + '.csv';
        a.click();
        URL.revokeObjectURL(url);
    }
};

window.exportToExcel = function() {
    if (categoriesDataTable && categoriesDataTable.buttons) {
        categoriesDataTable.button('.buttons-excel').trigger();
    } else {
        // Fallback: CSV olarak indir (Excel açabilir)
        exportToCSV();
    }
};

window.exportToPDF = function() {
    if (categoriesDataTable && categoriesDataTable.buttons) {
        categoriesDataTable.button('.buttons-pdf').trigger();
    } else {
        showNotification('PDF export için tam DataTables yüklenmesi gerekiyor', 'warning');
    }
};

window.printTable = function() {
    if (categoriesDataTable && categoriesDataTable.buttons) {
        categoriesDataTable.button('.buttons-print').trigger();
    } else {
        // Fallback: window.print()
        const table = document.getElementById('categories-datatable').cloneNode(true);
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head>
                    <title>Kategori Listesi</title>
                    <style>
                        table { border-collapse: collapse; width: 100%; }
                        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                        th { background-color: #f5f5f5; }
                    </style>
                </head>
                <body>
                    <h2>Kategori Listesi</h2>
                    ${table.outerHTML}
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
};
