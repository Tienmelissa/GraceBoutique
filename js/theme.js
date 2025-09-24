// ======== GESTION DES THÈMES ========
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('graceTheme');
  
  // Appliquer le thème sauvegardé ou détecter la préférence système
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  
  // Mettre à jour l'icône du bouton
  updateThemeIcon();
  
  // Écouter les changements de thème
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('graceTheme', newTheme);
  updateThemeIcon();
}

function updateThemeIcon() {
  const themeToggle = document.getElementById('theme-toggle');
  const icon = themeToggle?.querySelector('ion-icon');
  
  if (icon) {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    icon.setAttribute('name', currentTheme === 'dark' ? 'sunny-outline' : 'moon-outline');
  }
}

// Écouter les changements de préférence système
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('graceTheme')) {
      document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      updateThemeIcon();
    }
  });
}