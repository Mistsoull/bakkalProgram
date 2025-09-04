using Application.Services.Repositories;
using Domain.Entities;
using NArchitecture.Core.Persistence.Repositories;
using Persistence.Contexts;

namespace Persistence.Repositories;

public class SupplierRepository : EfRepositoryBase<Supplier, Guid, BaseDbContext>, ISupplierRepository
{
    public SupplierRepository(BaseDbContext context) : base(context)
    {
    }
}