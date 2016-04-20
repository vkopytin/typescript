/// </// <reference path="base.ts" />

import Base = require('app/jira/base/base');

class BaseEventDispatcher extends Base {
    
    constructor (opts: any) {
        super();
        this.init(opts);
    }

    init (opts: any) {
        super.init(opts);
    }
}
export = BaseEventDispatcher;