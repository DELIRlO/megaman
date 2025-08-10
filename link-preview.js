document.addEventListener("DOMContentLoaded", () => {
  const linkRegex = /(carlosfilho\.vercel\.app|carlosdiniz\.vercel\.app)/gi;
  const previewImageUrl = "https://carlosdiniz.vercel.app/preview.png";

  const MOUSE_LEAVE_DELAY = 300; // ms
  let hidePreviewTimer = null;
  let previewPopup = null;

  function createPreviewPopup() {
    if (previewPopup) return previewPopup;

    const popup = document.createElement("div");
    popup.className = "link-preview-popup";
    popup.style.cssText = `
      position: fixed;
      z-index: 10000;
      width: 250px;
      height: auto;
      background-color: #2c2c2c;
      border: 1px solid #8A2BE2;
      border-radius: 8px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
      padding: 10px;
      pointer-events: none;
      opacity: 0;
      transform: scale(0.9);
      transition: opacity 0.2s ease, transform 0.2s ease;
      font-family: 'Arial', sans-serif;
      font-size: 14px;
      color: #fff;
    `;

    const img = document.createElement("img");
    img.src = previewImageUrl;
    img.style.cssText = `
      width: 100%;
      height: auto;
      border-radius: 4px;
      margin-bottom: 8px;
    `;

    const title = document.createElement("div");
    title.textContent = "Portfolio de Carlos Filho";
    title.style.cssText =
      "font-weight: bold; font-size: 16px; margin-bottom: 4px;";

    const description = document.createElement("div");
    description.textContent =
      "Desenvolvedor Front-End, construo sistemas e sites web.";
    description.style.cssText =
      "font-size: 13px; color: #ccc; margin-bottom: 8px;";

    const url = document.createElement("div");
    url.textContent = "carlosdiniz.vercel.app";
    url.style.cssText = "font-size: 12px; color: #8A2BE2;";

    popup.appendChild(img);
    popup.appendChild(title);
    popup.appendChild(description);
    popup.appendChild(url);
    document.body.appendChild(popup);

    return popup;
  }

  function showPreview(e) {
    if (hidePreviewTimer) {
      clearTimeout(hidePreviewTimer);
      hidePreviewTimer = null;
    }

    if (!previewPopup) {
      previewPopup = createPreviewPopup();
    }

    previewPopup.style.display = "block";

    // Position calculation
    const x = e.clientX + 20;
    const y = e.clientY + 20;

    previewPopup.style.left = `${x}px`;
    previewPopup.style.top = `${y}px`;

    // Animate in
    setTimeout(() => {
      previewPopup.style.opacity = "1";
      previewPopup.style.transform = "scale(1)";
    }, 10);
  }

  function hidePreview() {
    if (previewPopup) {
      hidePreviewTimer = setTimeout(() => {
        previewPopup.style.opacity = "0";
        previewPopup.style.transform = "scale(0.9)";
        setTimeout(() => {
          if (previewPopup) previewPopup.style.display = "none";
        }, 200); // Wait for transition to finish
      }, MOUSE_LEAVE_DELAY);
    }
  }

  function wrapTextNodes(element) {
    if (
      !element ||
      (typeof element.nodeName === "string" &&
        [
          "SCRIPT",
          "STYLE",
          "NOSCRIPT",
          "IFRAME",
          "TEXTAREA",
          "BUTTON",
        ].includes(element.nodeName))
    ) {
      return;
    }

    // Process child nodes first
    if (element.childNodes && element.childNodes.length > 0) {
      // Create a static copy of childNodes to iterate over
      const children = Array.from(element.childNodes);
      children.forEach((child) => wrapTextNodes(child));
    }

    // Process the current node if it is a text node
    if (
      element.nodeType === Node.TEXT_NODE &&
      element.nodeValue.trim().length > 0
    ) {
      const text = element.nodeValue;
      if (linkRegex.test(text)) {
        const fragment = document.createDocumentFragment();
        let lastIndex = 0;

        text.replace(linkRegex, (match, p1, offset) => {
          // Add text before the match
          if (offset > lastIndex) {
            fragment.appendChild(
              document.createTextNode(text.substring(lastIndex, offset))
            );
          }

          // Create and add the styled anchor
          const anchor = document.createElement("a");
          anchor.href = "https://carlosdiniz.vercel.app";
          anchor.target = "_blank";
          anchor.textContent = match;
          anchor.style.color = "#8A2BE2";
          anchor.style.textDecoration = "underline";
          anchor.style.cursor = "pointer";

          anchor.addEventListener("mouseenter", showPreview);
          anchor.addEventListener("mousemove", showPreview);
          anchor.addEventListener("mouseleave", hidePreview);

          fragment.appendChild(anchor);

          lastIndex = offset + match.length;
        });

        // Add any remaining text
        if (lastIndex < text.length) {
          fragment.appendChild(
            document.createTextNode(text.substring(lastIndex))
          );
        }

        // Replace the original text node with the new fragment
        if (element.parentNode) {
          element.parentNode.replaceChild(fragment, element);
        }
      }
    }
  }

  // Initial scan of the document
  wrapTextNodes(document.body);

  // Use MutationObserver to watch for dynamic content changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        wrapTextNodes(node);
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
