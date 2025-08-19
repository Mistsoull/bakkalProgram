using Application.Services.Repositories;
using Domain.Entities;
using NArchitecture.Core.Persistence.Repositories;
using Persistence.Contexts;

namespace Persistence.Repositories;

public class OnCreditRepository : EfRepositoryBase<OnCredit, Guid, BaseDbContext>, IOnCreditRepository
{
    public OnCreditRepository(BaseDbContext context) : base(context)
    {
    }
}