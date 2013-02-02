using System.Web.Http;
using System.Web.Mvc;
using StructureMap;
using StructureMap.ServiceLocatorAdapter;
using Sopheon.Web;
using Sopheon.Web.App;

[assembly: WebActivator.PreApplicationStartMethod(typeof(Sopheon.Web.App.App_Start.StructuremapMvc), "Start")]
namespace Sopheon.Web.App.App_Start {
    public static class StructuremapMvc {
        public static void Start() {
            var container = (IContainer) IoC.Initialize();
            DependencyResolver.SetResolver(new SmDependencyResolver(container));
        }
    }
}