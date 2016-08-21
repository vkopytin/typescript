import React = require('react');
import ProductsView = require('app/jira/views/products/products_view');
import CreateProductView = require('app/jira/views/products/create_product_view');
import PanelView = require('app/jira/ui_controls/panel_view');
import FeedingViewModel = require('app/jira/view_models/products/feeding_view_model');


var template = function (viewModel: any) {
	return (
		<div id={"page-inner"}>
            <div className={"row"}>
				<div className="col-md-12">
					<CreateProductView viewModel={viewModel}/>
				</div>
			</div>
            <div className={"row"}>
                <div className="col-md-12">
					<PanelView ref="productsPanel" viewModel={viewModel} title={"Products"}>
						<ProductsView viewModel={viewModel} products={(vm: FeedingViewModel) => vm.getProducts()}/>
					</PanelView>
                </div>
            </div>
		</div>
	);
};

export = template;