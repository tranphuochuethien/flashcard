import type { SVGProps } from "react"

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 7V5h4"/>
      <path d="M10 5v2h4"/>
      <path d="M10 13v-2h4"/>
      <path d="M4 11v2h4"/>
      <path d="M18 17l-2-2 2-2"/>
      <path d="M20 15h-4"/>
      <path d="M4 15h4"/>
      <path d="M4 21v-2h4"/>
      <path d="M10 19v2h4"/>
      <path d="M14 19v2"/>
      <path d="M14 11v2"/>
      <rect width="18" height="18" x="3" y="3" rx="2"/>
    </svg>
  ),
}
