import React, {useEffect} from 'react';

function GoogleAds(props) {
    useEffect(() => {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }, [])

    return (
        <ins className="adsbygoogle"
             style={{display: 'block'}}
             data-ad-client="ca-pub-3100447499130313"
             data-ad-slot={props.slot}
             data-ad-format="auto"
             data-full-width-responsive="true"
             data-adtest="on"
        />
    );
}

export default GoogleAds;
