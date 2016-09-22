import React = require('react');
import ProductItemView = require('app/jira/views/products/product_item_view');


var template = function () {
    return (
        <div className="list-group">
           {this.state.products && this.state.products.map((entity: any) => 
                <ProductItemView
                 viewModel={entity}
                 key={entity.getId()}
                 onSelect={() => this.runCommand('SelectCommand', entity.getId())}
                 />
           )}
        </div>
    );
}

export = template;