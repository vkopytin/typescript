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
    setIssues (value: any[]): void {
        this.issues = value;
        this.triggerProperyChanged('model.issues');
    }
    getStatuses (): any[] {
        return this.statuses;
    }
    setStatuses (value: any[]): void {
        this.statuses = value;
        this.triggerProperyChanged('model.statuses');
    }
    getEpics (): any[] {
        return this.epics;
    }
    setEpics (value: any[]): void {
        this.epics = value;
        this.triggerProperyChanged('model.epics');
    }
    init (): void {
        ModelBase.prototype.init.apply(this, arguments);
        this.currentFilter = {};
    }
    resetFilter (filter: any): void {
        filter = filter || {};
        this.currentFilter = filter;
        this.triggerProperyChanged('model.filterReset');
        this.fetchIssues();
    }
    toggleFilter (key: string, value: string, enable: boolean): void {
        var fval = this.currentFilter[key] || value,
            values = _.without(fval.split(','), value);
            
        if (enable) {
            values.push(value);
        }
        this.currentFilter[key] = values.join(',');
        this.fetchIssues();
    }
    fetchIssues (): void {
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
    fetchStatuses (): void {
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
    fetchEpics (): void {
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
    static getCurrent (): JiraModel {
        if (inst) {
            return inst;
        }
        
        inst = new JiraModel({});
        
        return inst;
    }
}

export = JiraModel;