import _ = require('underscore');
import $ = require('jquery');
import ModelBase = require('app/jira/base/model_base');

var fetchIssuesXhr = null,
    fetchEpicsXhr = null,
    fetchStatusesXhr = null,
    inst;
        
class JiraModel extends ModelBase {
    issues: any
    statuses: any
    epics: any
    currentFilter: any
    
    getIssues () {
        return this.issues;
    }
    setIssues (value) {
        this.issues = value;
        this.triggerProperyChanged('model.issues');
    }
    getStatuses () {
        return this.statuses;
    }
    setStatuses (value) {
        this.statuses = value;
        this.triggerProperyChanged('model.statuses');
    }
    getEpics () {
        return this.epics;
    }
    setEpics (value) {
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
    toggleFilter (key, value, enable) {
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
            success: _.bind(function (items, success, xhr) {
                //console.log('Issues: ' + items.length);
                this.setIssues(items);
            }, this)
        });
    }
    fetchStatuses () {
        fetchStatusesXhr && fetchStatusesXhr.abort();
        fetchStatusesXhr = $.ajax({
            url: '/home/statuses',
            type: 'GET',
            success: _.bind(function (items, success, xhr) {
                //console.log('Statuses: ' + items.length);
                this.setStatuses(items);
            }, this)
        });
    }
    fetchEpics () {
        fetchEpicsXhr && fetchEpicsXhr.abort();
        fetchEpicsXhr = $.ajax({
            url: '/home/epics',
            type: 'GET',
            success: _.bind(function (items, success, xhr) {
                //console.log('Statuses: ' + items.length);
                this.setEpics(items);
            }, this)
        });
    }
    static getCurrent () {
        if (inst) {
            return inst;
        }
        
        inst = new JiraModel({});
        
        return inst;
    }
}
export = JiraModel;