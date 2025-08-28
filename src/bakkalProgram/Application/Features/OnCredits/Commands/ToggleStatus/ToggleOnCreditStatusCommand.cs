using Application.Services.Repositories;
using AutoMapper;
using MediatR;
using NArchitecture.Core.Application.Pipelines.Authorization;
using NArchitecture.Core.Application.Pipelines.Caching;
using NArchitecture.Core.Application.Pipelines.Logging;
using NArchitecture.Core.Application.Pipelines.Transaction;
using Domain.Entities;

namespace Application.Features.OnCredits.Commands.ToggleStatus;

public class ToggleOnCreditStatusCommand : IRequest<ToggleOnCreditStatusResponse>
{
    public Guid Id { get; set; }
    public bool IsPaid { get; set; }

    public class ToggleOnCreditStatusCommandHandler : IRequestHandler<ToggleOnCreditStatusCommand, ToggleOnCreditStatusResponse>
    {
        private readonly IMapper _mapper;
        private readonly IOnCreditRepository _onCreditRepository;

        public ToggleOnCreditStatusCommandHandler(IMapper mapper, IOnCreditRepository onCreditRepository)
        {
            _mapper = mapper;
            _onCreditRepository = onCreditRepository;
        }

        public async Task<ToggleOnCreditStatusResponse> Handle(ToggleOnCreditStatusCommand request, CancellationToken cancellationToken)
        {
            OnCredit? onCredit = await _onCreditRepository.GetAsync(
                predicate: oc => oc.Id == request.Id,
                cancellationToken: cancellationToken
            );

            if (onCredit == null)
                throw new ArgumentException("OnCredit not found");

            onCredit.IsPaid = request.IsPaid;
            onCredit.UpdatedDate = DateTime.UtcNow;

            await _onCreditRepository.UpdateAsync(onCredit);

            ToggleOnCreditStatusResponse response = _mapper.Map<ToggleOnCreditStatusResponse>(onCredit);
            return response;
        }
    }
}
