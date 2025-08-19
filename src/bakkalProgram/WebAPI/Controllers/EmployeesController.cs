using Application.Features.Employees.Commands.Create;
using Application.Features.Employees.Commands.Delete;
using Application.Features.Employees.Commands.Update;
using Application.Features.Employees.Queries.GetById;
using Application.Features.Employees.Queries.GetList;
using NArchitecture.Core.Application.Requests;
using NArchitecture.Core.Application.Responses;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EmployeesController : BaseController
{
    [HttpPost]
    public async Task<ActionResult<CreatedEmployeeResponse>> Add([FromBody] CreateEmployeeCommand command)
    {
        CreatedEmployeeResponse response = await Mediator.Send(command);

        return CreatedAtAction(nameof(GetById), new { response.Id }, response);
    }

    [HttpPut]
    public async Task<ActionResult<UpdatedEmployeeResponse>> Update([FromBody] UpdateEmployeeCommand command)
    {
        UpdatedEmployeeResponse response = await Mediator.Send(command);

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<DeletedEmployeeResponse>> Delete([FromRoute] Guid id)
    {
        DeleteEmployeeCommand command = new() { Id = id };

        DeletedEmployeeResponse response = await Mediator.Send(command);

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GetByIdEmployeeResponse>> GetById([FromRoute] Guid id)
    {
        GetByIdEmployeeQuery query = new() { Id = id };

        GetByIdEmployeeResponse response = await Mediator.Send(query);

        return Ok(response);
    }

    [HttpGet]
    public async Task<ActionResult<GetListResponse<GetListEmployeeListItemDto>>> GetList([FromQuery] PageRequest pageRequest)
    {
        GetListEmployeeQuery query = new() { PageRequest = pageRequest };

        GetListResponse<GetListEmployeeListItemDto> response = await Mediator.Send(query);

        return Ok(response);
    }
}