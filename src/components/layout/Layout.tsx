import React from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

type LayoutProps = {
  children: React.ReactNode
}

/**
 * The Layout component in TypeScript React renders a basic layout structure with a header, main content area, and footer.
 * @param {LayoutProps}  - The `Layout` component takes in a prop object `LayoutProps` which contains a `children` property. The `children`
 * prop is used to render the content inside the `Layout` component. The component structure includes a `Header` component at the top, followed
 * by the main content wrapped in
 * @returns The Layout component is being returned, which consists of a div with a class name of 'min-h-screen bg-background flex flex-col',
 * containing a Header component, a main element with a class name of 'flex-grow container mx-auto px-4 py-8' that wraps around the children
 * components, and a Footer component.
 */
const Layout = ({ children }: LayoutProps) => {
  return (
    <div className='min-h-screen bg-background flex flex-col'>
      <Header />
      <main className='flex-grow container mx-auto px-4 py-8'>{children}</main>
      <Footer />
    </div>
  )
}

export default Layout
