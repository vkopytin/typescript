using System;
using System.Web.Mvc;

using Vko.Services.Impl;
using hellomvc.Controllers;

public class MyControllerFactory : DefaultControllerFactory
{
    public override IController CreateController(System.Web.Routing.RequestContext requestContext, string controllerName)
    {
        if (controllerName.ToLower() == "jira")
        {
            return new JiraController(new ProductsService());
        }
        else
        {
 
            return base.CreateController(requestContext, controllerName);
        }
    }
}