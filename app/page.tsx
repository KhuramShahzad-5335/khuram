import {Home} from '@/components/home';
import {siteUrl} from '@/lib/content';
export const metadata={alternates:{canonical:'/'}};
export default function Page(){const person={'@context':'https://schema.org','@type':'Person',name:'Khuram Shahzad',url:siteUrl,jobTitle:'Self-employed Software Developer',sameAs:['https://github.com/KhuramShahzad-5335','https://www.linkedin.com/in/khuram-shahzad-0814b1230/']};return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(person).replace(/</g,'\\u003c')}}/><Home/></>}
