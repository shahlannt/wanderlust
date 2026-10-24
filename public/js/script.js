(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

/////////////////////////////////////////////////////////////////////


let taxSwitch = document.getElementById("switchCheckChecked");
if (taxSwitch) {
  const listingPrices = document.querySelectorAll(".listing-price");
  const taxInfo = document.getElementsByClassName("tax-info");
  const taxRate = Number(taxSwitch.dataset.taxRate);
  const priceFormatter = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  });

  function updateListingPrices() {
    for (const price of listingPrices) {
      const basePrice = Number(price.dataset.basePrice);
      const displayedPrice = taxSwitch.checked ? Math.round(basePrice * (1 + taxRate)) : basePrice;
      price.textContent = priceFormatter.format(displayedPrice);
    }

    for (const info of taxInfo) {
      info.style.display = taxSwitch.checked ? "inline" : "none";
    }
  }

  taxSwitch.addEventListener("change", () => {
    updateListingPrices();
  });
  updateListingPrices();
}

const filterRow = document.getElementById("filter-row");
if (filterRow) {
  const filterTray = document.getElementById("filter-tray");
  const moreFilters = document.getElementById("filter-more");
  const taxToggle = filterRow.querySelector(".tax-toggle");
  const filterOptions = Array.from(filterRow.querySelectorAll(".filter"));
  let trayOpen = false;

  function fitFilters() {
    filterOptions.forEach((filter) => filterRow.insertBefore(filter, taxToggle));
    moreFilters.hidden = false;

    const availableWidth = filterRow.clientWidth;
    const gap = parseFloat(getComputedStyle(filterRow).columnGap) || 0;
    const fixedWidth = taxToggle.getBoundingClientRect().width;
    const moreWidth = moreFilters.getBoundingClientRect().width;
    let usedWidth = fixedWidth;
    let visibleCount = 0;

    for (const filter of filterOptions) {
      const filterWidth = filter.getBoundingClientRect().width;
      const nextGapCount = visibleCount + 1;
      const needsMoreButton = visibleCount + 1 < filterOptions.length;
      const requiredWidth = usedWidth + filterWidth + gap * nextGapCount +
        (needsMoreButton ? moreWidth + gap : 0);

      if (requiredWidth > availableWidth) break;

      usedWidth += filterWidth;
      visibleCount += 1;
    }

    const overflowOptions = filterOptions.slice(visibleCount);
    overflowOptions.forEach((filter) => filterTray.appendChild(filter));
    if (overflowOptions.length === 0) trayOpen = false;
    moreFilters.hidden = overflowOptions.length === 0;
    filterTray.hidden = overflowOptions.length === 0 || !trayOpen;
    moreFilters.setAttribute("aria-expanded", String(trayOpen && overflowOptions.length > 0));
  }

  moreFilters.addEventListener("click", () => {
    trayOpen = !trayOpen;
    fitFilters();
  });

  const filterResizeObserver = new ResizeObserver(fitFilters);
  filterResizeObserver.observe(filterRow);
  window.addEventListener("load", fitFilters);
}