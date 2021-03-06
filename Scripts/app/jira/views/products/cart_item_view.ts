import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import CartEntryViewModel = require('app/jira/view_models/products/cart_entry_view_model');
import template = require('app/jira/templates/products/cart_item_template');
import React = require('react');
import ReactDOM = require('react-dom');


interface ICartViewItem {
    viewModel: CartEntryViewModel
    onSelect?: Function
}

class CartItemView extends BaseView<CartEntryViewModel, ICartViewItem> {
    setCartDelegate = () => this.setCart()
    
    setCart () {
        this.setState(_.extend(this.state, {
            cart: this.props.viewModel
        }));
    }

    constructor(opts: any) {
        super(opts);
        
        this.state = {
            cart: this.props.viewModel,
            isSelected: false
        };
    }
    
    attachEvents (viewModel: CartEntryViewModel): void {
        super.attachEvents(viewModel);
        _.each('change:CartDate change:CartDetail'.split(' '), (en) => {
            $(viewModel).on(en, this.setCartDelegate);
        });
    }
    
    detachEvents (viewModel: CartEntryViewModel): void {
        super.detachEvents(viewModel);
        _.each('change:CartDate change:CartDetail'.split(' '), (en) => {
            $(viewModel).off(en, this.setCartDelegate);
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
        
        return template.call(this, {
            cart: this.props.viewModel
        });
    }
    
    removeOneItem (evnt: any, productId: number): void {
        evnt.preventDefault();
        
        this.props.viewModel.removeFromCart(productId);
    }
}

export = CartItemView;