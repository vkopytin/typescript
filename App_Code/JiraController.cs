using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Ajax;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;

using Rebelmouse.jira;

namespace hellomvc.Controllers
{
    public class JiraController : Controller
    {
        static string URL = Vko.Config.JiraConfig["url"];
        static string jUserID = Vko.Config.JiraConfig["user"];
        static string jPassword = Vko.Config.JiraConfig["password"];

        public ActionResult Index ()
        {
            var mvcName = typeof(Controller).Assembly.GetName ();
            var isMono = Type.GetType ("Mono.Runtime") != null;

            ViewData ["Version"] = mvcName.Version.Major + "." + mvcName.Version.Minor;
            ViewData ["Runtime"] = isMono ? "Mono" : ".NET";
            ViewData ["Title"] = "C# MVC - Razor";
            ViewData ["ModuleName"] = "jira";
            ViewData ["bootstrap"] = new {
                issues = this.GetIssues("")
            };

            return View ();
        }
        
        [HttpGet]
        public ActionResult Issues(string status="") {
            var items = this.GetIssues(status);

            return Json(items, JsonRequestBehavior.AllowGet);
        }
        
        private IEnumerable<Issue> GetIssues(string status) {
            var jiraClient = new JiraClient(URL, jUserID, jPassword);
            var items = default(IEnumerable<Issue>);
            
            if (string.IsNullOrEmpty(status)) {
                items = jiraClient.Issues;
            } else {
                items = jiraClient.GetIssuesByStatus(status.Split(','));
            }
            
            return items;
        }
        
        [HttpGet]
        public ActionResult Bookmarklet() {
            var js = @"(function (root, doc) {
    var Utils = {
            elFromString: function (textHTML) {
                var el = document.createElement('div');

                el.innerHTML = textHTML;

                return el.firstChild;
            }
        },
        template = {
            text: '\
<iframe \
  id=""${uniqueId}"" seamless=""seamless"" frameBorder=""0"" \
  class=""jira-worktool-bookmarklet-iframe jira-dialog box-shadow jira-dialog-open popup-width-custom jira-dialog-content-ready"" \
  src=""${src}?referrer=${referrer}&__rmsp=-1&r=${time}"" height=""100%"" \
  width=""100%"" scrolling=""yes"" allowTransparency=""true"" \
  style=""position: fixed;top:10%;left:10%;z-index: 999;border: 1px solid gray;height: 80%;width: 80%;""\
 ></iframe>\
            ',
            render: function (options) {
                var html = this.text.replace(/\${([a-zA-Z0-9_]+)}/g, function (match, prop) {
                        if (prop in options) {
                            return options[prop];
                        }
                        return '';
                    });

                return html;
            }
        },
        BookmarkletBar = function (options) {
            this.onMessageHandler = this.onMessage.bind(this);

            this.init(this.options = options);
        },
        impl = {
            template: template,
            init: function (options) {
                root.addEventListener('message', this.onMessageHandler, false);
            },
            onMessage: function (evnt) {
                var data = evnt.data || '',
                    pair = data.split(':'),
                    namespace = pair[0],
                    command = pair[1];

                if (namespace !== 'bookmarklet') {
                    return false;
                }
                if (command === 'close') {
                    this.close();
                }
            },
            close: function () {
                this.el.parentNode.removeChild(this.el);
                root.removeEventListener('message', this.onMessageHandler);
                delete this['el'];
            },
            render: function () {
                var data = this.options,
                    html = template.render(data),
                    el = Utils.elFromString(html);

                doc.body.appendChild(el);
                this.el = doc.getElementById(uniqueId);

                return this;
            }
        },
        uniqueId = 'jira-worktool-bookmarklet-iframe';

    BookmarkletBar.prototype = impl;

    doc.getElementById(uniqueId) && doc.getElementById(uniqueId).remove();

    new BookmarkletBar({
        uniqueId: uniqueId,
        src: 'https://dev.local/mvc/jira',
        time: +new Date()
    }).render();

}(window, window.document));";
            return this.Content(js, "application/javascript");
        }
        
        [HttpGet]
        public ActionResult Products(int from=0, int count=10, string search=null)
        {
            var products = new Vko.Services.ProductsService();
            if (string.IsNullOrEmpty(search)) {
                var items = products.ListProductsPaged(from, count);

                return Json(items, JsonRequestBehavior.AllowGet);
            }
            var result = products.FindProductsPaged(search);

            return Json(result, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        public ActionResult Products(Vko.Services.Entities.Product product)
        {
            var products = new Vko.Services.ProductsService();
            var items = products.FindProducts(new {
                Id = product.Id
            });
            var item = items.FirstOrDefault();

            if (product.Id < 1 || items.Count() == 0)
            {
                item = products.CreateProduct(product);
            }
            else
            {
                item = products.UpdateProduct(product);
            }

            return Json(item, JsonRequestBehavior.AllowGet);
        }
        
        [HttpGet]
        public ActionResult Suppliers(int from=0, int count=10)
        {
            using (var repo = new Vko.Repository.General())
            {
                var suppliers = repo.Request<Vko.Repository.Entities.Supplier>();
                var items = suppliers.List(from, count);
    
                return Json(items.ToList(), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult Suppliers(Vko.Services.Entities.Supplier supplier)
        {
            var suppliers = new Vko.Services.ProductsService();
            var items = suppliers.FindSuppliers(new {
                Id = supplier.Id
            });
            var item = items.FirstOrDefault();

            if (items.Count() == 0)
            {
                item = suppliers.CreateSupplier(supplier);
            }
            else
            {
                item = suppliers.UpdateSupplier(supplier);
            }

            return Json(item, JsonRequestBehavior.AllowGet);
        }
                
        [HttpGet]
        public ActionResult Categories(int from=0, int count=10)
        {
            using (var repo = new Vko.Repository.General())
            {
                var categories = repo.Request<Vko.Repository.Entities.Category>();
                var items = categories.List(from, count);
    
                return Json(items.ToList(), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult Categories(Vko.Services.Entities.Category category)
        {
            var categories = new Vko.Services.ProductsService();
            var items = categories.FindCategories(new {
                Id = category.Id
            });
            var item = items.FirstOrDefault();

            if (items.Count() == 0)
            {
                item = categories.CreateCategory(category);
            }
            else
            {
                item = categories.UpdateCategory(category);
            }

            return Json(item, JsonRequestBehavior.AllowGet);
        }
        
        [HttpGet]
        public ActionResult Orders(int from=0, int count=10) {
            var products = new Vko.Services.ProductsService();
            var items = products.ListOrders(from, count);

            return Json(items, JsonRequestBehavior.AllowGet);
        }
        
        [HttpGet]
        public ActionResult OrderDetails(int from=0, int count=10) {
            var products = new Vko.Services.ProductsService();
            var items = products.ListOrderDetails(from, count);

            return Json(items, JsonRequestBehavior.AllowGet);
        }
        
        [HttpGet]
        public ActionResult Carts(int from=0, int count=10) {
            var products = new Vko.Services.ProductsService();
            var items = products.ListCarts(from, count);

            return Json(items, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        public ActionResult Carts(int cartDate=0) {
            var products = new Vko.Services.ProductsService();
            var items = products.CreateCart(DateTime.Now);

            return Json(items, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AddToCart(int productId, decimal price) {
            var products = new Vko.Services.ProductsService();
            var items = products.AddToCart(productId, price);

            return Json(items, JsonRequestBehavior.AllowGet);
        }
        
        [HttpPost]
        public ActionResult RemoveFromCart(int productId) {
            var products = new Vko.Services.ProductsService();
            var items = products.RemoveFromCart(productId);

            return Json(items, JsonRequestBehavior.AllowGet);
        }
        
        [HttpGet]
        public ActionResult Report(int from=0, int count=10) {
            var products = new Vko.Services.ProductsService();
            var items = products.Report();

            return Json(items, JsonRequestBehavior.AllowGet);
        }
    }
}
