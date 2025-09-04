using Application.Features.Suppliers.Rules;
using Application.Services.Repositories;
using NArchitecture.Core.Persistence.Paging;
using Domain.Entities;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace Application.Services.Suppliers;

public class SupplierManager : ISupplierService
{
    private readonly ISupplierRepository _supplierRepository;
    private readonly SupplierBusinessRules _supplierBusinessRules;

    public SupplierManager(ISupplierRepository supplierRepository, SupplierBusinessRules supplierBusinessRules)
    {
        _supplierRepository = supplierRepository;
        _supplierBusinessRules = supplierBusinessRules;
    }

    public async Task<Supplier?> GetAsync(
        Expression<Func<Supplier, bool>> predicate,
        Func<IQueryable<Supplier>, IIncludableQueryable<Supplier, object>>? include = null,
        bool withDeleted = false,
        bool enableTracking = true,
        CancellationToken cancellationToken = default
    )
    {
        Supplier? supplier = await _supplierRepository.GetAsync(predicate, include, withDeleted, enableTracking, cancellationToken);
        return supplier;
    }

    public async Task<IPaginate<Supplier>?> GetListAsync(
        Expression<Func<Supplier, bool>>? predicate = null,
        Func<IQueryable<Supplier>, IOrderedQueryable<Supplier>>? orderBy = null,
        Func<IQueryable<Supplier>, IIncludableQueryable<Supplier, object>>? include = null,
        int index = 0,
        int size = 10,
        bool withDeleted = false,
        bool enableTracking = true,
        CancellationToken cancellationToken = default
    )
    {
        IPaginate<Supplier> supplierList = await _supplierRepository.GetListAsync(
            predicate,
            orderBy,
            include,
            index,
            size,
            withDeleted,
            enableTracking,
            cancellationToken
        );
        return supplierList;
    }

    public async Task<Supplier> AddAsync(Supplier supplier)
    {
        Supplier addedSupplier = await _supplierRepository.AddAsync(supplier);

        return addedSupplier;
    }

    public async Task<Supplier> UpdateAsync(Supplier supplier)
    {
        Supplier updatedSupplier = await _supplierRepository.UpdateAsync(supplier);

        return updatedSupplier;
    }

    public async Task<Supplier> DeleteAsync(Supplier supplier, bool permanent = false)
    {
        Supplier deletedSupplier = await _supplierRepository.DeleteAsync(supplier);

        return deletedSupplier;
    }
}
