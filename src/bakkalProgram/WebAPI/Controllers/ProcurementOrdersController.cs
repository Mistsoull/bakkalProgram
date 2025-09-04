using Application.Features.ProcurementOrders.Commands.Create;
using Application.Features.ProcurementOrders.Commands.Delete;
using Application.Features.ProcurementOrders.Commands.Update;
using Application.Features.ProcurementOrders.Queries.GetById;
using Application.Features.ProcurementOrders.Queries.GetList;
using NArchitecture.Core.Application.Requests;
using NArchitecture.Core.Application.Responses;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProcurementOrdersController : BaseController
{
    [HttpPost]
    public async Task<ActionResult<CreatedProcurementOrderResponse>> Add([FromBody] CreateProcurementOrderCommand command)
    {
        CreatedProcurementOrderResponse response = await Mediator.Send(command);

        return CreatedAtAction(nameof(GetById), new { response.Id }, response);
    }

    [HttpPut]
    public async Task<ActionResult<UpdatedProcurementOrderResponse>> Update([FromBody] UpdateProcurementOrderCommand command)
    {
        UpdatedProcurementOrderResponse response = await Mediator.Send(command);

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<DeletedProcurementOrderResponse>> Delete([FromRoute] Guid id)
    {
        DeleteProcurementOrderCommand command = new() { Id = id };

        DeletedProcurementOrderResponse response = await Mediator.Send(command);

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GetByIdProcurementOrderResponse>> GetById([FromRoute] Guid id)
    {
        GetByIdProcurementOrderQuery query = new() { Id = id };

        GetByIdProcurementOrderResponse response = await Mediator.Send(query);

        return Ok(response);
    }

    [HttpGet]
    public async Task<ActionResult<GetListResponse<GetListProcurementOrderListItemDto>>> GetList([FromQuery] PageRequest pageRequest)
    {
        GetListProcurementOrderQuery query = new() { PageRequest = pageRequest };

        GetListResponse<GetListProcurementOrderListItemDto> response = await Mediator.Send(query);

        return Ok(response);
    }
}