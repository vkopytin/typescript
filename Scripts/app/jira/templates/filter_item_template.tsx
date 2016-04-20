/// <reference path="../../../react.d.ts" />
import React = require('react');

interface IFilterItemTemplate extends React.Props<any> {
    name: string;
    selected: boolean;
    description: string;
}

class FilterItemTemplate extends React.Component<IFilterItemTemplate, {}> {
    render() {
        return <button type="button" className={"btn btn-sm btn-" + (this.props.selected ? 'primary' : 'default') + " status-name"} title={this.props.description} style={{margin: '4px 6px'}}>
            {this.props.name}
        </button>;
    }
}

export = FilterItemTemplate;