document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Toggle
  const mobileMenuButton = document.getElementById("mobile-menu-button")
  const mobileMenu = document.getElementById("mobile-menu")

  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden")
  })

  // Close mobile menu when clicking on a link
  const mobileLinks = mobileMenu.querySelectorAll("a")
  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden")
    })
  })

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80, // Adjust for fixed header
          behavior: "smooth",
        })
      }
    })
  })

  // Parallax effect
  const parallaxSections = document.querySelectorAll(".parallax-section")

  function handleParallax() {
    parallaxSections.forEach((section) => {
      const scrollPosition = window.pageYOffset
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight

      if (scrollPosition + window.innerHeight > sectionTop && scrollPosition < sectionTop + sectionHeight) {
        const speed = section.getAttribute("data-speed") || 0.5
        const yPos = (scrollPosition - sectionTop) * speed
        section.style.backgroundPosition = `center ${yPos}px`
      }
    })
  }

  window.addEventListener("scroll", handleParallax)

  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle")
  const htmlElement = document.documentElement
  const themeIcon = themeToggle.querySelector("i")

  // Check for saved theme preference or use preferred color scheme
  const savedTheme = localStorage.getItem("theme")
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    htmlElement.classList.add("dark")
    themeIcon.classList.remove("fa-moon")
    themeIcon.classList.add("fa-sun")
  }

  themeToggle.addEventListener("click", () => {
    htmlElement.classList.toggle("dark")

    if (htmlElement.classList.contains("dark")) {
      localStorage.setItem("theme", "dark")
      themeIcon.classList.remove("fa-moon")
      themeIcon.classList.add("fa-sun")
    } else {
      localStorage.setItem("theme", "light")
      themeIcon.classList.remove("fa-sun")
      themeIcon.classList.add("fa-moon")
    }
  })

  // Initialize Pyodide for Python games
  async function initPyodide() {
    try {
      window.pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/",
      })
      console.log("Pyodide loaded successfully")

      // Load the Python games
      await loadPythonGames()
    } catch (error) {
      console.error("Error loading Pyodide:", error)
    }
  }

  async function loadPythonGames() {
    // We'll implement the Python games in separate files
    console.log("Python environment ready for games")
  }

  // Initialize Pyodide
  initPyodide()
})
