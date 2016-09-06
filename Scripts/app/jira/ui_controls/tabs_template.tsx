import React = require('react');

var template = function () {
    return (
        <div>
            <ul className={"nav nav-tabs"}>
                {React.Children.map(this.props.children, (x: any, index: number) => 
                <li className={this.activeTab() === index ? "active" : ""} key={index}>
                    <a href={"#"} onClick={(e) => this.changeTab(e, index)}>{x.props.tabTitle}</a>
                </li>)}
            </ul>
            <div className={"tab-content"}>
                {React.Children.map(this.props.children, (x: any, index: number) => {
                if (this.activeTab() !== index) return <div className={"tab-pane fade"} style={{display: "block"}}></div>;
                return (<div className={"tab-pane fade active in"}>
                    {x}
                </div>);})}
            </div>
        </div>
    );
};

export = template;