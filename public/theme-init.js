// Runs before the CSS paints: apply the stored theme (or the OS preference) to <html>
// so dark-mode users never see a light flash. The React ThemeProvider takes over after mount.
;(function () {
  try {
    var stored = localStorage.getItem('sharpen-theme')
    var theme = stored
      ? JSON.parse(stored)
      : matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    var meta = document.querySelector('meta[name="theme-color"]')
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0f172a' : '#f6f7f9')
  } catch {
    /* storage blocked - default paint stands */
  }
})()
