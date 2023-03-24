const sideItems = document.querySelectorAll('.side-item');
const profBtn = document.querySelector('.profBtn');
const candBtn = document.querySelector('.candBtn');
const tabs = document.querySelectorAll('.tab');
const proftoast = document.querySelector('.profToast');
const candtoast = document.querySelector('.candToast');

function showToast(toast, message, error) {
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

profBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const form = document.querySelector('#profileForm');
    const formData = new FormData(form);
    if (formData.get('email') === '' && formData.get('password') === '') {
        showToast(proftoast, "Veullez remplir au moins un champ", 400)
    } else {
        fetch('/update-profile', {
            method: 'POST',
            body: formData,
        }).then(async res => {
            if(res.status === 200) {
                showToast(proftoast, await res.text(), 200);
            } else {
                showToast(proftoast,'Erreur inconnue', 500)
            }
            }); 
    }
    
})

candBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const form = document.querySelector('#candidateForm');
    const formData = new FormData(form);
    const data = {
        nom: formData.get('nom'),
        prenom: formData.get('prenom'),
        secteur: formData.get('secteur'),
        anniv: formData.get('anniv'),
        adresse: formData.get('adresse'),
        email: formData.get('email'),
        commentaire: formData.get('commentaire'),
    }
    
    if (data.nom === '' || data.prenom === '' || data.secteur === '' || data.anniv === '' || data.adresse === '' || data.email === '' || data.commentaire === '') {
        showToast(candtoast, "Veuillez remplir tout les champs avec", 400);
    } else {
    fetch('/submit', {
      method: 'POST',
      body: formData
    }).then(async res => {
        if(res.status === 200) {
            showToast(candtoast, await res.text(), 200);
        } else {
            showToast(candtoast, 'Erreur inconnue', 500)
        }
    });
  } 
})