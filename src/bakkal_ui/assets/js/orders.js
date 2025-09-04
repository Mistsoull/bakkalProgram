/**
 * Siparişler Sayfa Yönetimi
 * apiService.js tabanlı, clean code prensipleriyle yazılmış sipariş yönetim modülü
 */

// DOM Element Referansları
let ordersTable;
let ordersDataTable;
let addOrderForm;
let addOrderModal;
let addItemModal;

// Bootstrap Modal Instances
let addModalInstance;
let addItemModalInstance;

// Data storage
let itemsData = [];
let editingItemIndex = -1;
let customersCache = [];
let productsCache = [];

/**
 * Sipariş durumuna göre ikon ve renk haritası
 */
const ORDER_STATUS_MAP = {
    'pending': { icon: 'fas fa-clock', color: 'warning', text: 'Bekliyor' },
    'paid': { icon: 'fas fa-check', color: 'success', text: 'Ödendi' },
    'delivered': { icon: 'fas fa-truck', color: 'info', text: 'Teslim Edildi' },
    'completed': { icon: 'fas fa-check-circle', color: 'success', text: 'Tamamlandı' },
    'cancelled': { icon: 'fas fa-times-circle', color: 'danger', text: 'İptal Edildi' },
    'default': { icon: 'fas fa-question', color: 'secondary', text: 'Bilinmiyor' }
};

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
        loadInitialData();
    }
}

/**
 * DOM element referanslarını başlat
 */
function initializeElements() {
    // DataTable
    ordersTable = document.getElementById('orders-datatable');
    
    // Forms and Modals
    addOrderForm = document.getElementById('add-order-form');
    addOrderModal = document.getElementById('addOrderModal');
    addItemModal = document.getElementById('addItemModal');
    
    // Bootstrap Modal Instances
    if (addOrderModal) {
        addModalInstance = new bootstrap.Modal(addOrderModal);
    }
    
    // DataTable'ı başlat
    if (ordersTable) {
        initializeDataTable();
    }
    
    // Set tomorrow's date as default delivery date
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const deliveryDateInput = document.getElementById('order-delivery-date-input');
    if (deliveryDateInput) {
        deliveryDateInput.value = tomorrowStr;
        deliveryDateInput.setAttribute('min', todayStr);
    }
}

/**
 * DataTable'ı başlat
 */
function initializeDataTable() {
    if (!ordersTable) return;
    
    try {
        console.log('Orders DataTable başlatılıyor...');
        
        ordersDataTable = $(ordersTable).DataTable({
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
                    filename: 'siparisler_' + new Date().toISOString().slice(0,10),
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
                    filename: 'siparisler_' + new Date().toISOString().slice(0,10),
                    title: 'Siparişler Listesi',
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
                    filename: 'siparisler_' + new Date().toISOString().slice(0,10),
                    title: 'Siparişler Listesi',
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
                    title: 'Siparişler Listesi',
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
            order: [[1, 'desc']], // Teslim tarihine göre yeniden eskiye sırala
            columnDefs: [
                {
                    targets: [4], // İşlemler sütunu
                    orderable: false,
                    searchable: false,
                    width: "180px",
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
        
        console.log('Orders DataTable başarıyla başlatıldı');
        
    } catch (error) {
        console.error('Orders DataTable başlatılamadı:', error);
    }
}

/**
 * Olay dinleyicilerini kur
 */
function setupEventListeners() {
    // Add form submit
    if (addOrderForm) {
        addOrderForm.addEventListener('submit', handleAddFormSubmit);
    }
    
    // Customer selection change
    const customerSelect = document.getElementById('order-customer-select');
    if (customerSelect) {
        customerSelect.addEventListener('change', handleCustomerSelection);
    }
    
    // Add item button
    const addItemBtn = document.getElementById('add-item-btn');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', addItemToTable);
    }
    
    // Save item button (artık kullanılmıyor)
    // const saveItemBtn = document.getElementById('save-item-btn');
    // if (saveItemBtn) {
    //     saveItemBtn.addEventListener('click', saveItem);
    // }
    
    // Product selection change
    const productSelect = document.getElementById('item-product-select');
    if (productSelect) {
        productSelect.addEventListener('change', handleProductSelection);
    }
    
    // Modal events
    if (addItemModal) {
        addItemModal.addEventListener('hidden.bs.modal', resetItemModal);
    }
    
    // Reset items when main modal is closed
    if (addOrderModal) {
        addOrderModal.addEventListener('hidden.bs.modal', resetMainModal);
    }
}

/**
 * Load initial data (customers and products)
 */
async function loadInitialData() {
    try {
        await Promise.all([
            loadCustomers(),
            loadProducts(),
            loadOrders()
        ]);
    } catch (error) {
        console.error('Error loading initial data:', error);
        showNotification('Veri yüklenirken hata oluştu', 'error');
    }
}

/**
 * Load customers from API
 */
async function loadCustomers() {
    try {
        const response = await window.apiService.fetchGetAll('Customers');
        customersCache = response.items || response;
        
        console.log('Customers loaded:', customersCache);
        
        const customerSelect = document.getElementById('order-customer-select');
        if (customerSelect) {
            customerSelect.innerHTML = '<option value="">Müşteri seçiniz...</option>';
            
            customersCache.forEach(customer => {
                console.log('Adding customer:', customer);
                const option = document.createElement('option');
                option.value = customer.id;
                const displayText = customer.name && customer.surname 
                    ? `${customer.name} ${customer.surname}`
                    : customer.name || 'Bilinmeyen Müşteri';
                option.textContent = displayText;
                option.dataset.name = customer.name || '';
                option.dataset.surname = customer.surname || '';
                option.dataset.phone = customer.phoneNumber || '';
                customerSelect.appendChild(option);
            });
        }
        
    } catch (error) {
        console.error('Error loading customers:', error);
        showNotification('Müşteriler yüklenemedi', 'error');
    }
}

/**
 * Load products from API
 */
async function loadProducts() {
    try {
        const response = await window.apiService.fetchGetAll('Products');
        productsCache = response.items || response;
        
        const productSelect = document.getElementById('item-product-select');
        if (productSelect) {
            productSelect.innerHTML = '<option value="">Ürün seçiniz...</option>';
            
            productsCache.forEach(product => {
                const option = document.createElement('option');
                option.value = product.id;
                option.textContent = product.name;
                option.dataset.price = product.price || 0;
                productSelect.appendChild(option);
            });
        }
        
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Ürünler yüklenemedi', 'error');
    }
}

/**
 * API'den siparişleri yükle ve DataTable'a ekle
 */
async function loadOrders() {
    if (!ordersDataTable) {
        console.warn('DataTable henüz başlatılmamış');
        return;
    }

    try {
        showLoadingState();

        const response = await window.apiService.fetchGetAll('Orders');
        const orders = response.items || response;
        
        console.log('Siparişler:', orders);

        ordersDataTable.clear();

        if (orders && orders.length > 0) {
            orders.forEach(order => {
                const rowData = createOrderRowData(order);
                ordersDataTable.row.add(rowData);
            });
        } else {
            showEmptyState();
        }

        ordersDataTable.draw();
        
        // Ürün sipariş özetini güncelle
        updateProductSummary(orders);

    } catch (error) {
        console.error('Siparişler yüklenemedi:', error);
        showErrorState();
        showNotification(`Siparişler yüklenirken bir hata oluştu: ${error.message}`, 'error');
    }
}

/**
 * Ürün sipariş özetini hesapla ve göster
 */
function updateProductSummary(orders) {
    const summaryContainer = document.getElementById('product-summary');
    if (!summaryContainer) return;

    // Ürün özetlerini hesapla
    const productSummary = {};
    
    if (orders && orders.length > 0) {
        orders.forEach(order => {
            if (order.items && order.items.length > 0) {
                order.items.forEach(item => {
                    const productName = item.productName || 'Bilinmeyen Ürün';
                    if (productSummary[productName]) {
                        productSummary[productName] += item.quantity || 0;
                    } else {
                        productSummary[productName] = item.quantity || 0;
                    }
                });
            }
        });
    }

    // Özet HTML'ini oluştur
    let summaryHtml = '';
    
    if (Object.keys(productSummary).length > 0) {
        Object.entries(productSummary)
            .sort(([,a], [,b]) => b - a) // Miktara göre azalan sırada sırala
            .forEach(([productName, totalQuantity]) => {
                summaryHtml += `
                    <div class="col-md-6 col-lg-4">
                        <div class="card border-light shadow-sm h-100">
                            <div class="card-body p-3">
                                <div class="d-flex align-items-center">
                                    <div class="flex-shrink-0 me-3">
                                        <div class="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                                            <i class="fas fa-box"></i>
                                        </div>
                                    </div>
                                    <div class="flex-grow-1">
                                        <div class="d-flex align-items-center justify-content-between">
                                            <h6 class="card-title mb-0 text-truncate me-2" title="${productName}">${productName}</h6>
                                            <span class="badge fs-5 fw-bold px-3 py-2" style="background-color: #d4edda; color: #000000; border: 1px solid #c3e6cb; font-size: 1.1rem !important;">
                                                ${totalQuantity} adet
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            });
    } else {
        summaryHtml = `
            <div class="col-12 text-center text-muted">
                <i class="fas fa-box-open fa-2x mb-3"></i>
                <p>Henüz sipariş bulunmuyor</p>
            </div>
        `;
    }

    summaryContainer.innerHTML = summaryHtml;
}

/**
 * DataTable için yükleniyor durumunu göster
 */
function showLoadingState() {
    if (!ordersDataTable) return;
    
    try {
        ordersDataTable.processing(true);
    } catch (error) {
        console.warn('DataTable processing durumu ayarlanamadı:', error);
    }
}

/**
 * DataTable için boş durum göster
 */
function showEmptyState() {
    console.log('Henüz sipariş bulunmuyor');
}

/**
 * DataTable için hata durumu göster
 */
function showErrorState() {
    if (!ordersDataTable) return;
    
    ordersDataTable.clear().draw();
    showNotification('Veri yüklenirken hata oluştu. Lütfen internet bağlantınızı kontrol edin ve sayfayı yenileyin.', 'error');
}

/**
 * DataTable için sipariş satır verisi oluştur
 */
function createOrderRowData(order) {
    console.log('Sipariş verisi:', order);

    // Tarihleri formatla
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    };

    // Durum belirleme
    const getStatusInfo = (isPaid, isDelivered) => {
        if (isPaid && isDelivered) {
            return ORDER_STATUS_MAP.completed;
        } else if (isPaid) {
            return ORDER_STATUS_MAP.paid;
        } else if (isDelivered) {
            return ORDER_STATUS_MAP.delivered;
        } else {
            return ORDER_STATUS_MAP.pending;
        }
    };

    const statusInfo = getStatusInfo(order.isPaid, order.isDelivered);
    const customerFullName = order.customerSurname 
        ? `${order.customerName} ${order.customerSurname}`
        : order.customerName;

    return [
        // Müşteri
        `<div class="text-truncate">
            <div class="fw-semibold mb-1">${escapeHtml(customerFullName)}</div>
        </div>`,
        
        // Teslim Tarihi
        `<span class="text-nowrap">${formatDate(order.deliveryDate)}</span>`,
        
        // Durum
        `<span class="badge bg-${statusInfo.color}-subtle text-${statusInfo.color}">
            <i class="${statusInfo.icon} me-1"></i>${statusInfo.text}
        </span>`,
        
        // Ödeme Durumu
        `<span class="badge bg-${order.isPaid ? 'success' : 'warning'}-subtle text-${order.isPaid ? 'success' : 'warning'}">
            <i class="fas fa-${order.isPaid ? 'check' : 'clock'} me-1"></i>${order.isPaid ? 'Ödendi' : 'Ödenmedi'}
        </span>`,
        
        // İşlemler
        `<div class="d-flex gap-1">
            <button class="btn btn-outline-info btn-sm" onclick="viewOrder('${order.id}')" title="Görüntüle">
                <i class="ti ti-eye fs-6"></i>
            </button>
            <button class="btn btn-outline-warning btn-sm" onclick="editOrder('${order.id}')" title="Düzenle">
                <i class="ti ti-edit fs-6"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="deleteOrder('${order.id}', '${escapeHtml(customerFullName)}')" title="Sil">
                <i class="ti ti-trash fs-6"></i>
            </button>
        </div>`
    ];
}

/**
 * Handle customer selection
 */
function handleCustomerSelection() {
    const selectElement = document.getElementById('order-customer-select');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const customerNameInput = document.getElementById('order-customer-name-input');
    const customerSurnameInput = document.getElementById('order-customer-surname-input');
    
    if (selectedOption.value) {
        customerNameInput.value = selectedOption.dataset.name || '';
        customerSurnameInput.value = selectedOption.dataset.surname || '';
        customerNameInput.classList.remove('is-invalid');
        customerNameInput.classList.add('is-valid');
        selectElement.classList.remove('is-invalid');
        selectElement.classList.add('is-valid');
    } else {
        customerNameInput.value = '';
        customerSurnameInput.value = '';
        customerNameInput.classList.remove('is-valid');
        selectElement.classList.remove('is-valid');
    }
}

/**
 * Handle product selection in item modal
 */
function handleProductSelection() {
    const selectElement = document.getElementById('item-product-select');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const productNameInput = document.getElementById('item-product-name-input');
    
    if (selectedOption.value) {
        productNameInput.value = selectedOption.textContent;
    } else {
        productNameInput.value = '';
    }
}

/**
 * Add item to table from main modal
 */
function addItemToTable() {
    const productSelect = document.getElementById('item-product-select');
    const productNameInput = document.getElementById('item-product-name-input');
    const quantityInput = document.getElementById('item-quantity-input');
    
    const productId = productSelect.value || null;
    const productName = productNameInput.value.trim();
    const quantity = parseInt(quantityInput.value);
    
    // Validate
    let isValid = true;
    
    if (!productName) {
        productNameInput.classList.add('is-invalid');
        isValid = false;
    } else {
        productNameInput.classList.remove('is-invalid');
    }
    
    if (!quantity || quantity <= 0) {
        quantityInput.classList.add('is-invalid');
        isValid = false;
    } else {
        quantityInput.classList.remove('is-invalid');
    }
    
    if (!isValid) return;
    
    // Check for duplicate
    const existingItem = itemsData.find(item => item.productName.toLowerCase() === productName.toLowerCase());
    if (existingItem) {
        Swal.fire({
            icon: 'warning',
            title: 'Uyarı',
            text: 'Bu ürün zaten eklenmiş!'
        });
        return;
    }
    
    // Add item
    const newItem = {
        productId: productId,
        productName: productName,
        quantity: quantity,
        unitPrice: 0
    };
    
    itemsData.push(newItem);
    updateItemsTable();
    
    // Clear inputs
    productSelect.value = '';
    productNameInput.value = '';
    quantityInput.value = '';
    productNameInput.classList.remove('is-invalid', 'is-valid');
    quantityInput.classList.remove('is-invalid', 'is-valid');
}

/**
 * Open add item modal
 */
function openAddItemModal() {
    editingItemIndex = -1;
    resetItemModal();
    addItemModalInstance.show();
}

/**
 * Save item from modal
 */
function saveItem() {
    const productId = document.getElementById('item-product-select').value || null;
    const productName = document.getElementById('item-product-name-input').value.trim();
    const quantity = parseInt(document.getElementById('item-quantity-input').value);
    
    // Validate
    let isValid = true;
    
    if (!productName) {
        document.getElementById('item-product-name-input').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('item-product-name-input').classList.remove('is-invalid');
    }
    
    if (!quantity || quantity < 1) {
        document.getElementById('item-quantity-input').classList.add('is-invalid');
        isValid = false;
    } else {
        document.getElementById('item-quantity-input').classList.remove('is-invalid');
    }
    
    if (!isValid) {
        return;
    }
    
    // Create item object
    const item = {
        productId,
        productName,
        quantity
    };
    
    // Add or update item
    if (editingItemIndex >= 0) {
        itemsData[editingItemIndex] = item;
        showNotification('Ürün güncellendi', 'success');
    } else {
        itemsData.push(item);
        showNotification('Ürün eklendi', 'success');
    }
    
    updateItemsTable();
    addItemModalInstance.hide();
}

/**
 * Update items table display
 */
function updateItemsTable() {
    const tableBody = document.getElementById('items-table-body');
    const noItemsRow = document.getElementById('no-items-row');
    
    if (!tableBody) return;
    
    // Clear existing rows except the no-items row
    const existingRows = tableBody.querySelectorAll('tr:not(#no-items-row)');
    existingRows.forEach(row => row.remove());
    
    if (itemsData.length === 0) {
        if (noItemsRow) noItemsRow.style.display = '';
    } else {
        if (noItemsRow) noItemsRow.style.display = 'none';
        
        itemsData.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <strong>${escapeHtml(item.productName)}</strong>
                </td>
                <td><span class="badge bg-info text-dark">${item.quantity}</span></td>
                <td class="text-center">
                    <button type="button" class="btn btn-outline-danger btn-sm" onclick="removeItem(${index})" title="Sil">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }
}

/**
 * Remove item from list
 */
function removeItem(index) {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
        itemsData.splice(index, 1);
        updateItemsTable();
        showNotification('Ürün silindi', 'success');
    }
}

/**
 * Reset item modal form
 */
function resetItemModal() {
    const form = document.getElementById('add-item-form');
    if (form) form.reset();
    
    // Reset validation classes
    document.querySelectorAll('#addItemModal .is-invalid, #addItemModal .is-valid').forEach(el => {
        el.classList.remove('is-invalid', 'is-valid');
    });
}

/**
 * Reset main modal
 */
function resetMainModal() {
    const form = document.getElementById('add-order-form');
    if (form) form.reset();
    
    // Reset items
    itemsData = [];
    updateItemsTable();
    
    // Reset customer name inputs
    const customerNameInput = document.getElementById('order-customer-name-input');
    const customerSurnameInput = document.getElementById('order-customer-surname-input');
    if (customerNameInput) customerNameInput.value = '';
    if (customerSurnameInput) customerSurnameInput.value = '';
    
    // Reset validation classes
    document.querySelectorAll('#addOrderModal .is-invalid, #addOrderModal .is-valid').forEach(el => {
        el.classList.remove('is-invalid', 'is-valid');
    });
    
    // Set tomorrow's date as default delivery date again
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    const deliveryDateInput = document.getElementById('order-delivery-date-input');
    if (deliveryDateInput) deliveryDateInput.value = tomorrowStr;
}

/**
 * Handle form submission
 */
async function handleAddFormSubmit(event) {
    event.preventDefault();
    
    // Validate main form
    if (!validateMainForm()) {
        return;
    }
    
    // Check if items exist
    if (itemsData.length === 0) {
        showNotification('En az bir ürün eklemelisiniz', 'error');
        return;
    }
    
    const submitBtn = addOrderForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    try {
        submitBtn.innerHTML = '<i class="ti ti-loader-2 me-2 spin"></i>Kaydediliyor...';
        submitBtn.disabled = true;
        
        // Prepare form data
        const orderData = {
            customerId: document.getElementById('order-customer-select').value || null,
            customerName: document.getElementById('order-customer-name-input').value,
            customerSurname: document.getElementById('order-customer-surname-input').value || null,
            deliveryDate: document.getElementById('order-delivery-date-input').value,
            isPaid: document.getElementById('order-payment-status-select').value === 'true',
            items: itemsData.map(item => ({
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: 0 // Backend için varsayılan değer
            }))
        };
        
        console.log('Sending data:', orderData);
        
        // Send to API
        const response = await window.apiService.fetchPost('Orders', orderData);
        
        console.log('Success:', response);
        
        showNotification('Sipariş başarıyla kaydedildi!', 'success');
        
        // Reset form and button state
        resetMainModal();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Close modal and refresh table
        addModalInstance.hide();
        loadOrders();
        
    } catch (error) {
        console.error('Error saving order:', error);
        showNotification(error.message || 'Sipariş kaydedilirken hata oluştu', 'error');
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Validate main form
 */
function validateMainForm() {
    const customerSelect = document.getElementById('order-customer-select');
    const customerName = document.getElementById('order-customer-name-input');
    const deliveryDate = document.getElementById('order-delivery-date-input');
    
    let isValid = true;
    
    // Reset validation
    [customerSelect, customerName, deliveryDate].forEach(field => {
        field.classList.remove('is-invalid', 'is-valid');
    });
    
    // Validate customer
    if (!customerSelect.value && !customerName.value.trim()) {
        customerSelect.classList.add('is-invalid');
        customerName.classList.add('is-invalid');
        isValid = false;
    } else {
        if (customerSelect.value) customerSelect.classList.add('is-valid');
        if (customerName.value.trim()) customerName.classList.add('is-valid');
    }
    
    // Validate delivery date
    if (!deliveryDate.value) {
        deliveryDate.classList.add('is-invalid');
        isValid = false;
    } else {
        deliveryDate.classList.add('is-valid');
    }
    
    if (!isValid) {
        const firstInvalid = document.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
    }
    
    return isValid;
}

/**
 * View order details
 */
async function viewOrder(orderId) {
    try {
        showLoadingState();
        
        // Fetch order details from API
        const orderDetails = await window.apiService.fetchGet(`Orders/${orderId}`);
        
        console.log('Order details:', orderDetails);
        
        // Show details modal
        showOrderDetailsModal(orderDetails);
        
    } catch (error) {
        console.error('Error fetching order details:', error);
        showNotification('Sipariş detayları yüklenirken hata oluştu', 'error');
    }
}

/**
 * Show order details modal
 */
function showOrderDetailsModal(orderDetails) {
    // Create modal if it doesn't exist
    let detailsModal = document.getElementById('orderDetailsModal');
    if (!detailsModal) {
        createOrderDetailsModal();
        detailsModal = document.getElementById('orderDetailsModal');
    }
    
    // Fill modal content
    const modalTitle = document.getElementById('orderDetailsModalLabel');
    const modalBody = document.getElementById('orderDetailsModalBody');
    
    const customerFullName = orderDetails.customerSurname 
        ? `${orderDetails.customerName} ${orderDetails.customerSurname}`
        : orderDetails.customerName;
    
    modalTitle.innerHTML = `<i class="fas fa-clipboard-list me-2"></i>Sipariş Ürünleri - ${escapeHtml(customerFullName)}`;
    
    let itemsHtml = '';
    
    if (orderDetails.items && orderDetails.items.length > 0) {
        itemsHtml = orderDetails.items.map((item, index) => `
            <tr>
                <td>
                    <div class="fw-semibold text-dark">${escapeHtml(item.productName)}</div>
                </td>
                <td class="text-center">
                    <span class="badge bg-success text-white fs-6 px-3 py-2">${item.quantity}</span>
                </td>
            </tr>
        `).join('');
    } else {
        itemsHtml = `
            <tr>
                <td colspan="2" class="text-center text-muted py-5">
                    <i class="fas fa-box-open fa-3x mb-3"></i>
                    <br>
                    <h5>Henüz ürün eklenmemiş</h5>
                    <p>Bu siparişte henüz hiç ürün bulunmuyor.</p>
                </td>
            </tr>
        `;
    }
    
    modalBody.innerHTML = `
        <div class="row mb-3">
            <div class="col-12">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    <strong>${escapeHtml(customerFullName)}</strong> müşterisinin sipariş ettiği ürünler
                    <span class="badge bg-primary ms-2">${orderDetails.items ? orderDetails.items.length : 0} ürün</span>
                </div>
            </div>
        </div>
        
        <div class="table-responsive">
            <table class="table table-bordered table-hover">
                <thead class="table-light">
                    <tr>
                        <th style="width: 70%;">Ürün Adı</th>
                        <th class="text-center" style="width: 30%;">Miktar</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
        </div>
    `;
    
    // Show modal
    const modalInstance = new bootstrap.Modal(detailsModal);
    modalInstance.show();
}

/**
 * Create order details modal
 */
function createOrderDetailsModal() {
    const modalHtml = `
        <div class="modal fade" id="orderDetailsModal" tabindex="-1" aria-labelledby="orderDetailsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-light">
                        <h5 class="modal-title text-dark" id="orderDetailsModalLabel">
                            <i class="fas fa-clipboard-list me-2"></i>Sipariş Ürünleri
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="orderDetailsModalBody">
                        <!-- Content will be populated dynamically -->
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            <i class="fas fa-times me-2"></i>Kapat
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

/**
 * Edit order
 */
async function editOrder(orderId) {
    showNotification(`Sipariş ${orderId} düzenleme özelliği yakında eklenecek.`, 'info');
}

/**
 * Delete order
 */
async function deleteOrder(orderId, customerName) {
    let confirmed = false;
    
    if (typeof Swal !== 'undefined') {
        const result = await Swal.fire({
            title: 'Sipariş Silme Onayı',
            html: `<strong>"${customerName}"</strong> müşterisinin siparişini silmek istediğinizden emin misiniz?<br><br><small class="text-muted">Bu işlem geri alınamaz.</small>`,
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
        confirmed = confirm(`"${customerName}" müşterisinin siparişini silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz.`);
    }
    
    if (!confirmed) return;

    try {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'Siliniyor...',
                text: 'Sipariş siliniyor, lütfen bekleyin.',
                icon: 'info',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        }
        
        await window.apiService.fetchDelete(`Orders/${orderId}`);
        
        console.log(`Sipariş silindi: ${orderId}`);
        
        if (typeof Swal !== 'undefined') {
            await Swal.fire({
                title: 'Başarılı!',
                text: `Sipariş başarıyla silindi.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        } else {
            showNotification('Sipariş başarıyla silindi!', 'success');
        }
        
        // Tabloyu yenile
        loadOrders();
        
    } catch (error) {
        console.error('Sipariş silinemedi:', error);
        
        let errorMessage = 'Sipariş silinirken bir hata oluştu.';
        
        if (error.message.includes('404')) {
            errorMessage = 'Sipariş bulunamadı. Sayfa yenilenecek.';
            setTimeout(() => loadOrders(), 2000);
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
window.viewOrder = viewOrder;
window.editOrder = editOrder;
window.deleteOrder = deleteOrder;
window.removeItem = removeItem;

console.log('Orders module loaded successfully');
