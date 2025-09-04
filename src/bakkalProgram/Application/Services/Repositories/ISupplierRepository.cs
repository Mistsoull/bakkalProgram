using Domain.Entities;
using NArchitecture.Core.Persistence.Repositories;

namespace Application.Services.Repositories;

public interface ISupplierRepository : IAsyncRepository<Supplier, Guid>, IRepository<Supplier, Guid>
{
}