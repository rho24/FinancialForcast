using System;
using FiniancialForcast.Models;
using FiniancialForcast.Queries;
using Xunit;
using Xunit.Should;

namespace FinancialForcast.Tests
{
    public class RetrieveScenarioTests
    {
        readonly RetrieveScenarioQuery _sut;

        public RetrieveScenarioTests() {
            _sut = new RetrieveScenarioQuery(new FFContext());
        }

        [Fact]
        public void ShouldReturnScenario() {
            var s = _sut.Handle(new RetrieveScenario() { Id = 1 });

            s.ShouldNotBeNull();
        }

        [Fact]
        public void ShouldReturnNullWhenNoScenario() {
            var s = _sut.Handle(new RetrieveScenario() { Id = 999 });
            s.ShouldBeNull();
        }
    }
}