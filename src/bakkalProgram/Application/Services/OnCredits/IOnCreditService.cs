using NArchitecture.Core.Persistence.Paging;
using Domain.Entities;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace Application.Services.OnCredits;

public interface IOnCreditService
{
    Task<OnCredit?> GetAsync(
        Expression<Func<OnCredit, bool>> predicate,
        Func<IQueryable<OnCredit>, IIncludableQueryable<OnCredit, object>>? include = null,
        bool withDeleted = false,
        bool enableTracking = true,
        CancellationToken cancellationToken = default
    );
    Task<IPaginate<OnCredit>?> GetListAsync(
        Expression<Func<OnCredit, bool>>? predicate = null,
        Func<IQueryable<OnCredit>, IOrderedQueryable<OnCredit>>? orderBy = null,
        Func<IQueryable<OnCredit>, IIncludableQueryable<OnCredit, object>>? include = null,
        int index = 0,
        int size = 10,
        bool withDeleted = false,
        bool enableTracking = true,
        CancellationToken cancellationToken = default
    );
    Task<OnCredit> AddAsync(OnCredit onCredit);
    Task<OnCredit> UpdateAsync(OnCredit onCredit);
    Task<OnCredit> DeleteAsync(OnCredit onCredit, bool permanent = false);
}
