import React = require('react');
import OrderItemView = require('app/jira/views/products/order_item_view');

var template = function () {
    return (
        <div className={"table-responsive"}>
            <table className={"table table-striped table-bordered table-hover"}>
                <thead>
                    <tr>
                        <th>Order Id</th>
                        <th>Order Date</th>
                    </tr>
                </thead>
                <tbody>
	               {this.state.orders && this.state.orders.map((entity: any) => 
                        <OrderItemView
                         viewModel={entity}
                         key={entity.getId()}
                         onSelect={() => this.runCommand('SelectCommand', entity.getId())}
                         />
                   )}
                </tbody>
            </table>
        </div>
    );
}

export = template;