'use strict';
module.exports = (self, options) => {
	options = Object.assign({}, options);

	const filter = key => {
		const match = pattern => typeof pattern === 'string' ? key === pattern : pattern.test(key);

		if (options.include) {
			return options.include.some(match);
		}

		if (options.exclude) {
			return !options.exclude.some(match);
		}

		return true;
	};

	for (const key of Object.getOwnPropertyNames(self.constructor.prototype)) {
		const value = self[key];

		if (key !== 'constructor' && typeof value === 'function' && filter(key)) {
			self[key] = value.bind(self);
		}
	}

	return self;
};

const excludedReactMethods = [
	'componentWillMount',
	'UNSAFE_componentWillMount',
	'render',
	'getSnapshotBeforeUpdate',
	'componentDidMount',
	'componentWillReceiveProps',
	'UNSAFE_componentWillReceiveProps',
	'shouldComponentUpdate',
	'componentWillUpdate',
	'UNSAFE_componentWillUpdate',
	'componentDidUpdate',
	'componentWillUnmount',
	'componentDidCatch',
	'setState',
	'forceUpdate'
];

module.exports.react = (self, options) => {
	options = Object.assign({}, options);
	options.exclude = (options.exclude || []).concat(excludedReactMethods);
	return module.exports(self, options);
};
