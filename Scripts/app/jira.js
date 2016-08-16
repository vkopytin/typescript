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
        BaseView.prototype.commands = function () {
            // declare commands from the child view
            return {};
        };
        BaseView.prototype.bindings = function () {
            // declare binding rules from the child view
            return {};
        };
        BaseView.prototype.init = function (opts) {
            this.viewModel = opts.viewModel;
            var bindings = _.extend({}, _.result(this, 'bindings'), _.result(opts, 'bindings') || {});
            $(this.viewModel).on('viewModel.finish', _.bind(this.finish, this));
            this.initBindings(bindings);
            this.initCommands(_.result(this, 'commands'));
        };
        BaseView.prototype.finish = function () {
            window.report[this.__name] = --window.report[this.__name];
            if (this.isFinish) {
                throw ('Warinig: Object is removed two times.');
            }
            this.isFinish = true;
            //console.log('Removed: ' + this.constructor.name);
        };
        BaseView.prototype.initBindings = function (bindings) {
            var _this = this;
            _.each(bindings, function (value, key) {
                var value = value, key = key;
                $(_this.viewModel).on(key, function () {
                    value.call(_this, _this, _this.viewModel);
                });
            }, this);
        };
        BaseView.prototype.initCommands = function (commands) {
            var _this = this;
            _.each(commands, function (value, key) {
                var pair = key.split(/\s+/);
                $(_this.$el).on(pair[0], pair[1], function (evnt) {
                    _this.runCommand(value, {});
                });
            }, this);
        };
        BaseView.prototype.runCommand = function (name, options) {
            var command = this.viewModel.getCommand(name);
            if (command) {
                command.execute.apply(command, arguments);
            }
        };
        BaseView.prototype.onNavigateTo = function () {
            this.viewModel && this.viewModel.navigateTo();
        };
        BaseView.prototype.onNavigateFrom = function () {
            this.viewModel && this.viewModel.navigateFrom();
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
define("app/jira/base/base_view_model", ["require", "exports", 'jquery', "app/jira/base/base"], function (require, exports, $, Base) {
    "use strict";
    var ViewModelBase = (function (_super) {
        __extends(ViewModelBase, _super);
        function ViewModelBase(opts) {
            _super.call(this);
            this.init(opts);
            //console.log('Created: ' + this.constructor.name)
        }
        ViewModelBase.prototype.init = function (opts) {
            this.opts = opts;
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
        ViewModelBase.prototype.triggerProperyChanged = function (propertyName) {
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
        'jira-report': ['app/jira/pages/jira_page', 'app/jira/view_models/jira_view_model'],
        'deploy-email': ['app/jira/pages/email_page', 'app/jira/view_models/email_view_model'],
        'feeding': ['app/jira/pages/feeding_page', 'app/jira/view_models/feeding_view_model']
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
            this.view && _.defer(_.bind(this.view.onNavigateFrom, this.view), 0);
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
                        _.defer(_.bind(this.onNavigateTo, this), 0);
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
            navigation.navigateTo('jira-report');
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
    var fetchProductsXhr = null, inst;
    var AccountingModel = (function (_super) {
        __extends(AccountingModel, _super);
        function AccountingModel() {
            _super.apply(this, arguments);
            this.products = [];
        }
        AccountingModel.prototype.getProducts = function () {
            return this.products;
        };
        AccountingModel.prototype.setProducts = function (value) {
            this.products = value;
            this.triggerProperyChanged('accounting_model.products');
        };
        AccountingModel.prototype.fetchProducts = function () {
            var _this = this;
            fetchProductsXhr = $.when(fetchProductsXhr).then(function () {
                return $.ajax({
                    url: '/jira/schedule',
                    type: 'GET',
                    data: {},
                    success: function (items, success, xhr) {
                        _this.setProducts(items);
                    }
                });
            });
        };
        AccountingModel.getCurrent = function () {
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
define("app/jira/view_models/issue_entry_view_model", ["require", "exports", "app/jira/base/base_view_model"], function (require, exports, BaseViewModel) {
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
define("app/jira/view_models/email_view_model", ["require", "exports", 'jquery', 'underscore', "app/jira/view_models/page_view_model", "app/jira/view_models/issue_entry_view_model", "app/jira/models/model"], function (require, exports, $, _, BaseViewModel, IssueEntryViewModel, Model) {
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
define("app/jira/templates/email_template", ["require", "exports", 'react'], function (require, exports, React) {
    "use strict";
    var template = function () {
        return (React.createElement("div", {id: "page-inner"}, React.createElement("div", {className: "row pad-top-botm "}, React.createElement("div", {className: "col-lg-12 col-md-12 col-sm-12"}, React.createElement("h1", {className: "page-head-line"}, "Tomorrow Deploy"), React.createElement("h1", {className: "page-subhead-line"}, "Tomorrow deploy"))), React.createElement("div", {className: "row"}, React.createElement("div", {style: { fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }, className: "email-contents col-lg-12 col-md-12 col-sm-12", dangerouslySetInnerHTML: this.getEmailHTML()})), React.createElement("div", {className: "row pad-top-botm"}, React.createElement("div", {className: "auto-email col-lg-12 col-md-12 col-sm-12"}, React.createElement("hr", null), React.createElement("a", {className: "btn btn-primary btn-lg", href: "mailto:qa@rebelmouse.com?subject=" + this.state.subject + "&body=" + this.getEmailText()}, "Create mail")))));
    };
    return template;
});
define("app/jira/views/email_view", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", "app/jira/templates/email_template", 'hgn!app/jira/templates/email_template'], function (require, exports, _, $, BaseView, template, emailTemplate) {
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
        EmailView.prototype.init = function (opts) {
            _super.prototype.init.call(this, opts);
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
                    return _.map(_this.viewModel.getIssues(), function (issue) { return issue.toJSON(); });
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
define("app/jira/templates/email_page_template", ["require", "exports", 'react', "app/jira/views/email_view"], function (require, exports, React, EmailView) {
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
define("app/jira/pages/email_page", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", "app/jira/base/base", "app/jira/templates/email_page_template", "app/jira/templates/master_page_template"], function (require, exports, _, $, BaseView, Base, template, master_page_template) {
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
            this.$el = options.el || $(document.body);
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
            return master_page_template.call(this, template.call(this, this.viewModel));
        };
        return EmailPage;
    }(BaseView));
    return EmailPage;
});
define("app/jira/view_models/filter_entry_view_model", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view_model", "app/jira/command", "app/jira/models/model"], function (require, exports, _, $, BaseViewModel, Command, Model) {
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
define("app/jira/view_models/filter_epic_view_model", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view_model", "app/jira/command", "app/jira/models/model"], function (require, exports, _, $, BaseViewModel, Command, Model) {
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
define("app/jira/view_models/jira_view_model", ["require", "exports", 'underscore', 'jquery', "app/jira/view_models/page_view_model", "app/jira/view_models/filter_entry_view_model", "app/jira/view_models/filter_epic_view_model", "app/jira/view_models/issue_entry_view_model", "app/jira/command", "app/jira/models/model"], function (require, exports, _, $, BaseViewModel, FilterEntryViewModel, FilterEpicViewModel, IssueEntryViewModel, Command, Model) {
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
                _this.fetchIssues();
                _this.fetchEpics();
            }, this), 0);
        };
        JiraViewModel.prototype.finish = function () {
            var model = Model.getCurrent();
            _.each({
                'model.issues': this.changeIssuesDelegate,
                'model.statuses': this.changeStatusesDelegate,
                'model.epics': this.changeEpicsDelegate
            }, function (h, e) { $(model).off(e, h); });
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
define("app/jira/templates/jira_issue_item_template", ["require", "exports", 'react'], function (require, exports, React) {
    "use strict";
    var template = function (data) {
        return (React.createElement("tr", null, React.createElement("td", {style: { width: "140px" }}, React.createElement("img", {src: data.fields.priority.iconUrl, title: data.fields.priority.name, style: { width: "16px", height: "16px" }}), data.fields.priority.name), React.createElement("td", null, React.createElement("div", null, data.Key, ": ", data.fields.summary), React.createElement("div", null, data.fields.status.name)), React.createElement("td", null), React.createElement("td", {style: { width: "140px", textAlign: "center" }}, data.updated()), React.createElement("td", {style: { minWidth: "140px" }}, data.fields.assignee && data.fields.assignee.displayName)));
    };
    return template;
});
define("app/jira/views/issue_view", ["require", "exports", 'underscore', "app/jira/base/base_view", "app/jira/templates/jira_issue_item_template"], function (require, exports, _, BaseView, template) {
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
        IssueView.prototype.init = function (opts) {
            _super.prototype.init.call(this, opts);
        };
        IssueView.prototype.render = function () {
            var data = this.viewModel.toJSON();
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
define("app/jira/view_models/product_entry_view_model", ["require", "exports", "app/jira/base/base_view_model"], function (require, exports, BaseViewModel) {
    "use strict";
    var ProductEntryViewModel = (function (_super) {
        __extends(ProductEntryViewModel, _super);
        function ProductEntryViewModel() {
            _super.apply(this, arguments);
        }
        ProductEntryViewModel.prototype.getId = function () {
            return this.opts.id;
        };
        return ProductEntryViewModel;
    }(BaseViewModel));
    return ProductEntryViewModel;
});
define("app/jira/view_models/feeding_view_model", ["require", "exports", 'underscore', 'jquery', "app/jira/view_models/page_view_model", "app/jira/view_models/product_entry_view_model", "app/jira/models/accounting_model"], function (require, exports, _, $, PageViewModel, ProductEntryViewModel, Model) {
    "use strict";
    var FeedingViewModel = (function (_super) {
        __extends(FeedingViewModel, _super);
        function FeedingViewModel() {
            _super.apply(this, arguments);
            this.products = [];
        }
        FeedingViewModel.prototype.getProducts = function () {
            return this.products;
        };
        FeedingViewModel.prototype.setProducts = function (value) {
            var products = this.products;
            _.defer(function () {
                _.each(products, function (viewModel) {
                    viewModel.finish();
                });
            }, 0);
            this.products = value;
            this.triggerProperyChanged('change:products');
        };
        FeedingViewModel.prototype.init = function (opts) {
            var _this = this;
            var model = Model.getCurrent();
            _super.prototype.init.call(this, opts);
            _.each({
                'accounting_model.products': this.changeProductsDelegate = _.bind(this.changeProducts, this)
            }, function (h, e) { $(model).on(e, h); });
            _.defer(_.bind(function () {
                _this.fetchProducts();
            }, this), 0);
        };
        FeedingViewModel.prototype.finish = function () {
            var model = Model.getCurrent();
            _.each({}, function (h, e) { $(model).off(e, h); });
            this.setProducts([]);
            _super.prototype.finish.call(this);
        };
        FeedingViewModel.prototype.changeProducts = function () {
            var model = Model.getCurrent(), issues = model.getProducts();
            this.setProducts(_.map(issues, function (item) {
                return new ProductEntryViewModel(item);
            }, this));
        };
        FeedingViewModel.prototype.fetchProducts = function () {
            var model = Model.getCurrent();
            model.fetchProducts();
        };
        return FeedingViewModel;
    }(PageViewModel));
    return FeedingViewModel;
});
define("app/jira/templates/product_item_template", ["require", "exports", 'react'], function (require, exports, React) {
    "use strict";
    var template = function (data) {
        return (React.createElement("tr", null, React.createElement("td", {style: { width: "140px" }}, data.id), React.createElement("td", null, data.user), React.createElement("td", null, data.Description)));
    };
    return template;
});
define("app/jira/views/product_item_view", ["require", "exports", "app/jira/base/base_view", "app/jira/templates/product_item_template"], function (require, exports, BaseView, template) {
    "use strict";
    var ProductItemView = (function (_super) {
        __extends(ProductItemView, _super);
        function ProductItemView(opts) {
            _super.call(this, opts);
        }
        ProductItemView.prototype.init = function (opts) {
            _super.prototype.init.call(this, opts);
        };
        ProductItemView.prototype.render = function () {
            var data = this.viewModel.toJSON();
            return template.call(this, data);
        };
        return ProductItemView;
    }(BaseView));
    return ProductItemView;
});
define("app/jira/templates/products_template", ["require", "exports", 'react', "app/jira/views/product_item_view"], function (require, exports, React, ProductItemView) {
    "use strict";
    var template = function () {
        return (React.createElement("div", {className: "table-responsive"}, React.createElement("table", {className: "table table-striped table-bordered table-hover"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Code"), React.createElement("th", null, "User"), React.createElement("th", null, "Product Description"))), React.createElement("tbody", null, this.state.products && this.state.products.map(function (entity) { return React.createElement(ProductItemView, {viewModel: entity, key: entity.getId()}); })))));
    };
    return template;
});
/// <reference path="../../../vendor.d.ts" />
/// <reference path="../base/base_view.ts" />
/// <reference path="../view_models/jira_view_model.ts" />
/// <reference path="../view_models/issue_entry_view_model.ts" />
/// <reference path="issue_view.ts" />
define("app/jira/views/products_view", ["require", "exports", 'jquery', 'underscore', "app/jira/base/base_view", "app/jira/templates/products_template"], function (require, exports, $, _, BaseView, template) {
    "use strict";
    var ProductsView = (function (_super) {
        __extends(ProductsView, _super);
        function ProductsView(opts) {
            _super.call(this, opts);
            this.state = {
                products: this.props.products(this.props.viewModel)
            };
        }
        ProductsView.prototype.setProducts = function () {
            this.setState({
                products: this.props.products(this.props.viewModel)
            });
        };
        ProductsView.prototype.init = function (opts) {
            _super.prototype.init.call(this, opts);
        };
        ProductsView.prototype.componentWillMount = function () {
            $(this.props.viewModel).on('change:products', _.bind(this.setProducts, this));
        };
        ProductsView.prototype.componentWillUnmount = function () {
            $(this.props.viewModel).off('change:products');
        };
        ProductsView.prototype.componentWillReceiveProps = function (props) {
            $(this.props.viewModel).off('change:products');
            $(props.viewModel).on('change:products', _.bind(this.setProducts, this));
        };
        ProductsView.prototype.render = function () {
            return template.call(this);
        };
        return ProductsView;
    }(BaseView));
    return ProductsView;
});
define("app/jira/templates/panel_template", ["require", "exports", 'react'], function (require, exports, React) {
    "use strict";
    var template = function () {
        return (React.createElement("div", {className: "epics-panel panel panel-default highlight"}, React.createElement("div", {className: "panel-heading"}, React.createElement("label", null, this.props.title)), React.createElement("div", {className: "panel-body"}, React.createElement("div", {className: "filter-items-epics"}, React.createElement("div", {className: "form-group"}, React.createElement("div", {className: "filter-epics"}), this.props.children)))));
    };
    return template;
});
/// <reference path="../base/base_view.ts" />
define("app/jira/views/panel_view", ["require", "exports", "app/jira/base/base_view", "app/jira/templates/panel_template"], function (require, exports, BaseView, template) {
    "use strict";
    var PanelView = (function (_super) {
        __extends(PanelView, _super);
        function PanelView(opts) {
            _super.call(this, opts);
            this.opts = opts;
        }
        PanelView.prototype.init = function (opts) {
            _super.prototype.init.call(this, opts);
        };
        PanelView.prototype.render = function () {
            return template.call(this);
        };
        return PanelView;
    }(BaseView));
    return PanelView;
});
define("app/jira/templates/feeding_page_template", ["require", "exports", 'react', "app/jira/views/products_view", "app/jira/views/panel_view"], function (require, exports, React, ProductsView, PanelView) {
    "use strict";
    var template = function (viewModel) {
        return (React.createElement("div", {id: "page-inner"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-md-12"}, React.createElement(PanelView, {ref: "productsPanel", viewModel: viewModel, title: "Products"}, React.createElement(ProductsView, {viewModel: viewModel, products: function (vm) { return vm.getProducts(); }}))))));
    };
    return template;
});
define("app/jira/pages/feeding_page", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", "app/jira/base/base", "app/jira/templates/feeding_page_template", "app/jira/templates/master_page_template"], function (require, exports, _, $, BaseView, Base, template, master_page_template) {
    "use strict";
    var FeedingPage = (function (_super) {
        __extends(FeedingPage, _super);
        function FeedingPage() {
            _super.apply(this, arguments);
            this.handlers = {
                onDraw: function () {
                    $('#main-menu').metisMenu();
                }
            };
        }
        FeedingPage.prototype.commands = function () {
            return {
                'click.command .jira-deploy-email': 'DeployEmailNavigateCommand',
                'click.command .jira-jira-report': 'JiraReportNavigateCommand'
            };
        };
        FeedingPage.prototype.init = function (options) {
            this.$el = options.el || $(document.body);
            _.extend(this.handlers, options.handlers || {});
            _super.prototype.init.call(this, options);
        };
        FeedingPage.prototype.finish = function () {
            Base.prototype.finish.apply(this, arguments);
        };
        FeedingPage.prototype.onNavigateTo = function () {
            this.handlers.onDraw.call(this);
            return _super.prototype.onNavigateTo.call(this);
        };
        FeedingPage.prototype.render = function () {
            return master_page_template.call(this, template.call(this, this.viewModel));
        };
        return FeedingPage;
    }(BaseView));
    return FeedingPage;
});
define("app/jira/templates/filter_item_view_template", ["require", "exports", 'react'], function (require, exports, React) {
    "use strict";
    var template = function () {
        var _this = this;
        return (React.createElement("span", {className: "highlight"}, React.createElement("button", {type: "button", className: "btn btn-sm btn-" + (this.state.selected ? 'primary' : 'default') + " status-name", onClick: function () { return _this.runCommand('SelectCommand'); }, title: this.state.description, style: { margin: '4px 6px' }}, this.state.name)));
    };
    return template;
});
define("app/jira/views/filter_item_view", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", "app/jira/templates/filter_item_view_template"], function (require, exports, _, $, BaseView, template) {
    "use strict";
    var FilterItemView = (function (_super) {
        __extends(FilterItemView, _super);
        function FilterItemView(opts) {
            _super.call(this, opts);
            this.state = this.props.viewModel.toJSON();
        }
        FilterItemView.prototype.init = function (opts) {
            _super.prototype.init.call(this, opts);
        };
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
define("app/jira/templates/filter_view_template", ["require", "exports", 'react', "app/jira/views/filter_item_view"], function (require, exports, React, FilterItemView) {
    "use strict";
    var StatusFilterItemView = FilterItemView;
    var template = function () {
        return (React.createElement("div", {className: "filter-statuses highlight"}, this.state.items.map(function (entry) {
            return React.createElement(StatusFilterItemView, {viewModel: entry, key: entry.getId()});
        })));
    };
    return template;
});
/// <reference path="../../../vendor.d.ts" />
/// <reference path="../base/base_view.ts" />
define("app/jira/views/filter_view", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", "app/jira/templates/filter_view_template"], function (require, exports, _, $, BaseView, template) {
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
        FilterView.prototype.init = function (opts) {
            _super.prototype.init.call(this, opts);
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
define("app/jira/templates/epics_view_template", ["require", "exports", 'react', "app/jira/views/filter_item_view"], function (require, exports, React, FilterItemView) {
    "use strict";
    var EpicFilterItemView = FilterItemView;
    var template = function () {
        return (React.createElement("div", {className: "filter-epics highlight"}, this.state.items.map(function (entry) {
            return React.createElement(EpicFilterItemView, {viewModel: entry, key: entry.getId()});
        })));
    };
    return template;
});
/// <reference path="../../../vendor.d.ts" />
/// <reference path="../base/base_view.ts" />
define("app/jira/views/epics_view", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", "app/jira/templates/epics_view_template"], function (require, exports, _, $, BaseView, template) {
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
        EpicsView.prototype.init = function (opts) {
            _super.prototype.init.call(this, opts);
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
define("app/jira/templates/jira_template", ["require", "exports", 'react'], function (require, exports, React) {
    "use strict";
    var template = function (IssueView) {
        var _this = this;
        return (React.createElement("div", {id: "page-inner"}, React.createElement("div", {className: "row"}, React.createElement("div", {className: "col-md-12"}, React.createElement("h1", {className: "page-head-line"}, "JIRA Report"))), React.createElement("div", {className: "row"}, React.createElement("div", {className: "jira-issues-list col-md-12"}, "JIRA Issues", React.createElement("div", {className: "panel panel-default"}, React.createElement("div", {className: "panel-heading"}, React.createElement("a", {href: "javascript:(function(){HOST = '{{domain}}';var jsCode = document.createElement('script');jsCode.setAttribute('src', HOST + '/mvc/jira/bookmarklet?' + Math.random());jsCode.setAttribute('id','jira-worktool-bookmarklet');document.getElementsByTagName('head')[0].appendChild(jsCode);}());"}, React.createElement("button", {className: "btn btn-lg btn-info"}, "Jira bookmarklet")), React.createElement("button", {type: "button", className: "filter-reset btn btn-lg btn-primary", onClick: function () { return _this.runCommand('ResetFiltersCommand'); }}, "Reset"), React.createElement("label", null, "Filter By Status")), React.createElement("div", {className: "panel-body"}, React.createElement("div", {className: "filter-items-statuses"}, React.createElement("div", {className: "form-group"}, this.props.children.find(function (item) { return item.ref === "filterStatuses"; }))))), this.props.children.find(function (item) { return item.ref === "epicsPanel"; }))), React.createElement("div", {className: "row"}, React.createElement("div", {className: "table-responsive"}, React.createElement("table", {className: "table table-hover"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Priority"), React.createElement("th", null, React.createElement("div", null, "Key: Summary"), React.createElement("div", null, "Status")), React.createElement("th", null, "X"), React.createElement("th", null, "Updated"), React.createElement("th", null, "Assignee"))), React.createElement("tbody", {className: "issues-list"}, this.state.issues && this.state.issues.map(function (entity) { return React.createElement(IssueView, {viewModel: entity, key: entity.getId()}); })))))));
    };
    return template;
});
/// <reference path="../../../vendor.d.ts" />
/// <reference path="../base/base_view.ts" />
/// <reference path="../view_models/jira_view_model.ts" />
/// <reference path="../view_models/issue_entry_view_model.ts" />
/// <reference path="issue_view.ts" />
define("app/jira/views/jira_view", ["require", "exports", 'jquery', 'underscore', "app/jira/base/base_view", "app/jira/views/issue_view", "app/jira/templates/jira_template"], function (require, exports, $, _, BaseView, IssueView, template) {
    "use strict";
    var JiraView = (function (_super) {
        __extends(JiraView, _super);
        function JiraView(opts) {
            _super.call(this, opts);
            this.state = {
                issues: this.props.issues(this.props.viewModel)
            };
        }
        JiraView.prototype.setIssues = function () {
            this.setState({
                issues: this.props.issues(this.props.viewModel)
            });
        };
        JiraView.prototype.init = function (opts) {
            _super.prototype.init.call(this, opts);
        };
        JiraView.prototype.componentWillMount = function () {
            $(this.props.viewModel).on('change:issues', _.bind(this.setIssues, this));
        };
        JiraView.prototype.componentWillUnmount = function () {
            $(this.props.viewModel).off('change:issues');
        };
        JiraView.prototype.componentWillReceiveProps = function (props) {
            $(this.props.viewModel).off('change:issues');
            $(props.viewModel).on('change:issues', _.bind(this.setIssues, this));
        };
        JiraView.prototype.render = function () {
            return template.call(this, IssueView);
        };
        return JiraView;
    }(BaseView));
    return JiraView;
});
define("app/jira/templates/jira_page_template", ["require", "exports", 'react', "app/jira/views/jira_view", "app/jira/views/filter_view", "app/jira/views/panel_view", "app/jira/views/epics_view"], function (require, exports, React, JiraView, FilterView, PanelView, EpicsView) {
    "use strict";
    var template = function (viewModel) {
        return (React.createElement(JiraView, {viewModel: viewModel, issues: function (vm) { return vm.getIssues(); }}, React.createElement(FilterView, {ref: "filterStatuses", viewModel: viewModel, statuses: function (vm) { return vm.getStatuses(); }}), React.createElement(PanelView, {ref: "epicsPanel", viewModel: viewModel, title: "Filter by Epic"}, React.createElement(EpicsView, {ref: "filterEpics", viewModel: viewModel, epics: function (vm) { return vm.getEpics(); }}))));
    };
    return template;
});
define("app/jira/pages/jira_page", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", "app/jira/base/base", "app/jira/templates/jira_page_template", "app/jira/templates/master_page_template"], function (require, exports, _, $, BaseView, Base, template, master_page_template) {
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
            this.$el = options.el || $(document.body);
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
            return master_page_template.call(this, template.call(this, this.viewModel));
        };
        return JiraPage;
    }(BaseView));
    return JiraPage;
});
define("app/jira/templates/jira_view_template", ["require", "exports", 'react', "app/jira/views/issue_view"], function (require, exports, React, IssueView) {
    "use strict";
    var template = function () {
        return (React.createElement("table", {className: "table table-hover"}, React.createElement("thead", null, React.createElement("tr", null, React.createElement("th", null, "Priority"), React.createElement("th", null, React.createElement("div", null, "Key: Summary"), React.createElement("div", null, "Status")), React.createElement("th", null, "X"), React.createElement("th", null, "Updated"), React.createElement("th", null, "Assignee"))), React.createElement("tbody", {className: "issues-list"}, this.state.issues && this.state.issues.map(function (entity) { return React.createElement(IssueView, {viewModel: entity, key: entity.getId()}); }))));
    };
    return template;
});
