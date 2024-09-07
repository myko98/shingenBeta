document.addEventListener("DOMContentLoaded", () => {
	const modal = document.getElementById("myModal");
	const learnMoreModal = document.getElementById("learnMoreModal");
	const closeButtons = document.querySelectorAll(".close");
	const editForm = document.getElementById("editForm");
	const learnMoreContent = document.getElementById("learnMoreContent");
	// const backendUrl = 'https://shingenbeta.onrender.com';
	const backendUrl = 'http://127.0.0.1:5000'
	const gridItems = Array.from(document.querySelectorAll(".grid-item"));
	const loadMoreButton = document.getElementById("loadMore");
	// const itemsPerPage = 40;
	// let currentPage = 1;
	const clearFiltersButton = document.getElementById("clearFilters");
	const mobileClearFiltersButton = document.getElementById("mobileClearFilters")
	const burgerIcon = document.querySelector(".burger-icon");

	const searchInput = document.querySelector("#searchInput");
	const mobileSearchInput = document.querySelector("#mobileSearchInput");

	// Get all sidebar and mobile checkboxes
	const sidebarFilters = document.querySelectorAll('.sidebar input[type="checkbox"]');
	const mobileFilters = document.querySelectorAll('.offcanvas-body input[type="checkbox"]');



	// SIDEBAR ACCORDION
	var acc = document.getElementsByClassName("accordion");
	var i;

	for (i = 0; i < acc.length; i++) {
		acc[i].addEventListener("click", function () {
			/* Toggle between adding and removing the "active" class,
			to highlight the button that controls the panel */
			this.classList.toggle("active");

			/* Toggle between hiding and showing the active panel */
			var panel = this.nextElementSibling;
			if (panel.style.display === "block") {
				panel.style.display = "none";
			} else {
				panel.style.display = "block";
			}
		});
	}

	// 08 11 Might need to reimplement if I do lazy loading/caching
	// But for now we compress images stored in mongoDB is sufficient
	// function displayItems() {
	// 	const start = (currentPage - 1) * itemsPerPage;
	// 	const end = currentPage * itemsPerPage;
	// 	gridItems.slice(0, end).forEach(item => item.style.display = "flex");
	// 	gridItems.slice(end).forEach(item => item.style.display = "none");

	// 	if (end >= gridItems.length) {
	// 		loadMoreButton.style.display = "none";
	// 	} else {
	// 		loadMoreButton.style.display = "block";
	// 	}
	// }

	// loadMoreButton.addEventListener("click", () => {
	// 	currentPage += 1;
	// 	displayItems();
	// })

	// // Initial display;
	// displayItems();

	closeButtons.forEach(button => {
		button.onclick = () => {
			button.closest(".modal").style.display = "none";
		};
	});

	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
		if (event.target == learnMoreModal) {
			learnMoreModal.style.display = "none";
		}
		document.body.style.overflow = "";
	}

	// Delete a sake from DB
	document.querySelectorAll('.deleteButton').forEach(button => {
		button.addEventListener('click', event => {
			event.stopPropagation();
			const confirmDelete = confirm("Are you sure you want to delete?")
			if (confirmDelete) {
				const gridItem = event.target.closest('.grid-item');
				const sakeId = gridItem.getAttribute('data-id');
				fetch(`${backendUrl}/sake/${sakeId}`, {
					method: 'DELETE'
				})
					.then(response => {
						console.log('Response:', response);
						if (!response.ok) {
							throw new Error('Network response was not ok');
						}
						return response.json();
					})
					.then(data => {
						console.log('Delete response:', data);
						// Optionally remove the grid item from the DOM
						if (data.message === 'Sake deleted') {
							gridItem.remove();
							// Refresh the page to reflect changes in the database
							location.reload();
						}
					})
					.catch(error => {
						console.error('There was a problem with the fetch operation:', error);
					});
			}
		})
	})

	// Edit form handling, loads data from card into edit form
	document.querySelectorAll('.editButton').forEach(button => {
		button.addEventListener('click', function (event) {
			event.stopPropagation();
			modal.style.display = "block";
			const contentContainer = this.parentNode.querySelector('.content');
			if (!contentContainer) return;

			const title = contentContainer.querySelector('h2');
			const properties = contentContainer.querySelectorAll('p');

			if (title) editForm.name.value = title.textContent;

			properties.forEach((p, index) => {
				// Skip the last one since that's for description and it has no :
				if (index < properties.length - 1) {
					const text = p.textContent;
					const [key, value] = text.split(': ');
					const inputElement = editForm.querySelector(`[name="${key.toLowerCase()}"]`);
					if (inputElement) {
						if (inputElement.type === 'number') {
							inputElement.value = parseFloat(value) || 0; // Use parseFloat to convert to number
						}
						// Dealing with in stock checkbox
						else if (key.toLowerCase() === "in stock") {
							if (value === "False") {
								inputElement.checked = true;
							} else {
								inputElement.checked = false;
							}
						}
						else {
							inputElement.value = value;
						}
					}
				}
			});

			// Set description seperately since it doesn't have :
			editForm.querySelector('[name="description"]').value = properties[properties.length - 1].textContent

			// Set description character count
			const descriptionCharLength = document.querySelector("#description").value.length;
			document.querySelector("#count").textContent = descriptionCharLength + " / 230";
			// update Description char count
			document.querySelector("#description").addEventListener('input', function () {
				let charCount = this.value.length;
				const count = this.nextElementSibling;

				count.innerHTML = charCount + " / 230"
				if (charCount > 230) {
					this.value = this.value.substring(0, 230)
					count.innerHTML = "230 / 230"
				}
			})

			// Set the sakeId to be passed to PUT request
			const gridItem = event.target.closest('.grid-item');
			const sakeId = gridItem.getAttribute('data-id');
			editForm.sakeId.value = sakeId;
		})
	})

	// HANDLE EDIT SUBMIT FORM
	editForm.addEventListener("submit", async (event) => {
		event.preventDefault();
		const formData = new FormData(editForm);

		// Create the data object with nested properties
		const data = {
			"name": formData.get('name'),
			"properties": {
				"Region": formData.get('region'),
				"Brewery": formData.get('brewery'),
				"Sizes": formData.get('sizes'),
				"Taste": formData.get('taste'),
				"Pairing": formData.get('pairing'),
				"Style": formData.get('style'),
				"Price": formData.get('price'),
				"Alchohol": formData.get('alchohol'),
				"Rice type": formData.get('rice type'),
				"Polish": formData.get('polish'),
				"Fermentation style": formData.get('fermentation style'),
				"Body": formData.get('body'),
				"In stock": formData.get('in stock') || "True",
				"Expected date": formData.get('expected date')
			},
			"description": formData.get('description')
		};

		// Append JSON stringified data to FormData
		formData.set('data', JSON.stringify(data)); // Send as a string field

		try {
			const response = await fetch(`${backendUrl}/sake/${formData.get('sakeId')}`, {
				method: 'PUT',
				body: formData // pass form data directly
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const result = await response.json();
			console.log('Update response:', result);

			// Optionally reload the page to reflect changes
			location.reload();
		} catch (error) {
			console.error('There was a problem with the fetch operation:', error);
		}
	})

	const learnMoreClose = document.getElementsByClassName("close")[1];
	learnMoreClose.onclick = () => learnMoreModal.style.display = "none";

	/**
	 * Handle clicking Learn More button for each grid-item
	 * 
	 * The idea here is that when user presses learn more, we get the info from
	 * the nearest grid-item, and then we update the modals values with those.
	 */
	document.querySelectorAll('.learnMore').forEach(button => {
		button.addEventListener('click', event => {
			event.stopPropagation();
			learnMoreModal.style.display = "block";

			document.body.style.overflow = 'hidden'; // Disable all scrolling

			const contentContainer = event.target.closest('.grid-item');

			if (!contentContainer) return;

			const title = contentContainer.querySelector('h2').textContent;
			const properties = contentContainer.querySelectorAll('p');
			const image = contentContainer.querySelector('img').src;

			if (title) document.getElementById("learnMoreTitle").textContent = title;
			document.getElementById("learnMoreImage").src = image;

			properties.forEach(p => {
				const [key, value] = p.textContent.split(': ');
				const elementId = `learnMore${key.replace(' ', '_')}`;
				// console.log(elementId, value);

				const element = document.getElementById(elementId);
				if (element) {
					if (elementId === "learnMoreIn_stock") {
						if (value.trim() === "True") {
							element.innerHTML = `${key}: &check;`
						} else {
							element.innerHTML = `${key}: &#10060;`
						}
					}
					else if (elementId === "learnMoreExpected_date") {
						if (value.trim() === "") {
							element.style.display = "none"
						} else {
							element.style.display = "block";
							element.textContent = `${key}: ${value.trim()}`;
						}
					}
					else {
						element.textContent = `${key}: ${value.trim()}`;
					}
				}
			});

			// set description seperately since it doesn't have :
			document.getElementById("learnMoreDescription").innerText = properties[properties.length - 1].textContent;
		})
	})

	// Add filter functionality to each input checkbox
	document.querySelectorAll('.filterCheckbox').forEach(checkbox => {
		checkbox.addEventListener('change', () => {
			// console.log(checkbox)
			filterSakes();
		});
	});

	// Search input filter
	searchInput.addEventListener("input", () => {
		filterSakes();
	})

	clearFiltersButton.addEventListener("click", () => resetFilters());
	mobileClearFiltersButton.addEventListener("click", () => resetFilters());

	// Syncs the mobile and desktop checkboxes
	function syncFilters(source, target) {
		source.forEach((checkbox, index) => {
			checkbox.addEventListener('change', function () {
				// console.log("checkbox: ", checkbox);
				// console.log("target: ", target[index]);
				target[index].checked = this.checked;  // Now 'this' refers to the checkbox
				filterSakes();
			});
		});
	}

	// Syncs the mobile and desktop inputs
	function syncSearchInputs(input1, input2) {
		input1.addEventListener('input', function () {
			input2.value = this.value;
			filterSakes();
		});
	}

	syncFilters(sidebarFilters, mobileFilters);
	syncFilters(mobileFilters, sidebarFilters);
	syncSearchInputs(searchInput, mobileSearchInput);
	syncSearchInputs(mobileSearchInput, searchInput);

	/**
	 * Filter categories
	 * 
	 * Whenever new filter categories get added, add them into here
	 */
	const categories = ["region", "brewery", "alchohol", "taste", "style", "riceType", "fermentationStyle", "polish", "body"]

	function filterSakes() {
		// Get the search bar value, as well as any checkedbox values selected
		const searchValue = searchInput.value.toLowerCase();

		const selectedValues = categories.reduce((acc, category) => {
			acc[category] = Array.from(document.querySelectorAll(`input[type="checkbox"][name="${category}"]:checked`)).map(checkbox => checkbox.value)

			return acc
		}, {});

		console.log("selected values: ", selectedValues)

		gridItems.forEach(item => {
			let matchesAllCategories = true;

			categories.forEach(category => {
				const itemValue = item.getAttribute(`data-${category}`)
				const selectedCategoryValues = selectedValues[category]

				// Check if there are no selected values or if the item's attribute value matches any of the selected values
				if (selectedCategoryValues.length > 0) {
					if (category === "alchohol") {
						// Special handling for 'alchohol' to compare numerical values
						matchesAllCategories = matchesAllCategories && selectedCategoryValues.every(val => Number(itemValue) > val);
					} else {
						matchesAllCategories = matchesAllCategories && selectedCategoryValues.includes(itemValue);
					}
				}
			})

			// Check if the sake name matches the search input
			const sakeName = item.querySelector("h2").textContent.toLowerCase();
			const searchMatch = sakeName.includes(searchValue);

			if (matchesAllCategories && searchMatch) {
				item.style.display = 'flex';
			} else {
				item.style.display = 'none';
			}
		});
	}

	/**
	 * Resets all the filters by setting search input to empty string and setting all 
	 * checkboxes to unchecked
	 */
	function resetFilters() {
		mobileSearchInput.value = "";
		searchInput.value = "";
		document.querySelectorAll('.filterCheckbox:checked').forEach(checkbox => checkbox.checked = false);
		filterSakes();
	}

	// LOGOUT
	const logout = document.getElementById('logout');
	if (logout) {
		document.getElementById('logout').addEventListener('click', () => {
			fetch('/logout', { method: "GET" }).then(response => {
				if (response.ok) {
					window.location.href = '/login'
				} else {
					console.log("logout failed")
				}
			}).catch(error => console.error("Error: ", error));
		})
	}
})