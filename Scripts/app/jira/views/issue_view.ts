/// <reference path="../base/base_view.ts" />
/// <reference path="../view_models/issue_entry_view_model.ts" />
import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import IssueEntryViewModel = require('app/jira/view_models/issue_entry_view_model');
import itemTemplate = require('hgn!app/jira/templates/jira_issue_item_template');

function toDate(ticks: number) : Date {
    
    //ticks are in nanotime; convert to microtime
    var ticksToMicrotime = ticks / 10000;
    
    //ticks are recorded from 1/1/1; get microtime difference from 1/1/1/ to 1/1/1970
    var epochMicrotimeDiff = 2208988800000;
    
    //new date is ticks, converted to microtime, minus difference from epoch microtime
    var tickDate = new Date(ticksToMicrotime - epochMicrotimeDiff);
    
    return tickDate;
}

function printDate(datetime: Date, format) : string {
    var format = format,
        dateStr = format.replace('YYYY', padStr(datetime.getFullYear()))
            .replace('YY', ('' + datetime.getFullYear()).substr(2))
            .replace('MM', padStr(1 + datetime.getMonth()))
            .replace('M', 1 + datetime.getMonth())
            .replace('DD', padStr(datetime.getDate()))
            .replace('hh', padStr(datetime.getHours()))
            .replace('mm', padStr(datetime.getMinutes()))
            .replace('ss', padStr(datetime.getSeconds()));
        
    return dateStr;
}

function padStr(i: number): string {
    return (i < 10) ? '0' + i : '' + i;
}

class IssueView extends BaseView<IssueEntryViewModel> {
    fields: any = {}
    
    init (opts) {
        this.$el = $('<tr/>');
        super.init(opts);
    }
    
    draw () {
        var html = itemTemplate(_.extend(this.viewModel.toJSON(), {
                updated: () => function () {
                    var date = new Date(this.fields.updated);
                    return printDate(date, 'YYYY-MM-DD hh:mm:ss');
                }
            }));
        
        this.$el.html(html);
        
        return this;
    }
}
export = IssueView;