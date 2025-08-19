using Application.Features.Orders.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Features.Orders.Commands.Update;

public class UpdateOrderCommand : IRequest<UpdatedOrderResponse>
{
    public Guid Id { get; set; }
    public required string ProductName { get; set; }
    public required int Quantity { get; set; }
    public required string CustomerName { get; set; }
    public required DateTime DeliveryDate { get; set; }
    public required bool IsDelivered { get; set; }
    public Guid? ProductId { get; set; }
    public Guid? CustomerId { get; set; }

    public class UpdateOrderCommandHandler : IRequestHandler<UpdateOrderCommand, UpdatedOrderResponse>
    {
        private readonly IMapper _mapper;
        private readonly IOrderRepository _orderRepository;
        private readonly OrderBusinessRules _orderBusinessRules;

        public UpdateOrderCommandHandler(IMapper mapper, IOrderRepository orderRepository,
                                         OrderBusinessRules orderBusinessRules)
        {
            _mapper = mapper;
            _orderRepository = orderRepository;
            _orderBusinessRules = orderBusinessRules;
        }

        public async Task<UpdatedOrderResponse> Handle(UpdateOrderCommand request, CancellationToken cancellationToken)
        {
            Order? order = await _orderRepository.GetAsync(predicate: o => o.Id == request.Id, cancellationToken: cancellationToken);
            await _orderBusinessRules.OrderShouldExistWhenSelected(order);
            order = _mapper.Map(request, order);

            await _orderRepository.UpdateAsync(order!);

            UpdatedOrderResponse response = _mapper.Map<UpdatedOrderResponse>(order);
            return response;
        }
    }
}