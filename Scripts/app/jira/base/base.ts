/// <reference path="../../../vendor.d.ts" />

import _ = require('underscore');
import Utils = require('app/jira/utils');


var report: { [key: string]: number } = {};

window.report = report;

window.__extends = function (child: any, base: any): void {
    child.prototype.ctor = child;
    Utils.extend.call(base, child.prototype);
};
window.__decorate = (this && this.__decorate) || function (decorators: any, target: any, key: any, desc: any): any {
    console.log('__decorate:', {decorators: decorators, target: target, key: key, desc: desc});
    _.each(decorators, function (func: Function) {
        var defFunc: Function = target[key];
        target[key] = func(target, key, {value: defFunc}).value;
    })
};
class Base {
	__name: string
	
	isFinish: boolean = false
	
	constructor () {
    	//console.log('Created: ' + this.constructor.name);
    	this.__name = this.constructor.name;
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