/**
 * Tedarik Siparişleri Sayfa Yönetimi
 * apiService.js tabanlı, clean code prensipleriyle yazılmış tedarik sipariş yönetim modülü
 */

// DOM Element Referansları
let procurementOrdersTable;
let procurementOrdersDataTable;
let addProcurementOrderForm;
let addProcurementOrderModal;
let addItemModal;

// Bootstrap Modal Instances
let addModalInstance;
let addItemModalInstance;

// Data storage
let itemsData = [];
let editingItemIndex = -1;
let suppliersCache = [];
let productsCache = [];

/**
 * Sipariş durumuna göre ikon ve renk haritası
 */
const ORDER_STATUS_MAP = {
    'pending': { icon: 'fas fa-clock', color: 'warning', text: 'Bekliyor' },
    'confirmed': { icon: 'fas fa-check', color: 'info', text: 'Onaylandı' },
    'shipped': { icon: 'fas fa-truck', color: 'primary', text: 'Kargoda' },
    'delivered': { icon: 'fas fa-check-circle', color: 'success', text: 'Teslim Edildi' },
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
    procurementOrdersTable = document.getElementById('procurement-orders-datatable');
    
    // Forms and Modals
    addProcurementOrderForm = document.getElementById('add-procurement-order-form');
    addProcurementOrderModal = document.getElementById('addProcurementOrderModal');
    addItemModal = document.getElementById('addItemModal');
    
    // Bootstrap Modal Instances
    if (addProcurementOrderModal) {
        addModalInstance = new bootstrap.Modal(addProcurementOrderModal);
    }
    if (addItemModal) {
        addItemModalInstance = new bootstrap.Modal(addItemModal);
    }
    
    // DataTable'ı başlat
    if (procurementOrdersTable) {
        initializeDataTable();
    }
    
    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    const orderDateInput = document.getElementById('po-order-date-input');
    if (orderDateInput) {
        orderDateInput.value = today;
        orderDateInput.setAttribute('min', today);
    }
    
    const deliveryDateInput = document.getElementById('po-delivery-date-input');
    if (deliveryDateInput) {
        deliveryDateInput.setAttribute('min', today);
    }
}

/**
 * DataTable'ı başlat
 */
function initializeDataTable() {
    if (!procurementOrdersTable) return;
    
    try {
        console.log('Procurement Orders DataTable başlatılıyor...');
        
        procurementOrdersDataTable = $(procurementOrdersTable).DataTable({
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
                    filename: 'tedarik_siparisleri_' + new Date().toISOString().slice(0,10),
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
                    filename: 'tedarik_siparisleri_' + new Date().toISOString().slice(0,10),
                    title: 'Tedarik Siparişleri Listesi',
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
                    filename: 'tedarik_siparisleri_' + new Date().toISOString().slice(0,10),
                    title: 'Tedarik Siparişleri Listesi',
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
                    title: 'Tedarik Siparişleri Listesi',
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
            order: [[1, 'desc']], // Sipariş tarihine göre yeniden eskiye sırala
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
        
        console.log('Procurement Orders DataTable başarıyla başlatıldı');
        
    } catch (error) {
        console.error('Procurement Orders DataTable başlatılamadı:', error);
    }
}

/**
 * Olay dinleyicilerini kur
 */
function setupEventListeners() {
    // Add form submit
    if (addProcurementOrderForm) {
        addProcurementOrderForm.addEventListener('submit', handleAddFormSubmit);
    }
    
    // Supplier selection change
    const supplierSelect = document.getElementById('po-supplier-select');
    if (supplierSelect) {
        supplierSelect.addEventListener('change', handleSupplierSelection);
    }
    
    // Add item button
    const addItemBtn = document.getElementById('add-item-btn');
    if (addItemBtn) {
        addItemBtn.addEventListener('click', openAddItemModal);
    }
    
    // Save item button
    const saveItemBtn = document.getElementById('save-item-btn');
    if (saveItemBtn) {
        saveItemBtn.addEventListener('click', saveItem);
    }
    
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
    if (addProcurementOrderModal) {
        addProcurementOrderModal.addEventListener('hidden.bs.modal', resetMainModal);
    }
}

/**
 * Load initial data (suppliers and products)
 */
async function loadInitialData() {
    try {
        await Promise.all([
            loadSuppliers(),
            loadProducts(),
            loadProcurementOrders()
        ]);
    } catch (error) {
        console.error('Error loading initial data:', error);
        showNotification('Veri yüklenirken hata oluştu', 'error');
    }
}

/**
 * Load suppliers from API
 */
async function loadSuppliers() {
    try {
        const response = await window.apiService.fetchGetAll('Suppliers');
        suppliersCache = response.items || response;
        
        console.log('Suppliers loaded:', suppliersCache);
        
        const supplierSelect = document.getElementById('po-supplier-select');
        if (supplierSelect) {
            supplierSelect.innerHTML = '<option value="">Tedarikçi seçiniz...</option>';
            
            suppliersCache.forEach(supplier => {
                console.log('Adding supplier:', supplier);
                const option = document.createElement('option');
                option.value = supplier.id;
                // Use nameSurname and companyName from the DTO
                const displayText = supplier.nameSurname && supplier.companyName 
                    ? `${supplier.nameSurname} - ${supplier.companyName}`
                    : supplier.nameSurname || supplier.companyName || supplier.name || 'Bilinmeyen Tedarikçi';
                option.textContent = displayText;
                option.dataset.nameSurname = supplier.nameSurname || '';
                option.dataset.companyName = supplier.companyName || '';
                option.dataset.phone = supplier.phoneNumber || '';
                supplierSelect.appendChild(option);
            });
        }
        
    } catch (error) {
        console.error('Error loading suppliers:', error);
        showNotification('Tedarikçiler yüklenemedi', 'error');
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
 * API'den tedarik siparişlerini yükle ve DataTable'a ekle
 */
async function loadProcurementOrders() {
    if (!procurementOrdersDataTable) {
        console.warn('DataTable henüz başlatılmamış');
        return;
    }

    try {
        showLoadingState();

        const response = await window.apiService.fetchGetAll('ProcurementOrders');
        const orders = response.items || response;
        
        console.log('Tedarik Siparişleri:', orders);

        procurementOrdersDataTable.clear();

        if (orders && orders.length > 0) {
            orders.forEach(order => {
                const rowData = createProcurementOrderRowData(order);
                procurementOrdersDataTable.row.add(rowData);
            });
        } else {
            showEmptyState();
        }

        procurementOrdersDataTable.draw();

    } catch (error) {
        console.error('Tedarik siparişleri yüklenemedi:', error);
        showErrorState();
        showNotification(`Tedarik siparişleri yüklenirken bir hata oluştu: ${error.message}`, 'error');
    }
}

/**
 * DataTable için yükleniyor durumunu göster
 */
function showLoadingState() {
    if (!procurementOrdersDataTable) return;
    
    try {
        procurementOrdersDataTable.processing(true);
    } catch (error) {
        console.warn('DataTable processing durumu ayarlanamadı:', error);
    }
}

/**
 * DataTable için boş durum göster
 */
function showEmptyState() {
    console.log('Henüz tedarik siparişi bulunmuyor');
}

/**
 * DataTable için hata durumu göster
 */
function showErrorState() {
    if (!procurementOrdersDataTable) return;
    
    procurementOrdersDataTable.clear().draw();
    showNotification('Veri yüklenirken hata oluştu. Lütfen internet bağlantınızı kontrol edin ve sayfayı yenileyin.', 'error');
}

/**
 * DataTable için tedarik siparişi satır verisi oluştur
 */
function createProcurementOrderRowData(order) {
    console.log('Tedarik Siparişi verisi:', order);

    // Tarihleri formatla
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR');
    };

    // Tutarı formatla - artık backend'den gelecek
    const formatPrice = (price) => {
        if (price === null || price === undefined || isNaN(price)) {
            return '₺0,00';
        }
        return new Intl.NumberFormat('tr-TR', {
            style: 'currency',
            currency: 'TRY',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    };

    // Durum belirleme
    const getStatusInfo = (isReceived) => {
        if (isReceived) {
            return ORDER_STATUS_MAP.delivered;
        } else {
            return ORDER_STATUS_MAP.pending;
        }
    };

    const statusInfo = getStatusInfo(order.isReceived);

    return [
        // Tedarikçi
        `<div class="text-truncate">
            <div class="fw-semibold mb-1">${escapeHtml(order.supplierName)}</div>
            ${order.items && order.items.length > 0 ? 
                `<small class="text-muted">${order.items.length} ürün</small>` : 
                '<small class="text-muted">0 ürün</small>'
            }
        </div>`,
        
        // Sipariş Tarihi
        `<span class="text-nowrap">${formatDate(order.orderDate)}</span>`,
        
        // Teslim Tarihi
        `<span class="text-nowrap">${formatDate(order.expectedDeliveryDate)}</span>`,
        
        // Durum
        `<span class="badge bg-${statusInfo.color}-subtle text-${statusInfo.color}">
            <i class="${statusInfo.icon} me-1"></i>${statusInfo.text}
        </span>`,
        
        // İşlemler
        `<div class="d-flex gap-1">
            <button class="btn btn-outline-info btn-sm" onclick="viewProcurementOrder('${order.id}')" title="Görüntüle">
                <i class="ti ti-eye fs-6"></i>
            </button>
            <button class="btn btn-outline-warning btn-sm" onclick="editProcurementOrder('${order.id}')" title="Düzenle">
                <i class="ti ti-edit fs-6"></i>
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="deleteProcurementOrder('${order.id}', '${escapeHtml(order.supplierName)}')" title="Sil">
                <i class="ti ti-trash fs-6"></i>
            </button>
        </div>`
    ];
}

/**
 * Handle supplier selection
 */
function handleSupplierSelection() {
    const selectElement = document.getElementById('po-supplier-select');
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const supplierNameInput = document.getElementById('po-supplier-name-input');
    
    if (selectedOption.value) {
        // Use the nameSurname and companyName from the dataset
        const displayName = selectedOption.dataset.nameSurname && selectedOption.dataset.companyName 
            ? `${selectedOption.dataset.nameSurname} - ${selectedOption.dataset.companyName}`
            : selectedOption.textContent;
        supplierNameInput.value = displayName;
        supplierNameInput.classList.remove('is-invalid');
        supplierNameInput.classList.add('is-valid');
        selectElement.classList.remove('is-invalid');
        selectElement.classList.add('is-valid');
    } else {
        supplierNameInput.value = '';
        supplierNameInput.classList.remove('is-valid');
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
    const tableBody = document.getElementById('modal-items-table-body');
    const noItemsMessage = document.getElementById('modal-no-items-message');
    const modalTable = document.getElementById('modal-items-table');
    
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    if (itemsData.length === 0) {
        noItemsMessage.style.display = 'block';
        modalTable.style.display = 'none';
    } else {
        noItemsMessage.style.display = 'none';
        modalTable.style.display = 'table';
        
        itemsData.forEach((item, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <strong>${escapeHtml(item.productName)}</strong>
                </td>
                <td><span class="badge bg-info text-dark">${item.quantity}</span></td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button type="button" class="btn btn-outline-danger" onclick="removeItem(${index})" title="Sil">
                            <i class="ti ti-trash"></i>
                        </button>
                    </div>
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
    const form = document.getElementById('add-procurement-order-form');
    if (form) form.reset();
    
    // Reset items
    itemsData = [];
    updateItemsTable();
    
    // Reset supplier name input
    const supplierNameInput = document.getElementById('po-supplier-name-input');
    if (supplierNameInput) supplierNameInput.value = '';
    
    // Reset validation classes
    document.querySelectorAll('#addProcurementOrderModal .is-invalid, #addProcurementOrderModal .is-valid').forEach(el => {
        el.classList.remove('is-invalid', 'is-valid');
    });
    
    // Set today's date again
    const today = new Date().toISOString().split('T')[0];
    const orderDateInput = document.getElementById('po-order-date-input');
    if (orderDateInput) orderDateInput.value = today;
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
    
    const submitBtn = addProcurementOrderForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    try {
        submitBtn.innerHTML = '<i class="ti ti-loader-2 me-2 spin"></i>Kaydediliyor...';
        submitBtn.disabled = true;
        
        // Prepare form data
        const formData = new FormData(addProcurementOrderForm);
        
        const procurementOrderData = {
            supplierId: document.getElementById('po-supplier-select').value || null,
            supplierName: document.getElementById('po-supplier-name-input').value,
            orderDate: document.getElementById('po-order-date-input').value,
            expectedDeliveryDate: document.getElementById('po-delivery-date-input').value || null,
            notes: document.getElementById('po-notes-input').value || null,
            items: itemsData.map(item => ({
                productId: item.productId,
                productName: item.productName,
                quantity: item.quantity,
                unitPrice: 0 // Backend için varsayılan değer
            }))
        };
        
        console.log('Sending data:', procurementOrderData);
        
        // Send to API
        const response = await window.apiService.fetchPost('ProcurementOrders', procurementOrderData);
        
        console.log('Success:', response);
        
        showNotification('Tedarik siparişi başarıyla kaydedildi!', 'success');
        
        // Close modal and refresh table
        addModalInstance.hide();
        loadProcurementOrders();
        
    } catch (error) {
        console.error('Error saving procurement order:', error);
        showNotification(error.message || 'Sipariş kaydedilirken hata oluştu', 'error');
        
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Validate main form
 */
function validateMainForm() {
    const supplierSelect = document.getElementById('po-supplier-select');
    const supplierName = document.getElementById('po-supplier-name-input');
    const orderDate = document.getElementById('po-order-date-input');
    
    let isValid = true;
    
    // Reset validation
    [supplierSelect, supplierName, orderDate].forEach(field => {
        field.classList.remove('is-invalid', 'is-valid');
    });
    
    // Validate supplier
    if (!supplierSelect.value && !supplierName.value.trim()) {
        supplierSelect.classList.add('is-invalid');
        supplierName.classList.add('is-invalid');
        isValid = false;
    } else {
        if (supplierSelect.value) supplierSelect.classList.add('is-valid');
        if (supplierName.value.trim()) supplierName.classList.add('is-valid');
    }
    
    // Validate order date
    if (!orderDate.value) {
        orderDate.classList.add('is-invalid');
        isValid = false;
    } else {
        orderDate.classList.add('is-valid');
    }
    
    if (!isValid) {
        const firstInvalid = document.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
    }
    
    return isValid;
}

/**
 * View procurement order details
 */
async function viewProcurementOrder(orderId) {
    try {
        showLoadingState();
        
        // Fetch order details from API
        const orderDetails = await window.apiService.fetchGet(`ProcurementOrders/${orderId}`);
        
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
    
    modalTitle.innerHTML = `<i class="fas fa-clipboard-list me-2"></i>Sipariş Ürünleri - ${escapeHtml(orderDetails.supplierName)}`;
    
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
                    <strong>${escapeHtml(orderDetails.supplierName)}</strong> tedarikçisinden sipariş edilen ürünler
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
 * Edit procurement order
 */
async function editProcurementOrder(orderId) {
    showNotification(`Sipariş ${orderId} düzenleme özelliği yakında eklenecek.`, 'info');
}

/**
 * Delete procurement order
 */
async function deleteProcurementOrder(orderId, supplierName) {
    let confirmed = false;
    
    if (typeof Swal !== 'undefined') {
        const result = await Swal.fire({
            title: 'Sipariş Silme Onayı',
            html: `<strong>"${supplierName}"</strong> tedarikçisinin siparişini silmek istediğinizden emin misiniz?<br><br><small class="text-muted">Bu işlem geri alınamaz.</small>`,
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
        confirmed = confirm(`"${supplierName}" tedarikçisinin siparişini silmek istediğinizden emin misiniz?\n\nBu işlem geri alınamaz.`);
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
        
        await window.apiService.fetchDelete(`ProcurementOrders/${orderId}`);
        
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
        loadProcurementOrders();
        
    } catch (error) {
        console.error('Sipariş silinemedi:', error);
        
        let errorMessage = 'Sipariş silinirken bir hata oluştu.';
        
        if (error.message.includes('404')) {
            errorMessage = 'Sipariş bulunamadı. Sayfa yenilenecek.';
            setTimeout(() => loadProcurementOrders(), 2000);
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
window.viewProcurementOrder = viewProcurementOrder;
window.editProcurementOrder = editProcurementOrder;
window.deleteProcurementOrder = deleteProcurementOrder;
window.removeItem = removeItem;

console.log('Procurement Orders module loaded successfully');
