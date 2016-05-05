/// <reference path="../../../vendor.d.ts" />
/// <reference path="../base/base_view.ts" />

import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import FilterItemView = require('app/jira/views/filter_item_view');
import JiraViewModel = require('app/jira/view_models/jira_view_model');
import FilterEntryViewModel = require('app/jira/view_models/filter_entry_view_model');
import template = require('app/jira/templates/filter_view_template');
import React = require('react');
import ReactDOM = require('react-dom');

interface IFilterView extends React.Props<any> {
    viewModel: JiraViewModel
    statuses: () => FilterEntryViewModel[]
    bindings: {[key: string]: Function}
}

class FilterView extends BaseView<JiraViewModel, IFilterView> {

    constructor (opts: any) {
        super(opts);
    }
    
    setItems (items: FilterEntryViewModel[]) {
        this.setState({
            items: items
        });
    }
    filterStatuses () {
        return $('.filter-statuses', this.$el);
    }
    
    init (opts: any): void {
        this.$el = opts.el ? $(opts.el) : $('<div/>');
        super.init(opts);
        this.state = {
            items: this.props.statuses()
        };
    }
    
    componentWillReceiveProps (newProps: any) {
    }
    
    render () {
        return template.call(this);
    }
}
export = FilterView;