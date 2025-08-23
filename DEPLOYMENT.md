# Bakkal CRM API - Plesk Deployment Guide

## Ön Hazırlık

### 1. Production Ayarlarını Yapılandırma
`appsettings.Production.json` dosyasında aşağıdaki ayarları güncellemeniz gerekiyor:

- **Domain Ayarları**: `http://ilgazmountainbakkal.com.tr/` yerine gerçek domain adınızı yazın
- **CORS Origins**: Frontend uygulamanızın domain'ini ekleyin
- **Mail Settings**: SMTP ayarlarınızı yapılandırın
- **Security Key**: Güçlü bir security key oluşturun

### 2. Plesk Üzerinde Gereksinimler
- .NET 8.0 Runtime yüklü olmalı
- SQL Server bağlantısı aktif olmalı
- SSL sertifikası yapılandırılmalı

## Deployment Adımları

### 1. Projeyi Derleme ve Yayımlama
```powershell
cd src\bakkalProgram\WebAPI
.\deploy.ps1
```

### 2. Plesk'e Upload
1. Plesk panel'de domain'inizi seçin
2. File Manager'a gidin
3. `httpdocs` klasörünün içeriğini temizleyin
4. `publish` klasöründeki tüm dosyaları `httpdocs`'a upload edin

### 3. Plesk Ayarları
1. **IIS Settings**:
   - Application Pool: .NET Framework version'ı "No Managed Code" yapın
   - Process Model: Load User Profile = True

2. **Database Connection**:
   - Connection string'i kontrol edin
   - Database erişim izinlerini doğrulayın

3. **SSL/TLS**:
   - SSL sertifikasını etkinleştirin
   - HTTPS yönlendirmesini aktif edin

### 4. Environment Variables (Opsiyonel)
Plesk'te environment variable olarak ayarlayabilirsiniz:
- `ASPNETCORE_ENVIRONMENT=Production`
- `ASPNETCORE_URLS=https://+:443;http://+:80`

## Kontrol Listesi

- [ ] appsettings.Production.json yapılandırıldı
- [ ] Domain ve CORS ayarları güncellendi
- [ ] SSL sertifikası aktif
- [ ] Database bağlantısı test edildi
- [ ] API endpoints test edildi
- [ ] Loglar kontrol edildi

## Sorun Giderme

### 1. 500 Hatası
- `logs` klasöründeki hata loglarını kontrol edin
- Connection string'i doğrulayın
- .NET 8.0 Runtime'ın yüklü olduğunu kontrol edin

### 2. CORS Hatası
- appsettings.Production.json'da AllowedOrigins'i kontrol edin
- Frontend domain'inin doğru olduğunu kontrol edin

### 3. Database Bağlantı Hatası
- SQL Server erişimini test edin
- Connection string'deki IP ve port'u kontrol edin
- Firewall ayarlarını kontrol edin

## İletişim
Sorunlar için: [your-email@domain.com]
