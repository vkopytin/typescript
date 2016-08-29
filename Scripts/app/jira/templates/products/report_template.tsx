import _ = require('underscore');
import React = require('react');
import OrderItemView = require('app/jira/views/products/order_item_view');

var template = function () {
    return (
        <div className={"table-responsive"}>
            <table className={"table table-striped table-bordered table-hover"}>
                <thead>
                    <tr>
                        <th>Month</th>
                        <th>Total</th>
                        <th>Quantity</th>
                        <th>Product/Supplier</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
	               {this.state.report && _.map(this.state.report, (entity: any) => 
                    <tr>
                		<td>{entity.Month}</td>
                		<td>{entity.Total}</td>
                		<td>{entity.Quantity}</td>
                		<td>{entity.ProductName}</td>
                		<td></td>
                	</tr>
                   )}
                </tbody>
            </table>
        </div>
    );
}

export = template;