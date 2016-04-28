/// <reference path="../../../vendor.d.ts" />
/// <reference path="../base/base_view.ts" />
/// <reference path="../base/base_view_model.ts" />
/// <reference path="../view_models/filter_entry_view_model.ts" />
import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import BaseViewModel = require('app/jira/base/base_view_model');
import template = require('hgn!app/jira/templates/filter_item_template');
import FilterEntryViewModel = require('app/jira/view_models/filter_entry_view_model');
import FilterItemTemplate = require('app/jira/templates/filter_item_template');
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
    }
    
    init (opts: any) {
        this.$el = opts.el || $('<span />');
        super.init(opts);
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
    
    finish () {
    }
    
    onChangeSelected (): void {
        this.setState(this.props.viewModel.toJSON());
    }
    
    toggleSelected (): void {
        var cmd = this.props.viewModel.getCommand('SelectCommand');
        cmd.execute();
    }
    
    render () {
        if (this.props.viewModel.isFinish) {
            return <div/>;
        }
        
        return <span className="highlight"><button
         type="button"
         className={"btn btn-sm btn-" + (this.state.selected ? 'primary' : 'default') + " status-name"}
         onClick={() => this.toggleSelected()}
         title={this.state.description}
         style={{margin: '4px 6px'}}>
            {this.state.name}
        </button></span>;
    }
}
export = FilterItemView;