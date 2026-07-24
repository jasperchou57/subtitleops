'use client';

import { useEffect } from 'react';
import { toAnalyticsId, trackUiInteraction } from '@/lib/analytics';

const TRACKED_ELEMENT_SELECTOR = [
  '[data-analytics-id]',
  '[data-analytics-control]',
  'a[href]',
  'button',
  '[role="button"]',
  "input:not([type='hidden'])",
  'select',
  'textarea',
  'summary',
].join(',');

export function InteractionTracker() {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (!(event.target instanceof Element)) return;

      const element = event.target.closest<HTMLElement>(
        TRACKED_ELEMENT_SELECTOR
      );
      if (!element || element.closest('[data-analytics-ignore]')) return;
      if (element instanceof HTMLLabelElement && element.htmlFor) return;

      const uiArea = getUiArea(element);
      const linkDetails = getLinkDetails(element);
      const elementType = getElementType(element);
      const elementId =
        getExplicitElementId(element) ??
        linkDetails.elementId ??
        getControlElementId(element, uiArea, elementType);

      trackUiInteraction({
        element_id: elementId,
        element_type: elementType,
        ui_area: uiArea,
        page_path: window.location.pathname,
        destination_path: linkDetails.destinationPath,
        link_domain: linkDetails.linkDomain,
      });
    }

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return null;
}

function getUiArea(element: HTMLElement): string {
  const explicitArea = element.closest<HTMLElement>('[data-analytics-area]')
    ?.dataset.analyticsArea;
  if (explicitArea) return toAnalyticsId(explicitArea);

  if (element.closest('[role="dialog"]')) return 'dialog';
  if (element.closest('header')) return 'header';
  if (element.closest('footer')) return 'footer';
  if (element.closest('nav')) return 'navigation';
  if (element.closest('form')) return 'form';
  if (element.closest('main')) return 'main';
  return 'page';
}

function getElementType(element: HTMLElement): string {
  if (element instanceof HTMLAnchorElement) return 'link';
  if (element instanceof HTMLButtonElement) return 'button';
  if (element instanceof HTMLInputElement) {
    return `${toAnalyticsId(element.type || 'text')}_input`;
  }
  return toAnalyticsId(element.tagName) || 'control';
}

function getExplicitElementId(element: HTMLElement): string | undefined {
  const explicitId =
    element.dataset.analyticsId || element.dataset.analyticsControl;
  if (explicitId) return toAnalyticsId(explicitId);

  if (element instanceof HTMLInputElement) {
    const labelId = Array.from(element.labels ?? []).find(
      (label) => label.dataset.analyticsId || label.dataset.analyticsControl
    );
    const explicitLabelId =
      labelId?.dataset.analyticsId || labelId?.dataset.analyticsControl;
    if (explicitLabelId) return toAnalyticsId(explicitLabelId);
  }

  return undefined;
}

function getControlElementId(
  element: HTMLElement,
  uiArea: string,
  elementType: string
): string {
  const stableId = element.id || element.getAttribute('name');
  const isGeneratedId =
    stableId?.startsWith(':') || stableId?.startsWith('base-ui-');
  if (stableId && !isGeneratedId) {
    const normalizedId = toAnalyticsId(stableId);
    if (normalizedId) return normalizedId;
  }

  const controlledElement = element.getAttribute('for');
  if (controlledElement) {
    return `label_${toAnalyticsId(controlledElement)}`;
  }

  const buttonType = element.getAttribute('type');
  if (buttonType === 'submit') return `${uiArea}_submit`;

  const boundary =
    element.closest<HTMLElement>(
      '[data-analytics-area],[role="dialog"],header,footer,nav,form,main'
    ) ?? document.body;
  const controls = Array.from(
    boundary.querySelectorAll<HTMLElement>(TRACKED_ELEMENT_SELECTOR)
  );
  const position = controls.indexOf(element);

  return position >= 0
    ? `${uiArea}_${elementType}_${position + 1}`
    : `${uiArea}_${elementType}`;
}

function getLinkDetails(element: HTMLElement): {
  destinationPath?: string;
  elementId?: string;
  linkDomain?: string;
} {
  if (!(element instanceof HTMLAnchorElement)) return {};

  const url = new URL(element.href, window.location.href);
  if (url.origin === window.location.origin) {
    const safeHash = /^#[a-z0-9_-]+$/i.test(url.hash) ? url.hash : '';
    const destinationPath = `${url.pathname}${safeHash}`;
    return {
      destinationPath,
      elementId: `navigate_${toAnalyticsId(destinationPath) || 'home'}`,
    };
  }

  return {
    elementId: `outbound_${toAnalyticsId(url.hostname)}`,
    linkDomain: url.hostname.slice(0, 100),
  };
}
