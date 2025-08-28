/**
 * API Servis Modülü
 * Clean Architecture backend entegrasyonu için yeniden kullanılabilir HTTP istek metodları sağlar
 */

// Backend API'nin temel URL'i
const BASE_URL = 'http://ilgazmountainbakkal.com.tr/api/';
//  const BASE_URL = 'http://localhost:5278/api/'; // Geliştirme için localhost

/**
 * Sayfalama destekli genel GET isteği işleyicisi
 * @param {string} endpoint - Başında slash olmayan API endpoint'i
 * @param {Object} options - İstek seçenekleri
 * @param {number} options.pageIndex - Sayfa indeksi (varsayılan: 0)
 * @param {number} options.pageSize - Sayfa boyutu (varsayılan: 10)
 * @param {Object} options.additionalParams - Ek sorgu parametreleri
 * @returns {Promise<any>} - Ayrıştırılmış JSON yanıtı
 */
async function fetchGet(endpoint, options = {}) {
    try {
        const {
            pageIndex = 0,
            pageSize = 10,
            additionalParams = {}
        } = options;

        // Sorgu parametrelerini oluştur
        const queryParams = new URLSearchParams({
            PageIndex: pageIndex.toString(),
            PageSize: pageSize.toString(),
            ...additionalParams
        });

        const url = `${BASE_URL}${endpoint}?${queryParams.toString()}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP hatası! durum: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`${endpoint} için GET isteği başarısız:`, error);
        throw error;
    }
}

/**
 * Genel POST isteği işleyicisi
 * @param {string} endpoint - Başında slash olmayan API endpoint'i
 * @param {Object} body - İstek gövdesi verisi
 * @returns {Promise<any>} - Ayrıştırılmış JSON yanıtı
 */
async function fetchPost(endpoint, body) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP hatası! durum: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`${endpoint} için POST isteği başarısız:`, error);
        throw error;
    }
}

/**
 * Genel PUT isteği işleyicisi
 * @param {string} endpoint - Başında slash olmayan API endpoint'i
 * @param {Object} body - İstek gövdesi verisi
 * @returns {Promise<any>} - Ayrıştırılmış JSON yanıtı
 */
async function fetchPut(endpoint, body) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP hatası! durum: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`${endpoint} için PUT isteği başarısız:`, error);
        throw error;
    }
}

/**
 * Genel DELETE isteği işleyicisi
 * @param {string} endpoint - Başında slash olmayan API endpoint'i
 * @returns {Promise<any>} - Ayrıştırılmış JSON yanıtı
 */
async function fetchDelete(endpoint) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP hatası! durum: ${response.status}`);
        }

        // DELETE istekleri boş yanıt döndürebilir
        const text = await response.text();
        return text ? JSON.parse(text) : null;
    } catch (error) {
        console.error(`${endpoint} için DELETE isteği başarısız:`, error);
        throw error;
    }
}

/**
 * ID'ye göre tek kayıt getiren GET isteği işleyicisi
 * @param {string} endpoint - Başında slash olmayan API endpoint'i (ör: 'Orders')
 * @param {string} id - Kaydın ID'si (GUID)
 * @returns {Promise<any>} - Ayrıştırılmış JSON yanıtı
 */
async function fetchGetById(endpoint, id) {
    try {
        const url = `${BASE_URL}${endpoint}/${id}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP hatası! durum: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`${endpoint}/${id} için GET isteği başarısız:`, error);
        throw error;
    }
}

// Modül kullanımı için fonksiyonları dışa aktar
window.apiService = {
    fetchGet,
    fetchPost,
    fetchPut,
    fetchDelete,
    fetchGetById,

    // Yaygın sayfalama senaryoları için kolaylık metodları
    fetchGetAll: (endpoint, additionalParams = {}) => fetchGet(endpoint, {
        pageIndex: 0,
        pageSize: 1000, // Tüm öğeleri almak için büyük sayfa boyutu
        additionalParams
    }),

    fetchGetPaged: (endpoint, pageIndex = 0, pageSize = 10, additionalParams = {}) => fetchGet(endpoint, {
        pageIndex,
        pageSize,
        additionalParams
    })
};
