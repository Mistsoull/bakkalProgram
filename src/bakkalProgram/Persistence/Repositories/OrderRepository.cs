using Application.Services.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using NArchitecture.Core.Persistence.Repositories;
using Persistence.Contexts;

namespace Persistence.Repositories;

public class OrderRepository : EfRepositoryBase<Order, Guid, BaseDbContext>, IOrderRepository
{
    public OrderRepository(BaseDbContext context) : base(context)
    {
    }

    public async Task<int> GetTotalOrderCountByDayAsync(DateTime date)
    {
        return await Context.Orders
            .Where(o => o.DeliveryDate == date.Date)
            .CountAsync();
    }
    public async Task<List<Order>> GetTodaysOrdersAsync(DateTime date)
    {
        return await Context.Orders
            .Include(o => o.Product)
            .Include(o => o.Customer)
            .Where(o => o.DeliveryDate == date.Date)
            .ToListAsync();
    }
}