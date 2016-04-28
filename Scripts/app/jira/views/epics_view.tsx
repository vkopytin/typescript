/// <reference path="../../../vendor.d.ts" />

/// <reference path="../base/base_view.ts" />

import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import FilterItemView = require('app/jira/views/filter_item_view');
import JiraViewModel = require('app/jira/view_models/jira_view_model');
import EpicsEntryViewModel = require('app/jira/view_models/filter_epic_view_model');
import React = require('react');
import ReactDOM = require('react-dom');

interface IEpicsView {
    
}

interface IFilterItemView<TViewModel extends EpicsEntryViewModel> {
    new(opts: any): FilterItemView<TViewModel>;
}

let EpicFilterItemView: IFilterItemView<EpicsEntryViewModel> = FilterItemView;

class EpicsView extends BaseView<JiraViewModel, IEpicsView> {

    constructor (opts: any) {
        super(opts);
    }
    
    setItems (items: EpicsEntryViewModel[]) {
        this.setState({
            items: items
        });
    }
    
    init (opts: any) {
        this.$el = opts.el ? $(opts.el) : $('<div/>');
        super.init(opts);
        this.state = {
            items: this.viewModel.getEpics()
        };
    }
    
    draw (): any {
        
        return this;
    }
    render () {
        if (this.isFinish) {
            return <div/>;
        }
        
        return <div>
        {this.state.items.map((entry: EpicsEntryViewModel) => 
            <EpicFilterItemView viewModel={entry} key={entry.getId()}/>
        )}
        </div>;
    }
}
export = EpicsView;