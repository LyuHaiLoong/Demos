(function() {
	const content = document.querySelectorAll(".standard-content");
	// Array.from(a);
	const contentAll = Array.prototype.slice.call(content);


	for (let val of contentAll) {
		val.onclick = function() {
			this.classList.toggle("in");
		}
	}

	const nav = document.querySelector(".nav-top");

	window.onscroll = () => {
		nav.style.top = 0;
	}
})()

