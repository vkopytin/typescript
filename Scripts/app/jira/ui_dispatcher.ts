/// <reference path="base/base_event_dispatcher.ts" />

import BaseEventDispatcher = require('app/jira/base/base_event_dispatcher');

class UIDispatcher extends BaseEventDispatcher {
}

declare var inst: UIDispatcher;
inst = new UIDispatcher({});

export = inst;