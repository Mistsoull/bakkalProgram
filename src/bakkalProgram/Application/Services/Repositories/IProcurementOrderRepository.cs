using Domain.Entities;
using NArchitecture.Core.Persistence.Repositories;

namespace Application.Services.Repositories;

public interface IProcurementOrderRepository : IAsyncRepository<ProcurementOrder, Guid>, IRepository<ProcurementOrder, Guid>
{
}