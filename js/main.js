// ======== INITIALISATION PRINCIPALE ========
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Initialiser le thème en premier
    if (typeof initTheme === 'function') {
      initTheme();
    } else {
      console.warn("⚠️ initTheme non disponible");
    }
    
    // Initialiser la navigation
    if (typeof initBurgerMenu === 'function') initBurgerMenu();
    if (typeof initWhatsAppContact === 'function') initWhatsAppContact();
    if (typeof initCartNavigation === 'function') initCartNavigation();
    
    // Charger les données
    if (typeof loadProducts === 'function') {
      await loadProducts();
    } else {
      console.warn("⚠️ loadProducts non disponible");
    }
    
    if (typeof loadReviews === 'function') {
      await loadReviews();
    } else {
      console.warn("⚠️ loadReviews non disponible");
    }
    
    // Initialiser le panier
    if (typeof updateCartCount === 'function') {
      updateCartCount();
    } else {
      console.warn("⚠️ updateCartCount non disponible");
    }
    
    // Si on est sur la page commande, afficher le panier
    if (window.location.pathname.includes("commande.html")) {
      if (typeof displayCart === 'function') {
        displayCart();
      } else {
        console.warn("⚠️ displayCart non disponible");
      }
    }
    
    // Initialiser les formulaires
    if (typeof initCommentForm === 'function') {
      initCommentForm();
    } else {
      console.warn("⚠️ initCommentForm non disponible");
    }
    
    // Configurer les cartes produits après un délai pour s'assurer que le contenu est chargé
    setTimeout(() => {
      if (typeof setupProductCards === 'function') setupProductCards();
      if (typeof bindCartButtons === 'function') bindCartButtons();
    }, 500);
    
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error);
  }
});