using Application.Features.OnCredits.Commands.Create;
using Application.Features.OnCredits.Commands.Delete;
using Application.Features.OnCredits.Commands.Update;
using Application.Features.OnCredits.Commands.ToggleStatus;
using Application.Features.OnCredits.Queries.GetById;
using Application.Features.OnCredits.Queries.GetList;
using NArchitecture.Core.Application.Requests;
using NArchitecture.Core.Application.Responses;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class OnCreditsController : BaseController
{
    [HttpPost]
    public async Task<ActionResult<CreatedOnCreditResponse>> Add([FromBody] CreateOnCreditCommand command)
    {
        CreatedOnCreditResponse response = await Mediator.Send(command);

        return CreatedAtAction(nameof(GetById), new { response.Id }, response);
    }

    [HttpPut]
    public async Task<ActionResult<UpdatedOnCreditResponse>> Update([FromBody] UpdateOnCreditCommand command)
    {
        UpdatedOnCreditResponse response = await Mediator.Send(command);

        return Ok(response);
    }

    [HttpPut("{id}/toggle-status")]
    public async Task<ActionResult<ToggleOnCreditStatusResponse>> ToggleStatus([FromRoute] Guid id, [FromBody] ToggleOnCreditStatusCommand command)
    {
        command.Id = id;
        ToggleOnCreditStatusResponse response = await Mediator.Send(command);

        return Ok(response);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<DeletedOnCreditResponse>> Delete([FromRoute] Guid id)
    {
        DeleteOnCreditCommand command = new() { Id = id };

        DeletedOnCreditResponse response = await Mediator.Send(command);

        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GetByIdOnCreditResponse>> GetById([FromRoute] Guid id)
    {
        GetByIdOnCreditQuery query = new() { Id = id };

        GetByIdOnCreditResponse response = await Mediator.Send(query);

        return Ok(response);
    }

    [HttpGet]
    public async Task<ActionResult<GetListResponse<GetListOnCreditListItemDto>>> GetList([FromQuery] PageRequest pageRequest)
    {
        GetListOnCreditQuery query = new() { PageRequest = pageRequest };

        GetListResponse<GetListOnCreditListItemDto> response = await Mediator.Send(query);

        return Ok(response);
    }
}