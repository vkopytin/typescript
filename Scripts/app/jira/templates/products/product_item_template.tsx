import React = require('react');

var template = function (data: any) {
	return (
		<a href="#" className="list-group-item" onClick={(e) => this.onClick(e)}>
			<div>{data.getProductName()}</div>
			<span>
            	<span><i className="fa fa-shopping-cart fa-fw fa-3x" onClick={(e) => this.addToCart(e)}></i></span>
				<span>
					<div>{data.getSupplier() && data.getSupplier().CompanyName}</div>
					<div>{data.getUnitPrice()}&nbsp;/&nbsp;{data.getQuantityPerUnit()}</div>
				</span>
			</span>
            <div className="pull-right text-muted small">
				<div>{data.getCategory() && data.getCategory().CategoryName}</div>
				<div><em>{(new Date(data.getOrderDateTs())).toLocaleString()}</em></div>
            </div>
		</a>
	);
};

export = template;