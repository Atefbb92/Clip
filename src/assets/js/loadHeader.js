document.addEventListener("DOMContentLoaded", function() {
  fetch('headerplateforme.html')
    .then(response => response.text())
    .then(data => {
      document.getElementById('headerplateforme-placeholder').innerHTML = data;
    });
    // Code JavaScript pour interagir avec le header
console.log('Le header a été chargé et ce script est exécuté.');
});
