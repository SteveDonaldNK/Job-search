// Get all the side-items
const sideItems = document.querySelectorAll('.side-item');
const tabs = document.querySelectorAll('.tab');
const fileInput = document.getElementById('formFile');
const searchResults = document.querySelector("#searchResults");

function showToast(message, error) {
  const toast = document.querySelector('.toast');
  if (toast) {
    if(error === 200) { 
      toast.className = 'toast shadow-sm p-3 rounded bg-success';
    } else if (error === 400) {
      toast.className = 'toast shadow-sm p-3 rounded bg-warning';
    } else {
      toast.className = 'toast shadow-sm p-3 rounded bg-danger';
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000); // hide the toast after 3 seconds
  }
}

  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 5) {
      showToast('Vous pouvez choisir un maximum de 5 photos', 400);
      fileInput.value = ''; // Clear the selected files
    }
  });

// Loop through the side-items and add a click event listener to each one
sideItems.forEach((link, index) => {
  link.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the default action of the link
    
    // Remove the active class from all the side-items
    sideItems.forEach(link => {
      link.classList.remove('active');
    });

    tabs.forEach(tab => {
      tab.classList.add('d-none');
    });
    
    // Add the active class to the clicked side-item
    this.classList.add('active');
    tabs[index].classList.remove('d-none');
  });
});

function searchFunction() {
  let searchInput = document.getElementById("searchInput");
  let searchQuery = searchInput.value.trim();
  if (searchQuery === "") {
    // if the search query is empty, hide all items
    searchResults.innerHTML = "";
    return;
  }
  fetch(`/search?q=${searchQuery}`)
    .then(response => response.json())
    .then(data => {
      searchResults.innerHTML = "";
      data.forEach(item => {
        let itemElement = document.createElement("div");
        itemElement.innerHTML = `<div class='d-flex py-4 px-2'><img style="height: 5rem; width: 100%; object-fit: cover;" class='w-25 me-2' src='/image/${item.image[0]}'>
                                    <div>
                                      <h5><a href='/emplois/${item._id}'>${item.titre.substr(0, 30)}</a></h5>
                                      <p>${item.description.substr(0, 50) + '...'}</p>
                                    </div>
                                  </div>`;
        searchResults.appendChild(itemElement);
      });
    })
    .catch(error => console.error(error));
}
