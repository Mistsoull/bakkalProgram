using Domain.Entities;
using NArchitecture.Core.Persistence.Repositories;

namespace Application.Services.Repositories;

public interface IOnCreditRepository : IAsyncRepository<OnCredit, Guid>, IRepository<OnCredit, Guid>
{
}