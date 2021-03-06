import React from 'react';
import ShareIcon from '@material-ui/icons/Share';
import { Button } from 'react-bootstrap';

function ShareButton(props) {
  return (
    <Button
      className="submit-button"
      onClick={() => {
        const el = document.createElement('textarea');
        el.value = `${window.location.href}`;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
        alert(props.alertMessage);
      }}
    >
      <ShareIcon fontSize="large" />
    </Button>
  );
}

export default ShareButton;
