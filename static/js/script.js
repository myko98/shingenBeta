const backendUrl = 'https://shingenbeta.onrender.com';
// const backendUrl = 'http://127.0.0.1:5000'

/**
 * Calls sake endpoint to get JSON data that gets transformed to a JS object
 */
async function fetchSakeData() {
	try {
		const response = await fetch(`${backendUrl}/sake`); // Adjust endpoint as necessary
		if (!response.ok) {
			throw new Error('Failed to fetch sake data');
		}
		const sakeData = await response.json();
		return sakeData;
	} catch (error) {
		console.error('Error fetching sake data:', error);
		return [];
	}
}

/**
 * Populate the learn more modal with selected sake details
 */
function populateLearnMoreModal(selected) {
	document.getElementById("learnMoreTitle").textContent = selected.name;
	document.getElementById("learnMoreImage").src = `data:image/jpeg;base64,${selected.image_base64}`;
	document.getElementById("learnMorePrice").textContent = `Price: ${selected.properties.Price || 'N/A'}`;
	document.getElementById("learnMoreSizes").textContent = `Sizes: ${selected.properties.Sizes || 'N/A'}`;
	document.getElementById("learnMoreIn_stock").innerHTML = selected.properties['In stock'] === "True" ? 'In Stock: &check;' : 'In Stock: &#10060;';
	document.getElementById("learnMoreExpected_date").textContent = selected.properties['In stock'] === "False" ? `Expected Date: ${selected.properties['Expected date']}` : '';

	for (const [key, value] of Object.entries(selected.properties)) {
		if (key === "In stock" || key === "Expected date") continue;
		const elementId = `learnMore${key.replace(' ', '_')}`;
		const element = document.getElementById(elementId);
		if (element) {
			element.textContent = `${key}: ${value}`;
		}
	}

	document.getElementById("learnMoreDescription").innerText = selected.description;
}

// Render sake items using the fetched data
function renderSakeItems(sakes) {
	const gridContainer = document.querySelector('.grid-container');
	gridContainer.innerHTML = ''; // Clear existing items

	sakes.forEach(sake => {
		const gridItem = document.createElement('div');
		gridItem.classList.add('grid-item', 'learnMore');

		// Add the data-id attribute with the sake's unique identifier
		gridItem.setAttribute('data-id', sake._id);

		gridItem.innerHTML = `
					<img src="data:image/jpeg;base64,${sake.image_base64}" alt="${sake.name}">
					<div class="content">
							<h2>${sake.name}</h2>
							<p>${sake.description}</p>
					</div>
					<div class="price">Price: ${sake.properties.Price || 'N/A'}</div>
					<button class="btn btn-dark learnMore">&#9432;</button>
			`;

		// Add edit and delete buttons if the user is authenticated
		if (currentUserIsAuthenticated) {
			const editButton = document.createElement('button');
			editButton.classList.add('btn', 'btn-dark', 'border', 'editButton');
			editButton.textContent = 'Edit';

			const deleteButton = document.createElement('button');
			deleteButton.classList.add('btn', 'btn-dark', 'border', 'deleteButton');
			deleteButton.textContent = 'Delete';

			gridItem.appendChild(editButton);
			gridItem.appendChild(deleteButton);
		}

		// If it's new, then add new button on top right
		if (sake.new === 'on') {
			const newIcon = document.createElement('div');
			newIcon.classList.add('newIcon');
			newIcon.textContent = "new"
			gridItem.appendChild(newIcon)
		}

		gridContainer.appendChild(gridItem);
	});
}

document.addEventListener("DOMContentLoaded", async () => {
	const modal = document.getElementById("myModal");
	const learnMoreModal = document.getElementById("learnMoreModal");
	const closeButtons = document.querySelectorAll(".close");
	const editForm = document.getElementById("editForm");

	const clearFiltersButton = document.getElementById("clearFilters");
	const mobileClearFiltersButton = document.getElementById("mobileClearFilters")

	const searchInput = document.querySelector("#searchInput");
	const mobileSearchInput = document.querySelector("#mobileSearchInput");
	const sortDropdown = document.querySelector("#sortDropdown");

	// Get all sidebar and mobile checkboxes
	const sidebarFilters = document.querySelectorAll('.sidebar input[type="checkbox"]');
	const mobileFilters = document.querySelectorAll('.offcanvas-body input[type="checkbox"]');

	const sakeData = await fetchSakeData();
	console.log('SAKE DATA: ', sakeData)
	renderSakeItems(sakeData)

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

	// Use event delegation for grid items
	const gridContainer = document.querySelector('.grid-container');

	gridContainer.addEventListener('click', (event) => {
		const gridItem = event.target.closest('.grid-item');
		if (!gridItem) return; // If click is not on a grid-item, do nothing

		const sakeId = gridItem.getAttribute('data-id');
		const selected = sakeData.find(sake => sake._id === sakeId);

		console.log(event.target)

		// Handle Learn More button
		if (event.target.classList.contains('learnMore') || event.target.closest('.content')) {
			event.stopPropagation();
			learnMoreModal.style.display = "block";
			document.body.style.overflow = 'hidden';
			// Populate learn more modal with selected sake details
			populateLearnMoreModal(selected);
		}

		// Handle Edit button
		if (event.target.classList.contains('editButton')) {
			event.stopPropagation();
			modal.style.display = "block";
			// Populate edit form with selected sake details
			populateEditForm(selected);
		}

		// Handle Delete button
		if (event.target.classList.contains('deleteButton')) {
			event.stopPropagation();
			const confirmDelete = confirm("Are you sure you want to delete?");
			if (confirmDelete) {
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
						if (data.message === 'Sake deleted') {
							gridItem.remove();
						}
					})
					.catch(error => {
						console.error('There was a problem with the fetch operation:', error);
					});
			}
		}
	});

	// Populate the edit form with selected sake details
	function populateEditForm(selected) {
		console.log(selected)
		editForm.name.value = selected.name || '';
		editForm.region.value = selected.properties.Region || '';
		editForm.brewery.value = selected.properties.Brewery || '';
		editForm.sizes.value = selected.properties.Sizes || '';
		editForm.taste.value = selected.properties.Taste || '';
		editForm.pairing.value = selected.properties.Pairing || '';
		editForm.style.value = selected.properties.Style || '';
		editForm.price.value = selected.properties.Price || '';
		editForm.alchohol.value = selected.properties.Alchohol || '';
		editForm.riceType.value = selected.properties['Rice type'] || '';
		editForm.polish.value = selected.properties.Polish || '';
		editForm.fermentationStyle.value = selected.properties['Fermentation style'] || '';
		editForm.body.value = selected.properties.Body || '';
		editForm.description.value = selected.description || '';
		editForm.inStock.checked = selected.properties['In stock'] === "True";
		editForm.expectedDate.value = selected.properties['Expected date'] || '';
		editForm.sakeId.value = selected._id;
		editForm.new.checked = selected.new === 'on';

		const descriptionCharLength = editForm.description.value.length;
		document.querySelector("#count").textContent = `${descriptionCharLength} / 230`;

		editForm.description.addEventListener('input', function () {
			let charCount = this.value.length;
			const count = this.nextElementSibling;
			count.innerHTML = `${charCount} / 230`;
			if (charCount > 230) {
				this.value = this.value.substring(0, 230);
				count.innerHTML = "230 / 230";
			}
		});
	}

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
			"description": formData.get('description'),
			"new": formData.get('new')
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
 * Whenever new filter categories get added, include them here
 */
	const categories = ["Region", "Brewery", "Alchohol", "Taste", "Style", "Rice type", "Fermentation style", "Polish", "Body"];

	function filterSakes() {
		// Get the search bar value and selected checkbox values
		const searchValue = searchInput.value.toLowerCase();

		// Create an object that stores the selected values for each category
		const selectedValues = categories.reduce((acc, category) => {
			acc[category] = Array.from(document.querySelectorAll(`input[type="checkbox"][name="${category.toLowerCase()}"]:checked`)).map(checkbox => checkbox.value.toLowerCase());
			return acc;
		}, {});

		console.log("Selected values:", selectedValues);

		// Filter sakeData based on the search input and selected filters
		const filteredSakes = sakeData.filter(sake => {
			let matchesAllCategories = true;

			// Check each category against selected filter values
			categories.forEach(category => {
				const itemValue = sake.properties[category];
				const selectedCategoryValues = selectedValues[category];

				// Check if the item value matches any of the selected values
				if (selectedCategoryValues.length > 0) {
					if (category === "Alchohol") {
						// Special handling for 'Alchohol' to compare numerical values
						matchesAllCategories = matchesAllCategories && selectedCategoryValues.some(val => Number(itemValue) > val);
					} else {
						matchesAllCategories = matchesAllCategories && selectedCategoryValues.includes(itemValue.toLowerCase());
					}
				}
			});

			// Check if the sake name matches the search input
			const sakeName = sake.name.toLowerCase();
			const searchMatch = sakeName.includes(searchValue);

			return matchesAllCategories && searchMatch;
		});

		// Render the filtered sake items
		renderSakeItems(filteredSakes);
	}

	sortDropdown.addEventListener("change", () => {
		const sortOption = sortDropdown.value;
		console.log(sortOption);
		sortSakes(sortOption);
	});

	/**
	 * Sorts the sakes based on the dropdown input value.
	 */
	function sortSakes(option) {
		// Use the sakeData array directly to sort and render
		let sortedSakeData = [...sakeData]; // Copy sakeData to avoid mutating the original array

		switch (option) {
			case 'new':
				console.log('sorting by new')
				// Sort by the 'new' property first, then by any other criteria if needed
				sortedSakeData.sort((a, b) => {
					// If 'new' property exists and is set to 'on', place it first
					const aIsNew = a.new === 'on' ? 1 : 0;
					const bIsNew = b.new === 'on' ? 1 : 0;

					// Sort 'new' items first; if equal, keep original order
					return bIsNew - aIsNew;
				});
				break;
			case 'aToZ':
				sortedSakeData.sort((a, b) => a.name.localeCompare(b.name));
				break;
			case 'zToA':
				sortedSakeData.sort((a, b) => b.name.localeCompare(a.name));
				break;
			case 'hToL':
				sortedSakeData.sort((a, b) => parseFloat(b.properties.Price) - parseFloat(a.properties.Price));
				break;
			case 'lToH':
				sortedSakeData.sort((a, b) => parseFloat(a.properties.Price) - parseFloat(b.properties.Price));
				break;
			case 'relevance': // Reset to the initial order
				sortedSakeData = [...sakeData]; // Revert to the original order
				break;
			default:
				break;
		}

		// Re-render the sorted items
		renderSakeItems(sortedSakeData);
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