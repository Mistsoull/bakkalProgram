using Application.Features.Suppliers.Commands.Create;
using Application.Features.Suppliers.Commands.Delete;
using Application.Features.Suppliers.Commands.Update;
using Application.Features.Suppliers.Queries.GetById;
using Application.Features.Suppliers.Queries.GetList;
using NArchitecture.Core.Application.Requests;
using NArchitecture.Core.Application.Responses;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class SuppliersController : BaseController
{
    [HttpPost]
    public async Task<ActionResult<CreatedSupplierResponse>> Add([FromBody] CreateSupplierCommand command)
    {
        CreatedSupplierResponse response = await Mediator.Send(command);

        return CreatedAtAction(nameof(GetById), new { response.Id }, response);
    }

    [HttpPut]
    public async Task<ActionResult<UpdatedSupplierResponse>> Update([FromBody] UpdateSupplierCommand command)
    {
        UpdatedSupplierResponse response = await Mediator.Send(command);

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<DeletedSupplierResponse>> Delete([FromRoute] Guid id)
    {
        DeleteSupplierCommand command = new() { Id = id };

        DeletedSupplierResponse response = await Mediator.Send(command);

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GetByIdSupplierResponse>> GetById([FromRoute] Guid id)
    {
        GetByIdSupplierQuery query = new() { Id = id };

        GetByIdSupplierResponse response = await Mediator.Send(query);

        return Ok(response);
    }

    [HttpGet]
    public async Task<ActionResult<GetListResponse<GetListSupplierListItemDto>>> GetList([FromQuery] PageRequest pageRequest)
    {
        GetListSupplierQuery query = new() { PageRequest = pageRequest };

        GetListResponse<GetListSupplierListItemDto> response = await Mediator.Send(query);

        return Ok(response);
    }
}