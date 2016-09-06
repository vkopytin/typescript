define("app/jira/command", ["require", "exports", "app/jira/base/base"], function (require, exports, Base) {
    "use strict";
    var Command = (function (_super) {
        __extends(Command, _super);
        function Command(opts) {
            _super.call(this);
            this.init(opts);
        }
        Command.prototype.init = function (opts) {
            this.handler = opts.execute;
            this.scope = opts.scope || this;
        };
        Command.prototype.execute = function () {
            this.handler.apply(this.scope, arguments);
        };
        return Command;
    }(Base));
    return Command;
});
define("app/jira/base/i_base_view", ["require", "exports"], function (require, exports) {
    "use strict";
});
/// <reference path="../../../vendor.d.ts" />
/// <reference path="base.ts" />
/// <reference path="base_view_model.ts" />
/// <reference path="../command.ts" />
define("app/jira/base/base_view", ["require", "exports", 'jquery', 'underscore', 'react'], function (require, exports, $, _, React) {
    "use strict";
    var BaseView = (function (_super) {
        __extends(BaseView, _super);
        function BaseView(opts) {
            _super.call(this, opts);
            this.isFinish = false;
            this.__name = this.constructor.name;
            window.report[this.__name] = ++window.report[this.__name] || 1;
            this.init(opts);
            //console.log('Created: ' + this.constructor.name)
        }
        BaseView.prototype.init = function (opts) {
            $(this.props.viewModel).on('viewModel.finish', _.bind(this.finish, this));
        };
        BaseView.prototype.finish = function () {
            window.report[this.__name] = --window.report[this.__name];
            if (this.isFinish) {
                throw ('Warinig: Object is removed two times.');
            }
            this.isFinish = true;
            //console.log('Removed: ' + this.constructor.name);
        };
        BaseView.prototype.runCommand = function (name, options) {
            var command = this.props.viewModel.getCommand(name);
            if (command) {
                command.execute.apply(command, arguments);
            }
        };
        BaseView.prototype.onNavigateTo = function () {
            this.props.viewModel && this.props.viewModel.navigateTo();
        };
        BaseView.prototype.onNavigateFrom = function () {
            this.props.viewModel && this.props.viewModel.navigateFrom();
        };
        return BaseView;
    }(React.Component));
    return BaseView;
});
/// <reference path="base/base_view.ts" />
/// <reference path="base/base_view_model.ts" />
define("app/jira/utils", ["require", "exports", 'underscore', 'jquery', 'react', 'react-dom'], function (require, exports, _, $, React, ReactDOM) {
    "use strict";
    var utils;
    (function (utils) {
        function extend(protoProps, staticProps) {
            var parent = this;
            var child;
            // The constructor function for the new subclass is either defined by you
            // (the "constructor" property in your `extend` definition), or defaulted
            // by us to simply call the parent's constructor.
            if (protoProps && _.has(protoProps, 'ctor')) {
                child = protoProps.ctor;
            }
            else {
                child = function () { return parent.apply(this, arguments); };
            }
            // Add static properties to the constructor function, if supplied.
            _.extend(child, parent, staticProps);
            // Set the prototype chain to inherit from `parent`, without calling
            // `parent`'s constructor function.
            var Surrogate = function () { this.constructor = child; };
            Surrogate.prototype = parent.prototype;
            child.prototype = new Surrogate();
            // Add prototype properties (instance properties) to the subclass,
            // if supplied.
            if (protoProps)
                _.extend(child.prototype, protoProps);
            // Set a convenience property in case the parent's prototype is needed
            // later.
            child.__super__ = parent.prototype;
            return child;
        }
        utils.extend = extend;
        function Create(Type, options) {
            //return new Type(options);
            return React.createElement.call(React, Type, options);
        }
        function loadViews(jsml, view) {
            var queue = null;
            _.each(jsml, function (item, propName) {
                var res = $.Deferred(), typeName = item[0], options = item[1], subViews = item[2];
                require([typeName], function (SubView) {
                    var el = $(options.el, view.$el);
                    var component = Create(SubView, _.extend({}, options, {
                        el: el
                    }));
                    var inst = ReactDOM.render.call(ReactDOM, component, el.get(0));
                    view[propName] = inst;
                    $.when(inst.draw(), utils.loadViews(subViews, inst)).done(function () {
                        res.resolve(inst);
                    });
                });
                queue = $.when(queue, res.promise());
            });
            return queue;
        }
        utils.loadViews = loadViews;
        // event handler
        function copy(e) {
            // find target element
            var inp = e.currentTarget;
            // select text
            var selection = window.getSelection();
            var range = document.createRange();
            range.selectNodeContents(inp);
            selection.removeAllRanges();
            selection.addRange(range);
            try {
                // copy text
                document.execCommand('copy');
            }
            catch (err) {
                alert('please press Ctrl/Cmd+C to copy');
            }
        }
        utils.copy = copy;
    })(utils || (utils = {}));
    return utils;
});
/// <reference path="../../../vendor.d.ts" />
define("app/jira/base/base", ["require", "exports", 'underscore', 'app/jira/utils'], function (require, exports, _, Utils) {
    "use strict";
    var report = {};
    window.report = report;
    window.__extends = function (child, base) {
        child.prototype.ctor = child;
        Utils.extend.call(base, child.prototype);
    };
    window.__decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        console.log('__decorate:', { decorators: decorators, target: target, key: key, desc: desc });
        _.each(decorators, function (func) {
            var defFunc = target[key];
            target[key] = func(target, key, { value: defFunc }).value;
        });
    };
    var Base = (function () {
        function Base() {
            this.isFinish = false;
            //console.log('Created: ' + this.constructor.name);
            this.__name = this.constructor.name;
            report[this.__name] = ++report[this.__name] || 1;
        }
        Base.prototype.finish = function () {
            //console.log('Removed: ' + this.constructor.name);
            report[this.__name] = --report[this.__name];
            if (this.isFinish) {
                throw ('Warinig: Object is removed two times.');
            }
            this.isFinish = true;
        };
        Base.extend = Utils.extend;
        return Base;
    }());
    return Base;
});
/// <reference path="base.ts" />
/// <reference path="../command.ts" />
define("app/jira/base/base_view_model", ["require", "exports", 'jquery', 'underscore', "app/jira/base/base"], function (require, exports, $, _, Base) {
    "use strict";
    var ViewModelBase = (function (_super) {
        __extends(ViewModelBase, _super);
        function ViewModelBase(opts) {
            var _this = this;
            _super.call(this);
            this.init(opts);
            _.each(this.opts, function (val, key) {
                _this.opts[key] = val;
                _this['set' + key] = function (value) {
                    if (value === _this.opts[key]) {
                        return _this;
                    }
                    _this.opts[key] = value;
                    _this.triggerProperyChanged('change:' + key, value);
                    return _this;
                };
                _this['get' + key] = function () {
                    return _this.opts[key];
                };
            });
            //console.log('Created: ' + this.constructor.name)
        }
        ViewModelBase.prototype.init = function (opts) {
            this.opts = _.extend({}, this.defaults, opts);
        };
        ViewModelBase.prototype.finish = function () {
            this.triggerProperyChanged('viewModel.finish');
            $(this).off();
            _super.prototype.finish.call(this);
            //console.log('Removed: ' + this.constructor.name);
        };
        ViewModelBase.prototype.getCommand = function (name) {
            throw "Command [" + name + "] is not defined";
        };
        ViewModelBase.prototype.triggerProperyChanged = function (propertyName, opts) {
            //console.log('ViewModel.trigger: ' + propertyName);
            $(this).trigger(propertyName);
        };
        ViewModelBase.prototype.navigateTo = function () {
        };
        ViewModelBase.prototype.navigateFrom = function () {
            this.finish();
        };
        ViewModelBase.prototype.toJSON = function () {
            return this.opts;
        };
        return ViewModelBase;
    }(Base));
    return ViewModelBase;
});
define("app/jira/navigation", ["require", "exports", 'jquery', 'underscore', "app/jira/base/base", 'react', 'react-dom'], function (require, exports, $, _, Base, React, ReactDOM) {
    "use strict";
    var components = {
        'jira-report': ['app/jira/pages/jira_page', 'app/jira/view_models/issues/jira_view_model'],
        'deploy-email': ['app/jira/pages/email_page', 'app/jira/view_models/email_report/email_view_model'],
        'feeding': ['app/jira/pages/feeding_page', 'app/jira/view_models/products/feeding_view_model']
    }, inst;
    var Navigation = (function (_super) {
        __extends(Navigation, _super);
        function Navigation(opts) {
            _super.call(this);
            this.init(opts);
        }
        Navigation.prototype.init = function (opts) {
        };
        Navigation.prototype.getView = function () {
            var match = window.location.href.match(/#(.*)$/);
            return match ? match[1] : '';
        };
        Navigation.prototype.setHash = function (hashPath) {
            window.location.hash = '#' + hashPath;
        };
        Navigation.prototype.loadComponent = function (componentName) {
            var _this = this;
            var deps = components[componentName];
            this.view && _.defer(function () { return _this.view.onNavigateFrom(); }, 0);
            this.setHash(componentName);
            if (deps) {
                require(deps, function (View, ViewModel) {
                    var $root = $('<div/>');
                    $(document.body).empty().append($root);
                    var view = React.createElement(View, {
                        el: $root,
                        viewModel: new ViewModel()
                    });
                    _this.view = ReactDOM.render(view, $root.get(0), function () {
                        var _this = this;
                        _.defer(function () { return _this.onNavigateTo(); }, 0);
                    });
                });
            }
        };
        Navigation.getInstance = function () {
            if (inst) {
                return inst;
            }
            return inst = new Navigation({});
        };
        return Navigation;
    }(Base));
    return Navigation;
});
define("app/jira/view_models/navigation_view_model", ["require", "exports", "app/jira/base/base_view_model", "app/jira/navigation"], function (require, exports, BaseViewModel, Navigation) {
    "use strict";
    var NavigationViewModel = (function (_super) {
        __extends(NavigationViewModel, _super);
        function NavigationViewModel() {
            _super.apply(this, arguments);
        }
        NavigationViewModel.prototype.navigateTo = function (name) {
            var navigation = Navigation.getInstance();
            navigation.loadComponent(name);
        };
        return NavigationViewModel;
    }(BaseViewModel));
    return NavigationViewModel;
});
define("app/jira", ["require", "exports", "app/jira/base/base_view_model", "app/jira/view_models/navigation_view_model"], function (require, exports, BaseViewModel, PageViewModel) {
    "use strict";
    var jira;
    (function (jira) {
        var navigation = 
        // Inject debendencies
        BaseViewModel.prototype.navigation = new PageViewModel({});
        function init() {
            var location = window.location.hash.substr(1) || 'jira-report';
            navigation.navigateTo(location);
            return true;
        }
        jira.init = init;
    })(jira || (jira = {}));
    return jira;
});
/// </// <reference path="base.ts" />
define("app/jira/base/base_event_dispatcher", ["require", "exports", "app/jira/base/base"], function (require, exports, Base) {
    "use strict";
    var BaseEventDispatcher = (function (_super) {
        __extends(BaseEventDispatcher, _super);
        function BaseEventDispatcher(opts) {
            _super.call(this);
            this.init(opts);
            //console.log('Created: ' + this.constructor.name)
        }
        BaseEventDispatcher.prototype.init = function (opts) {
        };
        return BaseEventDispatcher;
    }(Base));
    return BaseEventDispatcher;
});
/// <reference path="base/base_event_dispatcher.ts" />
define("app/jira/ui_dispatcher", ["require", "exports", "app/jira/base/base_event_dispatcher"], function (require, exports, BaseEventDispatcher) {
    "use strict";
    var UIDispatcher = (function (_super) {
        __extends(UIDispatcher, _super);
        function UIDispatcher() {
            _super.apply(this, arguments);
        }
        return UIDispatcher;
    }(BaseEventDispatcher));
    inst = new UIDispatcher({});
    return inst;
});
/// <reference path="base.ts" />
define("app/jira/base/model_base", ["require", "exports", 'jquery', "app/jira/base/base"], function (require, exports, $, Base) {
    "use strict";
    var ModelBase = (function (_super) {
        __extends(ModelBase, _super);
        function ModelBase(opts) {
            _super.call(this);
            this.init(opts);
        }
        ModelBase.prototype.init = function (opts) {
        };
        ModelBase.prototype.triggerProperyChanged = function (propertyName) {
            //console.log('Model.trigger: ' + propertyName);
            $(this).trigger(propertyName);
        };
        return ModelBase;
    }(Base));
    return ModelBase;
});
define("app/jira/models/accounting_model", ["require", "exports", 'jquery', "app/jira/base/model_base"], function (require, exports, $, ModelBase) {
    "use strict";
    var fetchProductsXhr = null, saveProductXhr = null, saveCartXhr = null, saveCategoryXhr = null, saveSupplierXhr = null, fetchCategoriesXhr = null, fetchSupppliersXhr = null, fetchOrdersXhr = null, fetchCartsXhr = null, fetchReportXhr = null, inst;
    var AccountingModel = (function (_super) {
        __extends(AccountingModel, _super);
        function AccountingModel() {
            _super.apply(this, arguments);
            this.products = [];
            this.productsTotal = 0;
            this.product = {};
            this.categories = [];
            this.suppliers = [];
            this.orders = [];
            this.carts = [];
            this.report = {};
        }
        AccountingModel.prototype.getProducts = function () {
            return this.products;
        };
        AccountingModel.prototype.getProductsTotal = function () {
            return this.productsTotal;
        };
        AccountingModel.prototype.setProducts = function (value) {
            this.products = value;
            this.triggerProperyChanged('accounting_model.products');
        };
        AccountingModel.prototype.getCategories = function () {
            return this.categories;
        };
        AccountingModel.prototype.setCategories = function (value) {
            this.categories = value;
            this.triggerProperyChanged('accounting_model.categories');
        };
        AccountingModel.prototype.getSuppliers = function () {
            return this.suppliers;
        };
        AccountingModel.prototype.setSuppliers = function (value) {
            this.suppliers = value;
            this.triggerProperyChanged('accounting_model.suppliers');
        };
        AccountingModel.prototype.getOrders = function () {
            return this.orders;
        };
        AccountingModel.prototype.setOrders = function (value) {
            this.orders = value;
            this.triggerProperyChanged('accounting_model.orders');
        };
        AccountingModel.prototype.getProduct = function () {
            return this.product;
        };
        AccountingModel.prototype.setProduct = function (product) {
            this.product = product;
            this.triggerProperyChanged('accounting_model.product');
        };
        AccountingModel.prototype.getCarts = function () {
            return this.carts;
        };
        AccountingModel.prototype.setCarts = function (value) {
            this.carts = value;
            this.triggerProperyChanged('accounting_model.carts');
        };
        AccountingModel.prototype.getReport = function () {
            return this.report;
        };
        AccountingModel.prototype.setReport = function (value) {
            this.report = value;
            this.triggerProperyChanged('accounting_model.report');
        };
        AccountingModel.prototype.fetchProducts = function (from, count) {
            var _this = this;
            if (from === void 0) { from = 0; }
            if (count === void 0) { count = 10; }
            fetchProductsXhr = $.when(fetchProductsXhr).then(function () {
                return $.ajax({
                    url: '/jira/products',
                    type: 'GET',
                    data: { from: from, count: count },
                    success: function (result, success, xhr) {
                        _this.productsTotal = result.Total;
                        _this.setProducts(result.Items);
                    }
                });
            });
            fetchProductsXhr.fail(function () {
                fetchProductsXhr = null;
            });
        };
        AccountingModel.prototype.fetchCategories = function (from, count) {
            var _this = this;
            if (from === void 0) { from = 0; }
            if (count === void 0) { count = 10; }
            fetchCategoriesXhr = $.when(fetchCategoriesXhr).then(function () {
                return $.ajax({
                    url: '/jira/categories',
                    type: 'GET',
                    data: { from: from, count: count },
                    success: function (items, success, xhr) {
                        _this.setCategories(items);
                    }
                });
            });
            fetchCategoriesXhr.fail(function () {
                fetchCategoriesXhr = null;
            });
        };
        AccountingModel.prototype.fetchSuppliers = function (from, count) {
            var _this = this;
            if (from === void 0) { from = 0; }
            if (count === void 0) { count = 10; }
            fetchSupppliersXhr = $.when(fetchSupppliersXhr).then(function () {
                return $.ajax({
                    url: '/jira/suppliers',
                    type: 'GET',
                    data: { from: from, count: count },
                    success: function (items, success, xhr) {
                        _this.setSuppliers(items);
                    }
                });
            });
            fetchSupppliersXhr.fail(function () {
                fetchSupppliersXhr = null;
            });
        };
        AccountingModel.prototype.fetchOrders = function (from, count) {
            var _this = this;
            if (from === void 0) { from = 0; }
            if (count === void 0) { count = 10; }
            fetchOrdersXhr = $.when(fetchOrdersXhr).then(function () {
                return $.ajax({
                    url: '/jira/orders',
                    type: 'GET',
                    data: { from: from, count: count },
                    success: function (items, success, xhr) {
                        _this.setOrders(items);
                    }
                });
            });
            fetchOrdersXhr.fail(function () {
                fetchOrdersXhr = null;
            });
        };
        AccountingModel.prototype.saveProduct = function (product) {
            var _this = this;
            saveProductXhr = $.when(saveProductXhr).then(function () {
                return $.ajax({
                    url: '/jira/products/' + product.Id,
                    type: 'POST',
                    data: JSON.stringify(product),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (item, success, xhr) {
                        _this.setProduct(item);
                    }
                });
            });
            saveProductXhr.fail(function () {
                saveProductXhr = null;
            });
        };
        AccountingModel.prototype.searchProducts = function (subject) {
            var _this = this;
            fetchOrdersXhr = $.when(fetchOrdersXhr).then(function () {
                return $.ajax({
                    url: '/jira/products',
                    type: 'GET',
                    data: { search: subject },
                    success: function (result, success, xhr) {
                        _this.productsTotal = result.Total;
                        _this.setProducts(result.Items);
                    }
                });
            });
            fetchOrdersXhr.fail(function () {
                fetchOrdersXhr = null;
            });
        };
        AccountingModel.prototype.fetchCarts = function (from, count) {
            var _this = this;
            if (from === void 0) { from = 0; }
            if (count === void 0) { count = 10; }
            fetchCartsXhr = $.when(fetchCartsXhr).then(function () {
                return $.ajax({
                    url: '/jira/carts',
                    type: 'GET',
                    data: { from: from, count: count },
                    success: function (result, success, xhr) {
                        _this.setCarts(result.Items);
                    }
                });
            });
            fetchCartsXhr.fail(function () {
                fetchCartsXhr = null;
            });
        };
        AccountingModel.prototype.addToCart = function (productId, price) {
            var _this = this;
            saveCartXhr = $.when(saveCartXhr).then(function () {
                return $.ajax({
                    url: '/jira/addtocart/',
                    type: 'POST',
                    data: { productId: productId, price: price },
                    success: function (item, success, xhr) {
                        _this.fetchCarts();
                    }
                });
            });
            saveCartXhr.fail(function () {
                saveCartXhr = null;
            });
        };
        AccountingModel.prototype.removeFromCart = function (productId) {
            var _this = this;
            saveCartXhr = $.when(saveCartXhr).then(function () {
                return $.ajax({
                    url: '/jira/removefromcart/',
                    type: 'POST',
                    data: { productId: productId },
                    success: function (item, success, xhr) {
                        _this.fetchCarts();
                    }
                });
            });
            saveCartXhr.fail(function () {
                saveCartXhr = null;
            });
        };
        AccountingModel.prototype.createCart = function () {
            var _this = this;
            saveCartXhr = $.when(saveCartXhr).then(function () {
                return $.ajax({
                    url: '/jira/carts/',
                    type: 'POST',
                    data: { CartDate: +new Date() },
                    success: function (item, success, xhr) {
                        _this.fetchCarts();
                    }
                });
            });
            saveCartXhr.fail(function () {
                saveCartXhr = null;
            });
        };
        AccountingModel.prototype.saveCategory = function (category) {
            var _this = this;
            saveCategoryXhr = $.when(saveCategoryXhr).then(function () {
                return $.ajax({
                    url: '/jira/categories/' + category.Id,
                    type: 'POST',
                    data: JSON.stringify(category),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (item, success, xhr) {
                        _this.fetchCategories(0, 100);
                    }
                });
            });
            saveCategoryXhr.fail(function () {
                saveCategoryXhr = null;
            });
        };
        AccountingModel.prototype.saveSupplier = function (supplier) {
            var _this = this;
            saveSupplierXhr = $.when(saveSupplierXhr).then(function () {
                return $.ajax({
                    url: '/jira/suppliers/' + supplier.Id,
                    type: 'POST',
                    data: JSON.stringify(supplier),
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    success: function (item, success, xhr) {
                        _this.fetchSuppliers(0, 100);
                    }
                });
            });
            saveSupplierXhr.fail(function () {
                saveSupplierXhr = null;
            });
        };
        AccountingModel.prototype.fetchReport = function (from, count) {
            var _this = this;
            if (from === void 0) { from = 0; }
            if (count === void 0) { count = 0; }
            fetchReportXhr = $.when(fetchReportXhr).then(function () {
                return $.ajax({
                    url: '/jira/report',
                    type: 'GET',
                    data: {},
                    success: function (items, success, xhr) {
                        _this.setReport(items);
                    }
                });
            });
            fetchReportXhr.fail(function () {
                fetchReportXhr = null;
            });
        };
        AccountingModel.getCurent = function () {
            if (inst) {
                return inst;
            }
            inst = new AccountingModel({});
            return inst;
        };
        return AccountingModel;
    }(ModelBase));
    return AccountingModel;
});
define("app/jira/models/model", ["require", "exports", 'underscore', 'jquery', "app/jira/base/model_base"], function (require, exports, _, $, ModelBase) {
    "use strict";
    var fetchIssuesXhr = null, fetchEpicsXhr = null, fetchStatusesXhr = null, inst;
    var JiraModel = (function (_super) {
        __extends(JiraModel, _super);
        function JiraModel() {
            _super.apply(this, arguments);
            this.issues = [];
            this.statuses = [];
            this.epics = [];
        }
        JiraModel.prototype.getIssues = function () {
            return this.issues;
        };
        JiraModel.prototype.setIssues = function (value) {
            this.issues = value;
            this.triggerProperyChanged('model.issues');
        };
        JiraModel.prototype.getStatuses = function () {
            return this.statuses;
        };
        JiraModel.prototype.setStatuses = function (value) {
            this.statuses = value;
            this.triggerProperyChanged('model.statuses');
        };
        JiraModel.prototype.getEpics = function () {
            return this.epics;
        };
        JiraModel.prototype.setEpics = function (value) {
            this.epics = value;
            this.triggerProperyChanged('model.epics');
        };
        JiraModel.prototype.init = function () {
            ModelBase.prototype.init.apply(this, arguments);
            this.currentFilter = {};
        };
        JiraModel.prototype.resetFilter = function (filter) {
            filter = filter || {};
            this.currentFilter = filter;
            this.triggerProperyChanged('model.filterReset');
            this.fetchIssues();
        };
        JiraModel.prototype.toggleFilter = function (key, value, enable) {
            var fval = this.currentFilter[key] || value, values = _.without(fval.split(','), value);
            if (enable) {
                values.push(value);
            }
            this.currentFilter[key] = values.join(',');
            this.fetchIssues();
        };
        JiraModel.prototype.fetchIssues = function () {
            var _this = this;
            fetchIssuesXhr && fetchIssuesXhr.abort();
            fetchIssuesXhr = $.ajax({
                url: '/home/issues',
                type: 'GET',
                data: this.currentFilter,
                success: function (items, success, xhr) {
                    //console.log('Issues: ' + items.length);
                    _this.setIssues(items);
                }
            });
        };
        JiraModel.prototype.fetchStatuses = function () {
            var _this = this;
            fetchStatusesXhr && fetchStatusesXhr.abort();
            fetchStatusesXhr = $.ajax({
                url: '/home/statuses',
                type: 'GET',
                success: function (items, success, xhr) {
                    //console.log('Statuses: ' + items.length);
                    _this.setStatuses(items);
                }
            });
        };
        JiraModel.prototype.fetchEpics = function () {
            var _this = this;
            fetchEpicsXhr && fetchEpicsXhr.abort();
            fetchEpicsXhr = $.ajax({
                url: '/home/epics',
                type: 'GET',
                success: function (items, success, xhr) {
                    //console.log('Statuses: ' + items.length);
                    _this.setEpics(items);
                }
            });
        };
        JiraModel.getCurrent = function () {
            if (inst) {
                return inst;
            }
            inst = new JiraModel({});
            return inst;
        };
        return JiraModel;
    }(ModelBase));
    return JiraModel;
});
define("app/jira/view_models/page_view_model", ["require", "exports", "app/jira/base/base_view_model", "app/jira/command"], function (require, exports, BaseViewModel, Command) {
    "use strict";
    var PageViewModel = (function (_super) {
        __extends(PageViewModel, _super);
        function PageViewModel() {
            _super.apply(this, arguments);
        }
        PageViewModel.prototype.init = function (opts) {
            _super.prototype.init.call(this, opts);
            this.DeployEmailNavigateCommand = new Command({ execute: this.onDeployEmailNavigateCommand, scope: this });
            this.JiraReportNavigateCommand = new Command({ execute: this.onJiraReportNavigateCommand, scope: this });
            this.FeedingPageNavigateCommand = new Command({ execute: this.onFeedingPageNavigateCommand, scope: this });
        };
        PageViewModel.prototype.getCommand = function (name) {
            switch (name) {
                case 'DeployEmailNavigateCommand':
                    return this.DeployEmailNavigateCommand;
                case 'JiraReportNavigateCommand':
                    return this.JiraReportNavigateCommand;
                case 'FeedingPageNavigateCommand':
                    return this.FeedingPageNavigateCommand;
                default:
                    return _super.prototype.getCommand.call(this, name);
            }
        };
        PageViewModel.prototype.onDeployEmailNavigateCommand = function () {
            this.navigation.navigateTo('deploy-email');
        };
        PageViewModel.prototype.onJiraReportNavigateCommand = function () {
            this.navigation.navigateTo('jira-report');
        };
        PageViewModel.prototype.onFeedingPageNavigateCommand = function () {
            this.navigation.navigateTo('feeding');
        };
        return PageViewModel;
    }(BaseViewModel));
    return PageViewModel;
});
define("app/jira/view_models/issues/issue_entry_view_model", ["require", "exports", "app/jira/base/base_view_model"], function (require, exports, BaseViewModel) {
    "use strict";
    var IssueEntryViewModel = (function (_super) {
        __extends(IssueEntryViewModel, _super);
        function IssueEntryViewModel() {
            _super.apply(this, arguments);
        }
        IssueEntryViewModel.prototype.getId = function () {
            return this.opts.Key;
        };
        return IssueEntryViewModel;
    }(BaseViewModel));
    return IssueEntryViewModel;
});
define("app/jira/view_models/email_report/email_view_model", ["require", "exports", 'jquery', 'underscore', "app/jira/view_models/page_view_model", "app/jira/view_models/issues/issue_entry_view_model", "app/jira/models/model"], function (require, exports, $, _, BaseViewModel, IssueEntryViewModel, Model) {
    "use strict";
    var EmailViewModel = (function (_super) {
        __extends(EmailViewModel, _super);
        function EmailViewModel() {
            _super.apply(this, arguments);
        }
        EmailViewModel.prototype.getIssues = function () {
            return this.issues;
        };
        EmailViewModel.prototype.setIssues = function (value) {
            var issues = this.issues;
            _.defer(function () {
                return _.each(issues, function (viewModel) {
                    return viewModel.finish();
                });
            }, 0);
            this.issues = value;
            this.triggerProperyChanged('change:issues');
        };
        EmailViewModel.prototype.init = function (opts) {
            var model = Model.getCurrent();
            _super.prototype.init.call(this, opts);
            this.changeIssuesDelegate = _.bind(this.changeIssues, this);
            $(model).on('model.issues', this.changeIssuesDelegate);
            _.defer(_.bind(function () {
                this.fetchIssues();
            }, this), 0);
        };
        EmailViewModel.prototype.finish = function () {
            var model = Model.getCurrent();
            $(model).off('model.issues', this.changeIssuesDelegate);
            $(this).off();
            this.setIssues([]);
            _super.prototype.finish.call(this);
        };
        EmailViewModel.prototype.changeIssues = function () {
            var model = Model.getCurrent(), issues = model.getIssues();
            this.setIssues(_.map(issues, function (item) {
                return new IssueEntryViewModel(item);
            }));
        };
        EmailViewModel.prototype.fetchIssues = function () {
            var model = Model.getCurrent();
            model.resetFilter({
                status: '10009'
            });
        };
        return EmailViewModel;
    }(BaseViewModel));
    return EmailViewModel;
});
define("app/jira/templates/email_report/email_template", ["require", "exports", 'react'], function (require, exports, React) {
    "use strict";
    var template = function () {
        return (React.createElement("div", {id: "page-inner"}, React.createElement("div", {className: "row pad-top-botm "}, React.createElement("div", {className: "col-lg-12 col-md-12 col-sm-12"}, React.createElement("h1", {className: "page-head-line"}, "Tomorrow Deploy"), React.createElement("h1", {className: "page-subhead-line"}, "Tomorrow deploy"))), React.createElement("div", {className: "row"}, React.createElement("div", {style: { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }, className: "email-contents col-lg-12 col-md-12 col-sm-12", dangerouslySetInnerHTML: this.getEmailHTML()})), React.createElement("div", {className: "row pad-top-botm"}, React.createElement("div", {className: "auto-email col-lg-12 col-md-12 col-sm-12"}, React.createElement("hr", null), React.createElement("a", {className: "btn btn-primary btn-lg", href: "mailto:qa@rebelmouse.com?subject=" + this.state.subject + "&body=" + this.getEmailText()}, "Create mail")))));
    };
    return template;
});
define("app/jira/views/email_report/email_view", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", "app/jira/templates/email_report/email_template", 'hgn!app/jira/templates/email_report/email_template'], function (require, exports, _, $, BaseView, template, emailTemplate) {
    "use strict";
    var EmailView = (function (_super) {
        __extends(EmailView, _super);
        function EmailView(opts) {
            _super.call(this, opts);
            this.state = {
                issues: this.props.viewModel.getIssues(),
                'email-to': 'qa@rebelmouse.com',
                subject: encodeURIComponent('Tomorrow deploy'),
                body: this.getEmailText()
            };
        }
        EmailView.prototype.setIssues = function () {
            this.setState(_.extend({}, this.state, {
                issues: this.props.viewModel.getIssues()
            }));
        };
        EmailView.prototype.componentWillMount = function () {
            $(this.props.viewModel).on('change:issues', _.bind(this.setIssues, this));
        };
        EmailView.prototype.componentWillUnmount = function () {
            $(this.props.viewModel).off('change:issues');
        };
        EmailView.prototype.componentWillReceiveProps = function (props) {
            $(this.props.viewModel).off('change:issues');
            $(props.viewModel).on('change:issues', _.bind(this.setIssues, this));
        };
        EmailView.prototype.getEmailHTML = function () {
            var _this = this;
            var data = {
                issues: function () {
                    return _.map(_this.props.viewModel.getIssues(), function (issue) { return issue.toJSON(); });
                }
            }, html = emailTemplate(data);
            return { __html: html };
        };
        EmailView.prototype.getEmailText = function () {
            var html = this.getEmailHTML();
            return encodeURIComponent($('<div/>').html(html.__html).text());
        };
        EmailView.prototype.render = function () {
            return template.call(this);
        };
        return EmailView;
    }(BaseView));
    return EmailView;
});
define("app/jira/pages/email_page_template", ["require", "exports", 'react', "app/jira/views/email_report/email_view"], function (require, exports, React, EmailView) {
    "use strict";
    var template = function (viewModel) {
        return (React.createElement(EmailView, {viewModel: viewModel}));
    };
    return template;
});
define("app/jira/templates/master_page_template", ["require", "exports", 'react'], function (require, exports, React) {
    "use strict";
    var template = function (view) {
        var _this = this;
        return (React.createElement("div", null, React.createElement("div", {id: "wrapper"}, React.createElement("nav", {className: "navbar navbar-default navbar-cls-top ", role: "navigation", style: { marginBottom: 0 }}, React.createElement("div", {className: "navbar-header"}, React.createElement("button", {type: "button", className: "navbar-toggle", "data-toggle": "collapse", "data-target": ".sidebar-collapse"}, React.createElement("span", {className: "sr-only"}, "Toggle navigation"), React.createElement("span", {className: "icon-bar"}), React.createElement("span", {className: "icon-bar"}), React.createElement("span", {className: "icon-bar"})), React.createElement("a", {className: "navbar-brand", href: "index.html"}, "COMPANY NAME")), React.createElement("div", {className: "header-right"}, React.createElement("a", {href: "message-task.html", className: "btn btn-info", title: "New Message"}, React.createElement("b", null, "30 "), React.createElement("i", {className: "fa fa-envelope-o fa-2x"})), React.createElement("a", {href: "message-task.html", className: "btn btn-primary", title: "New Task"}, React.createElement("b", null, "40 "), React.createElement("i", {className: "fa fa-bars fa-2x"})), React.createElement("a", {href: "javascript:(function () { parent.postMessage('bookmarklet:close', '*'); })();", className: "btn btn-danger", title: "Logout"}, React.createElement("i", {className: "fa fa-exclamation-circle fa-2x"})))), React.createElement("nav", {className: "navbar-default navbar-side", role: "navigation"}, React.createElement("div", {className: "sidebar-collapse"}, React.createElement("ul", {className: "nav", id: "main-menu"}, React.createElement("li", null, React.createElement("div", {className: "user-img-div"}, React.createElement("img", {src: "assets/img/user.png", className: "img-thumbnail"}), React.createElement("div", {className: "inner-text"}, "Jhon Deo Alex", React.createElement("br", null), React.createElement("small", null, "Last Login : 2 Weeks Ago ")))), React.createElement("li", null, React.createElement("a", {className: "jira-deploy-email", href: "#deploy-email", onClick: function () { return _this.runCommand('DeployEmailNavigateCommand'); }}, React.createElement("i", {className: "fa fa-dashboard "}), "Deploy e-mail")), React.createElement("li", null, React.createElement("a", {className: "jira-jira-report", href: "#jira-report", onClick: function () { return _this.runCommand('JiraReportNavigateCommand'); }}, React.createElement("i", {className: "fa fa-dashboard "}), "JIRA Report")), React.createElement("li", null, React.createElement("a", {className: "feeding-feeding", href: "#feeding", onClick: function () { return _this.runCommand('FeedingPageNavigateCommand'); }}, React.createElement("i", {className: "fa fa-dashboard "}), "Feeding")), React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "fa fa-desktop "}), "UI Elements ", React.createElement("span", {className: "fa arrow"})), React.createElement("ul", {className: "nav nav-second-level"}, React.createElement("li", null, React.createElement("a", {href: "panel-tabs.html"}, React.createElement("i", {className: "fa fa-toggle-on"}), "Tabs & Panels")), React.createElement("li", null, React.createElement("a", {href: "notification.html"}, React.createElement("i", {className: "fa fa-bell "}), "Notifications")), React.createElement("li", null, React.createElement("a", {href: "progress.html"}, React.createElement("i", {className: "fa fa-circle-o "}), "Progressbars")), React.createElement("li", null, React.createElement("a", {href: "buttons.html"}, React.createElement("i", {className: "fa fa-code "}), "Buttons")), React.createElement("li", null, React.createElement("a", {href: "icons.html"}, React.createElement("i", {className: "fa fa-bug "}), "Icons")), React.createElement("li", null, React.createElement("a", {href: "wizard.html"}, React.createElement("i", {className: "fa fa-bug "}), "Wizard")), React.createElement("li", null, React.createElement("a", {href: "typography.html"}, React.createElement("i", {className: "fa fa-edit "}), "Typography")), React.createElement("li", null, React.createElement("a", {href: "grid.html"}, React.createElement("i", {className: "fa fa-eyedropper "}), "Grid")))), React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "fa fa-yelp "}), "Extra Pages ", React.createElement("span", {className: "fa arrow"})), React.createElement("ul", {className: "nav nav-second-level"}, React.createElement("li", null, React.createElement("a", {href: "invoice.html"}, React.createElement("i", {className: "fa fa-coffee"}), "Invoice")), React.createElement("li", null, React.createElement("a", {href: "pricing.html"}, React.createElement("i", {className: "fa fa-flash "}), "Pricing")), React.createElement("li", null, React.createElement("a", {href: "component.html"}, React.createElement("i", {className: "fa fa-key "}), "Components")), React.createElement("li", null, React.createElement("a", {href: "social.html"}, React.createElement("i", {className: "fa fa-send "}), "Social")), React.createElement("li", null, React.createElement("a", {href: "message-task.html"}, React.createElement("i", {className: "fa fa-recycle "}), "Messages & Tasks")))), React.createElement("li", null, React.createElement("a", {className: "active-menu", href: "table.html"}, React.createElement("i", {className: "fa fa-flash "}), "Data Tables ")), React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "fa fa-bicycle "}), "Forms ", React.createElement("span", {className: "fa arrow"})), React.createElement("ul", {className: "nav nav-second-level"}, React.createElement("li", null, React.createElement("a", {href: "form.html"}, React.createElement("i", {className: "fa fa-desktop "}), "Basic ")), React.createElement("li", null, React.createElement("a", {href: "form-advance.html"}, React.createElement("i", {className: "fa fa-code "}), "Advance")))), React.createElement("li", null, React.createElement("a", {href: "gallery.html"}, React.createElement("i", {className: "fa fa-anchor "}), "Gallery")), React.createElement("li", null, React.createElement("a", {href: "error.html"}, React.createElement("i", {className: "fa fa-bug "}), "Error Page")), React.createElement("li", null, React.createElement("a", {href: "login.html"}, React.createElement("i", {className: "fa fa-sign-in "}), "Login Page")), React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "fa fa-sitemap "}), "Multilevel Link ", React.createElement("span", {className: "fa arrow"})), React.createElement("ul", {className: "nav nav-second-level"}, React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "fa fa-bicycle "}), "Second Level Link")), React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "fa fa-flask "}), "Second Level Link")), React.createElement("li", null, React.createElement("a", {href: "#"}, "Second Level Link", React.createElement("span", {className: "fa arrow"})), React.createElement("ul", {className: "nav nav-third-level"}, React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "fa fa-plus "}), "Third Level Link")), React.createElement("li", null, React.createElement("a", {href: "#"}, React.createElement("i", {className: "fa fa-comments-o "}), "Third Level Link")))))), React.createElement("li", null, React.createElement("a", {href: "blank.html"}, React.createElement("i", {className: "fa fa-square-o "}), "Blank Page"))))), React.createElement("div", {id: "page-wrapper"}, view)), React.createElement("div", {id: "footer-sec"}, "© 2014 YourCompany | Design By : ", React.createElement("a", {href: "http://www.binarytheme.com/", target: "_blank"}, "BinaryTheme.com"))));
    };
    return template;
});
define("app/jira/pages/email_page", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", "app/jira/base/base", "app/jira/pages/email_page_template", "app/jira/templates/master_page_template"], function (require, exports, _, $, BaseView, Base, template, master_page_template) {
    "use strict";
    var EmailPage = (function (_super) {
        __extends(EmailPage, _super);
        function EmailPage() {
            _super.apply(this, arguments);
            this.handlers = {
                onDraw: function () {
                    $('#main-menu').metisMenu();
                }
            };
        }
        EmailPage.prototype.init = function (options) {
            _.extend(this.handlers, options.handlers || {});
            _super.prototype.init.call(this, options);
        };
        EmailPage.prototype.finish = function () {
            Base.prototype.finish.apply(this, arguments);
        };
        EmailPage.prototype.onNavigateTo = function () {
            this.handlers.onDraw.call(this);
            return _super.prototype.onNavigateTo.call(this);
        };
        EmailPage.prototype.render = function () {
            return master_page_template.call(this, template.call(this, this.props.viewModel));
        };
        return EmailPage;
    }(BaseView));
    return EmailPage;
});
define("app/jira/view_models/products/product_entry_view_model", ["require", "exports", 'underscore', "app/jira/base/base_view_model", "app/jira/models/accounting_model"], function (require, exports, _, BaseViewModel, Model) {
    "use strict";
    var ProductEntryViewModel = (function (_super) {
        __extends(ProductEntryViewModel, _super);
        function ProductEntryViewModel() {
            _super.apply(this, arguments);
        }
        ProductEntryViewModel.prototype.getId = function () {
            return this.opts.Id;
        };
        ProductEntryViewModel.prototype.init = function (opts) {
            this.defaults = {
                Id: -1,
                ProductName: '',
                CategoryId: 1,
                SupplierId: 1,
                UnitPrice: 0,
                UnitsOnOrder: 1,
                QuantityPerUnit: 'szt',
                Supplier: {},
                Category: {}
            };
            _super.prototype.init.call(this, opts);
        };
        ProductEntryViewModel.prototype.setData = function (data) {
            var _this = this;
            _.each(data, function (value, key) {
                var setter = _this['set' + key];
                setter && setter.call(_this, value);
            });
        };
        ProductEntryViewModel.prototype.addToCart = function (productId, price) {
            var model = Model.getCurent();
            model.addToCart(productId, price);
        };
        return ProductEntryViewModel;
    }(BaseViewModel));
    return ProductEntryViewModel;
});
define("app/jira/view_models/products/category_entry_view_model", ["require", "exports", 'underscore', "app/jira/base/base_view_model", "app/jira/models/accounting_model"], function (require, exports, _, BaseViewModel, Model) {
    "use strict";
    var CategoryEntryViewModel = (function (_super) {
        __extends(CategoryEntryViewModel, _super);
        function CategoryEntryViewModel() {
            _super.apply(this, arguments);
        }
        CategoryEntryViewModel.prototype.getId = function () {
            return this.opts.Id;
        };
        CategoryEntryViewModel.prototype.init = function (opts) {
            this.defaults = {
                Id: -1,
                CategoryName: '',
                Description: ''
            };
            _super.prototype.init.call(this, opts);
        };
        CategoryEntryViewModel.prototype.setData = function (data) {
            var _this = this;
            _.each(data, function (value, key) {
                var setter = _this['set' + key];
                setter && setter.call(_this, value);
            });
        };
        CategoryEntryViewModel.prototype.saveCategory = function () {
            var model = Model.getCurent();
            model.saveCategory(this.toJSON());
        };
        return CategoryEntryViewModel;
    }(BaseViewModel));
    return CategoryEntryViewModel;
});
define("app/jira/view_models/products/supplier_entry_view_model", ["require", "exports", 'underscore', "app/jira/base/base_view_model", "app/jira/models/accounting_model"], function (require, exports, _, BaseViewModel, Model) {
    "use strict";
    var SupplierEntryView = (function (_super) {
        __extends(SupplierEntryView, _super);
        function SupplierEntryView() {
            _super.apply(this, arguments);
        }
        SupplierEntryView.prototype.getId = function () {
            return this.opts.Id;
        };
        SupplierEntryView.prototype.init = function (opts) {
            this.defaults = {
                Id: -1,
                CompanyName: '',
                Address: ''
            };
            _super.prototype.init.call(this, opts);
        };
        SupplierEntryView.prototype.setData = function (data) {
            var _this = this;
            _.each(data, function (value, key) {
                var setter = _this['set' + key];
                setter && setter.call(_this, value);
            });
        };
        SupplierEntryView.prototype.saveSupplier = function () {
            var model = Model.getCurent();
            model.saveSupplier(this.toJSON());
        };
        return SupplierEntryView;
    }(BaseViewModel));
    return SupplierEntryView;
});
define("app/jira/view_models/products/order_entry_view_model", ["require", "exports", 'underscore', "app/jira/base/base_view_model"], function (require, exports, _, BaseViewModel) {
    "use strict";
    var OrderEntryViewModel = (function (_super) {
        __extends(OrderEntryViewModel, _super);
        function OrderEntryViewModel() {
            _super.apply(this, arguments);
        }
        OrderEntryViewModel.prototype.getId = function () {
            return this.opts.Id;
        };
        OrderEntryViewModel.prototype.init = function (opts) {
            this.defaults = {
                Id: -1,
                OrderDate: '',
                OrderDetail: []
            };
            _super.prototype.init.call(this, opts);
        };
        OrderEntryViewModel.prototype.setData = function (data) {
            var _this = this;
            _.each(data, function (value, key) {
                var setter = _this['set' + key];
                setter && setter.call(_this, value);
            });
        };
        return OrderEntryViewModel;
    }(BaseViewModel));
    return OrderEntryViewModel;
});
define("app/jira/view_models/products/cart_entry_view_model", ["require", "exports", 'underscore', "app/jira/base/base_view_model", "app/jira/models/accounting_model"], function (require, exports, _, BaseViewModel, Model) {
    "use strict";
    var CartEntryViewModel = (function (_super) {
        __extends(CartEntryViewModel, _super);
        function CartEntryViewModel() {
            _super.apply(this, arguments);
        }
        CartEntryViewModel.prototype.getId = function () {
            return this.opts.Id;
        };
        CartEntryViewModel.prototype.init = function (opts) {
            this.defaults = {
                Id: -1,
                CartDate: '',
                CartDetail: []
            };
            _super.prototype.init.call(this, opts);
        };
        CartEntryViewModel.prototype.setData = function (data) {
            var _this = this;
            _.each(data, function (value, key) {
                var setter = _this['set' + key];
                setter && setter.call(_this, value);
            });
        };
        CartEntryViewModel.prototype.removeFromCart = function (productId) {
            var model = Model.getCurent();
            model.removeFromCart(productId);
        };
        return CartEntryViewModel;
    }(BaseViewModel));
    return CartEntryViewModel;
});
define("app/jira/view_models/products/feeding_view_model", ["require", "exports", 'underscore', 'jquery', "app/jira/view_models/page_view_model", "app/jira/view_models/products/product_entry_view_model", "app/jira/view_models/products/category_entry_view_model", "app/jira/view_models/products/supplier_entry_view_model", "app/jira/view_models/products/order_entry_view_model", "app/jira/view_models/products/cart_entry_view_model", "app/jira/command", "app/jira/models/accounting_model"], function (require, exports, _, $, PageViewModel, ProductEntryViewModel, CategoryEntryViewModel, SupplierEntryViewModel, OrderEntryViewModel, CartEntryViewModel, Command, Model) {
    "use strict";
    var FeedingViewModel = (function (_super) {
        __extends(FeedingViewModel, _super);
        function FeedingViewModel() {
            _super.apply(this, arguments);
            this.curentProduct = new ProductEntryViewModel({
                Id: 0,
                Category: { Id: 1 },
                Supplier: { Id: 1 }
            });
            this.products = [];
            this.productsTotal = 0;
            this.categories = [];
            this.suppliers = [];
            this.orders = [];
            this.carts = [];
            this.report = {};
        }
        FeedingViewModel.prototype.getCurentProduct = function () {
            return this.curentProduct;
        };
        FeedingViewModel.prototype.setCurentProduct = function (value) {
            this.curentProduct = value;
            this.triggerProperyChanged('change:CurentProduct');
        };
        FeedingViewModel.prototype.getProducts = function () {
            return this.products;
        };
        FeedingViewModel.prototype.setProducts = function (value) {
            var entries = this.products;
            _.defer(function () {
                _.each(entries, function (viewModel) {
                    viewModel.finish();
                });
            }, 0);
            this.products = value;
            this.triggerProperyChanged('change:products');
        };
        FeedingViewModel.prototype.getProductsTotal = function () {
            return this.productsTotal;
        };
        FeedingViewModel.prototype.setProductsTotal = function (value) {
            this.productsTotal = value;
        };
        FeedingViewModel.prototype.getCategories = function () {
            return this.categories;
        };
        FeedingViewModel.prototype.setCategories = function (value) {
            var entries = this.categories;
            _.defer(function () {
                _.each(entries, function (viewModel) {
                    viewModel.finish();
                });
            }, 0);
            this.categories = value;
            this.triggerProperyChanged('change:categories');
        };
        FeedingViewModel.prototype.getSuppliers = function () {
            return this.suppliers;
        };
        FeedingViewModel.prototype.setSuppliers = function (value) {
            var entries = this.suppliers;
            _.defer(function () {
                _.each(entries, function (viewModel) {
                    viewModel.finish();
                });
            }, 0);
            this.suppliers = value;
            this.triggerProperyChanged('change:suppliers');
        };
        FeedingViewModel.prototype.getOrders = function () {
            return this.orders;
        };
        FeedingViewModel.prototype.setOrders = function (value) {
            var entries = this.orders;
            _.defer(function () {
                _.each(entries, function (viewModel) {
                    viewModel.finish();
                });
            }, 0);
            this.orders = value;
            this.triggerProperyChanged('change:orders');
        };
        FeedingViewModel.prototype.getCarts = function () {
            return this.carts;
        };
        FeedingViewModel.prototype.setCarts = function (value) {
            var entries = this.carts;
            _.defer(function () {
                _.each(entries, function (viewModel) {
                    viewModel.finish();
                });
            }, 0);
            this.carts = value;
            this.triggerProperyChanged('change:carts');
        };
        FeedingViewModel.prototype.getCart = function () {
            return _.first(this.carts);
        };
        FeedingViewModel.prototype.getReport = function () {
            return this.report;
        };
        FeedingViewModel.prototype.setReport = function (value) {
            this.report = value;
            this.triggerProperyChanged('change:report');
        };
        FeedingViewModel.prototype.init = function (opts) {
            var _this = this;
            var model = Model.getCurent();
            _super.prototype.init.call(this, opts);
            this.SelectCommand = new Command({ execute: this.onChangeSelected, scope: this });
            _.each({
                'accounting_model.products': this.changeProductsDelegate = _.bind(this.changeProducts, this),
                'accounting_model.categories': this.changeCategoriesDelegate = _.bind(this.changeCategories, this),
                'accounting_model.suppliers': this.changeSuppliersDelegate = _.bind(this.changeSuppliers, this),
                'accounting_model.orders': this.changeOrdersDelegate = _.bind(this.changeOrders, this),
                'accounting_model.product': this.changeProductDelegate = _.bind(this.changeProduct, this),
                'accounting_model.carts': this.changeCartsDelegate = _.bind(this.changeCarts, this),
                'accounting_model.report': this.changeReportDelegate = _.bind(this.changeReport, this)
            }, function (h, e) { $(model).on(e, h); });
            _.defer(_.bind(function () {
                _this.fetchProducts();
                _this.fetchCategories();
                _this.fetchSuppliers();
                _this.fetchOrders();
                _this.fetchCarts();
                _this.fetchReport();
            }, this), 0);
        };
        FeedingViewModel.prototype.finish = function () {
            var model = Model.getCurent();
            _.each({
                'accounting_model.products': this.changeProductsDelegate,
                'accounting_model.categories': this.changeCategoriesDelegate,
                'accounting_model.suppliers': this.changeSuppliersDelegate,
                'accounting_model.orders': this.changeOrdersDelegate,
                'accounting_model.product': this.changeProductDelegate,
                'accounting_model.carts': this.changeCartsDelegate,
                'accounting_model.report': this.changeReportDelegate
            }, function (h, e) { $(model).off(e, h); });
            $(this).off();
            this.setProducts([]);
            this.setCategories([]);
            this.setSuppliers([]);
            this.setOrders([]);
            this.setCarts([]);
            _super.prototype.finish.call(this);
        };
        FeedingViewModel.prototype.getCommand = function (name) {
            switch (name) {
                case 'SelectCommand':
                    return this.SelectCommand;
                default:
                    return _super.prototype.getCommand.call(this, name);
            }
        };
        FeedingViewModel.prototype.newProduct = function () {
            this.setCurentProduct(new ProductEntryViewModel({
                Id: 0,
                Category: { Id: 1 },
                Supplier: { Id: 1 }
            }));
        };
        FeedingViewModel.prototype.onChangeSelected = function (commandName, productId) {
            var product = _.find(this.products, function (entity) { return entity.getId() === productId; });
            product && this.setCurentProduct(product);
        };
        FeedingViewModel.prototype.changeProducts = function () {
            var model = Model.getCurent(), items = model.getProducts(), total = model.getProductsTotal();
            this.setProductsTotal(total);
            this.setProducts(_.map(items, function (item) {
                return new ProductEntryViewModel(item);
            }, this));
        };
        FeedingViewModel.prototype.changeCategories = function () {
            var model = Model.getCurent(), items = model.getCategories();
            items.push({ Id: 0 });
            this.setCategories(_.map(items, function (item) {
                return new CategoryEntryViewModel(item);
            }, this));
        };
        FeedingViewModel.prototype.changeSuppliers = function () {
            var model = Model.getCurent(), items = model.getSuppliers();
            this.setSuppliers(_.map(items, function (item) {
                return new SupplierEntryViewModel(item);
            }, this));
        };
        FeedingViewModel.prototype.changeOrders = function () {
            var model = Model.getCurent(), items = model.getOrders();
            this.setOrders(_.map(items, function (item) {
                return new OrderEntryViewModel(item);
            }, this));
        };
        FeedingViewModel.prototype.changeProduct = function () {
            var model = Model.getCurent();
            var product = this.getCurentProduct();
            product.setData(model.getProduct());
            this.setCurentProduct(product);
        };
        FeedingViewModel.prototype.changeCarts = function () {
            var model = Model.getCurent(), items = model.getCarts();
            this.setCarts(_.map(items, function (item) {
                return new CartEntryViewModel(item);
            }, this));
        };
        FeedingViewModel.prototype.createCart = function () {
            var model = Model.getCurent();
            model.createCart();
        };
        FeedingViewModel.prototype.changeReport = function () {
            var model = Model.getCurent();
            this.setReport(model.getReport());
        };
        FeedingViewModel.prototype.fetchProducts = function (from, count) {
            if (from === void 0) { from = 0; }
            if (count === void 0) { count = 10; }
            var model = Model.getCurent();
            model.fetchProducts(from, count);
        };
        FeedingViewModel.prototype.fetchCategories = function () {
            var model = Model.getCurent();
            model.fetchCategories(0, 100);
        };
        FeedingViewModel.prototype.fetchSuppliers = function () {
            var model = Model.getCurent();
            model.fetchSuppliers(0, 100);
        };
        FeedingViewModel.prototype.fetchOrders = function () {
            var model = Model.getCurent();
            model.fetchOrders(0, 10);
        };
        FeedingViewModel.prototype.saveCurentProduct = function () {
            var model = Model.getCurent();
            model.saveProduct(this.curentProduct.toJSON());
        };
        FeedingViewModel.prototype.searchProducts = function (subject) {
            var model = Model.getCurent();
            model.searchProducts(subject);
        };
        FeedingViewModel.prototype.fetchCarts = function (from, count) {
            if (from === void 0) { from = 0; }
            if (count === void 0) { count = 10; }
            var model = Model.getCurent();
            model.fetchCarts(from, count);
        };
        FeedingViewModel.prototype.fetchReport = function (from, count) {
            if (from === void 0) { from = 0; }
            if (count === void 0) { count = 10; }
            var model = Model.getCurent();
            model.fetchReport(from, count);
        };
        return FeedingViewModel;
    }(PageViewModel));
    return FeedingViewModel;
});
define("app/jira/view_models/issues/filter_entry_view_model", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view_model", "app/jira/command", "app/jira/models/model"], function (require, exports, _, $, BaseViewModel, Command, Model) {
    "use strict";
    var FilterEntryViewModel = (function (_super) {
        __extends(FilterEntryViewModel, _super);
        function FilterEntryViewModel() {
            _super.apply(this, arguments);
        }
        FilterEntryViewModel.prototype.getId = function () {
            return this.opts.id;
        };
        FilterEntryViewModel.prototype.getSelected = function () {
            return this.opts.selected;
        };
        FilterEntryViewModel.prototype.setSelected = function (value) {
            var model = Model.getCurrent();
            this.opts.selected = value;
            this.triggerProperyChanged('change:selected');
            model.toggleFilter('status', this.getId(), value);
        };
        FilterEntryViewModel.prototype.init = function (opts) {
            var model = Model.getCurrent();
            _super.prototype.init.call(this, opts);
            this.SelectCommand = new Command({ execute: this.onChangeSelected, scope: this });
            this.resetItemDelegate = _.bind(this.resetItem, this);
            $(model).on('model.filterReset', this.resetItemDelegate);
        };
        FilterEntryViewModel.prototype.finish = function () {
            var model = Model.getCurrent();
            $(model).off('model.filterReset', this.resetItemDelegate);
            _super.prototype.finish.call(this);
        };
        FilterEntryViewModel.prototype.getCommand = function (name) {
            switch (name) {
                case 'SelectCommand':
                    return this.SelectCommand;
                default:
                    return _super.prototype.getCommand.call(this, name);
            }
        };
        FilterEntryViewModel.prototype.onChangeSelected = function () {
            this.setSelected(!this.getSelected());
        };
        FilterEntryViewModel.prototype.resetItem = function () {
            this.getSelected() && this.setSelected(false);
        };
        return FilterEntryViewModel;
    }(BaseViewModel));
    return FilterEntryViewModel;
});
define("app/jira/view_models/issues/filter_epic_view_model", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view_model", "app/jira/command", "app/jira/models/model"], function (require, exports, _, $, BaseViewModel, Command, Model) {
    "use strict";
    var FilterEpicViewModel = (function (_super) {
        __extends(FilterEpicViewModel, _super);
        function FilterEpicViewModel() {
            _super.apply(this, arguments);
        }
        FilterEpicViewModel.prototype.getId = function () {
            return this.opts.id;
        };
        FilterEpicViewModel.prototype.getSelected = function () {
            return this.opts.selected;
        };
        FilterEpicViewModel.prototype.setSelected = function (value) {
            var model = Model.getCurrent();
            this.opts.selected = value;
            this.triggerProperyChanged('change:selected');
            model.toggleFilter('epicLink', this.getId(), value);
        };
        FilterEpicViewModel.prototype.init = function (opts) {
            var model = Model.getCurrent();
            _super.prototype.init.call(this, opts);
            this.SelectCommand = new Command({ execute: this.onChangeSelected, scope: this });
            _.each({
                'model.filterReset': this.resetItemDelegate = _.bind(this.resetItem, this)
            }, function (h, e) { $(model).on(e, h); });
        };
        FilterEpicViewModel.prototype.finish = function () {
            var model = Model.getCurrent();
            _.each({
                'model.filterReset': this.resetItemDelegate
            }, function (h, e) { $(model).off(e, h); });
            _super.prototype.finish.call(this);
        };
        FilterEpicViewModel.prototype.getCommand = function (name) {
            switch (name) {
                case 'SelectCommand':
                    return this.SelectCommand;
                default:
                    return _super.prototype.getCommand.call(this, name);
            }
        };
        FilterEpicViewModel.prototype.onChangeSelected = function () {
            this.setSelected(!this.getSelected());
        };
        FilterEpicViewModel.prototype.resetItem = function () {
            this.getSelected() && this.setSelected(false);
        };
        return FilterEpicViewModel;
    }(BaseViewModel));
    return FilterEpicViewModel;
});
define("app/jira/view_models/issues/jira_view_model", ["require", "exports", 'underscore', 'jquery', "app/jira/view_models/page_view_model", "app/jira/view_models/issues/filter_entry_view_model", "app/jira/view_models/issues/filter_epic_view_model", "app/jira/view_models/issues/issue_entry_view_model", "app/jira/command", "app/jira/models/model"], function (require, exports, _, $, BaseViewModel, FilterEntryViewModel, FilterEpicViewModel, IssueEntryViewModel, Command, Model) {
    "use strict";
    var triggerPropertyChange = function (target, key, descriptor) {
        return {
            value: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                var result = descriptor.value.apply(this, args);
                console.log("decorator: ", { context: this, key: key, args: args, result: result });
                return result;
            }
        };
    };
    var filters = [{
            id: 'Deploy',
            selected: false,
            name: 'Ready to Deploy'
        }, {
            id: '"Code Review"',
            selected: false,
            name: 'Code Review'
        }, {
            id: 'Backlog',
            selected: false,
            name: 'Backlog'
        }, {
            id: '"Selected for Development"',
            selected: false,
            name: 'Selected for Development'
        }, {
            id: 'Done',
            selected: false,
            name: 'Done'
        }];
    var JiraViewModel = (function (_super) {
        __extends(JiraViewModel, _super);
        function JiraViewModel() {
            _super.apply(this, arguments);
            this.issues = [];
            this.statuses = filters.map(function (item) { return new FilterEntryViewModel(item); });
            this.epics = [];
            this.currentFiler = {};
        }
        JiraViewModel.prototype.getIssues = function () {
            return this.issues;
        };
        JiraViewModel.prototype.setIssues = function (value) {
            var issues = this.issues;
            _.defer(function () {
                _.each(issues, function (viewModel) {
                    viewModel.finish();
                });
            }, 0);
            this.issues = value;
            this.triggerProperyChanged('change:issues');
        };
        JiraViewModel.prototype.getStatuses = function () {
            return this.statuses;
        };
        JiraViewModel.prototype.setStatuses = function (value) {
            var filterItems = this.statuses;
            _.defer(function () {
                _.each(filterItems, function (viewModel) {
                    viewModel.finish();
                });
            }, 0);
            this.statuses = value;
            this.triggerProperyChanged('change:statuses');
        };
        JiraViewModel.prototype.getEpics = function () {
            return this.epics;
        };
        JiraViewModel.prototype.setEpics = function (value) {
            var epics = this.epics;
            _.defer(function () {
                _.each(epics, function (viewModel) {
                    viewModel.finish();
                });
            }, 0);
            this.epics = value;
            this.triggerProperyChanged('change:epics');
        };
        JiraViewModel.prototype.getFilter = function () {
            var filterItems = _.reduce(this.statuses, function (res, item) {
                if (item.getSelected()) {
                    res.push(item.getId());
                }
                return res;
            }, []);
            return {
                status: filterItems.join(',')
            };
        };
        JiraViewModel.prototype.init = function (opts) {
            var _this = this;
            var model = Model.getCurrent();
            _super.prototype.init.call(this, opts);
            this.currentFiler = {};
            this.ResetFiltersCommand = new Command({ execute: this.onResetFilters, scope: this });
            _.each({
                'model.issues': this.changeIssuesDelegate = _.bind(this.changeIssues, this),
                'model.statuses': this.changeStatusesDelegate = _.bind(this.changeStatuses, this),
                'model.epics': this.changeEpicsDelegate = _.bind(this.changeEpics, this)
            }, function (h, e) { $(model).on(e, h); });
            _.defer(_.bind(function () {
                _this.fetchStatuses();
                _this.fetchEpics();
                _this.fetchIssues();
            }, this), 0);
        };
        JiraViewModel.prototype.finish = function () {
            var model = Model.getCurrent();
            _.each({
                'model.issues': this.changeIssuesDelegate,
                'model.statuses': this.changeStatusesDelegate,
                'model.epics': this.changeEpicsDelegate
            }, function (h, e) { $(model).off(e, h); });
            $(this).off();
            this.setIssues([]);
            this.setEpics([]);
            this.setStatuses([]);
            _super.prototype.finish.call(this);
        };
        JiraViewModel.prototype.getCommand = function (name) {
            switch (name) {
                case 'ResetFiltersCommand':
                    return this.ResetFiltersCommand;
                default:
                    return _super.prototype.getCommand.call(this, name);
            }
        };
        JiraViewModel.prototype.onResetFilters = function () {
            var model = Model.getCurrent();
            model.resetFilter({});
        };
        JiraViewModel.prototype.changeIssues = function () {
            var model = Model.getCurrent(), issues = model.getIssues();
            this.setIssues(_.map(issues, function (item) {
                return new IssueEntryViewModel(item);
            }, this));
        };
        JiraViewModel.prototype.changeStatuses = function () {
            var model = Model.getCurrent(), statuses = model.getStatuses();
            this.setStatuses(_.map(statuses, function (item) { return new FilterEntryViewModel(item); }, this));
        };
        JiraViewModel.prototype.changeEpics = function () {
            var model = Model.getCurrent(), epics = model.getEpics();
            this.setEpics(_.map(epics, function (item) { return new FilterEpicViewModel({
                id: item.Key,
                selected: false,
                name: item.fields.summary
            }); }, this));
        };
        JiraViewModel.prototype.fetchIssues = function () {
            var model = Model.getCurrent();
            model.resetFilter({});
        };
        JiraViewModel.prototype.fetchStatuses = function () {
            var model = Model.getCurrent();
            model.fetchStatuses();
        };
        JiraViewModel.prototype.fetchEpics = function () {
            var model = Model.getCurrent();
            model.fetchEpics();
        };
        __decorate([
            triggerPropertyChange
        ], JiraViewModel.prototype, "setIssues");
        return JiraViewModel;
    }(BaseViewModel));
    return JiraViewModel;
});
define("app/jira/templates/products/product_item_template", ["require", "exports", 'react'], function (require, exports, React) {
    "use strict";
    var template = function (data) {
        var _this = this;
        return (React.createElement("a", {href: "#", className: "list-group-item", onClick: function (e) { return _this.onClick(e); }}, React.createElement("div", null, data.getProductName()), React.createElement("span", null, React.createElement("span", null, React.createElement("i", {className: "fa fa-shopping-cart fa-fw fa-3x", onClick: function (e) { return _this.addToCart(e); }})), React.createElement("span", null, React.createElement("div", null, data.getSupplier() && data.getSupplier().CompanyName), React.createElement("div", null, data.getUnitPrice(), " / ", data.getQuantityPerUnit()))), React.createElement("div", {className: "pull-right text-muted small"}, React.createElement("div", null, data.getCategory() && data.getCategory().CategoryName), React.createElement("div", null, React.createElement("em", null, (new Date(data.getOrderDateTs())).toLocaleString())))));
    };
    return template;
});
define("app/jira/views/products/product_item_view", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", "app/jira/templates/products/product_item_template"], function (require, exports, _, $, BaseView, template) {
    "use strict";
    var ProductItemView = (function (_super) {
        __extends(ProductItemView, _super);
        function ProductItemView(opts) {
            _super.call(this, opts);
            this.state = {
                product: this.props.viewModel
            };
            this.setProductDelegate = _.bind(this.setProduct, this);
        }
        ProductItemView.prototype.setProduct = function () {
            this.setState({
                product: this.props.viewModel
            });
        };
        ProductItemView.prototype.attachEvents = function (viewModel) {
            var _this = this;
            _.each('change:ProductName change:UnitPrice change:UnitsOnOrder change:QuantityPerUnit change:Categorie change:Supplier'.split(' '), function (en) {
                $(viewModel).on(en, _.bind(_this.setProduct, _this));
            });
        };
        ProductItemView.prototype.deattachEvents = function (viewModel) {
            _.each('change:ProductName change:UnitPrice change:UnitsOnOrder change:QuantityPerUnit change:Categorie change:Supplier'.split(' '), function (en) {
                $(viewModel).off(en);
            });
        };
        ProductItemView.prototype.componentWillMount = function () {
            this.attachEvents(this.props.viewModel);
        };
        ProductItemView.prototype.componentWillUnmount = function () {
            this.deattachEvents(this.props.viewModel);
        };
        ProductItemView.prototype.componentWillReceiveProps = function (props) {
            this.deattachEvents(this.props.viewModel);
            this.attachEvents(props.viewModel);
        };
        ProductItemView.prototype.onClick = function (evnt) {
            evnt.preventDefault();
            evnt.stopPropagation();
            this.props.onSelect && this.props.onSelect();
        };
        ProductItemView.prototype.render = function () {
            return template.call(this, this.props.viewModel);
        };
        ProductItemView.prototype.addToCart = function (evnt) {
            evnt.preventDefault();
            evnt.stopPropagation();
            var vm = this.props.viewModel;
            this.props.viewModel.addToCart(vm.getId(), vm.getUnitPrice());
        };
        ProductItemView.prototype.editProduct = function (evnt) {
            evnt.preventDefault();
            console.log('Selected product');
        };
        return ProductItemView;
    }(BaseView));
    return ProductItemView;
});
define("app/jira/templates/products/products_template", ["require", "exports", 'react', "app/jira/views/products/product_item_view"], function (require, exports, React, ProductItemView) {
    "use strict";
    var template = function () {
        var _this = this;
        return (React.createElement("div", {className: "list-group"}, this.state.products && this.state.products.map(function (entity) {
            return React.createElement(ProductItemView, {viewModel: entity, key: entity.getId(), onSelect: function () { return _this.runCommand('SelectCommand', entity.getId()); }});
        })));
    };
    return template;
});
/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../../base/base_view.ts" />
/// <reference path="../../view_models/issues/jira_view_model.ts" />
/// <reference path="../../view_models/issues/issue_entry_view_model.ts" />
define("app/jira/views/products/products_view", ["require", "exports", 'jquery', 'underscore', "app/jira/base/base_view", "app/jira/templates/products/products_template"], function (require, exports, $, _, BaseView, template) {
    "use strict";
    var ProductsView = (function (_super) {
        __extends(ProductsView, _super);
        function ProductsView(opts) {
            _super.call(this, opts);
            this.state = {
                products: this.props.products(this.props.viewModel)
            };
            this.setProductsDelegate = _.bind(this.setProducts, this);
        }
        ProductsView.prototype.setProducts = function () {
            this.setState({
                products: this.props.products(this.props.viewModel)
            });
        };
        ProductsView.prototype.attachEvents = function (viewModel) {
            var _this = this;
            _.each('change:products'.split(' '), function (en) {
                $(viewModel).on(en, _this.setProductsDelegate);
            });
        };
        ProductsView.prototype.deattachEvents = function (viewModel) {
            var _this = this;
            _.each('change:products'.split(' '), function (en) {
                $(viewModel).off(en, _this.setProductsDelegate);
            });
        };
        ProductsView.prototype.componentWillMount = function () {
            this.attachEvents(this.props.viewModel);
        };
        ProductsView.prototype.componentWillUnmount = function () {
            this.deattachEvents(this.props.viewModel);
        };
        ProductsView.prototype.componentWillReceiveProps = function (props) {
            this.deattachEvents(this.props.viewModel);
            this.attachEvents(props.viewModel);
        };
        ProductsView.prototype.render = function () {
            return template.call(this);
        };
        return ProductsView;
    }(BaseView));
    return ProductsView;
});
define("app/jira/templates/products/category_item_template", ["require", "exports", 'react'], function (require, exports, React) {
    "use strict";
    var template = function (data) {
        var _this = this;
        return (React.createElement("tr", {onClick: function (e) { return _this.onClick(e); }}, React.createElement("td", null, React.createElement("input", {className: "form-control", type: "text", onChange: function (e) { return _this.updateCategoryName(e); }, value: data.getCategoryName()})), React.createElement("td", null, React.createElement("input", {className: "form-control", type: "text", onChange: function (e) { return _this.updateDescription(e); }, value: data.getDescription()})), React.createElement("td", null, React.createElement("button", {className: "btn btn-xs btn-info", onClick: function (e) { return _this.saveCategory(e); }}, "Apply"))));
    };
    return template;
});
define("app/jira/views/products/category_item_view", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", "app/jira/templates/products/category_item_template"], function (require, exports, _, $, BaseView, template) {
    "use strict";
    var CategoryItemView = (function (_super) {
        __extends(CategoryItemView, _super);
        function CategoryItemView(opts) {
            _super.call(this, opts);
            this.state = {
                category: this.props.viewModel
            };
            this.setCategoryDelegate = _.bind(this.setCategory, this);
        }
        CategoryItemView.prototype.setCategory = function () {
            this.setState({
                category: this.props.viewModel
            });
        };
        CategoryItemView.prototype.attachEvents = function (viewModel) {
            var _this = this;
            _.each('change:CategoryName change:Description'.split(' '), function (en) {
                $(viewModel).on(en, _this.setCategoryDelegate);
            });
        };
        CategoryItemView.prototype.deattachEvents = function (viewModel) {
            var _this = this;
            _.each('change:CategoryName change:Description'.split(' '), function (en) {
                $(_this.props.viewModel).off(en, _this.setCategoryDelegate);
            });
        };
        CategoryItemView.prototype.componentWillMount = function () {
            this.attachEvents(this.props.viewModel);
        };
        CategoryItemView.prototype.componentWillUnmount = function () {
            this.deattachEvents(this.props.viewModel);
        };
        CategoryItemView.prototype.componentWillReceiveProps = function (props) {
            this.deattachEvents(this.props.viewModel);
            this.attachEvents(props.viewModel);
        };
        CategoryItemView.prototype.onClick = function (evnt) {
            evnt.preventDefault();
            this.props.onSelect && this.props.onSelect();
        };
        CategoryItemView.prototype.updateCategoryName = function (evnt) {
            evnt.preventDefault();
            var val = $(evnt.target).val();
            this.setState({
                category: this.state.category.setCategoryName(val)
            });
        };
        CategoryItemView.prototype.updateDescription = function (evnt) {
            evnt.preventDefault();
            var val = $(evnt.target).val();
            this.setState({
                category: this.state.category.setDescription(val)
            });
        };
        CategoryItemView.prototype.saveCategory = function (evnt) {
            evnt.preventDefault();
            this.state.category.saveCategory();
        };
        CategoryItemView.prototype.render = function () {
            return template.call(this, this.state.category);
        };
        return CategoryItemView;
    }(BaseView));
    return CategoryItemView;
});
define("app/jira/templates/products/categories_template", ["require", "exports", 'react', "app/jira/views/products/category_item_view"], function (require, exports, React, CategoryItemView) {
    "use strict";
    var template = function () {
        var _this = this;
        return (React.createElement("div", {className: "table-responsive"}, React.createElement("table", {className: "table table-hover"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Categoriy Name"), React.createElement("th", null, "Category Description"), React.createElement("th", null))), React.createElement("tbody", null, this.state.categories && this.state.categories.map(function (entity) {
            return React.createElement(CategoryItemView, {viewModel: entity, key: entity.getId(), onSelect: function () { return _this.runCommand('SelectCommand', entity.getId()); }});
        })))));
    };
    return template;
});
/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../../base/base_view.ts" />
define("app/jira/views/products/categories_view", ["require", "exports", 'jquery', 'underscore', "app/jira/base/base_view", "app/jira/templates/products/categories_template"], function (require, exports, $, _, BaseView, template) {
    "use strict";
    var CategoriesView = (function (_super) {
        __extends(CategoriesView, _super);
        function CategoriesView(opts) {
            _super.call(this, opts);
            this.state = {
                categories: this.props.viewModel.getCategories()
            };
            this.setCategoriesDelegate = _.bind(this.setCategories, this);
        }
        CategoriesView.prototype.setCategories = function () {
            this.setState({
                categories: this.props.viewModel.getCategories()
            });
        };
        CategoriesView.prototype.attachEvents = function (viewModel) {
            $(viewModel).on('change:categories', this.setCategoriesDelegate);
        };
        CategoriesView.prototype.deattachEvents = function (viewModel) {
            $(viewModel).off('change:categories', this.setCategoriesDelegate);
        };
        CategoriesView.prototype.componentWillMount = function () {
            this.attachEvents(this.props.viewModel);
        };
        CategoriesView.prototype.componentWillUnmount = function () {
            this.deattachEvents(this.props.viewModel);
        };
        CategoriesView.prototype.componentWillReceiveProps = function (props) {
            this.deattachEvents(this.props.viewModel);
            this.attachEvents(props.viewModel);
        };
        CategoriesView.prototype.render = function () {
            return template.call(this);
        };
        return CategoriesView;
    }(BaseView));
    return CategoriesView;
});
define("app/jira/templates/products/supplier_item_template", ["require", "exports", 'react'], function (require, exports, React) {
    "use strict";
    var template = function (data) {
        var _this = this;
        return (React.createElement("tr", {onClick: function (e) { return _this.onClick(e); }}, React.createElement("td", null, React.createElement("input", {className: "form-control", type: "text", onChange: function (e) { return _this.updateCompanyName(e); }, value: data.getCompanyName()})), React.createElement("td", null, React.createElement("input", {className: "form-control", type: "text", onChange: function (e) { return _this.updateAddress(e); }, value: data.getAddress()})), React.createElement("td", null, React.createElement("button", {className: "btn btn-xs btn-info", onClick: function (e) { return _this.saveSupplier(e); }}, "Apply"))));
    };
    return template;
});
define("app/jira/views/products/supplier_item_view", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", "app/jira/templates/products/supplier_item_template"], function (require, exports, _, $, BaseView, template) {
    "use strict";
    var SupplierItemView = (function (_super) {
        __extends(SupplierItemView, _super);
        function SupplierItemView(opts) {
            _super.call(this, opts);
            this.state = {
                supplier: this.props.viewModel
            };
            this.setSupplierDelegate = _.bind(this.setSupplier, this);
        }
        SupplierItemView.prototype.setSupplier = function () {
            this.setState({
                supplier: this.props.viewModel
            });
        };
        SupplierItemView.prototype.attachEvents = function (viewModel) {
            var _this = this;
            _.each('change:CompanyName change:Address'.split(' '), function (en) {
                $(viewModel).on(en, _this.setSupplierDelegate);
            });
        };
        SupplierItemView.prototype.deattachEvents = function (viewModel) {
            var _this = this;
            _.each('change:CompanyName change:Address'.split(' '), function (en) {
                $(viewModel).off(en, _this.setSupplierDelegate);
            });
        };
        SupplierItemView.prototype.componentWillMount = function () {
            this.attachEvents(this.props.viewModel);
        };
        SupplierItemView.prototype.componentWillUnmount = function () {
            this.deattachEvents(this.props.viewModel);
        };
        SupplierItemView.prototype.componentWillReceiveProps = function (props) {
            this.deattachEvents(this.props.viewModel);
            this.attachEvents(props.viewModel);
        };
        SupplierItemView.prototype.onClick = function (evnt) {
            evnt.preventDefault();
            this.props.onSelect && this.props.onSelect();
        };
        SupplierItemView.prototype.updateCompanyName = function (evnt) {
            evnt.preventDefault();
            var val = $(evnt.target).val();
            this.setState({
                supplier: this.state.supplier.setCompanyName(val)
            });
        };
        SupplierItemView.prototype.updateAddress = function (evnt) {
            evnt.preventDefault();
            var val = $(evnt.target).val();
            this.setState({
                supplier: this.state.supplier.setAddress(val)
            });
        };
        SupplierItemView.prototype.saveSupplier = function (evnt) {
            evnt.preventDefault();
            this.state.supplier.saveSupplier();
        };
        SupplierItemView.prototype.render = function () {
            return template.call(this, this.state.supplier);
        };
        return SupplierItemView;
    }(BaseView));
    return SupplierItemView;
});
define("app/jira/templates/products/suppliers_template", ["require", "exports", 'react', "app/jira/views/products/supplier_item_view"], function (require, exports, React, SupplierItemView) {
    "use strict";
    var template = function () {
        var _this = this;
        return (React.createElement("div", {className: "table-responsive"}, React.createElement("table", {className: "table table-hover"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Company Name"), React.createElement("th", null, "Address"), React.createElement("th", null))), React.createElement("tbody", null, this.state.suppliers && this.state.suppliers.map(function (entity) {
            return React.createElement(SupplierItemView, {viewModel: entity, key: entity.getId(), onSelect: function () { return _this.runCommand('SelectCommand', entity.getId()); }});
        })))));
    };
    return template;
});
/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../../base/base_view.ts" />
define("app/jira/views/products/suppliers_view", ["require", "exports", 'jquery', 'underscore', "app/jira/base/base_view", "app/jira/templates/products/suppliers_template"], function (require, exports, $, _, BaseView, template) {
    "use strict";
    var SuppliersView = (function (_super) {
        __extends(SuppliersView, _super);
        function SuppliersView(opts) {
            _super.call(this, opts);
            this.state = {
                suppliers: this.props.viewModel.getSuppliers()
            };
            this.setSuppliersDelegate = _.bind(this.setSuppliers, this);
        }
        SuppliersView.prototype.setSuppliers = function () {
            this.setState({
                suppliers: this.props.viewModel.getSuppliers()
            });
        };
        SuppliersView.prototype.attachEvents = function (viewModel) {
            var _this = this;
            _.each('change:suppliers'.split(' '), function (en) {
                $(viewModel).on(en, _this.setSuppliersDelegate);
            });
        };
        SuppliersView.prototype.deattachEvents = function (viewModel) {
            var _this = this;
            _.each('change:suppliers'.split(' '), function (en) {
                $(viewModel).off(en, _this.setSuppliersDelegate);
            });
        };
        SuppliersView.prototype.componentWillMount = function () {
            this.attachEvents(this.props.viewModel);
        };
        SuppliersView.prototype.componentWillUnmount = function () {
            this.deattachEvents(this.props.viewModel);
        };
        SuppliersView.prototype.componentWillReceiveProps = function (props) {
            this.deattachEvents(this.props.viewModel);
            this.attachEvents(props.viewModel);
        };
        SuppliersView.prototype.render = function () {
            return template.call(this);
        };
        return SuppliersView;
    }(BaseView));
    return SuppliersView;
});
define("app/jira/templates/products/order_item_template", ["require", "exports", 'underscore', 'react'], function (require, exports, _, React) {
    "use strict";
    var template = function (data) {
        var _this = this;
        return (React.createElement("a", {href: "#", className: "list-group-item", onClick: function (e) { return _this.onClick(e); }}, React.createElement("i", {className: "fa fa-shopping-cart fa-fw"}), data.order.getId(), React.createElement("span", {className: "pull-right text-muted small"}, React.createElement("em", null, (new Date(data.order.getOrderDate())).toLocaleString())), _.map([this.isSelected()], function (isSelected) {
            if (!isSelected) {
                return null;
            }
            return React.createElement("div", {className: "table-responsive"}, React.createElement("table", {className: "table table-bordered"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Id"), React.createElement("th", null, "Product Name"), React.createElement("th", null, "Unit Price"), React.createElement("th", null, "Quantity"))), React.createElement("tbody", null, _.map(data.order.getOrderDetail(), function (detail) {
                return React.createElement("tr", {key: detail.Id}, React.createElement("td", null, detail.Id), React.createElement("td", null, detail.Product.ProductName), React.createElement("td", null, detail.UnitPrice), React.createElement("td", null, detail.Quantity));
            }))));
        })[0]));
    };
    return template;
});
define("app/jira/views/products/order_item_view", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", "app/jira/templates/products/order_item_template"], function (require, exports, _, $, BaseView, template) {
    "use strict";
    var OrderItemView = (function (_super) {
        __extends(OrderItemView, _super);
        function OrderItemView(opts) {
            _super.call(this, opts);
            this.state = {
                order: this.props.viewModel,
                isSelected: false
            };
        }
        OrderItemView.prototype.setOrder = function () {
            this.setState(_.extend(this.state, {
                order: this.props.viewModel
            }));
        };
        OrderItemView.prototype.componentWillMount = function () {
            var _this = this;
            _.each('change:OrderDate change:OrderDetail'.split(' '), function (en) {
                $(_this.props.viewModel).on(en, _.bind(_this.setOrder, _this));
            });
        };
        OrderItemView.prototype.componentWillUnmount = function () {
            var _this = this;
            _.each('change:OrderDate change:OrderDetail'.split(' '), function (en) {
                $(_this.props.viewModel).off(en);
            });
        };
        OrderItemView.prototype.componentWillReceiveProps = function (props) {
            var _this = this;
            _.each('change:OrderDate change:OrderDetail'.split(' '), function (en) {
                $(_this.props.viewModel).off(en);
                $(props.viewModel).on(en, _.bind(_this.setOrder, _this));
            });
        };
        OrderItemView.prototype.isSelected = function () {
            return this.state.isSelected;
        };
        OrderItemView.prototype.onClick = function (evnt) {
            evnt.preventDefault();
            this.setState(_.extend(this.state, {
                isSelected: !this.state.isSelected
            }));
            this.props.onSelect && this.props.onSelect();
        };
        OrderItemView.prototype.render = function () {
            return template.call(this, this.state);
        };
        return OrderItemView;
    }(BaseView));
    return OrderItemView;
});
define("app/jira/templates/products/orders_template", ["require", "exports", 'react', "app/jira/views/products/order_item_view"], function (require, exports, React, OrderItemView) {
    "use strict";
    var template = function () {
        var _this = this;
        return (React.createElement("div", {className: "list-group"}, this.state.orders && this.state.orders.map(function (entity) {
            return React.createElement(OrderItemView, {viewModel: entity, key: entity.getId(), onSelect: function () { return _this.runCommand('SelectCommand', entity.getId()); }});
        })));
    };
    return template;
});
/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../../base/base_view.ts" />
define("app/jira/views/products/orders_view", ["require", "exports", 'jquery', 'underscore', "app/jira/base/base_view", "app/jira/templates/products/orders_template"], function (require, exports, $, _, BaseView, template) {
    "use strict";
    var OrdersView = (function (_super) {
        __extends(OrdersView, _super);
        function OrdersView(opts) {
            _super.call(this, opts);
            this.state = {
                orders: this.props.viewModel.getOrders()
            };
            this.setOrdersDelegate = _.bind(this.setOrders, this);
        }
        OrdersView.prototype.setOrders = function () {
            this.setState({
                orders: this.props.viewModel.getOrders()
            });
        };
        OrdersView.prototype.componentWillMount = function () {
            $(this.props.viewModel).on('change:orders', this.setOrdersDelegate);
        };
        OrdersView.prototype.componentWillUnmount = function () {
            $(this.props.viewModel).off('change:orders', this.setOrdersDelegate);
        };
        OrdersView.prototype.componentWillReceiveProps = function (props) {
            $(this.props.viewModel).off('change:orders', this.setOrdersDelegate);
            $(props.viewModel).on('change:orders', this.setOrdersDelegate);
        };
        OrdersView.prototype.render = function () {
            return template.call(this);
        };
        return OrdersView;
    }(BaseView));
    return OrdersView;
});
define("app/jira/templates/products/cart_item_template", ["require", "exports", 'underscore', 'react'], function (require, exports, _, React) {
    "use strict";
    var template = function (data) {
        var _this = this;
        return (React.createElement("div", null, data.cart && _.map(data.cart.getCartDetail(), function (detail) {
            return React.createElement("a", {key: detail.Id, href: "#schedule", className: "list-group-item", title: "Click to remove one item", onClick: function (e) { return _this.removeOneItem(e, detail.Product.Id); }}, React.createElement("i", {className: "fa fa-minus fa-fw"}), React.createElement("span", null, detail.Product.ProductName), React.createElement("span", {className: "pull-right text-muted small"}, React.createElement("em", null, detail.UnitPrice, " / ", detail.Quantity)));
        })));
    };
    return template;
});
define("app/jira/views/products/cart_item_view", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", "app/jira/templates/products/cart_item_template"], function (require, exports, _, $, BaseView, template) {
    "use strict";
    var CartItemView = (function (_super) {
        __extends(CartItemView, _super);
        function CartItemView(opts) {
            _super.call(this, opts);
            this.state = {
                cart: this.props.viewModel,
                isSelected: false
            };
            this.setCartDelegate = _.bind(this.setCart, this);
        }
        CartItemView.prototype.setCart = function () {
            this.setState(_.extend(this.state, {
                cart: this.props.viewModel
            }));
        };
        CartItemView.prototype.componentWillMount = function () {
            var _this = this;
            _.each('change:CartDate change:CartDetail'.split(' '), function (en) {
                $(_this.props.viewModel).on(en, _this.setCartDelegate);
            });
        };
        CartItemView.prototype.componentWillUnmount = function () {
            var _this = this;
            _.each('change:CartDate change:CartDetail'.split(' '), function (en) {
                $(_this.props.viewModel).off(en, _this.setCartDelegate);
            });
        };
        CartItemView.prototype.componentWillReceiveProps = function (props) {
            var _this = this;
            _.each('change:CartDate change:CartDetail'.split(' '), function (en) {
                $(_this.props.viewModel).off(en, _this.setCartDelegate);
                $(props.viewModel).on(en, _this.setCartDelegate);
            });
        };
        CartItemView.prototype.isSelected = function () {
            return this.state.isSelected;
        };
        CartItemView.prototype.onClick = function (evnt) {
            evnt.preventDefault();
            this.setState(_.extend(this.state, {
                isSelected: !this.state.isSelected
            }));
            this.props.onSelect && this.props.onSelect();
        };
        CartItemView.prototype.render = function () {
            return template.call(this, {
                cart: this.props.viewModel
            });
        };
        CartItemView.prototype.removeOneItem = function (evnt, productId) {
            evnt.preventDefault();
            this.props.viewModel.removeFromCart(productId);
        };
        return CartItemView;
    }(BaseView));
    return CartItemView;
});
define("app/jira/templates/products/cart_template", ["require", "exports", 'react', "app/jira/views/products/cart_item_view"], function (require, exports, React, CartItemView) {
    "use strict";
    var template = function () {
        return (React.createElement("div", {className: "list-group"}, this.state.cart && React.createElement(CartItemView, {viewModel: this.state.cart})));
    };
    return template;
});
/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../../base/base_view.ts" />
define("app/jira/views/products/cart_view", ["require", "exports", 'jquery', 'underscore', "app/jira/base/base_view", "app/jira/templates/products/cart_template"], function (require, exports, $, _, BaseView, template) {
    "use strict";
    var CartView = (function (_super) {
        __extends(CartView, _super);
        function CartView(opts) {
            _super.call(this, opts);
            this.state = {
                cart: this.props.viewModel.getCart()
            };
            this.setCartsDelegate = _.bind(this.setCart, this);
        }
        CartView.prototype.setCart = function () {
            this.setState({
                cart: this.props.viewModel.getCart()
            });
        };
        CartView.prototype.componentWillMount = function () {
            $(this.props.viewModel).on('change:carts', this.setCartsDelegate);
        };
        CartView.prototype.componentWillUnmount = function () {
            $(this.props.viewModel).off('change:carts', this.setCartsDelegate);
        };
        CartView.prototype.componentWillReceiveProps = function (props) {
            $(this.props.viewModel).off('change:carts', this.setCartsDelegate);
            $(props.viewModel).on('change:carts', this.setCartsDelegate);
        };
        CartView.prototype.render = function () {
            return template.call(this);
        };
        return CartView;
    }(BaseView));
    return CartView;
});
define("app/jira/templates/products/report_template", ["require", "exports", 'underscore', 'react'], function (require, exports, _, React) {
    "use strict";
    var template = function () {
        return (React.createElement("div", {className: "table-responsive"}, React.createElement("table", {className: "table table-striped table-bordered table-hover"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Month"), React.createElement("th", null, "Total"), React.createElement("th", null, "Quantity"), React.createElement("th", null, "Product/Supplier"), React.createElement("th", null, "Category"))), React.createElement("tbody", null, this.state.report && _.map(this.state.report, function (entity, index) {
            return React.createElement("tr", {key: index}, React.createElement("td", null, entity.Month), React.createElement("td", null, entity.Total), React.createElement("td", null, entity.Quantity), React.createElement("td", null, entity.ProductName), React.createElement("td", null));
        })))));
    };
    return template;
});
/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../../base/base_view.ts" />
define("app/jira/views/products/report_view", ["require", "exports", 'jquery', 'underscore', "app/jira/base/base_view", "app/jira/templates/products/report_template"], function (require, exports, $, _, BaseView, template) {
    "use strict";
    var ReportView = (function (_super) {
        __extends(ReportView, _super);
        function ReportView(opts) {
            _super.call(this, opts);
            this.state = {
                report: this.props.viewModel.getReport()
            };
            this.setReportDelegate = _.bind(this.setReport, this);
        }
        ReportView.prototype.setReport = function () {
            this.setState({
                report: this.props.viewModel.getReport()
            });
        };
        ReportView.prototype.attachEvents = function (viewModel) {
            $(viewModel).on('change:report', this.setReportDelegate);
        };
        ReportView.prototype.deattachEvents = function (viewModel) {
            $(viewModel).off('change:report', this.setReportDelegate);
        };
        ReportView.prototype.componentWillMount = function () {
            this.attachEvents(this.props.viewModel);
        };
        ReportView.prototype.componentWillUnmount = function () {
            this.deattachEvents(this.props.viewModel);
        };
        ReportView.prototype.componentWillReceiveProps = function (props) {
            this.deattachEvents(this.props.viewModel);
            this.attachEvents(props.viewModel);
        };
        ReportView.prototype.render = function () {
            return template.call(this);
        };
        return ReportView;
    }(BaseView));
    return ReportView;
});
define("app/jira/ui_controls/panel_template", ["require", "exports", 'react'], function (require, exports, React) {
    "use strict";
    var template = {
        body: function () {
            return (React.createElement("div", {className: "panel panel-default highlight"}, this.getHeader(), React.createElement("div", {className: "panel-body"}, this.getChildren())));
        },
        header: function (def) {
            return (React.createElement("div", {className: "panel-heading"}, !def && this.props.children, def && React.createElement("label", null, this.props.title)));
        }
    };
    return template;
});
/// <reference path="../base/base_view.ts" />
define("app/jira/ui_controls/panel_view", ["require", "exports", 'underscore', "app/jira/base/base_view", "app/jira/ui_controls/panel_template", 'react'], function (require, exports, _, BaseView, template, React) {
    "use strict";
    var PanelHeaderView = (function (_super) {
        __extends(PanelHeaderView, _super);
        function PanelHeaderView() {
            _super.apply(this, arguments);
        }
        PanelHeaderView.prototype.render = function () {
            return template.header.call(this);
        };
        return PanelHeaderView;
    }(BaseView));
    var PanelView = (function (_super) {
        __extends(PanelView, _super);
        function PanelView(opts) {
            _super.call(this, opts);
            this.opts = opts;
        }
        PanelView.prototype.getHeader = function () {
            var header = _.find(React.Children.toArray(this.props.children), function (el) { return el.type === PanelHeaderView; });
            if (header) {
                return header;
            }
            return template.header.call(this, true);
        };
        PanelView.prototype.getChildren = function () {
            return _.reduce(React.Children.toArray(this.props.children), function (res, el) {
                if (el.type === PanelHeaderView) {
                    return res;
                }
                res.push(el);
                return res;
            }, []);
        };
        PanelView.prototype.render = function () {
            return template.body.call(this);
        };
        PanelView.Header = PanelHeaderView;
        return PanelView;
    }(BaseView));
    return PanelView;
});
define("app/jira/templates/products/create_product_template", ["require", "exports", 'underscore', 'react'], function (require, exports, _, React) {
    "use strict";
    var template = function () {
        var _this = this;
        return (React.createElement("div", {className: "form-group"}, React.createElement("form", {role: "form", onSubmit: this.submitForm}, React.createElement("div", {className: "form-group"}, React.createElement("label", null, "Enter Product Name"), React.createElement("textarea", {className: "form-control", rows: "3", value: this.state.product.getProductName(), onChange: function (e) { return _this.updateProductName(e); }}), React.createElement("p", {className: "help-block"}, "Help text here.")), React.createElement("div", {className: "form-group"}, React.createElement("label", null, "Select Category"), React.createElement("select", {className: "form-control", value: this.state.product.getCategory() && this.state.product.getCategory().Id, onChange: function (e) { return _this.updateCategory(e); }}, _.map(this.state.categories, function (item) {
            return (React.createElement("option", {key: item.getId(), value: item.getId()}, item.getCategoryName()));
        })), React.createElement("p", {className: "help-block"}, "Help text here.")), React.createElement("div", {className: "form-group"}, React.createElement("label", null, "Select Supplier"), React.createElement("select", {className: "form-control", onChange: function (e) { return _this.updateSupplier(e); }, value: this.state.product.getSupplier() && this.state.product.getSupplier().Id}, _.map(this.state.suppliers, function (item) {
            return (React.createElement("option", {key: item.getId(), value: item.getId()}, item.getCompanyName()));
        })), React.createElement("p", {className: "help-block"}, "Help text here.")), React.createElement("div", {className: "form-group col-md-4"}, React.createElement("label", null, "Price"), React.createElement("input", {className: "form-control", type: "text", value: this.state.product.getUnitPrice(), onChange: function (e) { return _this.updateUnitPrice(e); }}), React.createElement("p", {className: "help-block"}, "Help text here.")), React.createElement("div", {className: "form-group col-md-4"}, React.createElement("label", null, "Quantity"), React.createElement("input", {className: "form-control", type: "text", value: this.state.product.getQuantityPerUnit(), onChange: function (e) { return _this.updateQuantityPerUnit(e); }}), React.createElement("p", {className: "help-block"}, "Help text here.")), React.createElement("div", {className: "form-group col-md-4"}, React.createElement("label", null, "Units"), React.createElement("input", {className: "form-control", type: "text", value: this.state.product.getUnitsOnOrder(), onChange: function (e) { return _this.updateUnitsOnOrder(e); }}), React.createElement("p", {className: "help-block"}, "Help text here.")), React.createElement("div", {className: "form-group col-md-8"}, React.createElement("button", {className: "btn btn-info", type: "submit", onClick: function (e) { return _this.saveProduct(e); }}, "Save")), React.createElement("div", {className: "form-group col-md-4"}, React.createElement("button", {className: "btn btn-info", type: "submit", onClick: function (e) { return _this.newProduct(e); }}, "New Product")))));
    };
    return template;
});
/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../../base/base_view.ts" />
define("app/jira/views/products/create_product_view", ["require", "exports", 'jquery', 'underscore', "app/jira/base/base_view", "app/jira/templates/products/create_product_template"], function (require, exports, $, _, BaseView, template) {
    "use strict";
    var CreateProductView = (function (_super) {
        __extends(CreateProductView, _super);
        function CreateProductView(opts) {
            _super.call(this, opts);
            this.state = {
                product: this.props.viewModel.getCurentProduct(),
                categories: this.props.viewModel.getCategories(),
                suppliers: this.props.viewModel.getSuppliers()
            };
            this.setProductDelegate = _.bind(this.setProduct, this);
            this.setCategoriesDelegate = _.bind(this.setProduct, this);
            this.setSuppliersDelegate = _.bind(this.setProduct, this);
        }
        CreateProductView.prototype.setProduct = function () {
            this.setState(_.extend(this.state, {
                product: this.props.viewModel.getCurentProduct(),
                categories: this.props.viewModel.getCategories(),
                suppliers: this.props.viewModel.getSuppliers()
            }));
        };
        CreateProductView.prototype.attachEvents = function (viewModel) {
            $(viewModel).on('change:CurentProduct', this.setProductDelegate);
            $(viewModel).on('change:categories', this.setProductDelegate);
            $(viewModel).on('change:suppliers', this.setProductDelegate);
        };
        CreateProductView.prototype.deatachEvents = function (viewModel) {
            $(viewModel).off('change:CurentProduct', this.setProductDelegate);
            $(viewModel).off('change:categories', this.setProductDelegate);
            $(viewModel).off('change:suppliers', this.setProductDelegate);
        };
        CreateProductView.prototype.componentWillMount = function () {
            this.attachEvents(this.props.viewModel);
        };
        CreateProductView.prototype.componentWillUnmount = function () {
            this.deatachEvents(this.props.viewModel);
        };
        CreateProductView.prototype.componentWillReceiveProps = function (props) {
            this.deatachEvents(this.props.viewModel);
            this.attachEvents(props.viewModel);
        };
        CreateProductView.prototype.updateProductName = function (evnt) {
            evnt.preventDefault();
            this.setState({
                product: this.state.product.setProductName(evnt.target.value)
            });
        };
        CreateProductView.prototype.updateUnitPrice = function (evnt) {
            evnt.preventDefault();
            this.setState({
                product: this.state.product.setUnitPrice(evnt.target.value)
            });
        };
        CreateProductView.prototype.updateQuantityPerUnit = function (evnt) {
            evnt.preventDefault();
            this.setState({
                product: this.state.product.setQuantityPerUnit(evnt.target.value)
            });
        };
        CreateProductView.prototype.updateUnitsOnOrder = function (evnt) {
            evnt.preventDefault();
            this.setState({
                product: this.state.product.setUnitsOnOrder(evnt.target.value)
            });
        };
        CreateProductView.prototype.updateCategory = function (evnt) {
            evnt.preventDefault();
            var category = _.find(this.state.categories, function (item) { return item.getId() == evnt.target.value; });
            if (category) {
                this.setState({
                    product: this.state.product
                        .setCategory(category.toJSON())
                        .setCategoryId(category.getId())
                });
            }
        };
        CreateProductView.prototype.updateSupplier = function (evnt) {
            evnt.preventDefault();
            var supplier = _.find(this.state.suppliers, function (item) { return item.getId() == evnt.target.value; });
            if (supplier) {
                this.setState({
                    product: this.state.product
                        .setSupplier(supplier.toJSON())
                        .setSupplierId(supplier.getId())
                });
            }
        };
        CreateProductView.prototype.saveProduct = function (evnt) {
            evnt.preventDefault();
            this.props.viewModel.saveCurentProduct();
        };
        CreateProductView.prototype.newProduct = function (evnt) {
            evnt.preventDefault();
            this.props.viewModel.newProduct();
        };
        CreateProductView.prototype.onSubmsubmitFormit = function (evnt) {
            evnt.preventDefault();
        };
        CreateProductView.prototype.render = function () {
            return template.call(this);
        };
        return CreateProductView;
    }(BaseView));
    return CreateProductView;
});
define("app/jira/ui_controls/tabs_template", ["require", "exports", 'react'], function (require, exports, React) {
    "use strict";
    var template = function () {
        var _this = this;
        return (React.createElement("div", null, React.createElement("ul", {className: "nav nav-tabs"}, React.Children.map(this.props.children, function (x, index) {
            return React.createElement("li", {className: _this.activeTab() === index ? "active" : "", key: index}, React.createElement("a", {href: "#", onClick: function (e) { return _this.changeTab(e, index); }}, x.props.tabTitle));
        })), React.createElement("div", {className: "tab-content"}, React.Children.map(this.props.children, function (x, index) {
            if (_this.activeTab() !== index)
                return React.createElement("div", {className: "tab-pane fade", style: { display: "block" }});
            return (React.createElement("div", {className: "tab-pane fade active in"}, x));
        }))));
    };
    return template;
});
/// <reference path="../base/base_view.ts" />
define("app/jira/ui_controls/tabs_view", ["require", "exports", "app/jira/base/base_view", "app/jira/ui_controls/tabs_template"], function (require, exports, BaseView, template) {
    "use strict";
    var TabsView = (function (_super) {
        __extends(TabsView, _super);
        function TabsView(opts) {
            _super.call(this, opts);
            this.state = {
                active: this.props.active || 0
            };
        }
        TabsView.prototype.changeTab = function (evnt, active) {
            evnt && evnt.preventDefault();
            this.setState({
                active: active
            });
        };
        TabsView.prototype.activeTab = function () {
            return this.state.active;
        };
        TabsView.prototype.render = function () {
            return template.call(this);
        };
        return TabsView;
    }(BaseView));
    return TabsView;
});
define("app/jira/pages/feeding_page_template", ["require", "exports", 'underscore', 'react', "app/jira/views/products/products_view", "app/jira/views/products/categories_view", "app/jira/views/products/suppliers_view", "app/jira/views/products/orders_view", "app/jira/views/products/cart_view", "app/jira/views/products/report_view", "app/jira/views/products/create_product_view", "app/jira/ui_controls/panel_view", "app/jira/ui_controls/tabs_view"], function (require, exports, _, React, ProductsView, CategoriesView, SuppliersView, OrdersView, CartView, ReportView, CreateProductView, PanelView, TabsView) {
    "use strict";
    var template = function (viewModel) {
        var _this = this;
        return (React.createElement(TabsView, {active: 0}, React.createElement("div", {id: "page-inner", tabTitle: "Home"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-md-6"}, React.createElement(PanelView, {title: "Create Product"}, React.createElement(CreateProductView, {viewModel: viewModel}))), React.createElement("div", {className: "col-md-6"}, React.createElement(PanelView, {title: "Cart"}, React.createElement(PanelView.Header, null, React.createElement("button", {className: "btn btn-danger", onClick: function (e) { return _this.createCart(e); }}, "new Cart"), React.createElement("div", {className: "pull-right btn btn-info"}, "Cart: ", this.state.cartName, React.createElement("span", {className: "badge"}, this.state.cartDate))), React.createElement(CartView, {viewModel: viewModel})))), React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-md-12"}, React.createElement("ul", {className: "pagination"}, React.createElement("li", {onClick: function (e) { return _this.fetchProducts(e, 0, 10); }}, React.createElement("a", {href: "#"}, "«")), _.map(_.range(0, this.state.productsTotal, 10), function (index) {
            return React.createElement("li", {key: index}, React.createElement("a", {href: "#", onClick: function (e) { return _this.fetchProducts(e, index, 10); }}, index));
        }), React.createElement("li", {onClick: function (e) { return _this.fetchProducts(e, 0, 10); }}, React.createElement("a", {href: "#"}, "»"))))), React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-md-12"}, React.createElement(PanelView, {ref: "productsPanel", viewModel: viewModel}, React.createElement(PanelView.Header, null, React.createElement("div", {className: "input-group col-md-12"}, React.createElement("input", {type: "text", onInput: function (e) { return _this.searchProducts(e); }, className: "form-control", placeholder: "Enter search phrase"}), React.createElement("span", {className: "input-group-btn"}, React.createElement("button", {className: "btn btn-success", type: "button"}, "Find")))), React.createElement(ProductsView, {viewModel: viewModel, products: function (vm) { return vm.getProducts(); }}))))), React.createElement("div", {id: "page-inner", tabTitle: "Categories"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-md-12"}, React.createElement(CategoriesView, {viewModel: viewModel})))), React.createElement("div", {id: "page-inner", tabTitle: "Suppliers"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-md-12"}, React.createElement(SuppliersView, {viewModel: viewModel})))), React.createElement("div", {id: "page-inner", tabTitle: "Orders"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-md-12"}, React.createElement(OrdersView, {viewModel: viewModel})))), React.createElement("div", {id: "page-inner", tabTitle: "Report"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-md-12"}, React.createElement(ReportView, {viewModel: viewModel}))))));
    };
    return template;
});
/// <reference path="../base/base.ts" />
/// <reference path="../base/base_view.ts" />
/// <reference path="../utils.ts" />
/// <reference path="../view_models/products/feeding_view_model.ts" />
define("app/jira/pages/feeding_page", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", "app/jira/base/base", "app/jira/pages/feeding_page_template", "app/jira/templates/master_page_template"], function (require, exports, _, $, BaseView, Base, template, master_page_template) {
    "use strict";
    var FeedingPage = (function (_super) {
        __extends(FeedingPage, _super);
        function FeedingPage(opts) {
            _super.call(this, opts);
            this.handlers = {
                onDraw: function () {
                    _.defer(function () {
                        $('#main-menu').metisMenu();
                    });
                }
            };
            var cart = this.props.viewModel.getCart();
            this.state = {
                cartDate: cart && new Date(cart.getCartDate()).toLocaleString(),
                cartName: cart && cart.getId(),
                productsTotal: this.props.viewModel.getProductsTotal()
            };
            this.searchProductsInternal = _.debounce(this.searchProductsInternal, 500);
            this.setProductsTotalDelegate = _.bind(this.setProductsTotal, this);
            this.updateCartDelegate = _.bind(this.updateCart, this);
        }
        FeedingPage.prototype.setProductsTotal = function (value) {
            this.setState(_.extend(this.state, {
                productsTotal: this.props.viewModel.getProductsTotal()
            }));
        };
        FeedingPage.prototype.updateCart = function () {
            var cart = this.props.viewModel.getCart();
            cart && this.setState(_.extend(this.state, {
                cartDate: new Date(cart.getCartDate()).toLocaleString(),
                cartName: cart.getId()
            }));
        };
        FeedingPage.prototype.init = function (options) {
            _.extend(this.handlers, options.handlers || {});
            _super.prototype.init.call(this, options);
        };
        FeedingPage.prototype.finish = function () {
            Base.prototype.finish.apply(this, arguments);
        };
        FeedingPage.prototype.attachEvents = function (viewModel) {
            $(viewModel).on('change:products', this.setProductsTotalDelegate);
            $(viewModel).on('change:carts', this.updateCartDelegate);
        };
        FeedingPage.prototype.deattachEvents = function (viewModel) {
            $(viewModel).off('change:products', this.setProductsTotalDelegate);
            $(viewModel).off('change:carts', this.updateCartDelegate);
        };
        FeedingPage.prototype.componentWillMount = function () {
            this.attachEvents(this.props.viewModel);
        };
        FeedingPage.prototype.componentWillUnmount = function () {
            this.deattachEvents(this.props.viewModel);
        };
        FeedingPage.prototype.componentWillReceiveProps = function (props) {
            this.deattachEvents(this.props.viewModel);
            this.attachEvents(props.viewModel);
        };
        FeedingPage.prototype.onNavigateTo = function () {
            this.handlers.onDraw.call(this);
            return _super.prototype.onNavigateTo.call(this);
        };
        FeedingPage.prototype.render = function () {
            return master_page_template.call(this, template.call(this, this.props.viewModel));
        };
        FeedingPage.prototype.fetchProducts = function (evnt, from, count) {
            evnt.preventDefault();
            this.props.viewModel.fetchProducts(from, count);
        };
        FeedingPage.prototype.searchProducts = function (evnt) {
            var subject = $(evnt.target).val();
            evnt.preventDefault();
            this.searchProductsInternal(subject);
        };
        FeedingPage.prototype.searchProductsInternal = function (subject) {
            this.props.viewModel.searchProducts(subject);
        };
        FeedingPage.prototype.createCart = function (evnt) {
            this.props.viewModel.createCart();
        };
        return FeedingPage;
    }(BaseView));
    return FeedingPage;
});
define("app/jira/templates/issues/jira_issue_item_template", ["require", "exports", 'react'], function (require, exports, React) {
    "use strict";
    var template = function (data) {
        return (React.createElement("tr", null, React.createElement("td", {style: { width: "140px" }}, React.createElement("img", {src: data.fields.priority.iconUrl, title: data.fields.priority.name, style: { width: "16px", height: "16px" }}), data.fields.priority.name), React.createElement("td", null, React.createElement("div", null, data.Key, ": ", data.fields.summary), React.createElement("div", null, data.fields.status.name)), React.createElement("td", null), React.createElement("td", {style: { width: "140px", textAlign: "center" }}, data.updated()), React.createElement("td", {style: { minWidth: "140px" }}, data.fields.assignee && data.fields.assignee.displayName)));
    };
    return template;
});
define("app/jira/views/issues/issue_view", ["require", "exports", 'underscore', "app/jira/base/base_view", "app/jira/templates/issues/jira_issue_item_template"], function (require, exports, _, BaseView, template) {
    "use strict";
    function toDate(ticks) {
        //ticks are in nanotime; convert to microtime
        var ticksToMicrotime = ticks / 10000;
        //ticks are recorded from 1/1/1; get microtime difference from 1/1/1/ to 1/1/1970
        var epochMicrotimeDiff = 2208988800000;
        //new date is ticks, converted to microtime, minus difference from epoch microtime
        var tickDate = new Date(ticksToMicrotime - epochMicrotimeDiff);
        return tickDate;
    }
    function printDate(datetime, format) {
        var format = format, dateStr = format.replace('YYYY', padStr(datetime.getFullYear()))
            .replace('YY', ('' + datetime.getFullYear()).substr(2))
            .replace('MM', padStr(1 + datetime.getMonth()))
            .replace('M', '' + (1 + datetime.getMonth()))
            .replace('DD', padStr(datetime.getDate()))
            .replace('hh', padStr(datetime.getHours()))
            .replace('mm', padStr(datetime.getMinutes()))
            .replace('ss', padStr(datetime.getSeconds()));
        return dateStr;
    }
    function padStr(i) {
        return (i < 10) ? '0' + i : '' + i;
    }
    var IssueView = (function (_super) {
        __extends(IssueView, _super);
        function IssueView(opts) {
            _super.call(this, opts);
        }
        IssueView.prototype.render = function () {
            var data = this.props.viewModel.toJSON();
            return template.call(this, _.extend(data, {
                updated: function () {
                    var date = new Date(data.fields.updated);
                    return printDate(date, 'YYYY-MM-DD hh:mm:ss');
                }
            }));
        };
        return IssueView;
    }(BaseView));
    return IssueView;
});
define("app/jira/templates/issues/filter_item_view_template", ["require", "exports", 'react'], function (require, exports, React) {
    "use strict";
    var template = function () {
        var _this = this;
        return (React.createElement("span", {className: "highlight"}, React.createElement("button", {type: "button", className: "btn btn-sm btn-" + (this.state.selected ? 'primary' : 'default') + " status-name", onClick: function () { return _this.runCommand('SelectCommand'); }, title: this.state.description, style: { margin: '4px 6px' }}, this.state.name)));
    };
    return template;
});
define("app/jira/views/issues/filter_item_view", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", "app/jira/templates/issues/filter_item_view_template"], function (require, exports, _, $, BaseView, template) {
    "use strict";
    var FilterItemView = (function (_super) {
        __extends(FilterItemView, _super);
        function FilterItemView(opts) {
            _super.call(this, opts);
            this.state = this.props.viewModel.toJSON();
        }
        FilterItemView.prototype.componentWillMount = function () {
            $(this.props.viewModel).on('change:selected', _.bind(this.onChangeSelected, this));
        };
        FilterItemView.prototype.componentWillUnmount = function () {
            $(this.props.viewModel).off('change:selected');
        };
        FilterItemView.prototype.componentWillReceiveProps = function (props) {
            $(this.props.viewModel).off('change:selected');
            $(props.viewModel).on('change:selected', _.bind(this.onChangeSelected, this));
        };
        FilterItemView.prototype.onChangeSelected = function () {
            this.setState(this.props.viewModel.toJSON());
        };
        FilterItemView.prototype.toggleSelected = function () {
            var cmd = this.props.viewModel.getCommand('SelectCommand');
            cmd.execute();
        };
        FilterItemView.prototype.render = function () {
            return template.call(this);
        };
        return FilterItemView;
    }(BaseView));
    return FilterItemView;
});
define("app/jira/templates/issues/filter_view_template", ["require", "exports", 'react', "app/jira/views/issues/filter_item_view"], function (require, exports, React, FilterItemView) {
    "use strict";
    var StatusFilterItemView = FilterItemView;
    var template = function () {
        return (React.createElement("div", {className: "filter-statuses highlight"}, this.state.items.map(function (entry) {
            return React.createElement(StatusFilterItemView, {viewModel: entry, key: entry.getId()});
        })));
    };
    return template;
});
/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../../base/base_view.ts" />
define("app/jira/views/issues/filter_view", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", "app/jira/templates/issues/filter_view_template"], function (require, exports, _, $, BaseView, template) {
    "use strict";
    var FilterView = (function (_super) {
        __extends(FilterView, _super);
        function FilterView(opts) {
            _super.call(this, opts);
            this.state = {
                items: this.props.statuses(this.props.viewModel)
            };
        }
        FilterView.prototype.setItems = function (items) {
            this.setState({
                items: items
            });
        };
        FilterView.prototype.setStatuses = function () {
            this.setState({
                items: this.props.statuses(this.props.viewModel)
            });
        };
        FilterView.prototype.componentWillMount = function () {
            $(this.props.viewModel).on('change:statuses', _.bind(this.setStatuses, this));
        };
        FilterView.prototype.componentWillUnmount = function () {
            $(this.props.viewModel).off('change:statuses');
        };
        FilterView.prototype.componentWillReceiveProps = function (props) {
            $(this.props.viewModel).off('change:statuses');
            $(props.viewModel).on('change:statuses', _.bind(this.setStatuses, this));
        };
        FilterView.prototype.render = function () {
            return template.call(this);
        };
        return FilterView;
    }(BaseView));
    return FilterView;
});
define("app/jira/templates/issues/epics_view_template", ["require", "exports", 'react', "app/jira/views/issues/filter_item_view"], function (require, exports, React, FilterItemView) {
    "use strict";
    var EpicFilterItemView = FilterItemView;
    var template = function () {
        return (React.createElement("div", {className: "filter-epics highlight"}, this.state.items.map(function (entry) {
            return React.createElement(EpicFilterItemView, {viewModel: entry, key: entry.getId()});
        })));
    };
    return template;
});
/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../../base/base_view.ts" />
define("app/jira/views/issues/epics_view", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", "app/jira/templates/issues/epics_view_template"], function (require, exports, _, $, BaseView, template) {
    "use strict";
    var EpicsView = (function (_super) {
        __extends(EpicsView, _super);
        function EpicsView(opts) {
            _super.call(this, opts);
            this.state = {
                items: this.props.epics(this.props.viewModel)
            };
        }
        EpicsView.prototype.setItems = function (items) {
            this.setState({
                items: items
            });
        };
        EpicsView.prototype.setEpics = function () {
            this.setState({
                items: this.props.epics(this.props.viewModel)
            });
        };
        EpicsView.prototype.componentWillMount = function () {
            $(this.props.viewModel).on('change:epics', _.bind(this.setEpics, this));
        };
        EpicsView.prototype.componentWillUnmount = function () {
            $(this.props.viewModel).off('change:epics');
        };
        EpicsView.prototype.componentWillReceiveProps = function (props) {
            $(this.props.viewModel).off('change:epics');
            $(props.viewModel).on('change:epics', _.bind(this.setEpics, this));
        };
        EpicsView.prototype.render = function () {
            return template.call(this);
        };
        return EpicsView;
    }(BaseView));
    return EpicsView;
});
define("app/jira/templates/issues/jira_template", ["require", "exports", 'react'], function (require, exports, React) {
    "use strict";
    var template = function (IssueView) {
        var _this = this;
        return (React.createElement("div", {id: "page-inner"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-md-12"}, React.createElement("h1", {className: "page-head-line"}, "JIRA Report"))), React.createElement("div", {className: "row"}, React.createElement("div", {className: "jira-issues-list col-md-12"}, React.createElement("div", {className: "panel panel-default"}, React.createElement("div", {className: "panel-heading"}, React.createElement("a", {href: "javascript:(function(){HOST = '{{domain}}';var jsCode = document.createElement('script');jsCode.setAttribute('src', HOST + '/mvc/jira/bookmarklet?' + Math.random());jsCode.setAttribute('id','jira-worktool-bookmarklet');document.getElementsByTagName('head')[0].appendChild(jsCode);}());"}, React.createElement("button", {className: "btn btn-lg btn-info"}, "Jira bookmarklet")), React.createElement("button", {type: "button", className: "filter-reset btn btn-lg btn-primary", onClick: function () { return _this.runCommand('ResetFiltersCommand'); }}, "Reset"), React.createElement("label", null, "Filter By Status")), React.createElement("div", {className: "panel-body"}, React.createElement("div", {className: "filter-items-statuses"}, React.createElement("div", {className: "form-group"}, this.props.children.find(function (item) { return item.ref === "filterStatuses"; }))))))), React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-md-12"}, this.props.children.find(function (item) { return item.ref === "epicsPanel"; }))), React.createElement("div", {className: "row"}, React.createElement("div", {className: "table-responsive"}, React.createElement("table", {className: "table table-hover"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Priority"), React.createElement("th", null, React.createElement("div", null, "Key: Summary"), React.createElement("div", null, "Status")), React.createElement("th", null, "X"), React.createElement("th", null, "Updated"), React.createElement("th", null, "Assignee"))), React.createElement("tbody", {className: "issues-list"}, this.state.issues && this.state.issues.map(function (entity) { return React.createElement(IssueView, {viewModel: entity, key: entity.getId()}); })))))));
    };
    return template;
});
/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../../base/base_view.ts" />
/// <reference path="../../view_models/issues/jira_view_model.ts" />
/// <reference path="../../view_models/issues/issue_entry_view_model.ts" />
/// <reference path="issue_view.ts" />
define("app/jira/views/issues/jira_view", ["require", "exports", 'jquery', 'underscore', "app/jira/base/base_view", "app/jira/views/issues/issue_view", "app/jira/templates/issues/jira_template"], function (require, exports, $, _, BaseView, IssueView, template) {
    "use strict";
    var JiraView = (function (_super) {
        __extends(JiraView, _super);
        function JiraView(opts) {
            _super.call(this, opts);
            this.setIssuesDelegate = _.bind(this.setIssues, this);
            this.state = {
                issues: this.props.issues(this.props.viewModel)
            };
        }
        JiraView.prototype.setIssues = function () {
            this.setState({
                issues: this.props.issues(this.props.viewModel)
            });
        };
        JiraView.prototype.componentWillMount = function () {
            $(this.props.viewModel).on('change:issues', this.setIssuesDelegate);
        };
        JiraView.prototype.componentWillUnmount = function () {
            $(this.props.viewModel).off('change:issues', this.setIssuesDelegate);
        };
        JiraView.prototype.componentWillReceiveProps = function (props) {
            $(this.props.viewModel).off('change:issues', this.setIssuesDelegate);
            $(props.viewModel).on('change:issues', this.setIssuesDelegate);
        };
        JiraView.prototype.render = function () {
            return template.call(this, IssueView);
        };
        return JiraView;
    }(BaseView));
    return JiraView;
});
define("app/jira/pages/jira_page_template", ["require", "exports", 'react', "app/jira/views/issues/jira_view", "app/jira/views/issues/filter_view", "app/jira/ui_controls/panel_view", "app/jira/views/issues/epics_view"], function (require, exports, React, JiraView, FilterView, PanelView, EpicsView) {
    "use strict";
    var template = function (viewModel) {
        return (React.createElement(JiraView, {viewModel: viewModel, issues: function (vm) { return vm.getIssues(); }}, React.createElement(FilterView, {ref: "filterStatuses", viewModel: viewModel, statuses: function (vm) { return vm.getStatuses(); }}), React.createElement(PanelView, {ref: "epicsPanel", viewModel: viewModel, title: "Filter by Epic"}, React.createElement(EpicsView, {ref: "filterEpics", viewModel: viewModel, epics: function (vm) { return vm.getEpics(); }}))));
    };
    return template;
});
define("app/jira/pages/jira_page", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", "app/jira/base/base", "app/jira/pages/jira_page_template", "app/jira/templates/master_page_template"], function (require, exports, _, $, BaseView, Base, template, master_page_template) {
    "use strict";
    var JiraPage = (function (_super) {
        __extends(JiraPage, _super);
        function JiraPage() {
            _super.apply(this, arguments);
            this.handlers = {
                onDraw: function () {
                    $('#main-menu').metisMenu();
                }
            };
        }
        JiraPage.prototype.init = function (options) {
            _.extend(this.handlers, options.handlers || {});
            _super.prototype.init.call(this, options);
        };
        JiraPage.prototype.finish = function () {
            Base.prototype.finish.apply(this, arguments);
        };
        JiraPage.prototype.onNavigateTo = function () {
            this.handlers.onDraw.call(this);
            return _super.prototype.onNavigateTo.call(this);
        };
        JiraPage.prototype.render = function () {
            return master_page_template.call(this, template.call(this, this.props.viewModel));
        };
        return JiraPage;
    }(BaseView));
    return JiraPage;
});
define("app/jira/templates/issues/jira_view_template", ["require", "exports", 'react', "app/jira/views/issues/issue_view"], function (require, exports, React, IssueView) {
    "use strict";
    var template = function () {
        return (React.createElement("table", {className: "table table-hover"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Priority"), React.createElement("th", null, React.createElement("div", null, "Key: Summary"), React.createElement("div", null, "Status")), React.createElement("th", null, "X"), React.createElement("th", null, "Updated"), React.createElement("th", null, "Assignee"))), React.createElement("tbody", {className: "issues-list"}, this.state.issues && this.state.issues.map(function (entity) { return React.createElement(IssueView, {viewModel: entity, key: entity.getId()}); }))));
    };
    return template;
});
