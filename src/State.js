const getIdlePromise = () => {
	return new Promise(() => null);
};

class State {
	constructor(data = null, transitions = []) {
		this._data = data;
		this._transitions = transitions;

		this._transitionPromise = getIdlePromise();
	}

	setData(data) {
		this.data = data;
	}

	addTransition(transition) {
		this._transitions = [...this._transitions, transition];
		this._transitionPromise = Promise.any(
			this._transitions.map((transitionFunction) => {
				return transitionFunction();
			})
		);
	}
}

export default State;
