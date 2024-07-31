
document.addEventListener("DOMContentLoaded", () => {
	console.log("hi")

	const backendUrl = 'https://shingenbeta.onrender.com';
	const form = document.getElementById("sakeForm")


	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const formData = new FormData(form)
		console.log("FormData: ", formData)

		fetch(`${backendUrl}/sake`, {
			method: 'POST',
			body: formData,
		}).then(response => response.json())
			.then(data => {
				if (data.message) {
					console.log(data.message)
					alert(data.message);
					// location.reload();
				} else if (data.error) {
					console.log("error: ", data.error)
					alert('Error: ' + data.error);
				}
			})
			.catch(error => console.error('Error:', error));
	})

})
