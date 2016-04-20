/// <reference path="../base/model_base.ts" />
import _ = require('underscore');
import $ = require('jquery');
import ModelBase = require('app/jira/base/model_base');

var fetchIssuesXhr: JQueryXHR = null,
    fetchEpicsXhr: JQueryXHR = null,
    fetchStatusesXhr: JQueryXHR = null,
    inst: JiraModel;
        
class JiraModel extends ModelBase {
    issues: any[] = []
    statuses: any[] = []
    epics: any[] = []
    currentFilter: any
    
    getIssues () {
        return this.issues;
    }
    setIssues (value: any[]) {
        this.issues = value;
        this.triggerProperyChanged('model.issues');
    }
    getStatuses (): any[] {
        return this.statuses;
    }
    setStatuses (value: any[]) {
        this.statuses = value;
        this.triggerProperyChanged('model.statuses');
    }
    getEpics (): any[] {
        return this.epics;
    }
    setEpics (value: any[]) {
        this.epics = value;
        this.triggerProperyChanged('model.epics');
    }
    init () {
        ModelBase.prototype.init.apply(this, arguments);
        this.currentFilter = {};
    }
    resetFilter (filter) {
        filter = filter || {};
        this.currentFilter = filter;
        this.triggerProperyChanged('model.filterReset');
        this.fetchIssues();
    }
    toggleFilter (key: string, value: string, enable: boolean) {
        var fval = this.currentFilter[key] || value,
            values = _.without(fval.split(','), value);
            
        if (enable) {
            values.push(value);
        }
        this.currentFilter[key] = values.join(',');
        this.fetchIssues();
    }
    fetchIssues () {
        fetchIssuesXhr && fetchIssuesXhr.abort();
        fetchIssuesXhr = $.ajax({
            url: '/home/issues',
            type: 'GET',
            data: this.currentFilter,
            success: (items, success, xhr) => {
                //console.log('Issues: ' + items.length);
                this.setIssues(items);
            }
        });
    }
    fetchStatuses () {
        fetchStatusesXhr && fetchStatusesXhr.abort();
        fetchStatusesXhr = $.ajax({
            url: '/home/statuses',
            type: 'GET',
            success: (items, success, xhr) => {
                //console.log('Statuses: ' + items.length);
                this.setStatuses(items);
            }
        });
    }
    fetchEpics () {
        fetchEpicsXhr && fetchEpicsXhr.abort();
        fetchEpicsXhr = $.ajax({
            url: '/home/epics',
            type: 'GET',
            success: (items, success, xhr) => {
                //console.log('Statuses: ' + items.length);
                this.setEpics(items);
            }
        });
    }
    static getCurrent () : JiraModel {
        if (inst) {
            return inst;
        }
        
        inst = new JiraModel({});
        
        return inst;
    }
}
export = JiraModel;