using Application.Features.Orders.Rules;
using Application.Services.Repositories;
using AutoMapper;
using Domain.Entities;
using MediatR;

namespace Application.Features.Orders.Commands.Create;

public class CreateOrderCommand : IRequest<CreatedOrderResponse>
{
    public required string ProductName { get; set; }
    public required int Quantity { get; set; }
    public required string CustomerName { get; set; }
    public required DateTime DeliveryDate { get; set; }
    public Guid? ProductId { get; set; }
    public Guid? CustomerId { get; set; }

    public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, CreatedOrderResponse>
    {
        private readonly IMapper _mapper;
        private readonly IOrderRepository _orderRepository;
        private readonly OrderBusinessRules _orderBusinessRules;

        public CreateOrderCommandHandler(IMapper mapper, IOrderRepository orderRepository,
                                         OrderBusinessRules orderBusinessRules)
        {
            _mapper = mapper;
            _orderRepository = orderRepository;
            _orderBusinessRules = orderBusinessRules;
        }

        public async Task<CreatedOrderResponse> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
        {
            Order order = _mapper.Map<Order>(request);
            await _orderBusinessRules.SetProductNameBasedOnProductId(request.ProductId, request.ProductName, order);
            await _orderBusinessRules.SetCustomerNameBasedOnCustomerId(request.CustomerId, request.CustomerName, order);
            
            await _orderRepository.AddAsync(order);

            CreatedOrderResponse response = _mapper.Map<CreatedOrderResponse>(order);
            return response;
        }
    }
}