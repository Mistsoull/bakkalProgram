using Application.Features.Suppliers.Commands.Create;
using Application.Features.Suppliers.Commands.Delete;
using Application.Features.Suppliers.Commands.Update;
using Application.Features.Suppliers.Queries.GetById;
using Application.Features.Suppliers.Queries.GetList;
using AutoMapper;
using NArchitecture.Core.Application.Responses;
using Domain.Entities;
using NArchitecture.Core.Persistence.Paging;

namespace Application.Features.Suppliers.Profiles;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<CreateSupplierCommand, Supplier>();
        CreateMap<Supplier, CreatedSupplierResponse>();

        CreateMap<UpdateSupplierCommand, Supplier>();
        CreateMap<Supplier, UpdatedSupplierResponse>();

        CreateMap<DeleteSupplierCommand, Supplier>();
        CreateMap<Supplier, DeletedSupplierResponse>();

        CreateMap<Supplier, GetByIdSupplierResponse>();

        CreateMap<Supplier, GetListSupplierListItemDto>();
        CreateMap<IPaginate<Supplier>, GetListResponse<GetListSupplierListItemDto>>();
    }
}