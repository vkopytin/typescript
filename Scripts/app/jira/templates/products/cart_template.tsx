import React = require('react');
import CartItemView = require('app/jira/views/products/cart_item_view');


var template = function () {
    return (
        <div className={"list-group"}>
            {this.state.cart && <CartItemView viewModel={this.state.cart} />}
        </div>
    );
}

export = template;