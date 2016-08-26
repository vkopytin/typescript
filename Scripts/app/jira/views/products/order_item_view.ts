import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import ProductEntryViewModel = require('app/jira/view_models/products/order_entry_view_model');
import template = require('app/jira/templates/products/order_item_template');
import React = require('react');
import ReactDOM = require('react-dom');

interface IOrderItemView {
    viewModel: ProductEntryViewModel
    onSelect?: Function
}

class OrderItemView extends BaseView<ProductEntryViewModel, IOrderItemView> {

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            order: this.props.viewModel,
            isSelected: false
        };
    }
    
    setOrder () {
        this.setState(_.extend(this.state, {
            order: this.props.viewModel
            }));
    }
    
    componentWillMount () {
        _.each('change:OrderDate change:OrderDetail'.split(' '), (en) => {
            $(this.props.viewModel).on(en, _.bind(this.setOrder, this));
        });
    }
    
    componentWillUnmount () {
        _.each('change:OrderDate change:OrderDetail'.split(' '), (en) => {
            $(this.props.viewModel).off(en);
        });
    }
    
    componentWillReceiveProps (props: IOrderItemView) {
        _.each('change:OrderDate change:OrderDetail'.split(' '), (en) => {
            $(this.props.viewModel).off(en);
            $(props.viewModel).on(en, _.bind(this.setOrder, this));
        });
    }
    
    isSelected (): any {
        return this.state.isSelected;
    }
    
    onClick (evnt: any): any {
        evnt.preventDefault();
        this.setState(_.extend(this.state, {
            isSelected: !this.state.isSelected
            }));
        this.props.onSelect && this.props.onSelect();
    }
    
    render () {
        
        return template.call(this, this.state);
    }
}

export = OrderItemView;