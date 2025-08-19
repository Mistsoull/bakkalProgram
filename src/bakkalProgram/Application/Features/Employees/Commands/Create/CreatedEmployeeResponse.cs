using NArchitecture.Core.Application.Responses;

namespace Application.Features.Employees.Commands.Create;

public class CreatedEmployeeResponse : IResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string PhoneNumber { get; set; }
}