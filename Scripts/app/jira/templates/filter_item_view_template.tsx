import React = require('react');

var template = function () {
    return (
        <span className="highlight"><button
         type="button"
         className={"btn btn-sm btn-" + (this.state.selected ? 'primary' : 'default') + " status-name"}
         onClick={() => this.runCommand('SelectCommand')}
         title={this.state.description}
         style={{margin: '4px 6px'}}>
            {this.state.name}
        </button></span>
    );
}

export = template;