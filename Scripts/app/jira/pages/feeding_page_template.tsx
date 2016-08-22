import React = require('react');
import ProductsView = require('app/jira/views/products/products_view');
import CategoriesView = require('app/jira/views/products/categories_view');
import CreateProductView = require('app/jira/views/products/create_product_view');
import PanelView = require('app/jira/ui_controls/panel_view');
import TabsView = require('app/jira/ui_controls/tabs_view');
import FeedingViewModel = require('app/jira/view_models/products/feeding_view_model');


var template = function (viewModel: any) {
	return (
		<TabsView active={0}>
			<div id={"page-inner"} title={"Home"}>
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
			<div id={"page-inner"} title={"Categories"}>
	            <div className={"row"}>
	                <div className="col-md-12">
						<CategoriesView viewModel={viewModel} />
	                </div>
	            </div>
			</div>
			<div id={"page-inner"} title={"Suppliers"}>
	            <div className={"row"}>
	                <div className="col-md-12">
		                <h4>Messages Tab</h4>
		                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
	                </div>
	            </div>
			</div>
			<div id={"page-inner"} title={"Orders"}>
	            <div className={"row"}>
	                <div className="col-md-12">
		                <h4>Settings Tab</h4>
		                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
	                </div>
	            </div>
			</div>
		</TabsView>
	);
};

export = template;