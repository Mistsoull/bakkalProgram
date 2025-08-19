using Application.Features.OnCredits.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Features.OnCredits.Queries.GetById;

public class GetByIdOnCreditQuery : IRequest<GetByIdOnCreditResponse>
{
    public Guid Id { get; set; }

    public class GetByIdOnCreditQueryHandler : IRequestHandler<GetByIdOnCreditQuery, GetByIdOnCreditResponse>
    {
        private readonly IMapper _mapper;
        private readonly IOnCreditRepository _onCreditRepository;
        private readonly OnCreditBusinessRules _onCreditBusinessRules;

        public GetByIdOnCreditQueryHandler(IMapper mapper, IOnCreditRepository onCreditRepository, OnCreditBusinessRules onCreditBusinessRules)
        {
            _mapper = mapper;
            _onCreditRepository = onCreditRepository;
            _onCreditBusinessRules = onCreditBusinessRules;
        }

        public async Task<GetByIdOnCreditResponse> Handle(GetByIdOnCreditQuery request, CancellationToken cancellationToken)
        {
            OnCredit? onCredit = await _onCreditRepository.GetAsync(predicate: oc => oc.Id == request.Id, cancellationToken: cancellationToken);
            await _onCreditBusinessRules.OnCreditShouldExistWhenSelected(onCredit);

            GetByIdOnCreditResponse response = _mapper.Map<GetByIdOnCreditResponse>(onCredit);
            return response;
        }
    }
}