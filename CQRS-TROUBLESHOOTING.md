# CQRS Troubleshooting Guide

## Yaygın CQRS Hataları ve Çözümleri

### 1. "No service for type 'MediatR.IMediator' has been registered"

**Nedeni:** MediatR servisinin dependency injection container'a kayıt edilmemesi.

**Çözüm:**
- `ApplicationServiceRegistration.cs` dosyasında `AddMediatR` çağrısının yapıldığından emin olun
- `Program.cs` dosyasında `AddApplicationServices` çağrısının yapıldığından emin olun

### 2. "No handler was found for request of type..."

**Nedeni:** İlgili command/query için handler'ın kayıt edilmemesi veya bulunamması.

**Çözüm:**
- Handler class'ının `IRequestHandler<TRequest, TResponse>` interface'ini implement ettiğinden emin olun
- Handler'ın Application assembly'sinde olduğundan emin olun
- Assembly scanning'in doğru çalıştığından emin olun

### 3. "Could not create instance of type..."

**Nedeni:** Handler'ın dependency'lerinin resolve edilememesi.

**Çözüm:**
- Handler'ın constructor'ında kullanılan tüm servislerin DI container'a kayıt edildiğinden emin olun
- Repository ve business rules sınıflarının kayıt edildiğini kontrol edin

### 4. Production Deployment Hataları

**Nedeni:** Production ortamında eksik konfigürasyonlar.

**Çözüm:**
- `appsettings.Production.json` dosyasının tüm gerekli section'ları içerdiğinden emin olun
- Connection string'in doğru olduğundan emin olun
- Tüm assembly'lerin publish edildiğinden emin olun

## Kontrol Edilmesi Gerekenler

### 1. Service Registration Sırası
```csharp
// Doğru sıralama:
builder.Services.AddApplicationServices(...); // MediatR burada kayıt ediliyor
builder.Services.AddPersistenceServices(...); // Repository'ler burada
builder.Services.AddInfrastructureServices(); // Diğer servisler burada
```

### 2. Handler Implementation
```csharp
public class CreateCategoryCommandHandler : IRequestHandler<CreateCategoryCommand, CreatedCategoryResponse>
{
    // Handler implementation
}
```

### 3. Assembly Registration
```csharp
services.AddMediatR(configuration =>
{
    configuration.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
    // Behaviors...
});
```

## Diagnostic Endpoints

Sistemi test etmek için aşağıdaki endpoint'leri kullanın:

- `GET /api/diagnostics/health` - Genel sistem sağlığı
- `GET /api/diagnostics/mediator-check` - MediatR kayıt kontrolü
- `GET /api/diagnostics/registered-handlers` - Kayıtlı handler'lar
- `GET /api/diagnostics/connection-test` - Veritabanı bağlantı testi (sadece development)

## Production Deployment Checklist

1. ✅ `appsettings.Production.json` dosyası dolu ve doğru
2. ✅ Connection string production ortamına uygun
3. ✅ Tüm NuGet paketleri restore edildi
4. ✅ Release mode'da build yapıldı
5. ✅ Publish işlemi başarılı
6. ✅ web.config dosyası mevcut
7. ✅ .NET 8.0 runtime server'da kurulu
8. ✅ IIS/Plesk'te doğru application pool seçili

## Log Kontrolü

Hatalar hakkında daha fazla bilgi için:
- Application logs: `/logs/` klasörü
- IIS logs: Server'ın IIS log klasörü
- Event Viewer: Windows Event Logs

## Sık Karşılaşılan Hatalar

### FileLoadException
- Tüm dependency'lerin doğru versiyonlarda olduğundan emin olun
- NuGet package restore işlemini tekrar yapın

### Assembly Load Hatası
- publish.deps.json dosyasının mevcut olduğundan emin olun
- Tüm required assembly'lerin publish klasöründe olduğunu kontrol edin

### Database Connection Hatası
- Connection string'in doğru olduğundan emin olun
- Database server'ın erişilebilir olduğundan emin olun
- SQL Server'da mixed mode authentication aktif olduğundan emin olun
