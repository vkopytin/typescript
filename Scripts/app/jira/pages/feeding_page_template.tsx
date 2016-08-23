import React = require('react');
import ProductsView = require('app/jira/views/products/products_view');
import CategoriesView = require('app/jira/views/products/categories_view');
import SuppliersView = require('app/jira/views/products/suppliers_view');
import OrdersView = require('app/jira/views/products/orders_view');
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
						<SuppliersView viewModel={viewModel} />
	                </div>
	            </div>
			</div>
			<div id={"page-inner"} title={"Orders"}>
	            <div className={"row"}>
	                <div className="col-md-12">
						<OrdersView viewModel={viewModel} />
	                </div>
	            </div>
			</div>
		</TabsView>
	);
};

export = template;