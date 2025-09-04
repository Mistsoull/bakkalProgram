using Application.Services.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using NArchitecture.Core.Persistence.Repositories;
using Persistence.Contexts;

namespace Persistence.Repositories;

public class ProcurementOrderItemRepository : EfRepositoryBase<ProcurementOrderItem, Guid, BaseDbContext>, IProcurementOrderItemRepository
{
    public ProcurementOrderItemRepository(BaseDbContext context) : base(context)
    {
    }

    public async Task<List<ProcurementOrderItem>> GetByProcurementOrderIdAsync(Guid procurementOrderId)
    {
        return await Context.ProcurementOrderItems
            .Where(poi => poi.ProcurementOrderId == procurementOrderId)
            .Include(poi => poi.Product)
            .ToListAsync();
    }
}
