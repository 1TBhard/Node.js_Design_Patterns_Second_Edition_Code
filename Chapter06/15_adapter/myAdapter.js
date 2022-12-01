// old interface
function OldIntl() {
	this.request = function (zipStart, zipEnd, weight) {
		// ...
		return "$49.75";
	};
}

// new interface
function NewIntl() {
	this.login = function (credentials) {
		/* ... */
	};
	this.setStart = function (start) {
		/* ... */
	};
	this.setDestination = function (destination) {
		/* ... */
	};
	this.calculate = function (weight) {
		return "$39.50";
	};
}

// adapter interface
function Adapter(credentials) {
	var newIntl = new NewIntl();

	newIntl.login(credentials);

	return {
		// Old의 request를 대체
		request: function (zipStart, zipEnd, weight) {
			newIntl.setStart(zipStart);
			newIntl.setDestination(zipEnd);
			return newIntl.calculate(weight);
		},
	};
}

function run() {
	var oldIntl = new OldIntl();
	var credentials = { token: "30a8-6ee1" };
	var adapter = new Adapter(credentials);

	// old의 동작
	var cost = oldIntl.request("78701", "10010", "2 lbs");
	console.log("Old cost: " + cost);

	// old의 기능과 유사하게 동작
	cost = adapter.request("78701", "10010", "2 lbs");

	console.log("New cost: " + cost);
}
