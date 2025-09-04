using Application.Features.Suppliers.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Features.Suppliers.Queries.GetById;

public class GetByIdSupplierQuery : IRequest<GetByIdSupplierResponse>
{
    public Guid Id { get; set; }

    public class GetByIdSupplierQueryHandler : IRequestHandler<GetByIdSupplierQuery, GetByIdSupplierResponse>
    {
        private readonly IMapper _mapper;
        private readonly ISupplierRepository _supplierRepository;
        private readonly SupplierBusinessRules _supplierBusinessRules;

        public GetByIdSupplierQueryHandler(IMapper mapper, ISupplierRepository supplierRepository, SupplierBusinessRules supplierBusinessRules)
        {
            _mapper = mapper;
            _supplierRepository = supplierRepository;
            _supplierBusinessRules = supplierBusinessRules;
        }

        public async Task<GetByIdSupplierResponse> Handle(GetByIdSupplierQuery request, CancellationToken cancellationToken)
        {
            Supplier? supplier = await _supplierRepository.GetAsync(predicate: s => s.Id == request.Id, cancellationToken: cancellationToken);
            await _supplierBusinessRules.SupplierShouldExistWhenSelected(supplier);

            GetByIdSupplierResponse response = _mapper.Map<GetByIdSupplierResponse>(supplier);
            return response;
        }
    }
}