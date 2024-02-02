import React, { useEffect } from 'react';

/**
 * Component for advertisement!!
 * 
 */

const loadScript = (src:any) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.onload = () => resolve(src);
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.body.appendChild(script);
    });
  };



const ExternalScriptComponent = () => {
  useEffect(() => {
    loadScript('//ophoacit.com/1?z=5894500')
      .then(() => console.log('Script loaded successfully'))
      .catch((error) => console.error('Failed to load the script:', error));
  }, []);

  return (
    <div></div>
  );
};

export default ExternalScriptComponent;


