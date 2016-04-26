/// <reference path="base/base_view.ts" />
/// <reference path="base/base_view_model.ts" />

import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import BaseViewModel = require('app/jira/base/base_view_model');

module utils {
    export function extend (protoProps: any, staticProps: any) {
        var parent = this;
        var child: any;

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call the parent's constructor.
        if (protoProps && _.has(protoProps, 'ctor')) {
            child = protoProps.ctor;
        } else {
            child = function() { return parent.apply(this, arguments); };
        }

        // Add static properties to the constructor function, if supplied.
        _.extend(child, parent, staticProps);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        var Surrogate: any = function () { this.constructor = child; };
        Surrogate.prototype = parent.prototype;
        child.prototype = new Surrogate();

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) _.extend(child.prototype, protoProps);

        // Set a convenience property in case the parent's prototype is needed
        // later.
        child.__super__ = parent.prototype;

        return child;
    }
    function Create<T>(Type: any, options: any): T {
        return new Type(options);
    }
    export function loadViews<T extends BaseViewModel, Y> (jsml: {[key: string]: any}, view: BaseView<T, Y>): JQueryPromise<{}> {
        var queue: JQueryPromise<{}> = null;
        _.each(jsml, function (item: any[], propName: string) {
            var res = $.Deferred(),
                typeName: string = item[0],
                options: any = item[1],
                subViews: {[key: string]: any} = item[2];
                
            require([typeName], (SubView: any) => {
                var inst = Create<BaseView<T, Y>>(SubView, _.extend({}, options, {
                    el: $(options.el, view.$el)
                }));
                
                view[propName] = inst;
                $.when(inst.draw(), utils.loadViews(subViews, inst)).done(() => {
                    res.resolve(inst);
                });
            });
            queue = $.when(queue, res.promise());
        });
       
       return queue;
    }
}

export = utils;