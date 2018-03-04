function CompletedTabView () {}

Object.assign( CompletedTabView.prototype, {
	mount: function ( rootNode ) {
		this.rootNode = rootNode;
	},
	unmount: function () {
		this.rootNode = null;
	},
	processNumbersHTML: function ( numbers ) {
		let numbersHTML = ``;

		numbers.forEach( function ( number ) {
			numbersHTML +=
				`<li class='card-tab__completed__num'><span class='card-tab__completed__num__val'>` +
				number +
				`</span></li>`;
		});
		this.rootNode.innerHTML = numbersHTML;
	}
});

export default CompletedTabView;
