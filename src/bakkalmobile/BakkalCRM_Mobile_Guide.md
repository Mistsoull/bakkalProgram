# Mini CRM Mobil Uygulama - Frontend Geliştirme Rehberi

## Giriş
Bu rehber, yöresel ve market ürünleri satan bir dükkan için mini CRM uygulamanızın(BakkalCRM.png) mobil versiyonunu Flutter ile geliştirmek için hazırlanmıştır. Mevcut .NET Web API arka uç (NArchitecture, DDD, MediatR, CQRS, Clean Architecture) ile uyumlu bir ön uç oluşturacağız. Kod tekrarı yapmadan, temel sınıflar kullanarak tutarlı ve sürdürülebilir bir yapı hedefliyoruz.

## Ana Kısıtlamalar
- Kullanıcı adı/şifre ile giriş ekranı yok; doğrudan erişim varsayılır.
- Uygulama yapısı, web ekran görüntüsündeki(BakkalCRM.png) tedarikçi listesi gibi modülleri yansıtmalı (İletişim Kişisi, Firma Adı, Telefon, Not, eylemler).
- Liste sayfaları için ListView veya DataTable widget’ları kullanılacak; her satırda görüntüle/düzenle/sil butonları olacak. Bu tablolarda olacak olan sütünlar, backend'den entity yapısına bakılarak oluşturulacak(../bakkalProgram/Domain/Entities) eğer entityleri bulamazsan, durdurup tabloyu nasıl yapman gerektiğini soracaksın.
- Liste öğelerine dokunmak detay sayfasına yönlendirecek.
- Yan çekmece menüsü ile modüllere (Siparişler, Ürünler, Kategoriler, Müşteriler, Tedarikçiler) erişim sağlanacak.
- Durum yönetimi için Bloc kullanılacak (tercih).
- Mobil ve tablet cihazlar için yanıt verebilirlik çok önemli.

## 1. Flutter UI Tasarım Rehberi
Mobil optimize edilmiş, güzel ve basit bir UI oluşturmaya odaklanın, web uygulamasının düzenine sadık kalarak dokunmatik için uyarlayın.

### Görsel Tasarım ve Temel Bileşenler
- **Renk Paleti**: Web uygulamanın renklerine benzer, mobil ekranda canlı ve okunaklı tonlar (mavinin farklı tonları, beyaz ağırlıklı, ferah görünüm).
- **Fontlar**: Okunaklı ve sade bir font ailesi (örneğin, Google Fonts’tan Poppins veya Lato).
- **İkonlar**: Tutarlılık için Material Design veya Cupertino ikon setleri.
- **Kullanıcı Deneyimi (UX)**: Parmakla kullanım kolaylığı için buton ve etkileşimli elementlerin boyutlarını ayarlayın. Mobil ve tablet için responsive tasarım çok önemli.

### Sayfa Akışları ve Elementler
- **Ana Liste Sayfası (Ör. Tedarikçiler)**: ListView ile tedarikçi listesi, her satırda detaylar ve eylemler.
- **Detay Sayfası**: Liste öğesine dokunulduğunda açılacak detay ekranı.
- **Menü**: Yan çekmece menüsü ile modül erişimi.

## 2. Flutter Frontend Geliştirme Rehberi
UI tasarımından sonra kodlamaya geçin. Sayfa sayfa ilerleyin.

### Geliştirme Yapısı ve Paketler
- **Proje Yapısı**: Clean Architecture ile klasörler (lib/core, lib/features, lib/shared).
- **API Entegrasyonu**: 
  - `dio` paketi ile HTTP istekleri.
  - `retrofit` ile API servisleri.
  - `lib/core/network` altında ApiService sınıfı.
- **Domain Katmanı (Models)**: Web API DTO’larına uygun modeller (ör. Siparis, Urun).
- **Data Katmanı (Repositories)**: ApiService’i kullanan SiparisRepository gibi sınıflar.
- **Presentation Katmanı**: Bloc ile UI ve durum yönetimi.

### Örnek Kodlama Akışı (Tedarikçi Listesi İçin)
- `lib/features/tedarikci/data/models/tedarikci_model.dart`: TedarikciModel sınıfı.
- `lib/features/tedarikci/data/repositories/tedarikci_repository.dart`: TedarikciRepository ile veri çekme.
- `lib/features/tedarikci/presentation/cubit/tedarikci_cubit.dart`: TedarikciState ve TedarikciCubit.
- `lib/features/tedarikci/presentation/pages/tedarikci_listesi_page.dart`: BlocProvider ve BlocBuilder ile UI.

### Geliştirme Adımları
Aşağıdaki adımlar, sayfalar halinde ilerleyerek uygulamanın frontend geliştirme sürecini kapsar. Her adımda, ilgili modülün liste, detay ve ekleme/düzenleme sayfaları sırayla ele alınacaktır.

0. **Menü ve Genel Navigasyon**
   - **Amaç**: Yan çekmece menüsü ile modül erişimini sağla.
   - **Adımlar**:
     1. `navigation_drawer.dart` widget’ı oluştur.
     2. Modülleri (Tedarikçiler, Siparişler vb.) listeleyip yönlendirme ekle.
     3. Scaffold ile menüyü ana ekrana entegre et.
   - **Çıktı**: Kullanıcı, menüden tüm modüllere erişebilir.3. Eylem butonlarını ekle.
     4. Responsive tasarım uygula.

1. **Tedarikçi Liste Sayfası**
   - **Amaç**: Tedarikçi listesini (İletişim Kişisi, Firma Adı, Telefon, Not) ListView ile görüntüle.
   - **Adımlar**:
     1. `tedarikci_listesi_page.dart` dosyasında ListView widget’ını oluştur.
     2. Her satırda TedarikciModel verilerini bağla (Bloc ile veri çekimi).
     3. Görüntüle/düzenle/sil butonlarını ekle (MaterialIcons kullan).
     4. Responsive tasarım için MediaQuery ile ekran boyutlarına uyum sağla.
   - **Çıktı**: Tedarikçi listesi, her satırda eylemlerle birlikte mobil ve tablette düzgün görünür.

2. **Tedarikçi Detay Sayfası**
   - **Amaç**: Bir tedarikçiye dokunulduğunda detayları (İletişim Kişisi, Firma Adı, Telefon, Not) göster.
   - **Adımlar**:
     1. `tedarikci_detay_page.dart` dosyası oluştur.
     2. Seçilen tedarikçinin ID’sini parametre olarak al (go_router ile).
     3. Bloc ile detay verisini çek ve Card widget’larıyla göster.
     4. Geri dönüş ve düzenleme butonları ekle.
   - **Çıktı**: Detay sayfası, seçilen tedarikçinin bilgilerini net bir şekilde sunar.

3. **Tedarikçi Ekleme/Düzenleme Sayfası**
   - **Amaç**: Yeni tedarikçi ekleme veya mevcut bir tedarikçiyi düzenleme.
   - **Adımlar**:
     1. `tedarikci_ekle_duzenle_page.dart` dosyası oluştur.
     2. TextFormField ile İletişim Kişisi, Firma Adı, Telefon, Not alanlarını ekle.
     3. Bloc ile form verilerini kaydet (API POST/PUT).
     4. Düzenleme modunda mevcut verileri doldur.
   - **Çıktı**: Kullanıcı, yeni tedarikçi ekleyebilir veya mevcut olanı düzenleyebilir.

4. **Veresiye, Siparişler, Tedarik Siparişleri, Ürünler, Kategoriler ve Müşteriler Modülleri**
   - **Amaç**: Bu modülleri Tedarikçi için kullanılan aynı şablonla tamamla.
   - **Adımlar**:
     1. Her modül için liste, detay ve ekleme/düzenleme sayfalarını oluştur.
     2. Mevcut kod yapısını (Bloc, Repository) yeniden kullan.
     3. Responsive tasarımı koru.
   - **Çıktı**: Tüm modüller tutarlı bir şekilde çalışır.

## Tamamlanan Modüller

### ✅ 1. Tedarikçiler (Suppliers) Modülü - TAMAMLANDI
- **Models**: SupplierModel + JSON serialization
- **Repository**: SupplierRepository (CRUD operations)
- **Cubit**: SupplierCubit + States (Loading, Loaded, Error)
- **UI Pages**: 
  - SupplierListPage (ListView, FAB, pull-to-refresh)
  - SupplierDetailPage (Card layout, edit/delete actions)
  - SupplierFormPage (Add/Edit form with validation)
- **Features**: 
  - Pagination support (PaginatedResponse)
  - Error handling with user-friendly messages
  - Responsive design for mobile/tablet
  - Navigation drawer integration
  - CRUD operations (Create, Read, Update, Delete)

### ✅ 2. Müşteriler (Customers) Modülü - TAMAMLANDI
- **Models**: CustomerModel + JSON serialization
- **Repository**: CustomerRepository (CRUD operations)
- **Cubit**: CustomerCubit + States (Loading, Loaded, Error)
- **UI Pages**: 
  - CustomerListPage (ListView, FAB, pull-to-refresh)
  - CustomerDetailPage (Card layout, edit/delete actions)
  - CustomerFormPage (Add/Edit form with validation)
- **Features**: 
  - Pagination support (PaginatedResponse)
  - Error handling with user-friendly messages
  - Responsive design for mobile/tablet
  - Navigation drawer integration
  - CRUD operations (Create, Read, Update, Delete)

### ✅ 3. Kategoriler (Categories) Modülü - TAMAMLANDI
- **Models**: CategoryModel + JSON serialization
- **Repository**: CategoryRepository (CRUD operations)
- **Cubit**: CategoryCubit + States (Loading, Loaded, Error)
- **UI Pages**: 
  - CategoryListPage (ListView, FAB, pull-to-refresh)
  - CategoryDetailPage (Card layout, edit/delete actions)
  - CategoryFormPage (Add/Edit form with validation)
- **Features**: 
  - Pagination support (PaginatedResponse)
  - Error handling with user-friendly messages
  - Responsive design for mobile/tablet
  - Navigation drawer integration
  - CRUD operations (Create, Read, Update, Delete)
  - Simple form (only Category Name field)

### ✅ 4. Siparişler (Orders) Modülü - TAMAMLANDI
- **Models**: OrderModel + OrderItemModel + JSON serialization
- **Repository**: OrderRepository (CRUD + status operations)
- **Cubit**: OrderCubit + States (Loading, Loaded, Error)
- **UI Pages**: 
  - OrderListPage (ListView with status indicators, FAB, pull-to-refresh)
  - OrderDetailPage (Comprehensive order + items display, status cards)
  - OrderFormPage (Complex form with order items management, dialog-based item addition)
- **Advanced Features**: 
  - Order Items Management (dynamic add/remove)
  - Status Management (paid/delivered toggles)
  - Business Logic (total calculations, status indicators)
  - Dialog-based Order Item Addition
  - Date picker integration
  - Status color coding (red/green indicators)
  - Complex entity relationships (Order -> OrderItems)
  - Advanced form validation
  - Responsive design for mobile/tablet
  - Navigation drawer integration
  - Full CRUD + markAsDelivered/markAsPaid operations

### 🔄 Sıradaki Modüller
- **Veresiye Defteri (OnCredits)** - ✅ TAMAMLANDI
- **Ürünler (Products)** - ✅ TAMAMLANDI 
- **Tedarik Siparişleri (ProcurementOrders)** - SIRADA

### ✅ 5. Veresiye Defteri (OnCredits) Modülü - TAMAMLANDI
- **Models**: OnCreditModel + JSON serialization
- **Repository**: OnCreditRepository (CRUD operations)
- **Cubit**: OnCreditCubit + States (Loading, Loaded, Error)
- **UI Pages**: 
  - OnCreditListPage (ListView, FAB, pull-to-refresh)
  - OnCreditDetailPage (Card layout with status indicators, edit/delete actions)
  - OnCreditFormPage (Add/Edit form with validation)
- **Advanced Features**: 
  - Payment Status Management (paid/unpaid indicators)
  - Customer & Employee Information Display
  - Amount Formatting (Turkish Lira)
  - Status Color Coding (red/green indicators)
  - Mark as Paid functionality
  - Business Logic (amount calculations, status indicators)
  - Complex form validation
  - Responsive design for mobile/tablet
  - Navigation drawer integration
  - Full CRUD + markAsPaid operations

### ✅ 6. Ürünler (Products) Modülü - TAMAMLANDI
- **Models**: ProductModel + CategoryInfo + JSON serialization
- **Repository**: ProductRepository (CRUD operations)
- **Cubit**: ProductCubit + States (Loading, Loaded, Error)
- **UI Pages**: 
  - ProductListPage (ListView, FAB, pull-to-refresh)
  - ProductDetailPage (Card layout with price highlighting, edit actions)
  - ProductFormPage (Add/Edit form with category dropdown)
- **Advanced Features**: 
  - Category Integration (dropdown selection)
  - Price Formatting (Turkish Lira)
  - Category Information Display
  - Dynamic Category Loading for Forms
  - Price Validation (non-negative)
  - Category Relationship Management
  - Responsive design for mobile/tablet
  - Navigation drawer integration
  - Full CRUD operations with category context