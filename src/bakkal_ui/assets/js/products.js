/**
 * Ürünler Sayfa Yönetimi
 * Ürünler sayfası için ürün listeleme ve form gönderimi işlemlerini yönetir
 */

// DOM Element Referansları
let productsTable;
let productsDataTable;
let addProductForm;
let productNameInput;
let addProductButton;

/**
 * Ürün İkonları Haritası
 * Ürün adlarına göre uygun Font Awesome ikonlarını eşleştiren sistem
 */
const PRODUCT_ICON_MAP = {
    // Ekmek ve Fırın Ürünleri
    'ekmek': 'fas fa-bread-slice',
    'simit': 'fas fa-circle-notch',
    'köy ekmeği': 'fas fa-seedling',
    'köy ekmegi': 'fas fa-seedling',
    'beyaz ekmek': 'fas fa-bread-slice',
    'kepekli ekmek': 'fas fa-wheat-awn',
    'tam buğday': 'fas fa-wheat-awn',
    'baget': 'fas fa-bread-slice',
    'somun': 'fas fa-bread-slice',
    'pide': 'fas fa-pizza-slice',
    'hamburger ekmeği': 'fas fa-hamburger',
    'sandviç ekmeği': 'fas fa-bread-slice',
    'çavdar ekmeği': 'fas fa-wheat-awn',
    'brioche': 'fas fa-bread-slice',
    'focaccia': 'fas fa-pizza-slice',
    'naan': 'fas fa-bread-slice',
    'lavash': 'fas fa-bread-slice',
    'tortilla': 'fas fa-circle',
    'croissant': 'fas fa-croissant',
    'açma': 'fas fa-circle-notch',
    'poğaça': 'fas fa-cookie-bite',
    'börek': 'fas fa-layer-group',
    
    // Süt Ürünleri
    'süt': 'fas fa-glass-whiskey',
    'yoğurt': 'fas fa-ice-cream',
    'ayran': 'fas fa-glass-whiskey',
    'peynir': 'fas fa-cheese',
    'beyaz peynir': 'fas fa-cheese',
    'kaşar': 'fas fa-cheese',
    'tereyağı': 'fas fa-butter',
    
    // İçecekler
    'su': 'fas fa-tint',
    'maden suyu': 'fas fa-wine-bottle',
    'çay': 'fas fa-mug-hot',
    'kahve': 'fas fa-coffee',
    'kola': 'fas fa-wine-bottle',
    'meyve suyu': 'fas fa-glass-whiskey',
    'portakal suyu': 'fas fa-glass-citrus',
    'elma suyu': 'fas fa-apple-alt',
    'gazoz': 'fas fa-wine-bottle',
    
    // Meyve ve Sebzeler
    'elma': 'fas fa-apple-alt',
    'portakal': 'fas fa-circle',
    'muz': 'fas fa-seedling',
    'domates': 'fas fa-tomato',
    'salatalık': 'fas fa-cucumber',
    'soğan': 'fas fa-onion',
    'patates': 'fas fa-potato',
    'havuç': 'fas fa-carrot',
    
    // Şekerlemeler
    'çikolata': 'fas fa-candy-cane',
    'şeker': 'fas fa-cube',
    'sakız': 'fas fa-circle',
    'kraker': 'fas fa-cookie',
    'bisküvi': 'fas fa-cookie-bite',
    'cips': 'fas fa-potato',
    
    // Temizlik
    'sabun': 'fas fa-soap',
    'şampuan': 'fas fa-pump-soap',
    'deterjan': 'fas fa-spray-can',
    'kağıt havlu': 'fas fa-toilet-paper',
    
    // Diğer
    'gazete': 'fas fa-newspaper',
    'dergi': 'fas fa-book-open',
    'dondurma': 'fas fa-ice-cream',
    'sigara': 'fas fa-smoking',
    'çakmak': 'fas fa-fire'
};

/**
 * Ürün adına göre uygun ikon döndürür
 * @param {string} productName - Ürün adı
 * @returns {string} - Font Awesome ikon sınıfı
 */
function getProductIcon(productName) {
    if (!productName) return 'fas fa-box';
    
    const normalizedName = productName.toLowerCase()
        .replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u')
        .replace(/ç/g, 'c').replace(/ı/g, 'i').replace(/ö/g, 'o')
        .trim();
    
    // Tam eşleşme ara
    if (PRODUCT_ICON_MAP[normalizedName]) {
        return PRODUCT_ICON_MAP[normalizedName];
    }
    
    // Kısmi eşleşme ara
    for (const [key, icon] of Object.entries(PRODUCT_ICON_MAP)) {
        if (normalizedName.includes(key) || key.includes(normalizedName)) {
            return icon;
        }
    }
    
    // Varsayılan ikon
    return 'fas fa-box';
}

/**
 * Ürün ikonu için kategori bazlı renk döndürür
 * @param {string} productName - Ürün adı
 * @returns {string} - CSS renk sınıfı
 */
function getProductIconColor(productName) {
    if (!productName) return 'text-muted';
    
    const normalizedName = productName.toLowerCase();
    
    // Ekmek ve unlu mamüller
    if (normalizedName.includes('ekmek') || normalizedName.includes('simit') || 
        normalizedName.includes('börek') || normalizedName.includes('pide')) {
        return 'text-warning';
    }
    
    // İçecekler
    if (normalizedName.includes('su') || normalizedName.includes('çay') || 
        normalizedName.includes('kahve') || normalizedName.includes('suyu')) {
        return 'text-primary';
    }
    
    // Süt ürünleri
    if (normalizedName.includes('süt') || normalizedName.includes('peynir') || 
        normalizedName.includes('yoğurt') || normalizedName.includes('ayran')) {
        return 'text-info';
    }
    
    // Şekerlemeler
    if (normalizedName.includes('çikolata') || normalizedName.includes('şeker') || 
        normalizedName.includes('dondurma') || normalizedName.includes('bisküvi')) {
        return 'text-danger';
    }
    
    // Meyve ve sebzeler
    if (normalizedName.includes('elma') || normalizedName.includes('portakal') || 
        normalizedName.includes('domates') || normalizedName.includes('patates')) {
        return 'text-success';
    }
    
    // Varsayılan
    return 'text-secondary';
}

// DOM yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', function() {
    // jQuery ve DataTables yüklenene kadar bekle
    function waitForDependencies() {
        if (typeof $ === 'undefined' || typeof $.fn.DataTable === 'undefined' || typeof $.fn.DataTable.Buttons === 'undefined') {
            setTimeout(waitForDependencies, 100);
        } else {
            initializeElements();
            setupEventListeners();
            
            // Sayfa yüklendikten sonra ürünleri getir
            if (productsDataTable) {
                loadProducts();
            }
        }
    }
    
    waitForDependencies();
});

/**
 * DOM element referanslarını başlat
 */
function initializeElements() {
    // DataTable tablosunu al
    productsTable = document.getElementById('products-datatable');
    
    // Ürün ekleme formu için - ürünler sayfasındaysak modal oluşturacağız
    // veya add-product sayfasındaysak mevcut formu kullanacağız
    addProductForm = document.getElementById('productForm') || document.getElementById('add-product-form');
    productNameInput = document.getElementById('productName') || document.getElementById('product-name-input');
    addProductButton = document.querySelector('button[type="submit"]') || document.getElementById('add-product-button');
    
    // DataTable'ı başlat
    if (productsTable) {
        initializeDataTable();
    }
}

/**
 * DataTable'ı başlat
 */
function initializeDataTable() {
    if (!productsTable) return;
    
    try {
        console.log('DataTable başlatılıyor...');
        console.log('jQuery sürümü:', $.fn.jquery);
        console.log('DataTables mevcut:', !!$.fn.DataTable);
        console.log('Buttons mevcut:', !!$.fn.DataTable.Buttons);
        
        productsDataTable = $(productsTable).DataTable({
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
                        columns: [0, 1, 2, 3], // Ürün adı, kategori, fiyat, durum
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
                    filename: 'urunler_' + new Date().toISOString().slice(0,10),
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
                    filename: 'urunler_' + new Date().toISOString().slice(0,10),
                    title: 'Ürün Listesi',
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
                    filename: 'urunler_' + new Date().toISOString().slice(0,10),
                    title: 'Ürün Listesi',
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
                    title: 'Ürün Listesi',
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
            order: [[0, 'asc']], // Ürün adına göre alfabetik sırala
            columnDefs: [
                {
                    targets: [4], // İşlemler sütunu
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
        console.log('Buttons mevcut:', !!productsDataTable.buttons);
        
    } catch (error) {
        console.error('DataTable başlatılamadı:', error);
        // Hata durumunda basit bir export butonu ekle
        setTimeout(() => {
            if ($('.dt-buttons').length === 0) {
                const table = $(productsTable);
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
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleFormSubmit);
    }
}

/**
 * API'den ürünleri yükle ve DataTable'a ekle
 * @param {number} pageIndex - Sayfa indeksi (varsayılan: 0)
 * @param {number} pageSize - Sayfa boyutu (ürünler için varsayılan: 1000)
 */
async function loadProducts(pageIndex = 0, pageSize = 1000) {
    if (!productsDataTable) {
        console.warn('DataTable henüz başlatılmamış');
        return;
    }

    try {
        // Yükleniyor durumunu göster
        showLoadingState();

        // API'den sayfalama ile ürünleri çek
        const response = await window.apiService.fetchGetAll('Products');
        
        console.log('API Yanıtı:', response); // Debug log

        // Sayfalanmış yanıtı işle - yanıt items dizisi içerebilir veya doğrudan dizi olabilir
        const products = response.items || response;
        
        console.log('Ürünler:', products); // Debug log

        // DataTable'ı temizle
        productsDataTable.clear();

        if (products && products.length > 0) {
            // Her ürün için satır verisi oluştur ve tabloya ekle
            products.forEach(product => {
                const rowData = createProductRowData(product);
                productsDataTable.row.add(rowData);
            });
        } else {
            showEmptyState();
        }

        // DataTable'ı yeniden çiz
        productsDataTable.draw();

    } catch (error) {
        console.error('Ürünler yüklenemedi:', error);
        console.error('Hata detayları:', {
            message: error.message,
            stack: error.stack,
            url: `${window.apiService ? 'API Servisi mevcut' : 'API Servisi mevcut değil'}`
        });
        showErrorState();
        // Kullanıcı dostu hata mesajı göster
        showNotification(`Ürünler yüklenirken bir hata oluştu: ${error.message}`, 'error');
    }
}

/**
 * DataTable için yükleniyor durumunu göster
 */
function showLoadingState() {
    if (!productsDataTable) return;
    
    try {
        // DataTable için loading processing özelliğini kullan
        productsDataTable.processing(true);
    } catch (error) {
        console.warn('DataTable processing durumu ayarlanamadı:', error);
    }
}

/**
 * DataTable için boş durum göster (DataTable otomatik olarak halleder)
 */
function showEmptyState() {
    // DataTable otomatik olarak "No data available" mesajı gösterir
    console.log('Henüz ürün bulunmuyor');
}

/**
 * DataTable için hata durumu göster
 */
function showErrorState() {
    if (!productsDataTable) return;
    
    // DataTable'ı temizle ve hata mesajı göster
    productsDataTable.clear().draw();
    showNotification('Veri yüklenirken hata oluştu. Lütfen internet bağlantınızı kontrol edin ve sayfayı yenileyin.', 'error');
}

/**
 * DataTable için ürün satır verisi oluştur
 * @param {Object} product - API'den gelen ürün verisi
 * @returns {Array} - DataTable satır verisi
 */
function createProductRowData(product) {
    // Debug: Ürün verisini logla
    console.log('Ürün verisi:', product);
    console.log('Fiyat değeri:', product.price, 'Tipi:', typeof product.price);
    
    // Fiyat formatla - Geliştirilmiş versiyon
    const formatPrice = (price) => {
        console.log('formatPrice fonksiyonuna gelen değer:', price, 'Tipi:', typeof price);
        
        // Null, undefined veya boş string kontrolü
        if (price === null || price === undefined || price === '') {
            return '0,00 ₺';
        }
        
        // String ise sayıya çevir
        const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
        
        // NaN kontrolü
        if (isNaN(numericPrice)) {
            console.warn('Geçersiz fiyat değeri:', price);
            return '0,00 ₺';
        }
        
        // Negatif değer kontrolü
        if (numericPrice < 0) {
            console.warn('Negatif fiyat değeri:', numericPrice);
            return '0,00 ₺';
        }
        
        try {
            return new Intl.NumberFormat('tr-TR', {
                style: 'currency',
                currency: 'TRY',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(numericPrice);
        } catch (error) {
            console.error('Fiyat formatlanırken hata:', error);
            return `${numericPrice.toFixed(2)} ₺`;
        }
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

    // Ürün için dinamik ikon ve renk al
    const productIcon = getProductIcon(product.name);
    const productIconColor = getProductIconColor(product.name);
    const productIconClass = `${productIcon} ${productIconColor}`;

    const categoryName = product.categoryName || 'Kategorisiz';
    const categoryIconClass = categoryIcons[categoryName] || categoryIcons.default;

    // Fiyatı formatla
    const formattedPrice = formatPrice(product.price);
    console.log('Formatlanmış fiyat:', formattedPrice);

    return [
        // Ürün Adı (Dinamik ikon ile)
        `<div class="d-flex align-items-center">
            <div class="me-3">
                <i class="${productIconClass} fs-5"></i>
            </div>
            <div>
                <h6 class="fs-4 fw-semibold mb-0">${escapeHtml(product.name)}</h6>
            </div>
        </div>`,
        
        // Kategori
        `<div class="d-flex align-items-center">
            <div class="me-2">
                <i class="${categoryIconClass} fs-6"></i>
            </div>
            <span class="fs-3">${escapeHtml(categoryName)}</span>
        </div>`,
        
        // Fiyat
        `<span class="badge bg-success-subtle text-success fs-3 fw-semibold">${formattedPrice}</span>`,
        
        // Durum
        `<span class="badge bg-primary-subtle text-primary">Aktif</span>`,
        
        // İşlemler
        `<div class="d-flex gap-1">
            <button class="btn btn-outline-warning btn-sm" onclick="editProduct('${product.id}')" title="Düzenle">
                <i class="ti ti-edit fs-6"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="deleteProduct('${product.id}', '${escapeHtml(product.name)}')" title="Sil">
                <i class="ti ti-trash fs-6"></i>
            </button>
        </div>`
    ];
}

/**
 * Yeni ürün ekleme için form gönderimini işle
 * @param {Event} event - Form gönderim olayı
 */
async function handleFormSubmit(event) {
    event.preventDefault();

    if (!productNameInput || !addProductButton) return;

    const productName = productNameInput.value.trim();

    // Girdiyi doğrula
    if (!productName) {
        showNotification('Lütfen ürün adını giriniz.', 'warning');
        productNameInput.focus();
        return;
    }

    // Buton durumunu güncelle
    const originalButtonText = addProductButton.innerHTML;
    addProductButton.innerHTML = '<i class="ti ti-loader-2 me-2 spin"></i>Kaydediliyor...';
    addProductButton.disabled = true;

    try {
        // API'ye POST isteği gönder
        const newProduct = await window.apiService.fetchPost('Products', {
            name: productName,
            price: 0, // Varsayılan fiyat
            categoryId: null // Kategori seçimi form'da olacak
        });

        // Başarı işlemi
        if (newProduct) {
            showNotification('Ürün başarıyla eklendi!', 'success');
            
            // Formu temizle
            productNameInput.value = '';
            
            // DataTable'ı yenile
            if (productsDataTable) {
                // Yeni ürünü tabloya ekle
                const newRowData = createProductRowData(newProduct);
                productsDataTable.row.add(newRowData).draw(false);
            }
        }
    } catch (error) {
        console.error('Ürün eklenemedi:', error);
        showNotification(`Ürün eklenirken bir hata oluştu: ${error.message}`, 'error');
    } finally {
        // Buton durumunu eski haline getir
        addProductButton.innerHTML = originalButtonText;
        addProductButton.disabled = false;
    }
}

/**
 * Ürünü düzenle
 * @param {string} productId - Ürün ID'si (Guid)
 */
function editProduct(productId) {
    // Düzenleme fonksiyonunu uygula
    showNotification(`Ürün ${productId} düzenleme özelliği yakında eklenecek.`, 'info');
}

/**
 * Onaylamalı ürün silme
 * @param {string} productId - Ürün ID'si (Guid)
 * @param {string} productName - Onay için ürün adı
 */
async function deleteProduct(productId, productName) {
    // SweetAlert2 kullanılabilirse modern onay penceresi, yoksa standart confirm
    let confirmed = false;
    
    if (typeof Swal !== 'undefined') {
        const result = await Swal.fire({
            title: 'Ürün Silme Onayı',
            html: `<strong>"${productName}"</strong> ürünunu silmek istediğinizden emin misiniz?<br><br><small class="text-muted">Bu işlem geri alınamaz.</small>`,
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
        confirmed = confirm(`"${productName}" ürünunu silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz.`);
    }
    
    if (!confirmed) return;

    try {
        // Loading bildirimi göster
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Siliniyor...',
                text: 'Ürün siliniyor, lütfen bekleyin.',
                icon: 'info',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        }
        
        // API'ye DELETE isteği gönder - Doğru endpoint formatı
        await window.apiService.fetchDelete(`Products/${productId}`);
        
        console.log(`Ürün silindi: ${productId} - ${productName}`);
        
        // Başarı bildirimi
        if (typeof Swal !== 'undefined') {
            await Swal.fire({
                title: 'Başarılı!',
                text: `"${productName}" ürünü başarıyla silindi.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            showNotification('Ürün başarıyla silindi!', 'success');
        }
        
        // DataTable'dan satırı kaldır
        if (productsDataTable) {
            // Silinen ürünün satırını bul ve kaldır
            const table = productsDataTable;
            let rowRemoved = false;
            
            table.rows().every(function(rowIdx, tableLoop, rowLoop) {
                const rowData = this.data();
                // İşlemler sütunundaki butonlardan ID'yi çek
                if (rowData[4] && rowData[4].includes(productId)) {
                    this.remove();
                    rowRemoved = true;
                    return false; // Loop'u durdur
                }
            });
            
            if (rowRemoved) {
                table.draw(false); // Sayfa numarasını koruyarak yeniden çiz
                console.log('Ürün tablodan kaldırıldı');
            } else {
                console.warn('Silinecek ürün tabloda bulunamadı, tabloyu yeniliyoruz');
                // Bulunamazsa tüm tabloyu yenile
                loadProducts();
            }
        }
        
    } catch (error) {
        console.error('Ürün silinemedi:', error);
        
        // Hata türüne göre mesaj belirle
        let errorMessage = 'Ürün silinirken bir hata oluştu.';
        
        if (error.message.includes('404')) {
            errorMessage = 'Ürün bulunamadı. Sayfa yenilenecek.';
            // 404 durumunda tabloyu yenile
            setTimeout(() => loadProducts(), 2000);
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
            showNotification(errorMessage, 'error');
        }
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
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
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
window.productsModule = {
    loadProducts,
    handleFormSubmit,
    editProduct,
    deleteProduct,
    initializeDataTable
};

// Manual export functions (fallback)
window.copyTableData = function() {
    if (productsDataTable && productsDataTable.buttons) {
        productsDataTable.button('copy').trigger();
    } else {
        showNotification('Kopyalama özelliği yüklenemedi.', 'warning');
    }
};

window.exportToCSV = function() {
    if (productsDataTable && productsDataTable.buttons) {
        productsDataTable.button('csv').trigger();
    } else {
        showNotification('CSV export özelliği yüklenemedi.', 'warning');
    }
};

window.exportToExcel = function() {
    if (productsDataTable && productsDataTable.buttons) {
        productsDataTable.button('excel').trigger();
    } else {
        showNotification('Excel export özelliği yüklenemedi.', 'warning');
    }
};

window.exportToPDF = function() {
    if (productsDataTable && productsDataTable.buttons) {
        productsDataTable.button('pdf').trigger();
    } else {
        showNotification('PDF export özelliği yüklenemedi.', 'warning');
    }
};

window.printTable = function() {
    if (productsDataTable && productsDataTable.buttons) {
        productsDataTable.button('print').trigger();
    } else {
        showNotification('Yazdırma özelliği yüklenemedi.', 'warning');
    }
};
