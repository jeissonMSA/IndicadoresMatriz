import React, { useEffect } from "react";
import { useLocation } from "@docusaurus/router";

// Helper functions
const cleanupPreviousModifications = (): void => {
  // Remove previous toggle headers de manera segura
  document.querySelectorAll(".toggle-header").forEach((header) => {
    if (header.parentNode) {
      const text = header.textContent;
      const textNode = document.createTextNode(text || "");
      header.replaceWith(textNode); // Usamos replaceWith que es más moderno y seguro
    }
  });

  // Reset classes
  document.querySelectorAll("li.has-children").forEach((li) => {
    li.classList.remove("has-children", "open");
  });

  document.querySelectorAll("ul.toggle-list").forEach((ul) => {
    ul.classList.remove("toggle-list");
  });
};

const processToggleList = (ulElement: HTMLUListElement): void => {
  ulElement.classList.add("toggle-list");

  ulElement.querySelectorAll("li").forEach((li) => {
    const subUl = li.querySelector(":scope > ul");
    if (subUl) {
      li.classList.add("has-children");

      // Create wrapper for the toggle header
      const wrapper = document.createElement("div");
      wrapper.className = "toggle-header";

      // Movemos solo los nodos que no son el subUl
      const children = Array.from(li.childNodes);
      for (const child of children) {
        if (child !== subUl && child.parentNode === li) {
          // Verificamos que el nodo todavía pertenece al li
          if (
            child.nodeType === Node.ELEMENT_NODE ||
            (child.nodeType === Node.TEXT_NODE && child.textContent?.trim())
          ) {
            wrapper.appendChild(child);
          }
        }
      }

      // Insertamos el wrapper solo si tiene contenido y si subUl todavía está en el li
      if (wrapper.childNodes.length > 0 && li.contains(subUl)) {
        li.insertBefore(wrapper, subUl);
      }

      wrapper.addEventListener("click", () => {
        li.classList.toggle("open");
      });
    }
  });
};

const enhanceToggledSections = (): void => {
  try {
    cleanupPreviousModifications();

    document.querySelectorAll("[data-toggle-list]").forEach((marker) => {
      let el: Element | null = marker.nextElementSibling;
      while (el && !/^H[2-6]$/i.test(el.tagName)) {
        if (el.tagName === "UL") {
          processToggleList(el as HTMLUListElement);
        }
        el = el.nextElementSibling;
      }
    });
  } catch (error) {
    console.error("Error in enhanceToggledSections:", error);
  }
};

// Props type definition
interface RootProps {
  children: React.ReactNode;
}

// Main component
const Root: React.FC<RootProps> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      enhanceToggledSections();
    }, 100); // Pequeño delay para asegurar que el DOM está listo

    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return <>{children}</>;
};

export default Root;
