"use client";

import { useEffect } from "react";
import { trackUiInteraction } from "@/lib/analytics";

const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button",
  "summary",
  "input:not([type='hidden'])",
  "select",
  "textarea",
  "[role='button']",
].join(",");

function normalizeLabel(value: string | null | undefined, fallback: string): string {
  const normalized = value
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 80);

  return normalized || fallback;
}

function normalizeTool(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "_")
    .slice(0, 80) || "unknown";
}

function findInteractiveElement(target: EventTarget | null): HTMLElement | null {
  return target instanceof Element
    ? target.closest<HTMLElement>(INTERACTIVE_SELECTOR)
    : null;
}

function getArea(element: HTMLElement): string {
  const explicitArea = element.closest<HTMLElement>("[data-analytics-area]")?.dataset.analyticsArea;
  if (explicitArea) return normalizeLabel(explicitArea, "main");

  if (element.closest("header")) return "header";
  if (element.closest("footer")) return "footer";

  const section = element.closest<HTMLElement>("section");
  if (section) {
    if (section.id) return normalizeLabel(section.id, "section");
    const heading = section.querySelector<HTMLElement>("h1, h2, h3");
    if (heading?.textContent) return normalizeLabel(heading.textContent, "section");
  }

  if (element.closest("article")) return "article";
  if (element.closest("nav")) return "navigation";
  return "main";
}

function getElementType(element: HTMLElement): string {
  if (element instanceof HTMLInputElement) return `input_${element.type || "text"}`;
  return element.getAttribute("role") || element.tagName.toLowerCase();
}

function getLinkDetails(element: HTMLElement): { link_path?: string; link_domain?: string } {
  if (!(element instanceof HTMLAnchorElement)) return {};

  try {
    const url = new URL(element.href, window.location.origin);
    if (!["http:", "https:"].includes(url.protocol)) {
      return { link_domain: url.protocol.replace(":", "") };
    }
    return {
      link_path: url.pathname,
      link_domain: url.hostname,
    };
  } catch {
    return {};
  }
}

function getControl(element: HTMLElement): string {
  const explicitControl = element.dataset.analyticsControl;
  if (explicitControl) return normalizeLabel(explicitControl, "control");

  if (element instanceof HTMLAnchorElement) {
    const { link_path, link_domain } = getLinkDetails(element);
    if (link_domain && link_domain !== window.location.hostname) {
      return normalizeLabel(`external_${link_domain}`, "external_link");
    }
    return normalizeLabel(`link_${link_path || "home"}`, "internal_link");
  }

  const stableLabel =
    element.getAttribute("aria-label") ||
    element.getAttribute("name") ||
    element.id ||
    element.getAttribute("title") ||
    element.textContent;

  return normalizeLabel(stableLabel, getElementType(element));
}

function getTool(element: HTMLElement): string | undefined {
  const explicitTool = element.closest<HTMLElement>("[data-analytics-tool]")?.dataset.analyticsTool;
  if (explicitTool) return normalizeTool(explicitTool);

  const match = window.location.pathname.match(/^\/tools\/([^/]+)/);
  return match ? normalizeTool(match[1]) : undefined;
}

function sendInteraction(element: HTMLElement, interactionType: "click" | "change") {
  if (element.closest("[data-analytics-ignore]")) return;

  trackUiInteraction({
    interaction_type: interactionType,
    ui_area: getArea(element),
    ui_control: getControl(element),
    element_type: getElementType(element),
    tool: getTool(element),
    ...getLinkDetails(element),
  });
}

export function InteractionTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const element = findInteractiveElement(event.target);
      if (element) sendInteraction(element, "click");
    };

    const handleChange = (event: Event) => {
      const element = findInteractiveElement(event.target);
      if (!element) return;

      const shouldTrackChange =
        element instanceof HTMLSelectElement ||
        (element instanceof HTMLInputElement &&
          ["checkbox", "radio", "range"].includes(element.type));

      if (shouldTrackChange) sendInteraction(element, "change");
    };

    document.addEventListener("click", handleClick, true);
    document.addEventListener("change", handleChange, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("change", handleChange, true);
    };
  }, []);

  return null;
}
