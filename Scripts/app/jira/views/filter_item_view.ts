/// <reference path="../../../vendor.d.ts" />
/// <reference path="../base/base_view.ts" />
/// <reference path="../base/base_view_model.ts" />
/// <reference path="../view_models/filter_entry_view_model.ts" />
import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import BaseViewModel = require('app/jira/base/base_view_model');
import FilterEntryViewModel = require('app/jira/view_models/filter_entry_view_model');
import FilterItemTemplate = require('app/jira/templates/filter_item_template');
import template = require('app/jira/templates/filter_item_view_template');
import React = require('react');
import ReactDOM = require('react-dom');

interface IFilterItemView<TViewModel extends IFilterEntryViewModel> extends React.Props<any> {
    viewModel: TViewModel;
}

interface IFilterEntryViewModel extends BaseViewModel {
	getSelected(): boolean;
}

class FilterItemView<TViewModel extends IFilterEntryViewModel> extends BaseView<TViewModel, IFilterItemView<TViewModel>> {

    constructor (opts: any) {
        super(opts);
        this.state = this.props.viewModel.toJSON();
    }
    
    componentWillMount () {
        $(this.props.viewModel).on('change:selected', _.bind(this.onChangeSelected, this));
    }
    
    componentWillUnmount () {
        $(this.props.viewModel).off('change:selected');
    }
    
    componentWillReceiveProps (props: any) {
        $(this.props.viewModel).off('change:selected');
        $(props.viewModel).on('change:selected', _.bind(this.onChangeSelected, this));
    }
    
    onChangeSelected (): void {
        this.setState(this.props.viewModel.toJSON());
    }
    
    toggleSelected (): void {
        var cmd = this.props.viewModel.getCommand('SelectCommand');
        cmd.execute();
    }
    
    render () {
        return template.call(this);
    }
}
export = FilterItemView;