/// <reference path="../../../../vendor.d.ts" />
/// <reference path="../../base/base_view.ts" />

import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import FilterItemView = require('app/jira/views/issues/filter_item_view');
import JiraViewModel = require('app/jira/view_models/issues/jira_view_model');
import EpicsEntryViewModel = require('app/jira/view_models/issues/filter_epic_view_model');
import template = require('app/jira/templates/issues/epics_view_template');
import React = require('react');
import ReactDOM = require('react-dom');

interface IEpicsView extends React.Props<any> {
    viewModel: JiraViewModel
    epics: (vm: JiraViewModel) => EpicsEntryViewModel[]
}

class EpicsView extends BaseView<JiraViewModel, IEpicsView> {

    constructor (opts: any) {
        super(opts);

        this.state = {
            items: this.props.epics(this.props.viewModel)
        };
    }
    
    setItems (items: EpicsEntryViewModel[]) {
        this.setState({
            items: items
        });
    }
    
    setEpics () {
        this.setState({
           items: this.props.epics(this.props.viewModel) 
        });
    }
    
    componentWillMount () {
        $(this.props.viewModel).on('change:epics', _.bind(this.setEpics, this));
    }
    
    componentWillUnmount () {
        $(this.props.viewModel).off('change:epics');
    }
    
    componentWillReceiveProps (props: IEpicsView) {
        $(this.props.viewModel).off('change:epics');
        $(props.viewModel).on('change:epics', _.bind(this.setEpics, this));
    }
    
    render () {
        return template.call(this);
    }
}
export = EpicsView;