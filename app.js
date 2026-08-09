/**
 * Application Controller - DSE CAP Round II Vacancy Portal
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let rawData = window.VACANCIES_DATA || [];
  let filteredData = [];
  let currentPage = 1;
  let pageSize = 24;
  let viewMode = 'grid';
  let activeBranchPill = 'all';

  // UI Element Selectors
  const statTotalSeats = document.getElementById('stat-total-seats');
  const statTotalColleges = document.getElementById('stat-total-colleges');
  const statCsSeats = document.getElementById('stat-cs-seats');
  const statEwsSeats = document.getElementById('stat-ews-seats');

  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const regionSelect = document.getElementById('region-select');
  const statusSelect = document.getElementById('status-select');
  const availabilitySelect = document.getElementById('availability-select');
  const sortSelect = document.getElementById('sort-select');
  const branchPillsContainer = document.getElementById('branch-pills');

  const resultsCount = document.getElementById('results-count');
  const gridViewBtn = document.getElementById('grid-view-btn');
  const tableViewBtn = document.getElementById('table-view-btn');
  
  const cardsViewContainer = document.getElementById('cards-view');
  const tableViewContainer = document.getElementById('table-view');
  const tableBody = document.getElementById('table-body');
  const emptyState = document.getElementById('empty-state');

  const prevPageBtn = document.getElementById('prev-page-btn');
  const nextPageBtn = document.getElementById('next-page-btn');
  const pageInfo = document.getElementById('page-info');
  const pageSizeSelect = document.getElementById('page-size-select');
  const exportCsvBtn = document.getElementById('export-csv-btn');

  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalClose = document.getElementById('modal-close');
  const modalBody = document.getElementById('modal-body');

  // Theme Toggle
  const savedTheme = localStorage.getItem('dse_portal_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('dse_portal_theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    themeToggleBtn.innerHTML = theme === 'light' ? '🌙' : '☀️';
    themeToggleBtn.title = `Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`;
  }

  // Initialize Data
  function init() {
    if (!rawData || rawData.length === 0) {
      // Try fetching vacancies.json as fallback
      fetch('vacancies.json')
        .then(res => res.json())
        .then(data => {
          rawData = data;
          setupApp();
        })
        .catch(err => {
          console.error("Failed to load vacancies data:", err);
        });
    } else {
      setupApp();
    }
  }

  function setupApp() {
    populateRegionDropdown();
    computeStats();
    applyFilters();
    setupEventListeners();
  }

  function computeStats() {
    let totalSeats = 0;
    let totalEws = 0;
    let csSeats = 0;
    const institutesSet = new Set();

    const csKeywords = ['computer', 'information technology', 'artificial intelligence', 'data science', 'cyber', 'software', 'machine learning', 'robotics', 'iot'];

    rawData.forEach(item => {
      totalSeats += (item['Total Vacant Seats'] || 0);
      totalEws += (item['EWS Seats'] || 0);
      institutesSet.add(item['Institute Code']);

      const cName = (item['Course Name'] || '').toLowerCase();
      if (csKeywords.some(kw => cName.includes(kw))) {
        csSeats += (item['Total Vacant Seats'] || 0);
      }
    });

    statTotalSeats.textContent = totalSeats.toLocaleString();
    statTotalColleges.textContent = institutesSet.size;
    statCsSeats.textContent = csSeats.toLocaleString();
    statEwsSeats.textContent = totalEws.toLocaleString();
  }

  function populateRegionDropdown() {
    const regions = new Set();
    rawData.forEach(item => {
      if (item['City / Region']) {
        regions.add(item['City / Region']);
      }
    });

    const sortedRegions = Array.from(regions).sort();
    sortedRegions.forEach(reg => {
      const opt = document.createElement('option');
      opt.value = reg;
      opt.textContent = reg;
      regionSelect.appendChild(opt);
    });
  }

  // Filter & Search Logic
  function applyFilters() {
    const searchVal = searchInput.value.trim().toLowerCase();
    clearSearchBtn.style.display = searchVal ? 'block' : 'none';

    const selectedRegion = regionSelect.value;
    const selectedStatus = statusSelect.value;
    const selectedAvailability = availabilitySelect.value;
    const selectedSort = sortSelect.value;

    const csKeywords = ['computer', 'information technology', 'artificial intelligence', 'data science', 'cyber', 'software', 'machine learning'];
    const entcKeywords = ['electronics', 'telecommunication', 'entc', 'communication'];
    const mechKeywords = ['mechanical', 'automobile', 'mechatronics'];
    const civilKeywords = ['civil', 'construction', 'structural'];
    const elecKeywords = ['electrical', 'power'];
    const chemKeywords = ['chemical', 'petrochemical', 'oil', 'paint', 'plastic'];

    filteredData = rawData.filter(item => {
      // 1. Text Search (Institute, Course, Code, Region)
      if (searchVal) {
        const matchesSearch = 
          (item['Institute Name'] || '').toLowerCase().includes(searchVal) ||
          (item['Course Name'] || '').toLowerCase().includes(searchVal) ||
          (item['Institute Code'] || '').toString().toLowerCase().includes(searchVal) ||
          (item['Choice Code'] || '').toString().toLowerCase().includes(searchVal) ||
          (item['City / Region'] || '').toLowerCase().includes(searchVal);

        if (!matchesSearch) return false;
      }

      // 2. Region Filter
      if (selectedRegion !== 'all' && item['City / Region'] !== selectedRegion) {
        return false;
      }

      // 3. Status Filter
      if (selectedStatus !== 'all') {
        const statusStr = (item['Status'] || '').toLowerCase();
        if (selectedStatus === 'government' && !statusStr.includes('government')) return false;
        if (selectedStatus === 'autonomous' && !statusStr.includes('autonomous')) return false;
        if (selectedStatus === 'unaided' && !statusStr.includes('un-aided')) return false;
        if (selectedStatus === 'minority' && !statusStr.includes('minority')) return false;
      }

      // 4. Availability Filter
      if (selectedAvailability === 'available' && (item['Total Vacant Seats'] || 0) <= 0) return false;
      if (selectedAvailability === 'ews' && (item['EWS Seats'] || 0) <= 0) return false;
      if (selectedAvailability === 'orphan' && (item['Orphan Total'] || 0) <= 0) return false;
      if (selectedAvailability === 'minority' && ((item['Minority (G)'] || 0) + (item['Minority (L)'] || 0)) <= 0) return false;

      // 5. Branch Quick Filter Pill
      if (activeBranchPill !== 'all') {
        const cName = (item['Course Name'] || '').toLowerCase();
        if (activeBranchPill === 'cs' && !csKeywords.some(kw => cName.includes(kw))) return false;
        if (activeBranchPill === 'entc' && !entcKeywords.some(kw => cName.includes(kw))) return false;
        if (activeBranchPill === 'mech' && !mechKeywords.some(kw => cName.includes(kw))) return false;
        if (activeBranchPill === 'civil' && !civilKeywords.some(kw => cName.includes(kw))) return false;
        if (activeBranchPill === 'elec' && !elecKeywords.some(kw => cName.includes(kw))) return false;
        if (activeBranchPill === 'chem' && !chemKeywords.some(kw => cName.includes(kw))) return false;
      }

      return true;
    });

    // Sort Logic
    filteredData.sort((a, b) => {
      if (selectedSort === 'seats-desc') return (b['Total Vacant Seats'] || 0) - (a['Total Vacant Seats'] || 0);
      if (selectedSort === 'seats-asc') return (a['Total Vacant Seats'] || 0) - (b['Total Vacant Seats'] || 0);
      if (selectedSort === 'code-asc') return (a['Choice Code'] || '').toString().localeCompare((b['Choice Code'] || '').toString());
      if (selectedSort === 'inst-asc') return (a['Institute Name'] || '').localeCompare(b['Institute Name'] || '');
      return 0;
    });

    currentPage = 1;
    renderResults();
  }

  // Render View
  function renderResults() {
    resultsCount.innerHTML = `Showing <span>${filteredData.length.toLocaleString()}</span> courses`;

    if (filteredData.length === 0) {
      cardsViewContainer.style.display = 'none';
      tableViewContainer.style.display = 'none';
      emptyState.style.display = 'block';
      updatePaginationControls(0);
      return;
    }

    emptyState.style.display = 'none';

    const startIdx = (currentPage - 1) * pageSize;
    const pageItems = filteredData.slice(startIdx, startIdx + pageSize);

    if (viewMode === 'grid') {
      cardsViewContainer.style.display = 'grid';
      tableViewContainer.style.display = 'none';
      renderGridCards(pageItems);
    } else {
      cardsViewContainer.style.display = 'none';
      tableViewContainer.style.display = 'block';
      renderTableRows(pageItems);
    }

    updatePaginationControls(filteredData.length);
  }

  function renderGridCards(items) {
    cardsViewContainer.innerHTML = '';
    items.forEach((item, idx) => {
      const isVacant = (item['Total Vacant Seats'] || 0) > 0;
      const card = document.createElement('div');
      card.className = `course-card ${isVacant ? 'available' : ''}`;

      card.innerHTML = `
        <div>
          <div class="card-header">
            <div>
              <span class="inst-code-badge">Inst Code: ${item['Institute Code']}</span>
              <div class="inst-name">${item['Institute Name']}</div>
            </div>
          </div>
          <div style="margin: 0.75rem 0;">
            <div class="course-title">${item['Course Name']}</div>
            <span class="status-tag">${item['Status']}</span>
          </div>
          <div class="choice-code-wrapper">
            <span style="font-size: 0.75rem; color: var(--text-dim); font-weight: 600;">CHOICE CODE:</span>
            <span class="choice-code-val">${item['Choice Code']}</span>
            <button class="copy-btn" title="Copy Choice Code" onclick="copyChoiceCode('${item['Choice Code']}')">📋</button>
          </div>
          <div class="seat-badges-row">
            <div class="seat-pill total-seats ${isVacant ? '' : 'zero'}">
              <span>Vacant:</span> <strong>${item['Total Vacant Seats']}</strong>
            </div>
            <div class="seat-pill ews-seats ${(item['EWS Seats'] || 0) > 0 ? '' : 'zero'}">
              <span>EWS:</span> <strong>${item['EWS Seats']}</strong>
            </div>
            ${(item['Orphan Total'] || 0) > 0 ? `<div class="seat-pill"><span>Orphan:</span> <strong>${item['Orphan Total']}</strong></div>` : ''}
          </div>
        </div>
        <div class="card-footer">
          <div class="location-tag">📍 ${item['City / Region']}</div>
          <button class="view-details-btn" onclick="openDetailsModal(${item['Sr No'] - 1})">Seat Matrix 📊</button>
        </div>
      `;

      cardsViewContainer.appendChild(card);
    });
  }

  function renderTableRows(items) {
    tableBody.innerHTML = '';
    items.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><strong>${item['Institute Code']}</strong></td>
        <td>${item['Institute Name']}</td>
        <td><span style="font-family: monospace; font-weight: 700; color: var(--cyan);">${item['Choice Code']}</span> <button class="copy-btn" onclick="copyChoiceCode('${item['Choice Code']}')">📋</button></td>
        <td><strong>${item['Course Name']}</strong></td>
        <td>${item['City / Region']}</td>
        <td><span class="seat-pill total-seats">${item['Total Vacant Seats']}</span></td>
        <td><span class="seat-pill ews-seats">${item['EWS Seats']}</span></td>
        <td><button class="view-details-btn" onclick="openDetailsModal(${item['Sr No'] - 1})">Details</button></td>
      `;
      tableBody.appendChild(tr);
    });
  }

  function updatePaginationControls(totalItems) {
    const totalPages = Math.ceil(totalItems / pageSize) || 1;
    pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
  }

  // Copy Choice Code
  window.copyChoiceCode = function(code) {
    navigator.clipboard.writeText(code).then(() => {
      showToast(`Choice Code ${code} copied to clipboard! 📋`);
    }).catch(err => {
      console.error('Failed to copy code:', err);
    });
  };

  // Toast Notification
  function showToast(msg) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>✨</span> <span>${msg}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // Seat Matrix Modal
  window.openDetailsModal = function(itemIndex) {
    const item = rawData[itemIndex];
    if (!item) return;

    const categories = [
      { name: 'OPEN', g: item['OPEN (G)'], l: item['OPEN (L)'] },
      { name: 'SC', g: item['SC (G)'], l: item['SC (L)'] },
      { name: 'ST', g: item['ST (G)'], l: item['ST (L)'] },
      { name: 'VJ/DT', g: item['VJ/DT (G)'], l: item['VJ/DT (L)'] },
      { name: 'NTB', g: item['NTB (G)'], l: item['NTB (L)'] },
      { name: 'NTC', g: item['NTC (G)'], l: item['NTC (L)'] },
      { name: 'NTD', g: item['NTD (G)'], l: item['NTD (L)'] },
      { name: 'OBC', g: item['OBC (G)'], l: item['OBC (L)'] },
      { name: 'SEBC', g: item['SEBC (G)'], l: item['SEBC (L)'] },
      { name: 'Minority', g: item['Minority (G)'], l: item['Minority (L)'] },
    ];

    modalBody.innerHTML = `
      <div style="margin-bottom: 1.25rem;">
        <span class="inst-code-badge">Inst Code: ${item['Institute Code']}</span>
        <h3 style="font-size: 1.2rem; font-weight: 700; margin-top: 0.4rem;">${item['Institute Name']}</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">📍 ${item['City / Region']} | Status: ${item['Status']}</p>
      </div>

      <div style="background: var(--bg-input); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem; display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: space-around;">
        <div><span style="color: var(--text-dim); font-size: 0.8rem;">CHOICE CODE</span><br><strong style="font-family: monospace; font-size: 1.1rem; color: var(--cyan);">${item['Choice Code']}</strong></div>
        <div><span style="color: var(--text-dim); font-size: 0.8rem;">TOTAL VACANT SEATS</span><br><strong style="font-size: 1.1rem; color: var(--success);">${item['Total Vacant Seats']}</strong></div>
        <div><span style="color: var(--text-dim); font-size: 0.8rem;">EWS SEATS</span><br><strong style="font-size: 1.1rem; color: var(--warning);">${item['EWS Seats']}</strong></div>
        <div><span style="color: var(--text-dim); font-size: 0.8rem;">ORPHAN SEATS</span><br><strong style="font-size: 1.1rem; color: var(--purple);">${item['Orphan Total']} (Inst: ${item['Orphan Inst']}, Non-Inst: ${item['Orphan Non-Inst']})</strong></div>
      </div>

      <h4 style="font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem;">Category Breakdown (G: General | L: Ladies)</h4>
      <div class="matrix-grid">
        ${categories.map(cat => `
          <div class="matrix-card">
            <div class="matrix-cat">${cat.name}</div>
            <div class="matrix-seats">
              <span class="g-seat">G: ${cat.g}</span>
              <span class="l-seat">L: ${cat.l}</span>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="margin-top: 1.25rem; display: flex; gap: 1.5rem; background: var(--bg-input); padding: 0.85rem; border-radius: var(--radius-md);">
        <div><strong>PWD Reserved:</strong> ${item['PWD Total Seats']} (Common: ${item['PWD Reserved Common']})</div>
        <div><strong>DEF Reserved:</strong> ${item['DEF Total Seats']} (Common: ${item['DEF Reserved Common']})</div>
      </div>
    `;

    modalOverlay.classList.add('active');
  };

  modalClose.addEventListener('click', () => modalOverlay.classList.remove('active'));
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('active');
  });

  // Export CSV
  exportCsvBtn.addEventListener('click', () => {
    if (filteredData.length === 0) {
      showToast('No data to export!');
      return;
    }

    const headers = Object.keys(filteredData[0]);
    const csvRows = [headers.join(',')];

    filteredData.forEach(row => {
      const values = headers.map(header => {
        const escaped = ('' + (row[header] || '')).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "DSE_CAP2_Vacancy_Filtered.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported filtered data to CSV! 📥');
  });

  // Event Listeners
  function setupEventListeners() {
    searchInput.addEventListener('input', applyFilters);
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      applyFilters();
    });

    regionSelect.addEventListener('change', applyFilters);
    statusSelect.addEventListener('change', applyFilters);
    availabilitySelect.addEventListener('change', applyFilters);
    sortSelect.addEventListener('change', applyFilters);

    branchPillsContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('pill-btn')) {
        document.querySelectorAll('.pill-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        activeBranchPill = e.target.getAttribute('data-branch');
        applyFilters();
      }
    });

    gridViewBtn.addEventListener('click', () => {
      viewMode = 'grid';
      gridViewBtn.classList.add('active');
      tableViewBtn.classList.remove('active');
      renderResults();
    });

    tableViewBtn.addEventListener('click', () => {
      viewMode = 'table';
      tableViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
      renderResults();
    });

    prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderResults();
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    });

    nextPageBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(filteredData.length / pageSize);
      if (currentPage < totalPages) {
        currentPage++;
        renderResults();
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
    });

    pageSizeSelect.addEventListener('change', (e) => {
      pageSize = parseInt(e.target.value);
      currentPage = 1;
      renderResults();
    });
  }

  // Start app
  init();
});
