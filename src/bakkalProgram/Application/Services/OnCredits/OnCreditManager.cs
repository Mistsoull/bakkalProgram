using Application.Features.OnCredits.Rules;
using Application.Services.Repositories;
using NArchitecture.Core.Persistence.Paging;
using Domain.Entities;
using Microsoft.EntityFrameworkCore.Query;
using System.Linq.Expressions;

namespace Application.Services.OnCredits;

public class OnCreditManager : IOnCreditService
{
    private readonly IOnCreditRepository _onCreditRepository;
    private readonly OnCreditBusinessRules _onCreditBusinessRules;

    public OnCreditManager(IOnCreditRepository onCreditRepository, OnCreditBusinessRules onCreditBusinessRules)
    {
        _onCreditRepository = onCreditRepository;
        _onCreditBusinessRules = onCreditBusinessRules;
    }

    public async Task<OnCredit?> GetAsync(
        Expression<Func<OnCredit, bool>> predicate,
        Func<IQueryable<OnCredit>, IIncludableQueryable<OnCredit, object>>? include = null,
        bool withDeleted = false,
        bool enableTracking = true,
        CancellationToken cancellationToken = default
    )
    {
        OnCredit? onCredit = await _onCreditRepository.GetAsync(predicate, include, withDeleted, enableTracking, cancellationToken);
        return onCredit;
    }

    public async Task<IPaginate<OnCredit>?> GetListAsync(
        Expression<Func<OnCredit, bool>>? predicate = null,
        Func<IQueryable<OnCredit>, IOrderedQueryable<OnCredit>>? orderBy = null,
        Func<IQueryable<OnCredit>, IIncludableQueryable<OnCredit, object>>? include = null,
        int index = 0,
        int size = 10,
        bool withDeleted = false,
        bool enableTracking = true,
        CancellationToken cancellationToken = default
    )
    {
        IPaginate<OnCredit> onCreditList = await _onCreditRepository.GetListAsync(
            predicate,
            orderBy,
            include,
            index,
            size,
            withDeleted,
            enableTracking,
            cancellationToken
        );
        return onCreditList;
    }

    public async Task<OnCredit> AddAsync(OnCredit onCredit)
    {
        OnCredit addedOnCredit = await _onCreditRepository.AddAsync(onCredit);

        return addedOnCredit;
    }

    public async Task<OnCredit> UpdateAsync(OnCredit onCredit)
    {
        OnCredit updatedOnCredit = await _onCreditRepository.UpdateAsync(onCredit);

        return updatedOnCredit;
    }

    public async Task<OnCredit> DeleteAsync(OnCredit onCredit, bool permanent = false)
    {
        OnCredit deletedOnCredit = await _onCreditRepository.DeleteAsync(onCredit);

        return deletedOnCredit;
    }
}
