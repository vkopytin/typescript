/// <reference path="../base/base.ts" />
/// <reference path="../base/base_view.ts" />
/// <reference path="../utils.ts" />
/// <reference path="../view_models/jira_view_model.ts" />
import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import Base = require('app/jira/base/base');
import Utils = require('app/jira/utils');
import template = require('hgn!app/jira/templates/page_template');
import template2 = require('app/jira/templates/jira_page_template');
import JiraViewModel = require('app/jira/view_models/jira_view_model');
import React = require('react');
import ReactDOM = require('react-dom');

interface IJiraPage {
    
}

class JiraPage extends BaseView<JiraViewModel, IJiraPage> {

    commands (): { [key: string]: string } {
        return { 
            'click.command .jira-deploy-email': 'DeployEmailNavigateCommand',
            'click.command .jira-jira-report': 'JiraReportNavigateCommand'
        };
    }
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
        this.$el.off();
        this.$el.empty();
        delete this.$el;
        
        Base.prototype.finish.apply(this, arguments);
    }
    
    onNavigateTo (): any {
        this.handlers.onDraw.call(this);
        return super.onNavigateTo();
    }
    
    render () {        
        return template2.call(this, this.viewModel);
    }
    
    static initHTML ($el: any) {
        var data = {},
            html = template(data),
            res = $.Deferred();
            
        $el.html(html);
    }
    
    draw (): any {
        var data = {},
            html = template(data),
            res = $.Deferred();
            
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
                        'change:statuses': (view: any, viewModel: JiraViewModel) => {
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
                        el: '.filter-epics',
                        viewModel: this.viewModel,
                        bindings: {
                            'change:epics': (view: any, viewModel: JiraViewModel) => {
                                view.setItems(viewModel.getEpics());
                            }
                        }
                    }]
                }]
            }]
        }, this).done(() => {
            this.handlers.onDraw.call(this);
            res.resolve(this);
        });
        
        return res.promise();  
    }
}
export = JiraPage;