// Basicall monitors semaphores with a delay
// getWaitFlag is actually a callback to a getter that returns true if
// this thread is supposed to wait, false when its clear to process
// callback is the method to call back to with a parameter {} collection
// safety is optional, what I found is race condition could occur when the thread
// might be ready to run before the target callback (even though getWaitFlag was okay)
// this could happen when a scene waspushed and still loading
TimeDelay = {};
TimeDelay.defaultDelay = 200;
// This method simply waits until the flag is set to false and then calls the method
// danger here is you must ensure that no lock conditions can occur, the 
// flag will always get set to false at some point
TimeDelay.monitorFlag = function(getWaitFlag, callBack, parameters, safety) {
	if (!safety) {
		safety = 20;
	}
	if ((safety > 2) && getWaitFlag()) {
		safety = safety - 1;
		setTimeout(function() {
			TimeDelay.monitorFlag(getWaitFlag, callBack, parameters, safety);
		},
		TimeDelay.defaultDelay);
	} else {
		callBack(parameters);
	}
};