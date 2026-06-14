/**
 * Escapa caracteres especiais de HTML para evitar injeção de markup.
 * @param {string} text - Texto a ser escapado.
 * @returns {string} Texto com entidades HTML.
 */
export function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Escapa texto para uso seguro em atributos HTML (inclui aspas simples).
 * @param {string} text - Texto a ser escapado.
 * @returns {string} Texto seguro para atributos HTML.
 */
export function escapeAttr(text) {
  return escapeHtml(text).replace(/'/g, "&#39;");
}

/**
 * Exibe uma mensagem temporária no elemento toast da página.
 * @param {string} message - Mensagem a ser exibida.
 */
export function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  setTimeout(() => toast.classList.remove("show"), 2500);
}
