

/**
 * Attaches a tooltip behavior to a given DOM element.
 * When the element is hovered over, a tooltip with the specified content is displayed.
 * The tooltip is automatically positioned below the element.
 *
 * @param {HTMLElement} $element - The DOM element to which the tooltip behavior is added.
*/
export const Tooltip = function ($element) {
  let $tooltip = null;
  let tooltipTimeout = null;

  function createTooltip() {
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);

      console
    }

    tooltipTimeout = setTimeout(() => {
      if (!$tooltip) {
        $tooltip = document.createElement('div');
        $tooltip.classList.add('tooltip', 'text-body-small');

        if ($element.classList.contains('new-notebook-btn')) {
          $tooltip.classList.add('new-notebook-tooltip');
        }

        const mainText = document.createElement('span');
        mainText.textContent = $element.dataset.tooltip;
        mainText.classList.add('tooltip-main-text');
        $tooltip.appendChild(mainText);

        const {
          top,
          left,
          height,
          width
        } = $element.getBoundingClientRect();

        // Calculate the scroll offsets
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

        // Adjust the tooltip position by adding scroll offsets
        $tooltip.style.top = `${top + height + 4 + scrollTop}px`;
        $tooltip.style.left = `${left + (width / 2) + scrollLeft}px`;
        $tooltip.style.transform = 'translate(-50%, 2px)';

        document.body.appendChild($tooltip);

        // Force a reflow before adding the 'show' class
        $tooltip.offsetHeight;
      }

      // Add the 'show' class to trigger the transition
      $tooltip.classList.add('show');
    }, 500); // Reduced delay to 500ms for a quicker response
  }

  function removeTooltip() {
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      tooltipTimeout = null;
    }
    if ($tooltip) {
      $tooltip.classList.remove('show');
      setTimeout(() => {
        if ($tooltip) {
          $tooltip.remove();
          $tooltip = null;
        }
      }, 300);
    }
  }

  $element.addEventListener('mouseenter', createTooltip);
  $element.addEventListener('mouseleave', removeTooltip);
}


