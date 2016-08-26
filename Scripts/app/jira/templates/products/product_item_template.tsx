import React = require('react');

var template = function (data: any) {
	return (<tr>
		<td>
			<button className="btn btn-sm btn-link"
			 onClick={(e) => this.addToCart(e)}
			 >
				<i className="glyphicon glyphicon-plus"></i>
				<span>to Cart</span>
			</button>
		</td>
		<td>
			<a href="#"
			  onClick={(e) => this.onClick(e)}
			  >
			  	<button className="btn btn-sm btn-link">{data.getProductName()}</button>
			</a>
		</td>
		<td style={{width: "140px"}}>
			{data.getUnitPrice()}
		</td>
		<td style={{width: "140px"}}>{data.getQuantityPerUnit()}</td>
		<td>{data.getCategory().CategoryName}</td>
		<td>{data.getSupplier().CompanyName}</td>
	</tr>);
};

export = template;