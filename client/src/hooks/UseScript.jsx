import { useEffect } from 'react';

const useScript = (url, async = true, onload, onerror) => {
  useEffect(() => {
	const script = document.createElement('script');

	script.src   = url;
	script.async = async;
	onload && (script.onload = onload)
	onerror && (script.onerror = onerror)
 
	document.body.appendChild(script);

	return () => {
	  document.body.removeChild(script);
	}
  }, [url]);
};

export default useScript;