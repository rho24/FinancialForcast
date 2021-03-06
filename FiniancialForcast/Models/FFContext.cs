﻿using System;
using System.Data.Entity;

namespace FiniancialForcast.Models
{
    public class FFContext : DbContext
    {
        public DbSet<Scenario> Scenarios { get; set; }

        static FFContext() {
            Database.SetInitializer(new FFContextInitializer());
        }

        public static void Initialize() {
            using(var db = new FFContext()) db.Database.Initialize(true);
        }
    }

    public class FFContextInitializer : DropCreateDatabaseIfModelChanges<FFContext>
    {
        protected override void Seed(FFContext context)
        {
            context.Scenarios.Add(
                new Scenario
                {
                    Name = "test",
                    DayRate = 325,
                    WeeksPerYear = 40,
                    PayeSalary = 10000,
                    VatFlatRatePercentage = 14.5m,
                    VatFirstYear = false,
                    DividendPercentage = 50,
                    YearlyCosts = 2000,
                    DailyExpenses = 0,
                    YearlyExpenses = 0,
                    PensionPercentage = 15
                });
            context.Scenarios.Add(
                new Scenario
                {
                    Name = "testing2",
                    DayRate = 250,
                    WeeksPerYear = 40,
                    PayeSalary = 10000,
                    VatFlatRatePercentage = 14.5m,
                    VatFirstYear = true,
                    DividendPercentage = 50,
                    YearlyCosts = 2000,
                    DailyExpenses = 0,
                    YearlyExpenses = 0,
                    PensionPercentage = 15
                });
        }
    }

    public class Scenario
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public decimal DayRate { get; set; }

        public int WeeksPerYear { get; set; }

        public decimal PayeSalary { get; set; }

        public decimal VatFlatRatePercentage { get; set; }

        public bool VatFirstYear { get; set; }

        public decimal DividendPercentage { get; set; }

        public decimal YearlyCosts { get; set; }

        public decimal DailyExpenses { get; set; }

        public decimal YearlyExpenses { get; set; }

        public decimal PensionPercentage { get; set; }
    }
}