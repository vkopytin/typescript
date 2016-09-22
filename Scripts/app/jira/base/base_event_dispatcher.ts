/// </// <reference path="base.ts" />

import Base = require('app/jira/base/base');


class BaseEventDispatcher extends Base {
    constructor (opts: any) {
        super();
        this.init(opts);
        //console.log('Created: ' + this.constructor.name)
    }
	
	init (opts: any): void {
		
	}
}
export = BaseEventDispatcher;