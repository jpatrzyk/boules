import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import './Modal.scss';

interface Props {
  open: boolean;
  onRequestClose: () => void;
  title?: React.ReactNode;
}

export const Modal: React.FC<Props> = ({ open, onRequestClose, title, children }) => {
  function renderModal() {
    return (
      <div className={classNames('Modal', { 'Modal--hidden': !open })}>
        <div className="Modal-mask" />
        <div className="Modal-window">
          {!!title && (<h2>{title}</h2>)}
          {children}
        </div>
      </div>
    );
  }
  const modalRoot = document.getElementById('modal-root') as HTMLElement;
  return ReactDOM.createPortal(renderModal(), modalRoot);
};
