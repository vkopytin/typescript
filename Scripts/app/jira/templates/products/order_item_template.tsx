import _ = require('underscore');
import React = require('react');


var template = function (data: any) {
	return (<a href={"#"} className={"list-group-item"} onClick={(e) => this.onClick(e)}>
		<i className={"fa fa-shopping-cart fa-fw"}></i>
		{data.order.getId()}
		<span className={"pull-right text-muted small"}>
			<em>
				{(new Date(data.order.getOrderDate())).toLocaleString()}
			</em>
		</span>
		{_.map([this.isSelected()], (isSelected) => {
                if (!isSelected) {
                        return null;
                }
        return <div className="table-responsive">
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Product Name</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                {_.map(data.order.getOrderDetail(), (detail: any) =>
                    <tr key={detail.Id}>
                        <td>{detail.Id}</td>
                        <td>{detail.Product.ProductName}</td>
                        <td>{detail.UnitPrice}</td>
                        <td>{detail.Quantity}</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>})[0]}
	</a>);
};

export = template;