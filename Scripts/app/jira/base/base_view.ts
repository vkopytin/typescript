/// <reference path="../../../vendor.d.ts" />
/// <reference path="base.ts" />
/// <reference path="base_view_model.ts" />
import $ = require('jquery');
import _ = require('underscore');
import Base = require('app/jira/base/base');

class BaseView extends Base {
    viewModel: any
    $el: any
    
    constructor (opts: any) {
        super();
        this.init(opts);
        //console.log('Created: ' + this.constructor.name)
    }
    commands () {
        // declare commands from the child view
        return {};
    }
    bindings () {
        // declare binding rules from the child view
    }
    
    init (opts) {
        super.init(opts);
        
        this.viewModel = opts.viewModel;
        var bindings = _.extend({},
            _.result(this, 'bindings'),
            _.result(opts, 'bindings') || {}
        );
        
        $(this.viewModel).on('viewModel.finish', _.bind(this.finish, this));
        
        this.initBindings(bindings);
        this.initCommands(_.result(this, 'commands'));
        this.$el.toggleClass('highlight', true);
        this.$el.attr('data-type', this.__name);
    }
    finish () {
        this.$el.off();
        this.$el.remove();
        delete this.$el;
        super.finish();
        //console.log('Removed: ' + this.constructor.name);
    }
    initBindings (bindings) {
        _.each(bindings, (value, key) => {
            var value = value, key = key;
            $(this.viewModel).on(key, _.bind(function () {
                value.call(this, this, this.viewModel);
            }, this));
        }, this);
    }
    initCommands (commands) {
        _.each(commands, (value, key) => {
            var pair = key.split(/\s+/);
            $(this.$el).on(pair[0], pair[1], _.bind(function (evnt) {
                var command = this.viewModel[value];
                
                command.execute();
            }, this));
        }, this);
    }
    appendTo (el) {
        $(el).append(this.$el);
        
        return this;
    }
    onNavigateTo () {
        this.viewModel && this.viewModel.navigateTo();
    }
    onNavigateFrom () {
        this.viewModel && this.viewModel.navigateFrom();
    }
    draw () {
        return this;
    }
}
export = BaseView;