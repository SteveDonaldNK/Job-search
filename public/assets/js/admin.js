// Get all the side-items
const sideItems = document.querySelectorAll('.side-item');
const tabs = document.querySelectorAll('.tab');
const submitBtn = document.querySelector(".submit-btn");

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

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  const form = document.querySelector('.offer-form');
  const formData = new FormData(form);

  const data = {
    titre: formData.get('titre'),
    description: formData.get('description'),
    salaire: formData.get('salaire'),
  }

  fetch('/publish', {
    method: 'POST',
    body: formData
  })
})
