using Application.Features.Orders.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Features.Orders.Commands.ToggleStatus;

public class ToggleOrderStatusCommand : IRequest<ToggleOrderStatusResponse>
{
    public Guid Id { get; set; }
    public bool IsDelivered { get; set; }

    public class ToggleOrderStatusCommandHandler : IRequestHandler<ToggleOrderStatusCommand, ToggleOrderStatusResponse>
    {
        private readonly IMapper _mapper;
        private readonly IOrderRepository _orderRepository;
        private readonly OrderBusinessRules _orderBusinessRules;

        public ToggleOrderStatusCommandHandler(IMapper mapper, IOrderRepository orderRepository, OrderBusinessRules orderBusinessRules)
        {
            _mapper = mapper;
            _orderRepository = orderRepository;
            _orderBusinessRules = orderBusinessRules;
        }

        public async Task<ToggleOrderStatusResponse> Handle(ToggleOrderStatusCommand request, CancellationToken cancellationToken)
        {
            Order? order = await _orderRepository.GetAsync(
                predicate: o => o.Id == request.Id, 
                include: o => o.Include(order => order.Items).Include(order => order.Customer!),
                cancellationToken: cancellationToken);
            
            await _orderBusinessRules.OrderShouldExistWhenSelected(order);

            // Teslimat durumunu güncelle
            order!.IsDelivered = request.IsDelivered;

            await _orderRepository.UpdateAsync(order);

            ToggleOrderStatusResponse response = _mapper.Map<ToggleOrderStatusResponse>(order);
            return response;
        }
    }
}
