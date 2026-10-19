(() => {
  'use strict';

  const dialog = document.querySelector('#image-dialog');
  const dialogImage = document.querySelector('#dialog-image');
  const dialogCaption = document.querySelector('#image-caption');
  const dialogClose = document.querySelector('#image-close');
  let lastImageButton;

  document.querySelectorAll('[data-lightbox]').forEach(button => {
    button.addEventListener('click', () => {
      lastImageButton = button;
      dialogImage.src = button.dataset.lightbox;
      dialogImage.alt = button.querySelector('img').alt;
      dialogCaption.textContent = button.dataset.caption;
      dialog.showModal();
      dialogClose.focus();
    });
  });
  dialogClose.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    }
  });
  dialog.addEventListener('close', () => lastImageButton?.focus());

  document.querySelector('#print-report').addEventListener('click', () => window.print());

  const storageKey = 'mk-ahot-review-notes-v1';
  const reviewToggle = document.querySelector('#review-toggle');
  const reviewPanel = document.querySelector('#review-panel');
  const reviewClose = document.querySelector('#review-close');
  const sectionSelect = document.querySelector('#review-section');
  const textarea = document.querySelector('#review-notes');
  const status = document.querySelector('#review-status');
  let notes = {};
  let storageAvailable = true;
  try {
    const existing = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (existing && typeof existing === 'object' && !Array.isArray(existing)) notes = existing;
  } catch {
    storageAvailable = false;
    status.textContent = 'Export to keep your notes';
  }
  function saveCurrentNote() {
    notes[sectionSelect.value] = textarea.value;
    try {
      localStorage.setItem(storageKey, JSON.stringify(notes));
      storageAvailable = true;
      status.textContent = 'Saved locally';
    } catch {
      storageAvailable = false;
      status.textContent = 'Export to keep your notes';
    }
  }
  function openReview() {
    reviewPanel.hidden = false;
    reviewToggle.setAttribute('aria-expanded', 'true');
    textarea.value = notes[sectionSelect.value] || '';
    if (!storageAvailable) status.textContent = 'Export to keep your notes';
    textarea.focus();
  }
  function closeReview() {
    reviewPanel.hidden = true;
    reviewToggle.setAttribute('aria-expanded', 'false');
    reviewToggle.focus();
  }
  reviewToggle.addEventListener('click', () => reviewPanel.hidden ? openReview() : closeReview());
  reviewClose.addEventListener('click', closeReview);
  reviewPanel.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeReview();
    }
  });
  textarea.addEventListener('input', saveCurrentNote);
  sectionSelect.addEventListener('change', () => {
    textarea.value = notes[sectionSelect.value] || '';
    status.textContent = storageAvailable ? 'Saved locally' : 'Export to keep your notes';
    textarea.focus();
  });
  document.querySelector('#export-notes').addEventListener('click', () => {
    saveCurrentNote();
    const date = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'Europe/London' }).format(new Date());
    let content = `AHOT COMPETENCE REPORT — REVIEW NOTES\nMichal Kowalczyk\nExported ${date}\n\n`;
    [...sectionSelect.options].forEach(option => {
      const note = typeof notes[option.value] === 'string' ? notes[option.value].trim() : '';
      if (note) content += `${option.text.toUpperCase()}\n${note}\n\n`;
    });
    if (![...sectionSelect.options].some(option => notes[option.value]?.trim())) content += 'No notes added yet.\n';
    const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ahot-review-notes.txt';
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  document.querySelector('#copy-email').addEventListener('click', async event => {
    const button = event.currentTarget;
    try {
      const response = await fetch('tutor-email.txt');
      if (!response.ok) throw new Error('Email draft unavailable');
      const email = await response.text();
      await navigator.clipboard.writeText(email);
      button.textContent = 'Email draft copied';
      setTimeout(() => { button.textContent = 'Copy email draft'; }, 2500);
    } catch {
      button.textContent = 'Open email draft to copy';
      window.open('tutor-email.txt', '_blank', 'noopener');
    }
  });

})();
