using FiniancialForcast.Models;
using FiniancialForcast.Queries;
using Xunit;
using Xunit.Should;

namespace FinancialForcast.Tests
{
    public class RetrieveScenariosTests
    {
        readonly RetrieveScenariosQuery _sut;

        public RetrieveScenariosTests()
        {
            _sut = new RetrieveScenariosQuery(new FFContext());
        }

        [Fact]
        public void ShouldReturnAllScenarios() {
            var scenarios = _sut.Handle(new RetrieveScenarios());

            scenarios.ShouldNotBeEmpty();
        }

        [Fact]
        public void ShouldReturnEmptyIfNoneLeft() {
            var scenarios = _sut.Handle(new RetrieveScenarios() { Skip = 10 });

            scenarios.ShouldBeEmpty();
        }
    }
}