import React = require('react');
import ProductsView = require('app/jira/views/products_view');
import PanelView = require('app/jira/views/panel_view');
import FeedingViewModel = require('app/jira/view_models/feeding_view_model');

var template = function (viewModel: any) {
	return (
		<div id={"page-inner"}>
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