/// <reference path="../../../vendor.d.ts" />
/// <reference path="../base/base_view.ts" />

import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import FilterItemView = require('app/jira/views/filter_item_view');
import JiraViewModel = require('app/jira/view_models/jira_view_model');
import FilterEntryViewModel = require('app/jira/view_models/filter_entry_view_model');
import React = require('react');
import ReactDOM = require('react-dom');

interface IFilterView {
    
}

class FilterView extends BaseView<JiraViewModel, IFilterView> {
    views: any[] = []
    
    setItems (items: FilterEntryViewModel[]) {
        this.views = [];
        _.each(items, (item) => {
            var view = <FilterItemView viewModel = {item}/>;
            
            this.views.push(view);
        }, this);
        
        this.drawItems();
    }
    filterStatuses () {
        return $('.filter-statuses', this.$el);
    }
    
    init (opts: any): void {
        this.$el = opts.el ? $(opts.el) : $('<div/>');
        super.init(opts);
        this.views = [];
        this.setItems(this.viewModel.getFilterItems());
    }
    
    drawItem (itemView: any): void {
        var el = $('<span class="highlight" />');
        el.appendTo(this.filterStatuses());
        ReactDOM.render(itemView, el.get(0));
    }
    drawItems (): void {
        _.each(this.views, this.drawItem, this);
    }
    draw () {
        this.drawItems();
        
        return this;
    }
}
export = FilterView;