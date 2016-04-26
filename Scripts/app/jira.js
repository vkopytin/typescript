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
            this.$el.toggleClass('highlight', true);
            this.$el.attr('data-type', this.__name);
        };
        BaseView.prototype.finish = function () {
            this.$el.off();
            this.$el.remove();
            delete this.$el;
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
                    var command = _this.viewModel.getCommand(value);
                    command.execute();
                });
            }, this);
        };
        BaseView.prototype.appendTo = function (el) {
            $(el).append(this.$el);
            return this;
        };
        BaseView.prototype.onNavigateTo = function () {
            this.viewModel && this.viewModel.navigateTo();
        };
        BaseView.prototype.onNavigateFrom = function () {
            this.viewModel && this.viewModel.navigateFrom();
        };
        BaseView.prototype.draw = function () {
            return this;
        };
        return BaseView;
    }(React.Component));
    return BaseView;
});
/// <reference path="base/base_view.ts" />
/// <reference path="base/base_view_model.ts" />
define("app/jira/utils", ["require", "exports", 'underscore', 'jquery'], function (require, exports, _, $) {
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
            return new Type(options);
        }
        function loadViews(jsml, view) {
            var queue = null;
            _.each(jsml, function (item, propName) {
                var res = $.Deferred(), typeName = item[0], options = item[1], subViews = item[2];
                require([typeName], function (SubView) {
                    var inst = Create(SubView, _.extend({}, options, {
                        el: $(options.el, view.$el)
                    }));
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
define("app/jira/navigation", ["require", "exports", 'jquery', 'underscore', "app/jira/base/base"], function (require, exports, $, _, Base) {
    "use strict";
    var components = {
        'jira-report': ['app/jira/pages/jira_page', 'app/jira/view_models/jira_view_model'],
        'deploy-email': ['app/jira/pages/email_page', 'app/jira/view_models/email_view_model']
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
                    _this.view = new View({
                        el: $(document.body),
                        viewModel: new ViewModel()
                    });
                    _this.view.draw();
                    _.defer(_.bind(_this.view.onNavigateTo, _this.view), 0);
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
        };
        PageViewModel.prototype.getCommand = function (name) {
            switch (name) {
                case 'DeployEmailNavigateCommand':
                    return this.DeployEmailNavigateCommand;
                case 'JiraReportNavigateCommand':
                    return this.JiraReportNavigateCommand;
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
define("app/jira/pages/email_page", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", "app/jira/base/base", 'app/jira/utils', 'hgn!app/jira/templates/page_template'], function (require, exports, _, $, BaseView, Base, Utils, template) {
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
        EmailPage.prototype.commands = function () {
            return {
                'click.command .jira-deploy-email': 'DeployEmailNavigateCommand',
                'click.command .jira-jira-report': 'JiraReportNavigateCommand'
            };
        };
        EmailPage.prototype.init = function (options) {
            this.$el = options.el || $(document.body);
            _.extend(this.handlers, options.handlers || {});
            _super.prototype.init.call(this, options);
        };
        EmailPage.prototype.finish = function () {
            this.$el.off();
            this.$el.empty();
            delete this.$el;
            Base.prototype.finish.apply(this, arguments);
        };
        EmailPage.prototype.draw = function () {
            var data = {}, html = template(data);
            this.$el.html(html);
            Utils.loadViews({
                emailView: ['app/jira/views/email_view', {
                        el: '#page-wrapper',
                        viewModel: this.viewModel
                    }]
            }, this);
            this.handlers.onDraw.call(this);
            return this;
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
        JiraViewModel.prototype.getFilterItems = function () {
            return this.filterItems;
        };
        JiraViewModel.prototype.setStatuses = function (value) {
            var filterItems = this.filterItems;
            _.defer(function () {
                _.each(filterItems, function (viewModel) {
                    viewModel.finish();
                });
            }, 0);
            this.filterItems = value;
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
            var filterItems = _.reduce(this.filterItems, function (res, item) {
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
            this.filterItems = _.map(filters, function (item) {
                return new FilterEntryViewModel(item);
            });
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
define("app/jira/pages/jira_page", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", "app/jira/base/base", 'app/jira/utils', 'hgn!app/jira/templates/page_template'], function (require, exports, _, $, BaseView, Base, Utils, template) {
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
        JiraPage.prototype.commands = function () {
            return {
                'click.command .jira-deploy-email': 'DeployEmailNavigateCommand',
                'click.command .jira-jira-report': 'JiraReportNavigateCommand'
            };
        };
        JiraPage.prototype.init = function (options) {
            this.$el = options.el || $(document.body);
            _.extend(this.handlers, options.handlers || {});
            _super.prototype.init.call(this, options);
        };
        JiraPage.prototype.finish = function () {
            this.$el.off();
            this.$el.empty();
            delete this.$el;
            Base.prototype.finish.apply(this, arguments);
        };
        JiraPage.prototype.draw = function () {
            var _this = this;
            var data = {}, html = template(data), res = $.Deferred();
            this.$el.html(html);
            Utils.loadViews({
                jiraView: ['app/jira/views/jira_view', {
                        el: '#page-wrapper',
                        viewModel: this.viewModel
                    }, {
                        filterView: ['app/jira/views/filter_view', {
                                el: '.filter-items-statuses',
                                viewModel: this.viewModel,
                                bindings: {
                                    'change:statuses': function (view, viewModel) {
                                        view.setItems(viewModel.getFilterItems());
                                    }
                                }
                            }],
                        panelView: ['app/jira/views/panel_view', {
                                el: '.epics-panel',
                                title: 'Filter by Epic',
                                viewModel: this.viewModel
                            }, {
                                epicsView: ['app/jira/views/epics_view', {
                                        el: '.filter-items-epics',
                                        viewModel: this.viewModel,
                                        bindings: {
                                            'change:epics': function (view, viewModel) {
                                                view.setItems(viewModel.getEpics());
                                            }
                                        }
                                    }]
                            }]
                    }]
            }, this).done(function () {
                _this.handlers.onDraw.call(_this);
                res.resolve(_this);
            });
            return res.promise();
        };
        return JiraPage;
    }(BaseView));
    return JiraPage;
});
define("app/jira/views/email_view", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", 'hgn!app/jira/templates/email_template', 'hgn!app/main/templates/deploy_email.email_template'], function (require, exports, _, $, BaseView, template, emailTemplate) {
    "use strict";
    var EmailView = (function (_super) {
        __extends(EmailView, _super);
        function EmailView() {
            _super.apply(this, arguments);
        }
        EmailView.prototype.init = function (opts) {
            this.$el = opts.el || $('<div/>');
            _super.prototype.init.call(this, opts);
            $(this.viewModel).on('change:issues', _.bind(this.draw, this));
        };
        EmailView.prototype.draw = function () {
            var data = {
                issues: _.map(this.viewModel.getIssues(), function (viewModel) { return viewModel.toJSON(); })
            }, html = template(data);
            this.$el.html(html);
            $('.auto-email', this.$el).html(emailTemplate({
                'email-to': 'qa@rebelmouse.com',
                subject: encodeURIComponent('Tomorrow deploy'),
                body: encodeURIComponent($('.email-contents', this.$el).text())
            }));
            return this;
        };
        return EmailView;
    }(BaseView));
    return EmailView;
});
define("app/jira/templates/filter_item_template", ["require", "exports", 'react'], function (require, exports, React) {
    "use strict";
    var FilterItemTemplate = (function (_super) {
        __extends(FilterItemTemplate, _super);
        function FilterItemTemplate() {
            _super.apply(this, arguments);
        }
        FilterItemTemplate.prototype.render = function () {
            return React.createElement("button", {type: "button", className: "btn btn-sm btn-" + (this.props.selected ? 'primary' : 'default') + " status-name", title: this.props.description, style: { margin: '4px 6px' }}, this.props.name);
        };
        return FilterItemTemplate;
    }(React.Component));
    return FilterItemTemplate;
});
define("app/jira/views/filter_item_view", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", 'hgn!app/jira/templates/filter_item_template', 'app/jira/templates/filter_item_template', 'react', 'react-dom'], function (require, exports, _, $, BaseView, template, FilterItemTemplate, React, ReactDOM) {
    "use strict";
    var FilterItemView = (function (_super) {
        __extends(FilterItemView, _super);
        function FilterItemView(opts) {
            _super.call(this, opts);
        }
        FilterItemView.prototype.button = function () {
            return $('button', this.$el);
        };
        FilterItemView.prototype.commands = function () {
            return {
                'click.command .status-name': 'SelectCommand'
            };
        };
        FilterItemView.prototype.init = function (opts) {
            this.$el = opts.el || $('<span />');
            _super.prototype.init.call(this, opts);
            $(this.viewModel).on('change:selected', _.bind(this.onChangeSelected, this));
        };
        FilterItemView.prototype.onChangeSelected = function () {
            var $el = this.button(), isSelected = !!this.viewModel.getSelected();
            $el.toggleClass('btn-primary', isSelected);
            $el.toggleClass('btn-default', !isSelected);
        };
        FilterItemView.prototype.draw = function () {
            var data = this.viewModel.toJSON(), html = template(data);
            var fit = new FilterItemTemplate(data);
            ReactDOM.render(fit.render(), this.$el.get(0));
            //this.$el.html(html);
            return this;
        };
        FilterItemView.prototype.render = function () {
            var data = this.props.viewModel.toJSON();
            return React.createElement("button", {type: "button", className: "btn btn-sm btn-" + (data.selected ? 'primary' : 'default') + " status-name", title: data.description, style: { margin: '4px 6px' }}, data.name);
        };
        return FilterItemView;
    }(BaseView));
    return FilterItemView;
});
/// <reference path="../../../vendor.d.ts" />
define("app/jira/views/epics_view", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", 'app/jira/views/filter_item_view'], function (require, exports, _, $, BaseView, FilterItemView) {
    "use strict";
    var EpicsView = (function (_super) {
        __extends(EpicsView, _super);
        function EpicsView() {
            _super.apply(this, arguments);
            this.views = [];
        }
        EpicsView.prototype.setItems = function (items) {
            var _this = this;
            this.views = [];
            _.each(items, function (item) {
                var view = new FilterItemView({
                    viewModel: item
                });
                _this.views.push(view);
            }, this);
            this.drawItems();
        };
        EpicsView.prototype.filterEpics = function () {
            return $('.filter-epics', this.$el);
        };
        EpicsView.prototype.init = function (opts) {
            this.$el = opts.el ? $(opts.el) : $('<div/>');
            _super.prototype.init.call(this, opts);
            this.views = [];
            this.setItems(this.viewModel.getEpics());
        };
        EpicsView.prototype.drawItem = function (itemView) {
            itemView.appendTo(this.filterEpics()).draw();
        };
        EpicsView.prototype.drawItems = function () {
            _.each(this.views, this.drawItem, this);
        };
        EpicsView.prototype.draw = function () {
            this.drawItems();
            return this;
        };
        return EpicsView;
    }(BaseView));
    return EpicsView;
});
define("app/jira/views/issue_view", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", 'hgn!app/jira/templates/jira_issue_item_template'], function (require, exports, _, $, BaseView, itemTemplate) {
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
        function IssueView() {
            _super.apply(this, arguments);
        }
        IssueView.prototype.init = function (opts) {
            this.$el = $('<tr/>');
            _super.prototype.init.call(this, opts);
        };
        IssueView.prototype.draw = function () {
            var data = this.viewModel.toJSON(), html = itemTemplate(_.extend(data, {
                updated: function () { return function () {
                    var date = new Date(data.fields.updated);
                    return printDate(date, 'YYYY-MM-DD hh:mm:ss');
                }; }
            }));
            this.$el.html(html);
            return this;
        };
        return IssueView;
    }(BaseView));
    return IssueView;
});
/// <reference path="../../../vendor.d.ts" />
/// <reference path="../base/base_view.ts" />
define("app/jira/views/filter_view", ["require", "exports", 'underscore', 'jquery', "app/jira/base/base_view", 'app/jira/views/filter_item_view', 'react', 'react-dom'], function (require, exports, _, $, BaseView, FilterItemView, React, ReactDOM) {
    "use strict";
    var FilterView = (function (_super) {
        __extends(FilterView, _super);
        function FilterView() {
            _super.apply(this, arguments);
            this.views = [];
        }
        FilterView.prototype.setItems = function (items) {
            var _this = this;
            this.views = [];
            _.each(items, function (item) {
                var view = React.createElement(FilterItemView, {viewModel: item});
                _this.views.push(view);
            }, this);
            this.drawItems();
        };
        FilterView.prototype.filterStatuses = function () {
            return $('.filter-statuses', this.$el);
        };
        FilterView.prototype.init = function (opts) {
            this.$el = opts.el ? $(opts.el) : $('<div/>');
            _super.prototype.init.call(this, opts);
            this.views = [];
            this.setItems(this.viewModel.getFilterItems());
        };
        FilterView.prototype.drawItem = function (itemView) {
            var el = $('<span />');
            el.appendTo(this.filterStatuses());
            ReactDOM.render(itemView, el.get(0));
        };
        FilterView.prototype.drawItems = function () {
            _.each(this.views, this.drawItem, this);
        };
        FilterView.prototype.draw = function () {
            this.drawItems();
            return this;
        };
        return FilterView;
    }(BaseView));
    return FilterView;
});
/// <reference path="../../../vendor.d.ts" />
/// <reference path="../base/base_view.ts" />
/// <reference path="../view_models/jira_view_model.ts" />
/// <reference path="../view_models/issue_entry_view_model.ts" />
/// <reference path="issue_view.ts" />
/// <reference path="epics_view.ts" />
define("app/jira/views/jira_view", ["require", "exports", 'jquery', 'underscore', "app/jira/base/base_view", "app/jira/views/issue_view", 'hgn!app/jira/templates/jira_template'], function (require, exports, $, _, BaseView, IssueView, template) {
    "use strict";
    var JiraView = (function (_super) {
        __extends(JiraView, _super);
        function JiraView() {
            _super.apply(this, arguments);
            this.views = [];
        }
        JiraView.prototype.commands = function () {
            return {
                'click.command .filter-reset': 'ResetFiltersCommand'
            };
        };
        JiraView.prototype.init = function (opts) {
            this.$el = opts.el ? $(opts.el) : $('<div/>');
            _super.prototype.init.call(this, opts);
            this.views = [];
            $(this.viewModel).on('change:issues', _.bind(this.drawItems, this));
        };
        JiraView.prototype.drawItem = function (viewModel) {
            var view = new IssueView({
                viewModel: viewModel
            }).appendTo($('.issues-list')).draw();
            this.views.push(view);
        };
        JiraView.prototype.drawItems = function () {
            var issues = this.viewModel.getIssues();
            this.views = [];
            _.each(issues, this.drawItem, this);
        };
        JiraView.prototype.draw = function () {
            var data = {
                domain: 'https://dev.local'
            }, html = template(data);
            this.$el.html(html);
            this.drawItems();
            return this;
        };
        return JiraView;
    }(BaseView));
    return JiraView;
});
/// <reference path="../base/base_view.ts" />
define("app/jira/views/panel_view", ["require", "exports", 'jquery', "app/jira/base/base_view", 'hgn!app/jira/templates/panel_template'], function (require, exports, $, BaseView, template) {
    "use strict";
    var PanelView = (function (_super) {
        __extends(PanelView, _super);
        function PanelView() {
            _super.apply(this, arguments);
        }
        PanelView.prototype.init = function (opts) {
            this.$el = opts.el ? $(opts.el) : $('<div />');
            _super.prototype.init.call(this, opts);
            this.opts = opts;
        };
        PanelView.prototype.draw = function () {
            var data = {
                title: this.opts.title
            }, html = template(data);
            this.$el.html(html);
            return this;
        };
        return PanelView;
    }(BaseView));
    return PanelView;
});
