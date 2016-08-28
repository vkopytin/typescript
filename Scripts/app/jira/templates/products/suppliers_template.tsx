import React = require('react');
import SupplierItemView = require('app/jira/views/products/supplier_item_view');

var template = function () {
    return (
        <div className={"table-responsive"}>
            <table className={"table table-striped table-bordered table-hover"}>
                <thead>
                    <tr>
                        <th>Company Name</th>
                        <th>Address</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
	               {this.state.suppliers && this.state.suppliers.map((entity: any) => 
                        <SupplierItemView
                         viewModel={entity}
                         key={entity.getId()}
                         onSelect={() => this.runCommand('SelectCommand', entity.getId())}
                         />
                   )}
                </tbody>
            </table>
        </div>
    );
}

export = template;