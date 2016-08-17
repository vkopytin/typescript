import React = require('react');
import ProductItemView = require('app/jira/views/products/product_item_view');

var template = function () {
    return (
        <div className={"table-responsive"}>
            <table className={"table table-striped table-bordered table-hover"}>
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>User</th>
                        <th>Product Description</th>
                    </tr>
                </thead>
                <tbody>
	        {this.state.products && this.state.products.map((entity: any) => <ProductItemView viewModel={entity} key={entity.getId()}/>)}
                </tbody>
            </table>
        </div>
    );
}

export = template;