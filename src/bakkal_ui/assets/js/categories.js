/**
 * Kategoriler Sayfa Yönetimi
 * Kategoriler sayfası için kategori listeleme ve form gönderimi işlemlerini yönetir
 */

// DOM Element Referansları
let categoriesTableBody;
let addCategoryForm;
let categoryNameInput;
let addCategoryButton;

// DOM yüklendiğinde başlat
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    loadCategories();
});

/**
 * DOM element referanslarını başlat
 */
function initializeElements() {
    // Tablo gövdesini al - mevcut tablo yapısını kullan
    categoriesTableBody = document.querySelector('table tbody');
    
    // Kategori ekleme formu için - kategoriler sayfasındaysak modal oluşturacağız
    // veya add-category sayfasındaysak mevcut formu kullanacağız
    addCategoryForm = document.getElementById('categoryForm') || document.getElementById('add-category-form');
    categoryNameInput = document.getElementById('categoryName') || document.getElementById('category-name-input');
    addCategoryButton = document.querySelector('button[type="submit"]') || document.getElementById('add-category-button');
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
 * API'den kategorileri yükle ve tabloyu doldur
 * @param {number} pageIndex - Sayfa indeksi (varsayılan: 0)
 * @param {number} pageSize - Sayfa boyutu (kategoriler için varsayılan: 50)
 */
async function loadCategories(pageIndex = 0, pageSize = 50) {
    if (!categoriesTableBody) return;

    try {
        // Yükleniyor durumunu göster
        showLoadingState();

        // API'den sayfalama ile kategorileri çek
        const response = await window.apiService.fetchGetAll('Categories');
        
        console.log('API Yanıtı:', response); // Debug log

        // Yükleniyor durumunu temizle
        categoriesTableBody.innerHTML = '';

        // Sayfalanmış yanıtı işle - yanıt items dizisi içerebilir veya doğrudan dizi olabilir
        const categories = response.items || response;
        
        console.log('Kategoriler:', categories); // Debug log

        if (categories && categories.length > 0) {
            // Tabloyu kategorilerle doldur
            categories.forEach(category => {
                const row = createCategoryRow(category);
                categoriesTableBody.appendChild(row);
            });

            // Yanıtta sayfalama bilgisi varsa, burada işleyebilirsiniz
            if (response.totalCount !== undefined) {
                console.log(`${response.totalCount} kategoriden ${categories.length} tanesi yüklendi`);
                // TODO: Gerekirse sayfalama kontrolleri ekle
            }
        } else {
            // Boş durumu göster
            showEmptyState();
        }
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
 * Tabloda yükleniyor durumunu göster
 */
function showLoadingState() {
    if (!categoriesTableBody) return;
    
    categoriesTableBody.innerHTML = `
        <tr>
            <td colspan="5" class="text-center py-4">
                <div class="d-flex align-items-center justify-content-center">
                    <div class="spinner-border spinner-border-sm text-primary me-2" role="status">
                        <span class="visually-hidden">Yükleniyor...</span>
                    </div>
                    <span>Kategoriler yükleniyor...</span>
                </div>
            </td>
        </tr>
    `;
}

/**
 * Tabloda boş durum göster
 */
function showEmptyState() {
    if (!categoriesTableBody) return;
    
    categoriesTableBody.innerHTML = `
        <tr>
            <td colspan="5" class="text-center py-5">
                <div class="text-muted">
                    <i class="fas fa-inbox fs-1 mb-3 d-block text-muted"></i>
                    <h6>Henüz kategori bulunmuyor</h6>
                    <p class="mb-0">İlk kategorinizi eklemek için yukarıdaki "Yeni Kategori Ekle" butonunu kullanın.</p>
                </div>
            </td>
        </tr>
    `;
}

/**
 * Tabloda hata durumu göster
 */
function showErrorState() {
    if (!categoriesTableBody) return;
    
    categoriesTableBody.innerHTML = `
        <tr>
            <td colspan="5" class="text-center py-5">
                <div class="text-danger">
                    <i class="fas fa-exclamation-triangle fs-1 mb-3 d-block"></i>
                    <h6>Veri yüklenirken hata oluştu</h6>
                    <p class="mb-0">Lütfen internet bağlantınızı kontrol edin ve sayfayı yenileyin.</p>
                    <button class="btn btn-outline-primary btn-sm mt-2" onclick="loadCategories()">
                        <i class="fas fa-redo me-1"></i>Tekrar Dene
                    </button>
                </div>
            </td>
        </tr>
    `;
}

/**
 * Bir kategori için tablo satırı oluştur
 * @param {Object} category - API'den gelen kategori verisi
 * @returns {HTMLElement} - Tablo satır elementi
 */
function createCategoryRow(category) {
    const row = document.createElement('tr');
    
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

    row.innerHTML = `
        <td>
            <div class="d-flex align-items-center">
                <div class="me-3">
                    <i class="${iconClass} fs-6"></i>
                </div>
                <div>
                    <h6 class="fs-4 fw-semibold mb-0">${escapeHtml(category.name)}</h6>
                </div>
            </div>
        </td>
        <td>
            <span class="badge bg-info-subtle text-info">${category.products?.length || 0} ürün</span>
        </td>
        <td>
            <p class="mb-0 fw-normal">${formatDate(category.createdDate)}</p>
        </td>
        <td>
            <div class="dropdown dropstart">
                <a href="javascript:void(0)" class="text-muted" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="ti ti-dots-vertical fs-6"></i>
                </a>
                <ul class="dropdown-menu">
                    <li>
                        <a class="dropdown-item d-flex align-items-center gap-3" href="javascript:void(0)" onclick="viewCategory('${category.id}')">
                            <i class="fs-4 ti ti-eye"></i>Görüntüle
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item d-flex align-items-center gap-3" href="javascript:void(0)" onclick="editCategory('${category.id}')">
                            <i class="fs-4 ti ti-edit"></i>Düzenle
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item d-flex align-items-center gap-3 text-danger" href="javascript:void(0)" onclick="deleteCategory('${category.id}', '${escapeHtml(category.name)}')">
                            <i class="fs-4 ti ti-trash"></i>Sil
                        </a>
                    </li>
                </ul>
            </div>
        </td>
    `;

    return row;
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

            // Kategoriler listesi sayfasındaysak, tabloya yeni satır ekle
            if (categoriesTableBody && window.location.pathname.includes('categories.html')) {
                // Boş durum varsa kaldır
                const emptyRow = categoriesTableBody.querySelector('td[colspan]');
                if (emptyRow) {
                    categoriesTableBody.innerHTML = '';
                }

                // Yeni kategoriyi tablonun başına ekle
                const newRow = createCategoryRow(newCategory);
                categoriesTableBody.insertBefore(newRow, categoriesTableBody.firstChild);
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
        
        // Satırı tablodan kaldır
        const row = event.target.closest('tr');
        if (row) {
            row.remove();
        }

        // Tablo boşsa kontrol et
        if (categoriesTableBody && categoriesTableBody.children.length === 0) {
            showEmptyState();
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
    deleteCategory
};
