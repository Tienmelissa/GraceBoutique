// ======== MENU BURGER ========
function initBurgerMenu() {
  const burgerMenu = document.getElementById('burger-menu');
  const navMenu = document.getElementById('nav-menu');
  
  if (burgerMenu && navMenu) {
    burgerMenu.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      
      // Changer l'icône
      const icon = burgerMenu.querySelector('ion-icon');
      if (navMenu.classList.contains('active')) {
        icon.setAttribute('name', 'close-outline');
      } else {
        icon.setAttribute('name', 'menu-outline');
      }
    });
    
    // Fermer le menu quand on clique sur un lien
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = burgerMenu.querySelector('ion-icon');
        icon.setAttribute('name', 'menu-outline');
      });
    });
    
    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', function(event) {
      if (!burgerMenu.contains(event.target) && !navMenu.contains(event.target)) {
        navMenu.classList.remove('active');
        const icon = burgerMenu.querySelector('ion-icon');
        icon.setAttribute('name', 'menu-outline');
      }
    });
  }
}

// ======== WHATSAPP ========
function initWhatsAppContact() {
  const whatsappBtn = document.getElementById("whatsapp-contact");
  if (whatsappBtn) {
    whatsappBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const phone = "22667340582";
      const text = encodeURIComponent(
        "Bonjour, je souhaite obtenir des informations sur vos produits."
      );
      const url = `https://wa.me/${phone}?text=${text}`;
      window.open(url, "_blank");
    });
  }
}