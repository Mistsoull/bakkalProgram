using Application.Features.Orders.Commands.Create;
using Application.Features.Orders.Commands.Delete;
using Application.Features.Orders.Commands.Update;
using Application.Features.Orders.Commands.ToggleStatus;
using Application.Features.Orders.Queries.GetById;
using Application.Features.Orders.Queries.GetList;
using AutoMapper;
using NArchitecture.Core.Application.Responses;
using Domain.Entities;
using NArchitecture.Core.Persistence.Paging;
using Application.Features.Orders.Queries.GetListGetTodaysOrdersList;

namespace Application.Features.Orders.Profiles;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<CreateOrderCommand, Order>();
        CreateMap<Order, CreatedOrderResponse>();

        CreateMap<UpdateOrderCommand, Order>();
        CreateMap<Order, UpdatedOrderResponse>();

        CreateMap<ToggleOrderStatusCommand, Order>();
        CreateMap<Order, ToggleOrderStatusResponse>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product != null ? src.Product.Name : src.ProductName))
            .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Name : src.CustomerName))
            .ForMember(dest => dest.CustomerSurname, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Surname : src.CustomerSurname));

        CreateMap<DeleteOrderCommand, Order>();
        CreateMap<Order, DeletedOrderResponse>();

        CreateMap<Order, GetByIdOrderResponse>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product != null ? src.Product.Name : src.ProductName))
            .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Name : src.CustomerName))
            .ForMember(dest => dest.CustomerSurname, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Surname : src.CustomerSurname));

        CreateMap<Order, GetListOrderListItemDto>();
        CreateMap<IPaginate<Order>, GetListResponse<GetListOrderListItemDto>>();

        CreateMap<Order, GetTodaysOrdersListItemDto>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product != null ? src.Product.Name : src.ProductName))
            .ForMember(dest => dest.CustomerName, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Name : src.CustomerName))
            .ForMember(dest => dest.CustomerSurname, opt => opt.MapFrom(src => src.Customer != null ? src.Customer.Surname : src.CustomerSurname));
    }
}