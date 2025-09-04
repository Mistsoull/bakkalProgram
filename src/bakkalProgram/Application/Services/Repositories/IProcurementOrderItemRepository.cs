using Domain.Entities;
using NArchitecture.Core.Persistence.Repositories;

namespace Application.Services.Repositories;

public interface IProcurementOrderItemRepository : IAsyncRepository<ProcurementOrderItem, Guid>, IRepository<ProcurementOrderItem, Guid>
{
    Task<List<ProcurementOrderItem>> GetByProcurementOrderIdAsync(Guid procurementOrderId);
}
