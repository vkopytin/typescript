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
    name: string;
    selected: boolean;
    description: string;
    viewModel: TViewModel;
} 

interface IFilterEntryViewModel extends BaseViewModel {
	getSelected(): boolean;
}

class FilterItemView<TViewModel extends IFilterEntryViewModel> extends BaseView<TViewModel, IFilterItemView<TViewModel>> {
    
    constructor (opts: any) {
        super(opts);
    }
    
    button () {
        return $('button', this.$el);
    }
    commands (): { [key: string]: string } {
        return {
            'click.command .status-name': 'SelectCommand'
        };
    }
    
    init (opts: any) {
        this.$el = opts.el || $('<span />');
        super.init(opts);
        
        $(this.viewModel).on('change:selected', _.bind(this.onChangeSelected, this));
    }
    
    onChangeSelected (): void {
        var $el = this.button(),
            isSelected = !!this.viewModel.getSelected();
        
        $el.toggleClass('btn-primary', isSelected);
        $el.toggleClass('btn-default', !isSelected);
    }
    draw (): any {
        var data = this.viewModel.toJSON(),
            html = template(data);
            
        var fit = new FilterItemTemplate(data);
        ReactDOM.render(fit.render(), this.$el.get(0));
        //this.$el.html(html);
        
        return this;
    }
    render () {
        var data = this.props.viewModel.toJSON();
        return <button type="button" className={"btn btn-sm btn-" + (data.selected ? 'primary' : 'default') + " status-name"} title={data.description} style={{margin: '4px 6px'}}>
            {data.name}
        </button>;
    }
}
export = FilterItemView;