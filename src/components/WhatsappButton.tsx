'use client';
// src/components/WhatsappButton.tsx
import { useEffect, useState } from 'react';
import { getSiteConfig } from '@/lib/firestore';
import styles from './WhatsappButton.module.css';

export default function WhatsappButton() {
  const [href, setHref] = useState('https://wa.me/917999854628');
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    getSiteConfig().then(cfg => {
      if (cfg?.whatsappNumber) setHref(`https://wa.me/${cfg.whatsappNumber}`);
    });
  }, []);

  return (
    <div className={styles.container}>
      {showTooltip && (
        <a href={href} target="_blank" rel="noreferrer" className={styles.tooltip}>
          <span className={styles.onlineDot} />
          <span className={styles.tooltipText}>Need Help? <strong>Chat on WhatsApp</strong></span>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowTooltip(false);
            }}
            aria-label="Close message"
          >
            ×
          </button>
        </a>
      )}

      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={styles.btn}
        aria-label="Chat on WhatsApp"
      >
        <span className={styles.pulseRing} />
        <svg
          className={styles.waIcon}
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M18.403 5.586C16.699 3.879 14.437 2.937 12.023 2.937C7.094 2.937 3.092 6.938 3.09 11.871C3.089 13.447 3.501 14.986 4.283 16.34L3 21L7.768 19.749C9.076 20.462 10.536 20.838 12.018 20.839H12.023C16.95 20.839 20.953 16.837 20.955 11.904C20.956 9.513 20.015 7.251 18.403 5.586ZM12.023 19.34C10.686 19.34 9.378 18.981 8.232 18.301L7.96 18.139L5.132 18.881L5.886 16.126L5.708 15.843C4.961 14.654 4.567 13.28 4.568 11.871C4.57 7.753 7.915 4.408 12.03 4.408C14.022 4.408 15.885 5.185 17.29 6.592C18.696 7.999 19.47 9.863 19.469 11.856C19.467 15.976 16.122 19.34 12.023 19.34ZM16.115 13.882C15.891 13.77 14.786 13.226 14.581 13.151C14.376 13.076 14.226 13.039 14.076 13.264C13.926 13.489 13.502 13.988 13.372 14.138C13.242 14.288 13.112 14.307 12.888 14.195C12.664 14.083 11.942 13.846 11.087 13.084C10.421 12.49 9.972 11.757 9.842 11.532C9.712 11.307 9.828 11.186 9.94 11.075C10.04 10.975 10.163 10.814 10.275 10.683C10.387 10.552 10.424 10.458 10.499 10.308C10.574 10.158 10.537 10.027 10.481 9.915C10.424 9.802 9.975 8.698 9.789 8.248C9.607 7.81 9.421 7.869 9.282 7.861C9.151 7.854 9.001 7.852 8.851 7.852C8.701 7.852 8.458 7.908 8.252 8.133C8.046 8.358 7.465 8.902 7.465 10.007C7.465 11.112 8.271 12.18 8.383 12.33C8.495 12.48 9.97 14.733 12.23 15.71C12.767 15.942 13.185 16.08 13.511 16.183C14.049 16.354 14.538 16.33 14.924 16.273C15.355 16.209 16.25 15.731 16.437 15.206C16.624 14.681 16.624 14.231 16.568 14.138C16.512 14.044 16.362 13.994 16.115 13.882Z"
            fill="currentColor"
          />
        </svg>
      </a>
    </div>
  );
}

