import React, { useEffect, useRef } from 'react'


export default function Banner(): JSX.Element {
    
    const banner = useRef<HTMLDivElement>(null)

    const atOptions = {
		key : 'd979a4cd0221f6b42f11993edb258468',
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