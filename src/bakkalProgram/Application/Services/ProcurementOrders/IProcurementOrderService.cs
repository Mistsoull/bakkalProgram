using NArchitecture.Core.Persistence.Paging;
using Domain.Entities;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace Application.Services.ProcurementOrders;

public interface IProcurementOrderService
{
    Task<ProcurementOrder?> GetAsync(
        Expression<Func<ProcurementOrder, bool>> predicate,
        Func<IQueryable<ProcurementOrder>, IIncludableQueryable<ProcurementOrder, object>>? include = null,
        bool withDeleted = false,
        bool enableTracking = true,
        CancellationToken cancellationToken = default
    );
    Task<IPaginate<ProcurementOrder>?> GetListAsync(
        Expression<Func<ProcurementOrder, bool>>? predicate = null,
        Func<IQueryable<ProcurementOrder>, IOrderedQueryable<ProcurementOrder>>? orderBy = null,
        Func<IQueryable<ProcurementOrder>, IIncludableQueryable<ProcurementOrder, object>>? include = null,
        int index = 0,
        int size = 10,
        bool withDeleted = false,
        bool enableTracking = true,
        CancellationToken cancellationToken = default
    );
    Task<ProcurementOrder> AddAsync(ProcurementOrder procurementOrder);
    Task<ProcurementOrder> UpdateAsync(ProcurementOrder procurementOrder);
    Task<ProcurementOrder> DeleteAsync(ProcurementOrder procurementOrder, bool permanent = false);
}
