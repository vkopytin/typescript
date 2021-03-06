/// <reference path="../../base/base_view.ts" />
/// <reference path="../../view_models/issues/issue_entry_view_model.ts" />
import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import IssueEntryViewModel = require('app/jira/view_models/issues/issue_entry_view_model');
import template = require('app/jira/templates/issues/jira_issue_item_template');
import React = require('react');
import ReactDOM = require('react-dom');

function toDate(ticks: number) : Date {
    
    //ticks are in nanotime; convert to microtime
    var ticksToMicrotime = ticks / 10000;
    
    //ticks are recorded from 1/1/1; get microtime difference from 1/1/1/ to 1/1/1970
    var epochMicrotimeDiff = 2208988800000;
    
    //new date is ticks, converted to microtime, minus difference from epoch microtime
    var tickDate = new Date(ticksToMicrotime - epochMicrotimeDiff);
    
    return tickDate;
}

function printDate(datetime: Date, format: string) : string {
    var format = format,
        dateStr = format.replace('YYYY', padStr(datetime.getFullYear()))
            .replace('YY', ('' + datetime.getFullYear()).substr(2))
            .replace('MM', padStr(1 + datetime.getMonth()))
            .replace('M', '' + (1 + datetime.getMonth()))
            .replace('DD', padStr(datetime.getDate()))
            .replace('hh', padStr(datetime.getHours()))
            .replace('mm', padStr(datetime.getMinutes()))
            .replace('ss', padStr(datetime.getSeconds()));
        
    return dateStr;
}

function padStr(i: number): string {
    return (i < 10) ? '0' + i : '' + i;
}

interface IIssueView {
    viewModel: IssueEntryViewModel
}

class IssueView extends BaseView<IssueEntryViewModel, IIssueView> {

    constructor(opts: any) {
        super(opts);
    }
    
    render () {
        var data = this.props.viewModel.toJSON();
        
        return template.call(this, _.extend(data, {
            updated: () => {
                var date = new Date(data.fields.updated);
                return printDate(date, 'YYYY-MM-DD hh:mm:ss');
            }
        }));
    }
}
export = IssueView;