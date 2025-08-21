/**
 * Product Add Form Management
 * .NET Clean Architecture backend ile entegrasyon için ürün ekleme formu işleyicisi
 */

// Form elementlerinin referanslarını al
const addProductForm = document.getElementById('productForm');
const productNameInput = document.getElementById('productName');
const productPriceInput = document.getElementById('productPrice');
const productCategorySelect = document.getElementById('productCategory');

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
    'su böreği': 'fas fa-layer-group',
    'sigara böreği': 'fas fa-bacon',
    'spanakli börek': 'fas fa-leaf',
    'peynirli börek': 'fas fa-cheese',
    
    // Süt Ürünleri
    'süt': 'fas fa-glass-whiskey',
    'yoğurt': 'fas fa-ice-cream',
    'ayran': 'fas fa-glass-whiskey',
    'peynir': 'fas fa-cheese',
    'beyaz peynir': 'fas fa-cheese',
    'kaşar': 'fas fa-cheese',
    'tereyağı': 'fas fa-butter',
    'krema': 'fas fa-ice-cream',
    'labne': 'fas fa-ice-cream',
    'kefir': 'fas fa-glass-whiskey',
    'çiğ süt': 'fas fa-glass-whiskey',
    
    // İçecekler
    'su': 'fas fa-tint',
    'maden suyu': 'fas fa-wine-bottle',
    'çay': 'fas fa-mug-hot',
    'kahve': 'fas fa-coffee',
    'kola': 'fas fa-wine-bottle',
    'meyve suyu': 'fas fa-glass-whiskey',
    'portakal suyu': 'fas fa-glass-citrus',
    'elma suyu': 'fas fa-apple-alt',
    'şeftali suyu': 'fas fa-glass-whiskey',
    'energy drink': 'fas fa-bolt',
    'enerji içeceği': 'fas fa-bolt',
    'soğuk çay': 'fas fa-glass-whiskey',
    'limonata': 'fas fa-lemon',
    'gazoz': 'fas fa-wine-bottle',
    
    // Meyve ve Sebzeler
    'elma': 'fas fa-apple-alt',
    'portakal': 'fas fa-circle',
    'muz': 'fas fa-seedling',
    'üzüm': 'fas fa-grape-cluster',
    'çilek': 'fas fa-strawberry',
    'kiraz': 'fas fa-cherry',
    'şeftali': 'fas fa-peach',
    'armut': 'fas fa-pear',
    'kavun': 'fas fa-melon',
    'karpuz': 'fas fa-watermelon',
    'domates': 'fas fa-tomato',
    'salatalık': 'fas fa-cucumber',
    'soğan': 'fas fa-onion',
    'patates': 'fas fa-potato',
    'havuç': 'fas fa-carrot',
    'biber': 'fas fa-pepper-hot',
    'patlıcan': 'fas fa-eggplant',
    'kabak': 'fas fa-squash',
    'marul': 'fas fa-leaf',
    'maydanoz': 'fas fa-leaf',
    'dereotu': 'fas fa-leaf',
    
    // Et ve Tavuk
    'et': 'fas fa-drumstick-bite',
    'kuzu eti': 'fas fa-drumstick-bite',
    'dana eti': 'fas fa-drumstick-bite',
    'kıyma': 'fas fa-hamburger',
    'tavuk': 'fas fa-drumstick-bite',
    'piliç': 'fas fa-drumstick-bite',
    'balık': 'fas fa-fish',
    'ton balığı': 'fas fa-fish',
    'somon': 'fas fa-fish',
    'levrek': 'fas fa-fish',
    'çupra': 'fas fa-fish',
    'karides': 'fas fa-shrimp',
    'mürekkep balığı': 'fas fa-squid',
    'sosis': 'fas fa-hotdog',
    'sucuk': 'fas fa-bacon',
    'salam': 'fas fa-bacon',
    'jambon': 'fas fa-bacon',
    
    // Konserveler ve Hazır Gıdalar
    'konserve': 'fas fa-can-food',
    'domates konservesi': 'fas fa-can-food',
    'fasulye konservesi': 'fas fa-can-food',
    'ton balığı konservesi': 'fas fa-can-food',
    'makarna': 'fas fa-utensils',
    'spagetti': 'fas fa-utensils',
    'penne': 'fas fa-utensils',
    'pirinç': 'fas fa-rice',
    'bulgur': 'fas fa-wheat',
    'mercimek': 'fas fa-seedling',
    'nohut': 'fas fa-circle',
    'fasulye': 'fas fa-seedling',
    'barbunya': 'fas fa-seedling',
    
    // Şekerlemeler ve Atıştırmalıklar
    'çikolata': 'fas fa-candy-cane',
    'şeker': 'fas fa-cube',
    'sakız': 'fas fa-circle',
    'kraker': 'fas fa-cookie',
    'bisküvi': 'fas fa-cookie-bite',
    'cips': 'fas fa-potato',
    'kuruyemiş': 'fas fa-nut',
    'fındık': 'fas fa-nut',
    'badem': 'fas fa-nut',
    'ceviz': 'fas fa-nut',
    'fıstık': 'fas fa-nut',
    'çekirdek': 'fas fa-seedling',
    'kuru üzüm': 'fas fa-grape-cluster',
    'hurma': 'fas fa-date',
    'incir': 'fas fa-fig',
    'lokum': 'fas fa-candy-cane',
    'helva': 'fas fa-candy-cane',
    
    // Temizlik ve Kişisel Bakım
    'sabun': 'fas fa-soap',
    'şampuan': 'fas fa-pump-soap',
    'diş macunu': 'fas fa-toothbrush',
    'diş fırçası': 'fas fa-toothbrush',
    'kağıt havlu': 'fas fa-toilet-paper',
    'tuvalet kağıdı': 'fas fa-toilet-paper',
    'deterjan': 'fas fa-spray-can',
    'çamaşır suyu': 'fas fa-tint',
    'bulaşık deterjanı': 'fas fa-spray-can',
    'yüz kremi': 'fas fa-pump-soap',
    'el kremi': 'fas fa-hand-holding-heart',
    'güneş kremi': 'fas fa-sun',
    'parfüm': 'fas fa-spray-can',
    'deodorant': 'fas fa-spray-can',
    
    // Ev ve Mutfak
    'pil': 'fas fa-battery-full',
    'ampul': 'fas fa-lightbulb',
    'çakmak': 'fas fa-fire',
    'mum': 'fas fa-candle',
    'streç film': 'fas fa-tape',
    'alüminyum folyo': 'fas fa-square',
    'kese kağıdı': 'fas fa-shopping-bag',
    'poşet': 'fas fa-shopping-bag',
    'çöp torbası': 'fas fa-trash',
    'buzdolabı poşeti': 'fas fa-snowflake',
    
    // Baharat ve Yağlar
    'tuz': 'fas fa-cube',
    'karabiber': 'fas fa-pepper-hot',
    'kırmızı biber': 'fas fa-pepper-hot',
    'kimyon': 'fas fa-seedling',
    'tarçın': 'fas fa-tree',
    'nane': 'fas fa-leaf',
    'fesleğen': 'fas fa-leaf',
    'kekik': 'fas fa-leaf',
    'defne yaprağı': 'fas fa-leaf',
    'zeytinyağı': 'fas fa-wine-bottle',
    'ayçiçek yağı': 'fas fa-sun',
    'tereyağı': 'fas fa-butter',
    'margarin': 'fas fa-butter',
    'sirke': 'fas fa-wine-bottle',
    'limon tuzu': 'fas fa-lemon',
    'mayonez': 'fas fa-pump-soap',
    'ketçap': 'fas fa-ketchup',
    'hardal': 'fas fa-mustard',
    
    // Dondurulmuş Ürünler
    'dondurma': 'fas fa-ice-cream',
    'donmuş sebze': 'fas fa-snowflake',
    'donmuş meyve': 'fas fa-snowflake',
    'donmuş pizza': 'fas fa-pizza-slice',
    'donmuş börek': 'fas fa-snowflake',
    'buzlu soda': 'fas fa-snowflake',
    
    // Kırtasiye ve Gazete
    'gazete': 'fas fa-newspaper',
    'dergi': 'fas fa-book-open',
    'kalem': 'fas fa-pen',
    'defter': 'fas fa-book',
    'silgi': 'fas fa-eraser',
    'cetvel': 'fas fa-ruler',
    'makas': 'fas fa-cut',
    'yapıştırıcı': 'fas fa-tape',
    'zarf': 'fas fa-envelope',
    'posta kartı': 'fas fa-postcard',
    
    // Sigara ve Tütün
    'sigara': 'fas fa-smoking',
    'çakmak': 'fas fa-fire',
    'kibrit': 'fas fa-fire',
    'pipo tütünü': 'fas fa-smoking',
    'nargile tütünü': 'fas fa-smoking',
    
    // Bebek Ürünleri
    'bebek bezi': 'fas fa-baby',
    'bebek maması': 'fas fa-baby-carriage',
    'biberon': 'fas fa-baby-carriage',
    'emzik': 'fas fa-baby',
    'bebek şampuanı': 'fas fa-baby',
    'bebek kremi': 'fas fa-baby',
    
    // Hayvan Maması
    'kedi maması': 'fas fa-cat',
    'köpek maması': 'fas fa-dog',
    'kuş yemi': 'fas fa-dove',
    'balık yemi': 'fas fa-fish',
    'kedi kumu': 'fas fa-cat'
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
 * Sayfa yüklendiğinde kategorileri yükle
 */
document.addEventListener('DOMContentLoaded', function() {
    loadCategoriesForDropdown();
    initializeFormValidation();
    
    // Spinner stilleri ekle
    addSpinnerStyles();
});

/**
 * Kategori seçim menüsünü API'den gelen verilerle doldur
 */
async function loadCategoriesForDropdown() {
    try {
        // Loading durumunu göster
        productCategorySelect.innerHTML = '<option value="">Kategoriler yükleniyor...</option>';
        productCategorySelect.disabled = true;

        // API'den kategorileri çek
        const response = await apiService.fetchGetAll('Categories');
        
        // API yanıtının yapısına göre verileri al
        const categories = response.items || response || [];
        
        // Seçim menüsünü temizle ve varsayılan option ekle
        productCategorySelect.innerHTML = '<option value="">Kategori Seçiniz...</option>';
        
        // Her kategori için option ekle
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            productCategorySelect.appendChild(option);
        });
        
        // Select'i etkinleştir
        productCategorySelect.disabled = false;
        
        console.log(`${categories.length} kategori başarıyla yüklendi.`);
        
    } catch (error) {
        console.error('Kategoriler yüklenirken hata oluştu:', error);
        
        // Hata durumunda kullanıcıya bilgi ver
        productCategorySelect.innerHTML = '<option value="">Kategoriler yüklenemedi</option>';
        productCategorySelect.disabled = true;
        
        // Kullanıcıya hata mesajı göster
        showNotification('Kategoriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.', 'error');
    }
}

/**
 * Form validation ve submit işleyicilerini başlat
 */
function initializeFormValidation() {
    // Form submit olayını dinle
    addProductForm.addEventListener('submit', handleFormSubmit);
    
    // Real-time validation ekle
    productNameInput.addEventListener('input', validateProductName);
    productPriceInput.addEventListener('input', validateProductPrice);
    productCategorySelect.addEventListener('change', validateProductCategory);
    
    // Ürün adı değiştiğinde ikon önizlemesi göster
    productNameInput.addEventListener('input', updateProductIconPreview);
    
    // Form reset işleyicisi
    const resetButton = addProductForm.querySelector('button[type="reset"]');
    if (resetButton) {
        resetButton.addEventListener('click', handleFormReset);
    }
    
    // Ikon önizleme alanını oluştur
    createIconPreviewArea();
}

/**
 * Form submit işleyicisi
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // Form validasyonunu kontrol et
    if (!validateForm()) {
        return;
    }
    
    // Submit butonu referansını al
    const submitButton = addProductForm.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    try {
        // Loading durumu göster
        setButtonLoadingState(submitButton, true);
        
        // Form verilerini al ve hazırla
        const productData = {
            name: productNameInput.value.trim(),
            price: parseFloat(productPriceInput.value),
            categoryId: productCategorySelect.value
        };
        
        console.log('Gönderilecek ürün verisi:', productData);
        
        // API'ye POST isteği gönder
        const response = await apiService.fetchPost('Products', productData);
        
        console.log('Ürün başarıyla eklendi:', response);
        
        // Başarı bildirimi göster
        showNotification('Ürün başarıyla eklendi!', 'success');
        
        // Formu sıfırla
        resetFormValidation();
        addProductForm.reset();
        
        // 1.5 saniye sonra ürünler sayfasına yönlendir
        setTimeout(() => {
            window.location.href = 'products.html';
        }, 1500);
        
    } catch (error) {
        console.error('Ürün eklenirken hata oluştu:', error);
        
        // Hata mesajını kullanıcıya göster
        let errorMessage = 'Ürün eklenirken bir hata oluştu.';
        
        if (error.message.includes('400')) {
            errorMessage = 'Geçersiz veri girdiniz. Lütfen bilgileri kontrol edin.';
        } else if (error.message.includes('409')) {
            errorMessage = 'Bu isimde bir ürün zaten mevcut.';
        } else if (error.message.includes('500')) {
            errorMessage = 'Sunucu hatası oluştu. Lütfen daha sonra tekrar deneyin.';
        }
        
        showNotification(errorMessage, 'error');
        
    } finally {
        // Loading durumunu kaldır
        setButtonLoadingState(submitButton, false, originalButtonText);
    }
}

/**
 * Form validasyonu
 */
function validateForm() {
    let isValid = true;
    
    // Tüm alanları validate et
    if (!validateProductName()) isValid = false;
    if (!validateProductPrice()) isValid = false;
    if (!validateProductCategory()) isValid = false;
    
    // İlk geçersiz alana focus et
    if (!isValid) {
        const firstInvalidField = addProductForm.querySelector('.is-invalid');
        if (firstInvalidField) {
            firstInvalidField.focus();
        }
    }
    
    return isValid;
}

/**
 * Ürün adı validasyonu
 */
function validateProductName() {
    const value = productNameInput.value.trim();
    
    if (!value) {
        setFieldValidation(productNameInput, false, 'Lütfen ürün adını giriniz.');
        return false;
    }
    
    if (value.length < 2) {
        setFieldValidation(productNameInput, false, 'Ürün adı en az 2 karakter olmalıdır.');
        return false;
    }
    
    if (value.length > 100) {
        setFieldValidation(productNameInput, false, 'Ürün adı en fazla 100 karakter olabilir.');
        return false;
    }
    
    setFieldValidation(productNameInput, true);
    return true;
}

/**
 * Ikon önizleme alanını oluştur
 */
function createIconPreviewArea() {
    // Ürün adı input'unun bulunduğu form grup elementini bul
    const productNameFormGroup = productNameInput.closest('.col-md-4');
    
    if (productNameFormGroup && !document.getElementById('product-icon-preview')) {
        const iconPreviewHtml = `
            <div id="product-icon-preview" class="mt-2" style="display: none;">
                <div class="card bg-light-primary">
                    <div class="card-body p-3">
                        <div class="d-flex align-items-center">
                            <div class="me-3">
                                <i id="preview-icon" class="fas fa-box fs-4 text-primary"></i>
                            </div>
                            <div>
                                <h6 class="fw-semibold mb-1 text-primary">Ürün İkonu Önizlemesi</h6>
                                <p class="mb-0 fs-2 text-dark" id="preview-text">
                                    Ürün adı yazın, otomatik ikon seçimi gösterilsin
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        productNameFormGroup.insertAdjacentHTML('beforeend', iconPreviewHtml);
    }
}

/**
 * Ürün ikon önizlemesini güncelle
 */
function updateProductIconPreview() {
    const previewArea = document.getElementById('product-icon-preview');
    const previewIcon = document.getElementById('preview-icon');
    const previewText = document.getElementById('preview-text');
    
    if (!previewArea || !previewIcon || !previewText) return;
    
    const productName = productNameInput.value.trim();
    
    if (productName.length >= 2) {
        const iconClass = getProductIcon(productName);
        
        // İkon sınıfını güncelle
        previewIcon.className = `${iconClass} fs-4 text-primary`;
        
        // Önizleme metnini güncelle
        previewText.textContent = `"${productName}" için seçilen ikon`;
        
        // Önizleme alanını göster
        previewArea.style.display = 'block';
        
        // Hafif animasyon ekle
        previewIcon.style.transform = 'scale(1.1)';
        setTimeout(() => {
            previewIcon.style.transform = 'scale(1)';
        }, 200);
        
    } else {
        // Ürün adı çok kısa ise önizlemeyi gizle
        previewArea.style.display = 'none';
    }
}

/**
 * Ürün fiyatı validasyonu
 */
function validateProductPrice() {
    const value = productPriceInput.value.trim();
    
    if (!value) {
        setFieldValidation(productPriceInput, false, 'Lütfen ürün fiyatını giriniz.');
        return false;
    }
    
    const price = parseFloat(value);
    
    if (isNaN(price) || price < 0) {
        setFieldValidation(productPriceInput, false, 'Lütfen geçerli bir fiyat giriniz.');
        return false;
    }
    
    if (price > 999999.99) {
        setFieldValidation(productPriceInput, false, 'Fiyat çok yüksek. Maksimum 999,999.99 ₺ olabilir.');
        return false;
    }
    
    setFieldValidation(productPriceInput, true);
    return true;
}

/**
 * Kategori validasyonu
 */
function validateProductCategory() {
    const value = productCategorySelect.value;
    
    if (!value) {
        setFieldValidation(productCategorySelect, false, 'Lütfen bir kategori seçiniz.');
        return false;
    }
    
    setFieldValidation(productCategorySelect, true);
    return true;
}

/**
 * Field validation durumunu ayarla
 */
function setFieldValidation(field, isValid, errorMessage = '') {
    const feedbackElement = field.parentNode.parentNode.querySelector('.invalid-feedback');
    
    // Validation sınıflarını kaldır
    field.classList.remove('is-valid', 'is-invalid');
    
    if (isValid) {
        field.classList.add('is-valid');
    } else {
        field.classList.add('is-invalid');
        if (feedbackElement && errorMessage) {
            feedbackElement.textContent = errorMessage;
        }
    }
}

/**
 * Form reset işleyicisi
 */
function handleFormReset() {
    // Kısa bir gecikme sonra validation sınıflarını kaldır
    setTimeout(() => {
        resetFormValidation();
        
        // İkon önizlemesini gizle
        const previewArea = document.getElementById('product-icon-preview');
        if (previewArea) {
            previewArea.style.display = 'none';
        }
    }, 100);
}

/**
 * Form validation durumunu sıfırla
 */
function resetFormValidation() {
    const validationClasses = addProductForm.querySelectorAll('.is-valid, .is-invalid');
    validationClasses.forEach(element => {
        element.classList.remove('is-valid', 'is-invalid');
    });
}

/**
 * Buton loading durumunu ayarla
 */
function setButtonLoadingState(button, isLoading, originalText = '') {
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = '<i class="ti ti-loader-2 me-2 spin"></i>Kaydediliyor...';
    } else {
        button.disabled = false;
        button.innerHTML = originalText || '<i class="ti ti-device-floppy me-2"></i>Ürün Kaydet';
    }
}

/**
 * Kullanıcıya bildirim göster
 */
function showNotification(message, type = 'info') {
    // SweetAlert2 kullanılabilirse onu kullan, yoksa alert kullan
    if (typeof Swal !== 'undefined') {
        const config = {
            text: message,
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            position: 'top-end',
            toast: true
        };
        
        switch (type) {
            case 'success':
                config.icon = 'success';
                config.background = '#d4edda';
                config.color = '#155724';
                break;
            case 'error':
                config.icon = 'error';
                config.background = '#f8d7da';
                config.color = '#721c24';
                config.timer = 5000; // Hata mesajlarını daha uzun göster
                break;
            case 'warning':
                config.icon = 'warning';
                config.background = '#fff3cd';
                config.color = '#856404';
                break;
            default:
                config.icon = 'info';
                config.background = '#d1ecf1';
                config.color = '#0c5460';
        }
        
        Swal.fire(config);
    } else {
        // Fallback: basit alert
        alert(message);
    }
}

/**
 * Spinner animasyonu için CSS ekle
 */
function addSpinnerStyles() {
    if (!document.getElementById('spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'spinner-styles';
        style.textContent = `
            .spin {
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            /* İkon önizleme animasyonu */
            #preview-icon {
                transition: transform 0.2s ease-in-out;
            }
            
            #product-icon-preview {
                animation: fadeInUp 0.3s ease-out;
            }
            
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Ürün ikon haritası için özel renkler */
            .text-bread { color: #8B4513 !important; }
            .text-dairy { color: #F5F5DC !important; }
            .text-beverage { color: #4682B4 !important; }
            .text-fruit { color: #FF6347 !important; }
            .text-vegetable { color: #32CD32 !important; }
            .text-meat { color: #8B0000 !important; }
            .text-sweet { color: #FF69B4 !important; }
            .text-cleaning { color: #87CEEB !important; }
        `;
        document.head.appendChild(style);
    }
}
