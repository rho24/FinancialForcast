using System;
using FiniancialForcast.Models;
using MediatR;

namespace FiniancialForcast.Queries
{
    public class RetrieveScenarioQuery :IRequestHandler<RetrieveScenario, Scenario>
    {
        readonly FFContext _context;

        public RetrieveScenarioQuery(FFContext context) {
            _context = context;
        }

        public Scenario Handle(RetrieveScenario message)
        {
            return _context.Scenarios.Find(message.Id);
        }
    }

    public class RetrieveScenario : IRequest<Scenario>
    {
        public int Id { get; set; }
    }
}