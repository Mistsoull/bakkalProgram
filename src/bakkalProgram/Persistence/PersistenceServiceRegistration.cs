using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using NArchitecture.Core.Persistence.DependencyInjection;
using Persistence.Contexts;
using Application.Services.Repositories;
using Persistence.Repositories;

namespace Persistence;

public static class PersistenceServiceRegistration
{
    public static IServiceCollection AddPersistenceServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<BaseDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("SqlConnectionPlesk")));
        services.AddDbMigrationApplier(buildServices => buildServices.GetRequiredService<BaseDbContext>());


        services.AddScoped<ICategoryRepository, CategoryRepository>();
        services.AddScoped<ICustomerRepository, CustomerRepository>();
        services.AddScoped<IEmployeeRepository, EmployeeRepository>();
        services.AddScoped<IOnCreditRepository, OnCreditRepository>();
        services.AddScoped<IOrderRepository, OrderRepository>();
        services.AddScoped<IProductRepository, ProductRepository>();
        return services;
    }
}
