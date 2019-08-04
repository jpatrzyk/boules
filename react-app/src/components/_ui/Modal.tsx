import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import './Modal.scss';

interface Props {
  open: boolean;
  onRequestClose: () => void;
  title?: string;
}

export const Modal: React.FC<Props> = ({ open, onRequestClose, title, children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [lastActiveElement, setLastActiveElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    if (open) {
      setLastActiveElement(document.activeElement as HTMLElement);
    } else {
      if (lastActiveElement) {
        attemptFocus(lastActiveElement);
        setLastActiveElement(null);
      }
    }
  }, [open, setLastActiveElement, lastActiveElement]);

  useEffect(() => {
    function focusFirstDescendant(element: HTMLElement) {
      if (contentRef.current) {
        for (let i = 0; i < element.childNodes.length; i++) {
          const child = element.childNodes[i] as HTMLElement;
          if (attemptFocus(child) || focusFirstDescendant(child)) {
            return true;
          }
        }
      }
    }
    if (lastActiveElement) {
      if (contentRef.current) {
        focusFirstDescendant(contentRef.current);
      }
    }
  }, [lastActiveElement]);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.code === 'Escape') {
        event.stopPropagation();
        onRequestClose();
      }
    }
    document.addEventListener('keyup', handleEscape);

    return () => {
      document.removeEventListener('keyup', handleEscape);
    };
  }, [onRequestClose]);

  function attemptFocus(element: HTMLElement) {
    try {
      element.focus();
    } catch (e) {}
    return document.activeElement === element;
  }

  function renderModal() {
    return (
      <div className={classNames('Modal-backdrop', { 'Modal-backdrop--active': open })}>
        <div
          className={classNames('Modal', { 'Modal--hidden': !open })}
          role="dialog"
          aria-describedby={title || 'modal'}
          aria-modal="true"
        >
          {!!title && <h2>{title}</h2>}
          <div className="Modal-content" ref={contentRef}>
            {children}
          </div>
        </div>
      </div>
    );
  }
  const modalRoot = document.getElementById('modal-root') as HTMLElement;
  return ReactDOM.createPortal(renderModal(), modalRoot);
};
