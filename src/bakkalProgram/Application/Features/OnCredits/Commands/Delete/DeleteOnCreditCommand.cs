using Application.Features.OnCredits.Constants;
using Application.Features.OnCredits.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Features.OnCredits.Commands.Delete;

public class DeleteOnCreditCommand : IRequest<DeletedOnCreditResponse>
{
    public Guid Id { get; set; }

    public class DeleteOnCreditCommandHandler : IRequestHandler<DeleteOnCreditCommand, DeletedOnCreditResponse>
    {
        private readonly IMapper _mapper;
        private readonly IOnCreditRepository _onCreditRepository;
        private readonly OnCreditBusinessRules _onCreditBusinessRules;

        public DeleteOnCreditCommandHandler(IMapper mapper, IOnCreditRepository onCreditRepository,
                                         OnCreditBusinessRules onCreditBusinessRules)
        {
            _mapper = mapper;
            _onCreditRepository = onCreditRepository;
            _onCreditBusinessRules = onCreditBusinessRules;
        }

        public async Task<DeletedOnCreditResponse> Handle(DeleteOnCreditCommand request, CancellationToken cancellationToken)
        {
            OnCredit? onCredit = await _onCreditRepository.GetAsync(predicate: oc => oc.Id == request.Id, cancellationToken: cancellationToken);
            await _onCreditBusinessRules.OnCreditShouldExistWhenSelected(onCredit);

            await _onCreditRepository.DeleteAsync(onCredit!);

            DeletedOnCreditResponse response = _mapper.Map<DeletedOnCreditResponse>(onCredit);
            return response;
        }
    }
}