import _ = require('underscore');
import React = require('react');

var template = function (data: any) {
    return (
        <div>
        {data.cart && _.map(data.cart.getCartDetail(), (detail: any) =>
            <a key={detail.Id} href={"#schedule"} className={"list-group-item"}
             title="Click to remove one item"
             onClick={(e) => this.removeOneItem(e, detail.Product.Id)}
             >
                <i className={"fa fa-minus fa-fw"}></i>
                <span>{detail.Product.ProductName}</span>
        		<span className={"pull-right text-muted small"}>
        			<em>
        				{detail.UnitPrice}&nbsp;/&nbsp;{detail.Quantity}
        			</em>
        		</span>
           </a>
       )}
       </div>);
};

export = template;