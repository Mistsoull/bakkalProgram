using Application.Features.ProcurementOrders.Rules;
using Application.Services.Repositories;
using NArchitecture.Core.Persistence.Paging;
using Domain.Entities;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace Application.Services.ProcurementOrders;

public class ProcurementOrderManager : IProcurementOrderService
{
    private readonly IProcurementOrderRepository _procurementOrderRepository;
    private readonly ProcurementOrderBusinessRules _procurementOrderBusinessRules;

    public ProcurementOrderManager(IProcurementOrderRepository procurementOrderRepository, ProcurementOrderBusinessRules procurementOrderBusinessRules)
    {
        _procurementOrderRepository = procurementOrderRepository;
        _procurementOrderBusinessRules = procurementOrderBusinessRules;
    }

    public async Task<ProcurementOrder?> GetAsync(
        Expression<Func<ProcurementOrder, bool>> predicate,
        Func<IQueryable<ProcurementOrder>, IIncludableQueryable<ProcurementOrder, object>>? include = null,
        bool withDeleted = false,
        bool enableTracking = true,
        CancellationToken cancellationToken = default
    )
    {
        ProcurementOrder? procurementOrder = await _procurementOrderRepository.GetAsync(predicate, include, withDeleted, enableTracking, cancellationToken);
        return procurementOrder;
    }

    public async Task<IPaginate<ProcurementOrder>?> GetListAsync(
        Expression<Func<ProcurementOrder, bool>>? predicate = null,
        Func<IQueryable<ProcurementOrder>, IOrderedQueryable<ProcurementOrder>>? orderBy = null,
        Func<IQueryable<ProcurementOrder>, IIncludableQueryable<ProcurementOrder, object>>? include = null,
        int index = 0,
        int size = 10,
        bool withDeleted = false,
        bool enableTracking = true,
        CancellationToken cancellationToken = default
    )
    {
        IPaginate<ProcurementOrder> procurementOrderList = await _procurementOrderRepository.GetListAsync(
            predicate,
            orderBy,
            include,
            index,
            size,
            withDeleted,
            enableTracking,
            cancellationToken
        );
        return procurementOrderList;
    }

    public async Task<ProcurementOrder> AddAsync(ProcurementOrder procurementOrder)
    {
        ProcurementOrder addedProcurementOrder = await _procurementOrderRepository.AddAsync(procurementOrder);

        return addedProcurementOrder;
    }

    public async Task<ProcurementOrder> UpdateAsync(ProcurementOrder procurementOrder)
    {
        ProcurementOrder updatedProcurementOrder = await _procurementOrderRepository.UpdateAsync(procurementOrder);

        return updatedProcurementOrder;
    }

    public async Task<ProcurementOrder> DeleteAsync(ProcurementOrder procurementOrder, bool permanent = false)
    {
        ProcurementOrder deletedProcurementOrder = await _procurementOrderRepository.DeleteAsync(procurementOrder);

        return deletedProcurementOrder;
    }
}
