import _ = require('underscore');
import Utils = require('app/jira/utils');
var report = {};

window.report = report;

window.__extends = function (child, base) {
    child.prototype.ctor = child;
    Utils.extend.call(base, child.prototype);
};

class Base {
	__name: string
	
	isFinish: boolean = false
	
	constructor () {
    	//console.log('Created: ' + this.constructor.name);
    	this.__name = this.constructor['name'];
    	report[this.__name] = ++report[this.__name] || 1;
	}
	
	finish (): void {
        //console.log('Removed: ' + this.constructor.name);
        report[this.__name] = --report[this.__name];
        if (this.isFinish) {
            throw('Warinig: Object is removed two times.');
        }
        this.isFinish = true;
	}
	
	static extend = Utils.extend
}
export = Base;