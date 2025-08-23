using Domain.Entities;
using NArchitecture.Core.Persistence.Repositories;

namespace Application.Services.Repositories;

public interface IOrderRepository : IAsyncRepository<Order, Guid>, IRepository<Order, Guid>
{
    Task<int> GetTotalOrderCountByDayAsync(DateTime date);
    Task<List<Order>> GetTodaysOrdersAsync(DateTime date);
}