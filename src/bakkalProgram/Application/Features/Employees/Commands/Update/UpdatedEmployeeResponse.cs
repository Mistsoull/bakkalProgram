using NArchitecture.Core.Application.Responses;

namespace Application.Features.Employees.Commands.Update;

public class UpdatedEmployeeResponse : IResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public string PhoneNumber { get; set; }
}