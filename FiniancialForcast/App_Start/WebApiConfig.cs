using System;
using System.Web.Http;
using FiniancialForcast.Infrastructure;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace FiniancialForcast
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config) {
            // Web API configuration and services
            config.Formatters.Add(new BrowserJsonFormatter());

            var jsonSerializerSettings = GlobalConfiguration.Configuration.Formatters.JsonFormatter.SerializerSettings;
            jsonSerializerSettings.Formatting = Formatting.Indented;
            jsonSerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(name: "DefaultApi", routeTemplate: "api/{controller}/{id}", defaults: new { id = RouteParameter.Optional });
        }
    }
}