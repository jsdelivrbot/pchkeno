const noop = function () {};

const handlers = {};
/* @TODO: SystemJS has a bug that doesnt parse this correctly, the "get" name is being treated as 
* a special symbol
handlers["get"] = function(target, name, receiver) {
    var val = target[name];
    this.opts.getter(this.basePropName + name, val);
    return val;
};
*/

handlers[`set`] = function ( target, name, value, receiver ) {
	const prevValue = name in target ? target[name] : undefined;

	if ( target[name] !== value ) {
		target[name] = value;
		this.opts.setter( this.basePropName + name, value, prevValue );
	}
	return true;
};

function createProxy ( target, opts, basePropName ) {
	basePropName = basePropName || ``;
	// proxy child objects as well
	for ( const key in target ) {
		if (
			target.hasOwnProperty( key ) &&
			target[key] !== null &&
			!Array.isArray( target[key]) &&
			typeof target[key] === `object`
		) {
			target[key] = createProxy( target[key], opts, basePropName + key + `.` );
		}
	}
	// proxy the target object, last so it doesnt fire events above
	//var handler = new ProxyHandler(target, opts, basePropName);
	const handler = Object.assign(
		{
			target: target,
			basePropName: basePropName,
			opts: Object.assign(
				{
					getter: noop,
					setter: noop
				},
				opts || {}
			)
		},
		handlers
	);
	const proxy = new Proxy( target, handler );

	return proxy;
}

const factory = {
	createProxy: createProxy
};

export default factory;
