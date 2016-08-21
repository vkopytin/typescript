import React = require('react');
import ProductItemView = require('app/jira/views/products/product_item_view');
import PanelView = require('app/jira/ui_controls/panel_view');


var template = function () {
    return (
        <PanelView title={"Create Product"}>
            <form role={"form"} onSubmit={this.submitForm}>
                <div className={"form-group"}>
                    <label>Enter Product Name</label>
                    <textarea className={"form-control"}
                     rows={"3"}
                     value={this.state.product.getProductName()}
                     onChange={(e) => this.updateProductName(e)}
                     />
                    <p className={"help-block"}>Help text here.</p>
                </div>
                <div className={"form-group"}>
                    <label>Enter Unit Price</label>
                    <input className={"form-control"}
                     type={"text"}
                     value={this.state.product.getUnitPrice()}
                     onChange={(e) => this.updateUnitPrice(e)}
                     />
                    <p className="help-block">Help text here.</p>
                </div>
                <div className={"form-group"}>
                    <label>Enter Quantity Per Unit</label>
                    <input className={"form-control"}
                     type={"text"}
                     value={this.state.product.getQuantityPerUnit()}
                     onChange={(e) => this.updateQuantityPerUnit(e)}
                     />
                </div>
                <div className={"form-group"}>
                    <label>Enter Units on Order</label>
                    <input className={"form-control"}
                     type={"text"}
                     value={this.state.product.getUnitsOnOrder()}
                     onChange={(e) => this.updateUnitsOnOrder(e)}
                     />
                </div>
                <button className={"btn btn-info"}
                 type={"submit"}
                 onClick={(e) => this.saveProduct(e)}
                 >
                     Save
                </button>
            </form>
        </PanelView>
    );
}

export = template;