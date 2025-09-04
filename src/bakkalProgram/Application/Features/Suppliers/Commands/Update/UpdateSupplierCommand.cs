using Application.Features.Suppliers.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Features.Suppliers.Commands.Update;

public class UpdateSupplierCommand : IRequest<UpdatedSupplierResponse>
{
    public Guid Id { get; set; }
    public required string NameSurname { get; set; }
    public required string CompanyName { get; set; }
    public required string PhoneNumber { get; set; }
    public required string Note { get; set; }

    public class UpdateSupplierCommandHandler : IRequestHandler<UpdateSupplierCommand, UpdatedSupplierResponse>
    {
        private readonly IMapper _mapper;
        private readonly ISupplierRepository _supplierRepository;
        private readonly SupplierBusinessRules _supplierBusinessRules;

        public UpdateSupplierCommandHandler(IMapper mapper, ISupplierRepository supplierRepository,
                                         SupplierBusinessRules supplierBusinessRules)
        {
            _mapper = mapper;
            _supplierRepository = supplierRepository;
            _supplierBusinessRules = supplierBusinessRules;
        }

        public async Task<UpdatedSupplierResponse> Handle(UpdateSupplierCommand request, CancellationToken cancellationToken)
        {
            Supplier? supplier = await _supplierRepository.GetAsync(predicate: s => s.Id == request.Id, cancellationToken: cancellationToken);
            await _supplierBusinessRules.SupplierShouldExistWhenSelected(supplier);
            supplier = _mapper.Map(request, supplier);

            await _supplierRepository.UpdateAsync(supplier!);

            UpdatedSupplierResponse response = _mapper.Map<UpdatedSupplierResponse>(supplier);
            return response;
        }
    }
}