using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using FiniancialForcast.Models;
using MediatR;

namespace FiniancialForcast.Queries
{
    public class RetrieveScenariosQuery : IRequestHandler<RetrieveScenarios, IEnumerable<Scenario>>
    {
        readonly FFContext _context;

        public RetrieveScenariosQuery(FFContext context) {
            _context = context;
        }

        public IEnumerable<Scenario> Handle(RetrieveScenarios message) {
            var skip = message.Skip ?? 0;
            var take = message.Take ?? 1000;
            return _context.Scenarios.OrderBy(e => e.Name).Skip(() => skip).Take(() => take).ToList();
        }
    }

    public class RetrieveScenarios : IRequest<IEnumerable<Scenario>>
    {
        public int? Skip { get; set; }
        public int? Take { get; set; }
    }
}