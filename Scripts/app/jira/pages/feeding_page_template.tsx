import _ = require('underscore');
import React = require('react');
import ProductsView = require('app/jira/views/products/products_view');
import CategoriesView = require('app/jira/views/products/categories_view');
import SuppliersView = require('app/jira/views/products/suppliers_view');
import OrdersView = require('app/jira/views/products/orders_view');
import CartView = require('app/jira/views/products/cart_view');
import ReportView = require('app/jira/views/products/report_view');
import CreateProductView = require('app/jira/views/products/create_product_view');
import PanelView = require('app/jira/ui_controls/panel_view');
import TabsView = require('app/jira/ui_controls/tabs_view');
import FeedingViewModel = require('app/jira/view_models/products/feeding_view_model');


var template = function (viewModel: any) {
	return (
		<TabsView active={0}>
			<div id="page-inner" tabTitle="Home">
	            <div className="row">
					<div className="col-md-6">
						<PanelView title="Create Product">
							<CreateProductView viewModel={viewModel}/>
						</PanelView>
					</div>
					<div className="col-md-6">
						<PanelView title="Cart">
							<PanelView.Header>
							<button className="btn btn-danger" onClick={(e) => this.createCart(e)}>new Cart</button>
							<div className="pull-right btn btn-info">Cart: {this.state.cartName}
								<span className="badge">{this.state.cartDate}</span>
							</div>
							</PanelView.Header>
							<CartView viewModel={viewModel}/>
						</PanelView>
					</div>
				</div>
	            <div className={"row"}>
					<div className="col-md-12">
						<ul className={"pagination"}>
						<li onClick={(e) => this.fetchProducts(e, 0, 10)}><a href="#">&laquo;</a></li>
						{_.map(_.range(0, this.state.productsTotal, 10), (index: number) => 
							 <li key={index}><a href="#" onClick={(e) => this.fetchProducts(e, index, 10)}>{index}</a></li>
						)}
						<li onClick={(e) => this.fetchProducts(e, 0, 10)}><a href="#">&raquo;</a></li>
						</ul>
					</div>
				</div>
	            <div className={"row"}>
	                <div className="col-md-12">
						<PanelView ref="productsPanel" viewModel={viewModel}>
							<PanelView.Header>
								<div className="input-group col-md-12">
			        	       		<input type="text" onInput={(e) => this.searchProducts(e)} className="form-control" placeholder="Enter search phrase" />
		    	                   	<span className="input-group-btn">
		        	                  	<button className="btn btn-success" type="button">Find</button>
				    	            </span>
								</div>
							</PanelView.Header>
							<ProductsView viewModel={viewModel} products={(vm: FeedingViewModel) => vm.getProducts()}/>
						</PanelView>
	                </div>
	            </div>
			</div>
			<div id={"page-inner"} tabTitle={"Categories"}>
	            <div className={"row"}>
	                <div className="col-md-12">
						<CategoriesView viewModel={viewModel} />
	                </div>
	            </div>
			</div>
			<div id={"page-inner"} tabTitle={"Suppliers"}>
	            <div className={"row"}>
	                <div className="col-md-12">
						<SuppliersView viewModel={viewModel} />
	                </div>
	            </div>
			</div>
			<div id={"page-inner"} tabTitle={"Orders"}>
	            <div className={"row"}>
	                <div className="col-md-12">
						<OrdersView viewModel={viewModel} />
	                </div>
	            </div>
			</div>
			<div id={"page-inner"} tabTitle={"Report"}>
	            <div className={"row"}>
	                <div className="col-md-12">
						<ReportView viewModel={viewModel} />
	                </div>
	            </div>
			</div>
		</TabsView>
	);
};

export = template;