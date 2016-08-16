/// <reference path="../base/base.ts" />
/// <reference path="../base/base_view.ts" />
/// <reference path="../utils.ts" />
/// <reference path="../view_models/jira_view_model.ts" />
import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import Base = require('app/jira/base/base');
import Utils = require('app/jira/utils');
import template = require('app/jira/templates/jira_page_template');
import master_page_template = require('app/jira/templates/master_page_template');
import JiraViewModel = require('app/jira/view_models/jira_view_model');
import React = require('react');
import ReactDOM = require('react-dom');

interface IJiraPage {
    
}

class JiraPage extends BaseView<JiraViewModel, IJiraPage> {

    handlers = {
        onDraw: function () {
            $('#main-menu').metisMenu();
        }
    }
    
    init (options: any): void {
        this.$el = options.el || $(document.body);
        _.extend(this.handlers, options.handlers || {});
        
        super.init(options);
    }
    finish (): void {
        Base.prototype.finish.apply(this, arguments);
    }
    
    onNavigateTo (): any {
        this.handlers.onDraw.call(this);
        return super.onNavigateTo();
    }
    
    render () {        
        return master_page_template.call(this,
                template.call(this, this.viewModel)
            );
    }
}
export = JiraPage;