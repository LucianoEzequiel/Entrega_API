//Logica para inicio sesion loguin y registro
//almacenamiento local no seguro sin backend
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const loginUsernameInput = document.getElementById("loginUsername");
  const loginPasswordInput = document.getElementById("loginPassword");
  const registerUsernameInput = document.getElementById("registerUsername");
  const registerPasswordInput = document.getElementById("registerPassword");
  const registerEmailInput = document.getElementById("registerEmail");
  const confirmPasswordInput = document.getElementById("confirmPassword");
  const fullNameInput = document.getElementById("fullName");
  const birthDateInput = document.getElementById("birthDate");
  const tabLinks = document.querySelectorAll(".tab-link");
  const tabContents = document.querySelectorAll(".tab-content");

  // Mostrar la pestaña de inicio de sesión por defecto
  document.getElementById("LoginTab").classList.add("active");
  tabLinks[0].classList.add("active");

  // Agregar referencia global a la función openTab
  window.openTab = function (tabName) {
    tabContents.forEach((content) => {
      content.classList.remove("active");
    });
    tabLinks.forEach((link) => {
      link.classList.remove("active");
    });
    document.getElementById(tabName).classList.add("active");
    document
      .querySelector(`[onclick="openTab('${tabName}')"]`)
      .classList.add("active");
  };

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = loginUsernameInput.value.trim();
    const password = loginPasswordInput.value.trim();

    // Validar el inicio de sesión solo si los detalles coinciden con los almacenados en el almacenamiento local
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    let valid = true;

    if (username === "") {
      showError(loginUsernameInput, "Username is required");
      valid = false;
    } else {
      clearError(loginUsernameInput);
    }

    if (password === "") {
      showError(loginPasswordInput, "Password is required");
      valid = false;
    } else {
      clearError(loginPasswordInput);
    }

    if (valid) {
      if (username === storedUsername && password === storedPassword) {
        // Inicio de sesión exitoso
        alert("Inicio de sesión exitoso.");
        // Limpiar campos de usuario y contraseña
        loginUsernameInput.value = '';
        loginPasswordInput.value = '';
        // Redirigir a la página de inicio de sesión exitoso
        window.location.href = "kitsu.html";
      } else {
        // Mostrar mensaje de error
        alert("Usuario o contraseña incorrectos.");
      }
    }
  });

  registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = registerUsernameInput.value.trim();
    const email = registerEmailInput.value.trim();
    const password = registerPasswordInput.value.trim();
    const confirmPassword = confirmPasswordInput.value.trim();
    const fullName = fullNameInput.value.trim();
    const birthDate = birthDateInput.value.trim();

    let valid = true;

    if (username === "") {
      showError(registerUsernameInput, "Username is required");
      valid = false;
    } else {
      clearError(registerUsernameInput);
    }

    if (email === "") {
      showError(registerEmailInput, "Email is required");
      valid = false;
    } else if (!isValidEmail(email)) {
      showError(registerEmailInput, "Invalid email format");
      valid = false;
    } else {
      clearError(registerEmailInput);
    }

    if (password === "") {
      showError(registerPasswordInput, "Password is required");
      valid = false;
    } else {
      clearError(registerPasswordInput);
    }

    if (confirmPassword === "") {
      showError(confirmPasswordInput, "Please confirm password");
      valid = false;
    } else if (confirmPassword !== password) {
      showError(confirmPasswordInput, "Passwords do not match");
      valid = false;
    } else {
      clearError(confirmPasswordInput);
    }

    if (fullName === "") {
      showError(fullNameInput, "Full name is required");
      valid = false;
    } else {
      clearError(fullNameInput);
    }

    if (birthDate === "") {
      showError(birthDateInput, "Birth date is required");
      valid = false;
    } else {
      clearError(birthDateInput);
    }

    if (valid) {
      // Guardar los datos en el almacenamiento local
      localStorage.setItem('username', username);
      localStorage.setItem('password', password);
      alert("Usuario registrado con éxito. Ahora puedes iniciar sesión.");
      switchToLogin();
    }
  });

  function switchToLogin() {
    openTab("LoginTab");
  }

  function showError(input, message) {
    clearError(input);
    const error = document.createElement("small");
    error.className = "error";
    error.innerText = message;
    input.parentElement.appendChild(error);
  }

  function clearError(input) {
    const error = input.parentElement.querySelector(".error");
    if (error) {
      input.parentElement.removeChild(error);
    }
  }

  // Expresión regular para validar el formato de correo electrónico
  function isValidEmail(email) {
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
});


//logica para consumir api de web http:kitsu.com
// Funcionalidad del menú
document.getElementById("menu-icon").addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("show");
  });
  
  // Cerrar el menú al hacer clic en una opción
  document.querySelectorAll('.sidebar a').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
          e.preventDefault();
  
          // Cierra el menú después de hacer clic en una opción
          document.querySelector('.sidebar').classList.remove('show');
  
          // Obtener el href del enlace y desplazarse a la sección correspondiente
          const target = this.getAttribute('href').substring(1); // Elimina el '#' del href
          document.getElementById(target).scrollIntoView({
              behavior: 'smooth'
          });
      });
  });
    
  // Fetch y mostrar listas de anime al cargar la página
  window.addEventListener("load", () => {
    fetchAnimeList(
        "popular",
        "https://kitsu.io/api/edge/anime?sort=popularityRank&page[limit]=20&page[offset]=0","popularAnime"
    );
    fetchAnimeList(
        "trending",
        "https://kitsu.io/api/edge/trending/anime?limit=27","trendingAnime"
    );
  });
  
  function fetchAnimeList(type, url, elementId) {
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();
        })
        .then((data) => {
            displayAnimeList(data.data, elementId);
        })
        .catch((error) => {
            console.error(`Error fetching ${type} anime list:`, error);
            document.getElementById(
                elementId
            ).textContent = `Error fetching ${type} anime list: ${error}`;
        });
  }
  
  function displayAnimeList(animeList, elementId) {
    const animeInfoDiv = document.getElementById(elementId);
    animeInfoDiv.innerHTML = ""; // Limpiar resultados previos
    animeList.forEach((anime) => {
        if (anime.attributes.titles && anime.attributes.titles.en) {
            const title = anime.attributes.titles.en;
            const image = anime.attributes.posterImage
                ? anime.attributes.posterImage.small
                : "";
            const synopsis = anime.attributes.synopsis
                ? anime.attributes.synopsis
                : "No synopsis available.";
  
            if (title.trim() !== "" && image.trim() !== "") {
                const animeDiv = document.createElement("div");
                animeDiv.classList.add("anime-item");
  
                const titleElement = document.createElement("h3");
                titleElement.textContent = title;
                animeDiv.appendChild(titleElement);
  
                const imageElement = document.createElement("img");
                imageElement.src = image;
                imageElement.alt = title;
                animeDiv.appendChild(imageElement);
  
                const synopsisElement = document.createElement("p");
                synopsisElement.textContent = synopsis;
                animeDiv.appendChild(synopsisElement);
  
                animeInfoDiv.appendChild(animeDiv);
            }
        }
    });
  }  

  // Función para desplazarse suavemente hacia arriba
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Muestra el botón de regreso arriba cuando se desplaza hacia abajo
window.addEventListener('scroll', () => {
    const btnScrollToTop = document.getElementById('btnScrollToTop');
    if (window.scrollY > 100) {
        btnScrollToTop.style.display = 'block';
    } else {
        btnScrollToTop.style.display = 'none';
    }
});
