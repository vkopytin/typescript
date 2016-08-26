import React = require('react');
import OrderItemView = require('app/jira/views/products/order_item_view');

var template = function () {
    return (
        <div className={"list-group"}>
               {this.state.orders && this.state.orders.map((entity: any) => 
                    <OrderItemView
                     viewModel={entity}
                     key={entity.getId()}
                     onSelect={() => this.runCommand('SelectCommand', entity.getId())}
                     />
               )}
        </div>
    );
}

export = template;