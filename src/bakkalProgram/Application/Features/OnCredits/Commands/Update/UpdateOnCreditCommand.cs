using Application.Features.OnCredits.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Features.OnCredits.Commands.Update;

public class UpdateOnCreditCommand : IRequest<UpdatedOnCreditResponse>
{
    public Guid Id { get; set; }
    public required string EmployeeName { get; set; }
    public required string Note { get; set; }
    public required bool IsPaid { get; set; }
    public required double TotalAmount { get; set; }
    public Guid? EmployeeId { get; set; }

    public class UpdateOnCreditCommandHandler : IRequestHandler<UpdateOnCreditCommand, UpdatedOnCreditResponse>
    {
        private readonly IMapper _mapper;
        private readonly IOnCreditRepository _onCreditRepository;
        private readonly OnCreditBusinessRules _onCreditBusinessRules;

        public UpdateOnCreditCommandHandler(IMapper mapper, IOnCreditRepository onCreditRepository,
                                         OnCreditBusinessRules onCreditBusinessRules)
        {
            _mapper = mapper;
            _onCreditRepository = onCreditRepository;
            _onCreditBusinessRules = onCreditBusinessRules;
        }

        public async Task<UpdatedOnCreditResponse> Handle(UpdateOnCreditCommand request, CancellationToken cancellationToken)
        {
            OnCredit? onCredit = await _onCreditRepository.GetAsync(predicate: oc => oc.Id == request.Id, cancellationToken: cancellationToken);
            await _onCreditBusinessRules.OnCreditShouldExistWhenSelected(onCredit);
            onCredit = _mapper.Map(request, onCredit);

            await _onCreditRepository.UpdateAsync(onCredit!);

            UpdatedOnCreditResponse response = _mapper.Map<UpdatedOnCreditResponse>(onCredit);
            return response;
        }
    }
}