import React, { useEffect, useRef } from 'react'


export default function Banner(): JSX.Element {
    
    const banner = useRef<HTMLDivElement>(null)

    const atOptions = {
		key : '55a8d1b09b6ef43598774f4aa5e64ef7',
		format : 'iframe',
		height : 50,
		width : 320,
		params : {}
	}
    useEffect(() => {
    if (!banner.current?.firstChild) {
        const conf = document.createElement('script')
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `//www.profitabledisplaynetwork.com/${atOptions.key}/invoke.js`
        conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`

        if (banner.current) {
            banner.current.append(conf)
            banner.current.append(script)
        }
    }
}, [])

    return <div ref={banner}></div>
}