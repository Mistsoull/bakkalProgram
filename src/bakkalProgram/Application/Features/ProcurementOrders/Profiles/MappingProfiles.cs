using Application.Features.ProcurementOrders.Commands.Create;
using Application.Features.ProcurementOrders.Commands.Delete;
using Application.Features.ProcurementOrders.Commands.Update;
using Application.Features.ProcurementOrders.Dtos;
using Application.Features.ProcurementOrders.Queries.GetById;
using Application.Features.ProcurementOrders.Queries.GetList;
using AutoMapper;
using NArchitecture.Core.Application.Responses;
using Domain.Entities;
using NArchitecture.Core.Persistence.Paging;

namespace Application.Features.ProcurementOrders.Profiles;

public class MappingProfiles : Profile
{
    public MappingProfiles()
    {
        CreateMap<CreateProcurementOrderCommand, ProcurementOrder>();
        CreateMap<ProcurementOrder, CreatedProcurementOrderResponse>()
            .ForMember(dest => dest.TotalItemCount, opt => opt.MapFrom(src => src.GetTotalItemCount()))
            .ForMember(dest => dest.UniqueProductCount, opt => opt.MapFrom(src => src.GetUniqueProductCount()));

        CreateMap<UpdateProcurementOrderCommand, ProcurementOrder>();
        CreateMap<ProcurementOrder, UpdatedProcurementOrderResponse>();

        CreateMap<DeleteProcurementOrderCommand, ProcurementOrder>();
        CreateMap<ProcurementOrder, DeletedProcurementOrderResponse>();

        CreateMap<ProcurementOrder, GetByIdProcurementOrderResponse>()
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items));

        CreateMap<ProcurementOrder, GetListProcurementOrderListItemDto>()
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items));
        CreateMap<IPaginate<ProcurementOrder>, GetListResponse<GetListProcurementOrderListItemDto>>();

        // ProcurementOrderItem mappings
        CreateMap<ProcurementOrderItem, ProcurementOrderItemDto>();
        CreateMap<CreateProcurementOrderItemDto, ProcurementOrderItem>();
    }
}