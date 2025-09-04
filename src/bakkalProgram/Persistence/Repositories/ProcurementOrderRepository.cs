using Application.Services.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using NArchitecture.Core.Persistence.Repositories;
using Persistence.Contexts;

namespace Persistence.Repositories;

public class ProcurementOrderRepository : EfRepositoryBase<ProcurementOrder, Guid, BaseDbContext>, IProcurementOrderRepository
{
    public ProcurementOrderRepository(BaseDbContext context) : base(context)
    {
    }
}