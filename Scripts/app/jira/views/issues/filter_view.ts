/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../../base/base_view.ts" />

import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import FilterItemView = require('app/jira/views/issues/filter_item_view');
import JiraViewModel = require('app/jira/view_models/issues/jira_view_model');
import FilterEntryViewModel = require('app/jira/view_models/issues/filter_entry_view_model');
import template = require('app/jira/templates/issues/filter_view_template');
import React = require('react');
import ReactDOM = require('react-dom');

interface IFilterView extends React.Props<any> {
    viewModel: JiraViewModel
    statuses: (vm: JiraViewModel) => FilterEntryViewModel[]
}

class FilterView extends BaseView<JiraViewModel, IFilterView> {

    constructor (opts: any) {
        super(opts);

        this.state = {
            items: this.props.statuses(this.props.viewModel)
        };
    }
    
    setItems (items: FilterEntryViewModel[]) {
        this.setState({
            items: items
        });
    }
    
    setStatuses () {
        this.setState({
            items: this.props.statuses(this.props.viewModel)
        });
    }
    
    componentWillMount () {
        $(this.props.viewModel).on('change:statuses', _.bind(this.setStatuses, this));
    }
    
    componentWillUnmount () {
        $(this.props.viewModel).off('change:statuses');
    }
    
    componentWillReceiveProps (props: IFilterView) {
        $(this.props.viewModel).off('change:statuses');
        $(props.viewModel).on('change:statuses', _.bind(this.setStatuses, this));
    }
    
    render () {
        return template.call(this);
    }
}
export = FilterView;