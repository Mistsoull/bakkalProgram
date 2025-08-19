using Application.Features.Customers.Commands.Create;
using Application.Features.Customers.Commands.Delete;
using Application.Features.Customers.Commands.Update;
using Application.Features.Customers.Queries.GetById;
using Application.Features.Customers.Queries.GetList;
using AutoMapper;
using NArchitecture.Core.Application.Responses;
using Domain.Entities;
using NArchitecture.Core.Persistence.Paging;

namespace Application.Features.Customers.Profiles;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<CreateCustomerCommand, Customer>();
        CreateMap<Customer, CreatedCustomerResponse>();

        CreateMap<UpdateCustomerCommand, Customer>();
        CreateMap<Customer, UpdatedCustomerResponse>();

        CreateMap<DeleteCustomerCommand, Customer>();
        CreateMap<Customer, DeletedCustomerResponse>();

        CreateMap<Customer, GetByIdCustomerResponse>();

        CreateMap<Customer, GetListCustomerListItemDto>();
        CreateMap<IPaginate<Customer>, GetListResponse<GetListCustomerListItemDto>>();
    }
}