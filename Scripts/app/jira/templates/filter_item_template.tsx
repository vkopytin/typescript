/// <reference path="../../../react.d.ts" />
import React = require('react');

// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX

interface IFilterItemTemplate extends React.Props<any> {
    name: string;
}

class FilterItemTemplate extends React.Component<IFilterItemTemplate, {}> {
    render() {
        return <button type="button" class="btn btn-sm btn-{{#selected}}primary{{/selected}}{{^selected}}default{{/selected}} status-name" title="{{description}}" x-style="margin: 4px 6px;">
            {this.props.name}
        </button>;
    }
}

export = FilterItemTemplate;