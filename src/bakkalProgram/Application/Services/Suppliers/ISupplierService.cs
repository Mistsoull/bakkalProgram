using NArchitecture.Core.Persistence.Paging;
using Domain.Entities;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace Application.Services.Suppliers;

public interface ISupplierService
{
    Task<Supplier?> GetAsync(
        Expression<Func<Supplier, bool>> predicate,
        Func<IQueryable<Supplier>, IIncludableQueryable<Supplier, object>>? include = null,
        bool withDeleted = false,
        bool enableTracking = true,
        CancellationToken cancellationToken = default
    );
    Task<IPaginate<Supplier>?> GetListAsync(
        Expression<Func<Supplier, bool>>? predicate = null,
        Func<IQueryable<Supplier>, IOrderedQueryable<Supplier>>? orderBy = null,
        Func<IQueryable<Supplier>, IIncludableQueryable<Supplier, object>>? include = null,
        int index = 0,
        int size = 10,
        bool withDeleted = false,
        bool enableTracking = true,
        CancellationToken cancellationToken = default
    );
    Task<Supplier> AddAsync(Supplier supplier);
    Task<Supplier> UpdateAsync(Supplier supplier);
    Task<Supplier> DeleteAsync(Supplier supplier, bool permanent = false);
}
