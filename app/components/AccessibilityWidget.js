'use client';

import { useState, useEffect } from 'react';

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [grayscale, setGrayscale] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [keyboardNav, setKeyboardNav] = useState(false);
  const [fullAccess, setFullAccess] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Create a separate container for the accessibility widget
  useEffect(() => {
    // Create container if it doesn't exist
    let container = document.getElementById('accessibility-root');
    if (!container) {
      container = document.createElement('div');
      container.id = 'accessibility-root';
      document.body.appendChild(container);
    }

    // Create style element for the widget
    let styleElement = document.getElementById('accessibility-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'accessibility-styles';
      styleElement.innerHTML = `
        #accessibility-root {
          position: fixed;
          bottom: 24px;
          left: 16px;
          z-index: 9999999;
          font-family: system-ui, -apple-system, sans-serif;
          direction: rtl;
        }
        #accessibility-root * {
          box-sizing: border-box;
          font-family: inherit;
        }
        #accessibility-toggle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #3b82f6;
          color: #fff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          position: relative;
          z-index: 9999;
          animation: accessibilityPulse 2s infinite;
        }
        @keyframes accessibilityPulse {
          0% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
          }
        }
        #accessibility-menu {
          display: none;
          flex-direction: column;
          margin-top: 5px;
          background: #f9f9f9;
          border: 1px solid #000;
          border-radius: 5px;
          padding: 10px;
          min-width: 220px;
        }
        #accessibility-menu.open {
          display: flex;
        }
        #accessibility-menu button {
          display: flex;
          width: 100%;
          margin: 2px 0;
          padding: 8px 10px;
          text-align: right;
          font-size: 14px;
          cursor: pointer;
          background: #fff;
          color: #000;
          border: 1px solid #ccc;
          border-radius: 3px;
          align-items: center;
        }
        #accessibility-menu button:hover {
          background: #f0f0f0;
        }
        #accessibility-menu button svg {
          margin-left: 8px;
          flex-shrink: 0;
        }
        /* סימון כפתורים פעילים */
        #accessibility-menu button[aria-pressed="true"] {
          background: #333;
          color: #fff;
        }
        #accessibility-menu button[aria-pressed="true"] svg {
          color: #fff;
        }
        .text-size-control {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 2px 0;
          width: 100%;
        }
        .text-size-control button {
          width: auto !important;
          padding: 4px 8px !important;
          margin: 0 !important;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
        }
        .text-size-control span {
          font-size: 14px;
          margin: 0 8px;
        }
        .text-size-control .size-controls {
          display: flex;
          align-items: center;
        }

        /* מצב ניגודיות גבוהה */
        body.high-contrast, body.high-contrast *:not(#accessibility-root *) {
          background-color: #000 !important;
          color: #fff !important;
        }
        body.high-contrast a:not(#accessibility-root *), 
        body.high-contrast a:visited:not(#accessibility-root *) {
          color: #0ff !important;
          text-decoration: underline !important;
        }

        /* מצב גווני אפור */
        body.grayscale {
          filter: grayscale(100%);
        }
        /* Fix for position issues when grayscale is enabled */
        body.grayscale #accessibility-root {
          filter: none;
          position: fixed;
          bottom: 24px;
          left: 16px;
          z-index: 9999999;
        }

        /* הדגשת קישורים */
        body.highlight-links a:not(#accessibility-root *) {
          background-color: yellow !important;
          color: #000 !important;
          font-weight: bold;
          text-decoration: underline;
        }

        /* סימון פוקוס מודגש (במצב ניווט מקלדת) */
        body.keyboard-nav *:focus:not(#accessibility-root *) {
          outline: 3px solid red !important;
        }

        /* Modal Styles */
        #accessibility-modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          z-index: 99999;
          direction: rtl;
        }
        #accessibility-modal.open {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #accessibility-modal-content {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          position: relative;
        }
        #accessibility-modal-close {
          position: absolute;
          top: 10px;
          left: 10px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          padding: 5px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        #accessibility-modal-close:hover {
          background: #f0f0f0;
        }
        #accessibility-modal h2 {
          font-size: 24px;
          margin-bottom: 20px;
          color: #333;
        }
        #accessibility-modal p {
          margin-bottom: 15px;
          line-height: 1.6;
          color: #444;
        }
        #accessibility-modal strong {
          color: #333;
          font-weight: 600;
        }
        #accessibility-statement-btn {
          width: 100%;
          text-align: center;
          padding: 8px;
          margin-top: 10px;
          background: #f0f0f0;
          border: 1px solid #ccc;
          border-radius: 3px;
          cursor: pointer;
        }
        #accessibility-statement-btn:hover {
          background: #e0e0e0;
        }
      `;
      document.head.appendChild(styleElement);
    }

    // Cleanup function
    return () => {
      // We don't remove the container or styles on unmount
      // to ensure the widget persists across page navigations
    };
  }, []);

  // Apply accessibility settings when they change
  useEffect(() => {
    if (typeof document !== 'undefined') {
      // Font size - apply to html element to affect the entire site
      document.documentElement.style.fontSize = `${currentFontSize}%`;
      
      // High contrast
      if (highContrast) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
      
      // Grayscale
      if (grayscale) {
        document.body.classList.add('grayscale');
      } else {
        document.body.classList.remove('grayscale');
      }
      
      // Highlight links
      if (highlightLinks) {
        document.body.classList.add('highlight-links');
      } else {
        document.body.classList.remove('highlight-links');
      }
      
      // Keyboard navigation
      if (keyboardNav) {
        document.body.classList.add('keyboard-nav');
      } else {
        document.body.classList.remove('keyboard-nav');
      }
    }
  }, [currentFontSize, highContrast, grayscale, highlightLinks, keyboardNav]);

  // Load saved settings from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('accessibilitySettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setCurrentFontSize(settings.currentFontSize || 100);
        setHighContrast(settings.highContrast || false);
        setGrayscale(settings.grayscale || false);
        setHighlightLinks(settings.highlightLinks || false);
        setKeyboardNav(settings.keyboardNav || false);
        setFullAccess(settings.fullAccess || false);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessibilitySettings', JSON.stringify({
        currentFontSize,
        highContrast,
        grayscale,
        highlightLinks,
        keyboardNav,
        fullAccess
      }));
    }
  }, [currentFontSize, highContrast, grayscale, highlightLinks, keyboardNav, fullAccess]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Escape' || e.key === 'Esc') && isOpen) {
        setIsOpen(false);
        const toggleButton = document.getElementById('accessibility-toggle');
        if (toggleButton) toggleButton.focus();
      } else if (isOpen) {
        const menu = document.getElementById('accessibility-menu');
        if (!menu) return;
        
        const focusableItems = menu.querySelectorAll('button');
        const index = Array.prototype.indexOf.call(focusableItems, document.activeElement);
        
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (index < focusableItems.length - 1) {
            focusableItems[index + 1].focus();
          } else {
            focusableItems[0].focus();
          }
        }
        
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (index > 0) {
            focusableItems[index - 1].focus();
          } else {
            focusableItems[focusableItems.length - 1].focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Increase text size
  const increaseText = () => {
    if (currentFontSize < 200) {
      setCurrentFontSize(currentFontSize + 10);
    }
  };

  // Decrease text size
  const decreaseText = () => {
    if (currentFontSize > 100) {
      setCurrentFontSize(currentFontSize - 10);
    }
  };

  // Toggle high contrast
  const toggleHighContrast = () => {
    const newValue = !highContrast;
    setHighContrast(newValue);
    
    // Turn off grayscale if high contrast is enabled
    if (newValue && grayscale) {
      setGrayscale(false);
    }
  };

  // Toggle grayscale
  const toggleGrayscale = () => {
    const newValue = !grayscale;
    setGrayscale(newValue);
    
    // Turn off high contrast if grayscale is enabled
    if (newValue && highContrast) {
      setHighContrast(false);
    }
  };

  // Toggle highlight links
  const toggleHighlightLinks = () => {
    setHighlightLinks(!highlightLinks);
  };

  // Toggle keyboard navigation
  const toggleKeyboardNav = () => {
    setKeyboardNav(!keyboardNav);
  };

  // Toggle full accessibility
  const toggleFullAccess = () => {
    const newValue = !fullAccess;
    setFullAccess(newValue);
    
    if (newValue) {
      // Enable full accessibility mode
      setHighContrast(true);
      setHighlightLinks(true);
      setKeyboardNav(true);
      setCurrentFontSize(120);
    } else {
      // Disable full accessibility mode
      setHighContrast(false);
      setGrayscale(false);
      setHighlightLinks(false);
      setKeyboardNav(false);
      setCurrentFontSize(100);
    }
  };

  // Add modal close handler
  const closeModal = (e) => {
    if (e.target.id === 'accessibility-modal' || e.target.id === 'accessibility-modal-close') {
      setIsModalOpen(false);
    }
  };

  // Add keyboard handler for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  // Render the widget directly into the DOM
  useEffect(() => {
    const container = document.getElementById('accessibility-root');
    if (!container) return;

    // Create button element
    const renderToggleButton = () => {
      const button = document.createElement('button');
      button.id = 'accessibility-toggle';
      button.setAttribute('aria-controls', 'accessibility-menu');
      button.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      button.setAttribute('aria-label', 'פתח תפריט נגישות');
      
      // Accessibility icon SVG
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="16" cy="4" r="1"/><path d="m18 19 1-7-6 1"/><path d="m5 8 3-3 5 5-3 3"/><path d="M19.2 16.2a7 7 0 1 1-9.4-9.4"/></svg>`;
      
      button.onclick = () => {
        setIsOpen(!isOpen);
        
        // Focus first button when menu opens
        if (!isOpen) {
          setTimeout(() => {
            const textSizeControls = document.querySelector('.text-size-control');
            if (textSizeControls) {
              const firstButton = textSizeControls.querySelector('button:first-child');
              if (firstButton) firstButton.focus();
            }
          }, 10);
        }
      };
      return button;
    };

    // Create menu element
    const renderMenu = () => {
      const menu = document.createElement('div');
      menu.id = 'accessibility-menu';
      menu.className = isOpen ? 'open' : '';
      menu.setAttribute('role', 'region');
      menu.setAttribute('aria-label', 'תפריט נגישות');
      menu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      
      // Text size controls
      const textSizeControl = document.createElement('div');
      textSizeControl.className = 'text-size-control';
      
      // Text size label
      const textSizeLabel = document.createElement('span');
      textSizeLabel.textContent = 'גודל טקסט:';
      textSizeControl.appendChild(textSizeLabel);
      
      // Create a container for the size controls
      const sizeControls = document.createElement('div');
      sizeControls.className = 'size-controls';
      
      // Decrease text button
      const decreaseTextBtn = document.createElement('button');
      decreaseTextBtn.id = 'decrease-text';
      decreaseTextBtn.type = 'button';
      decreaseTextBtn.setAttribute('aria-label', 'הקטנת טקסט');
      decreaseTextBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
      decreaseTextBtn.onclick = decreaseText;
      sizeControls.appendChild(decreaseTextBtn);
      
      // Text size value
      const textSizeValue = document.createElement('span');
      textSizeValue.textContent = `${currentFontSize}%`;
      sizeControls.appendChild(textSizeValue);
      
      // Increase text button
      const increaseTextBtn = document.createElement('button');
      increaseTextBtn.id = 'increase-text';
      increaseTextBtn.type = 'button';
      increaseTextBtn.setAttribute('aria-label', 'הגדלת טקסט');
      increaseTextBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
      increaseTextBtn.onclick = increaseText;
      sizeControls.appendChild(increaseTextBtn);
      
      // Add the size controls to the text size control
      textSizeControl.appendChild(sizeControls);
      
      menu.appendChild(textSizeControl);
      
      // High contrast button
      const highContrastBtn = document.createElement('button');
      highContrastBtn.id = 'high-contrast-btn';
      highContrastBtn.type = 'button';
      highContrastBtn.setAttribute('aria-pressed', highContrast ? 'true' : 'false');
      highContrastBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2v20M2 12h20"></path></svg><span>ניגודיות גבוהה</span>`;
      highContrastBtn.onclick = toggleHighContrast;
      menu.appendChild(highContrastBtn);
      
      // Grayscale button
      const grayscaleBtn = document.createElement('button');
      grayscaleBtn.id = 'grayscale-btn';
      grayscaleBtn.type = 'button';
      grayscaleBtn.setAttribute('aria-pressed', grayscale ? 'true' : 'false');
      grayscaleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg><span>גווני אפור</span>`;
      grayscaleBtn.onclick = toggleGrayscale;
      menu.appendChild(grayscaleBtn);
      
      // Highlight links button
      const highlightLinksBtn = document.createElement('button');
      highlightLinksBtn.id = 'highlight-links-btn';
      highlightLinksBtn.type = 'button';
      highlightLinksBtn.setAttribute('aria-pressed', highlightLinks ? 'true' : 'false');
      highlightLinksBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg><span>הדגשת קישורים</span>`;
      highlightLinksBtn.onclick = toggleHighlightLinks;
      menu.appendChild(highlightLinksBtn);
      
      // Keyboard navigation button
      const keyboardNavBtn = document.createElement('button');
      keyboardNavBtn.id = 'keyboard-nav-btn';
      keyboardNavBtn.type = 'button';
      keyboardNavBtn.setAttribute('aria-pressed', keyboardNav ? 'true' : 'false');
      keyboardNavBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect><path d="M6 8h4"></path><path d="M10 16h4"></path><path d="M14 8h4"></path><path d="M6 12h12"></path></svg><span>ניווט מקלדת</span>`;
      keyboardNavBtn.onclick = toggleKeyboardNav;
      menu.appendChild(keyboardNavBtn);
      
      // Full accessibility button
      const fullAccessBtn = document.createElement('button');
      fullAccessBtn.id = 'full-access-btn';
      fullAccessBtn.type = 'button';
      fullAccessBtn.setAttribute('aria-pressed', fullAccess ? 'true' : 'false');
      fullAccessBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg><span>נגישות מלאה</span>`;
      fullAccessBtn.onclick = toggleFullAccess;
      menu.appendChild(fullAccessBtn);
      
      // Add accessibility statement button
      const statementBtn = document.createElement('button');
      statementBtn.id = 'accessibility-statement-btn';
      statementBtn.type = 'button';
      statementBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg><span>הצהרת נגישות</span>`;
      statementBtn.onclick = () => setIsModalOpen(true);
      menu.appendChild(statementBtn);

      return menu;
    };

    // Create modal element
    const renderModal = () => {
      const modal = document.createElement('div');
      modal.id = 'accessibility-modal';
      modal.className = isModalOpen ? 'open' : '';
      modal.onclick = closeModal;

      const content = document.createElement('div');
      content.id = 'accessibility-modal-content';
      
      const closeButton = document.createElement('button');
      closeButton.id = 'accessibility-modal-close';
      closeButton.innerHTML = '×';
      closeButton.setAttribute('aria-label', 'סגור הצהרת נגישות');
      closeButton.onclick = closeModal;
      
      content.innerHTML = `
        <h2>הצהרת נגישות</h2>
        <p>
          אנחנו, ב "Cicilia Import", רואים בנגישות ערך עליון, ואתר "Cicilia Import" עומד בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג 2013. התאמות הנגישות בוצעו על פי המלצות התקן הישראלי (ת"י 5568) לנגישות תכנים באינטרנט ברמה AA ומסמך WCAG 2.0.
        </p>
        <p>
          <strong>הממשק:</strong><br>
          "Cicilia Import" מותאם לדפדפנים הנפוצים ולשימוש בטלפון הנייד. הממשק מאפשר לגולשים להתאים את תצוגת האתר ולהפעיל אותו באמצעים שונים, דוגמת תוכנות לקריאת מסך ועל ידי המקלדת.
        </p>
        <p>
          <strong>התאמות נגישות באתר:</strong>
          <ul>
            <li>שינוי גודל טקסט</li>
            <li>ניגודיות גבוהה</li>
            <li>מצב גווני אפור</li>
            <li>הדגשת קישורים</li>
            <li>ניווט מקלדת</li>
            <li>נגישות מלאה</li>
          </ul>
        </p>
        <p>
          <strong>יצירת קשר:</strong><br>
          אם נתקלתם בבעיה או שיש לכם הצעות לשיפור הנגישות, נשמח לשמוע מכם. ניתן ליצור קשר באמצעות:<br>
          דוא"ל: <a href="mailto:Ronen_kh@hotmail.com">Ronen_kh@hotmail.com</a>
        </p>
      `;

      content.insertBefore(closeButton, content.firstChild);
      modal.appendChild(content);
      return modal;
    };

    // Clear container and render components
    container.innerHTML = '';
    container.appendChild(renderToggleButton());
    container.appendChild(renderMenu());
    container.appendChild(renderModal());
  }, [isOpen, currentFontSize, highContrast, grayscale, highlightLinks, keyboardNav, fullAccess, isModalOpen]);

  // This component doesn't render anything in the React tree
  return null;
} 