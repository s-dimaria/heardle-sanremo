import React, { useEffect, useRef } from 'react'


export default function Banner(): JSX.Element {
    
    const banner = useRef<HTMLDivElement>(null)

    const atOptions = {
		key : 'd8eda912a7485ab7f3da1d35bd959721',
		format : 'iframe',
		height : 90,
		width : 728,
		params : {}
	}
    useEffect(() => {
    if (!banner.current?.firstChild) {
        const conf = document.createElement('script')
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `//www.effectivecreativeformat.com/${atOptions.key}/invoke.js`
        conf.innerHTML = `atOptions = ${JSON.stringify(atOptions)}`

        if (banner.current) {
            banner.current.append(conf)
            banner.current.append(script)
        }
    }
}, [])

    return <div ref={banner}></div>
}