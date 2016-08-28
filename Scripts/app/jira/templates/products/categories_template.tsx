import React = require('react');
import CategoryItemView = require('app/jira/views/products/category_item_view');

var template = function () {
    return (
        <div className={"table-responsive"}>
            <table className={"table table-striped table-bordered table-hover"}>
                <thead>
                    <tr>
                        <th>Categoriy Name</th>
                        <th>Category Description</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
	               {this.state.categories && this.state.categories.map((entity: any) => 
                        <CategoryItemView
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