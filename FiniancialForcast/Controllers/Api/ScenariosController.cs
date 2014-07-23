using System.Collections;
using System.Collections.Generic;
using System.Web.Http;
using FiniancialForcast.Models;
using FiniancialForcast.Queries;
using MediatR;

namespace FiniancialForcast.Controllers.Api
{
    public class ScenariosController:ApiController
    {
        readonly IMediator _mediator;

        public ScenariosController(IMediator mediator) {
            _mediator = mediator;
        }

        public IHttpActionResult GetScenario(int id) {
            var scenario = _mediator.Send(new RetrieveScenario{Id = id});

            if(scenario == null)
                return NotFound();

            return Ok(scenario);
        }

        public IEnumerable<Scenario> GetAllScenarios() {
            var scenarios = _mediator.Send(new RetrieveScenarios());

            return scenarios;
        }

    }
}