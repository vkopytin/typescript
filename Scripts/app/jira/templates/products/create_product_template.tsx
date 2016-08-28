import _ = require('underscore');
import React = require('react');
import ProductItemView = require('app/jira/views/products/product_item_view');
import PanelView = require('app/jira/ui_controls/panel_view');


var template = function () {
    return (
        <form role="form" onSubmit={this.submitForm}>
            <div className="form-group">
                <label>Enter Product Name</label>
                <textarea className="form-control"
                 rows="3"
                 value={this.state.product.getProductName()}
                 onChange={(e) => this.updateProductName(e)}
                 />
                <p className="help-block">Help text here.</p>
            </div>
            <div className="form-group">
                <label>Select Category</label>
                <select className="form-control"
                 value={this.state.product.getCategory() && this.state.product.getCategory().Id}
                 onChange={(e) => this.updateCategory(e)}
                 >
                    {_.map(this.state.categories, (item: any) => {
                        return (<option key={item.getId()} value={item.getId()}>{item.getCategoryName()}</option>);
                    })}
                 </select>
                <p className="help-block">Help text here.</p>
            </div>
            <div className="form-group">
                <label>Select Supplier</label>
                <select className="form-control"
                 onChange={(e) => this.updateSupplier(e)}
                 value={this.state.product.getSupplier() && this.state.product.getSupplier().Id}
                 >
                    {_.map(this.state.suppliers, (item: any) => {
                        return (<option key={item.getId()} value={item.getId()}>{item.getCompanyName()}</option>);
                    })}
                 </select>
                <p className="help-block">Help text here.</p>
            </div>
            <div className="form-group col-md-4">
                <label>Price</label>
                <input className="form-control"
                 type="text"
                 value={this.state.product.getUnitPrice()}
                 onChange={(e) => this.updateUnitPrice(e)}
                 />
                <p className="help-block">Help text here.</p>
            </div>
            <div className="form-group col-md-4">
                <label>Quantity</label>
                <input className="form-control"
                 type="text"
                 value={this.state.product.getQuantityPerUnit()}
                 onChange={(e) => this.updateQuantityPerUnit(e)}
                 />
                <p className="help-block">Help text here.</p>
            </div>
            <div className="form-group col-md-4">
                <label>Units</label>
                <input className="form-control"
                 type="text"
                 value={this.state.product.getUnitsOnOrder()}
                 onChange={(e) => this.updateUnitsOnOrder(e)}
                 />
                <p className="help-block">Help text here.</p>
            </div>
            <button className={"btn btn-info"}
             type={"submit"}
             onClick={(e) => this.saveProduct(e)}
             >
                 Save
            </button>
        </form>
    );
}

export = template;