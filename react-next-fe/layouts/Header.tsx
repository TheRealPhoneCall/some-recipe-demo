import Image from "next/image"
import logo from '../assets/some-recipe.png'
import { Navbar } from "flowbite-react"

const Header = () => {
  return (
    <header>
      <Navbar
        fluid={true}
        rounded={true}
      >
        <Navbar.Brand href="/">
          <Image
            src={logo}
            width='50'
            height='50'
            className="mr-3 h-6 sm:h-9"
            alt="Some Recipe Logo"
          />
          <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
            Some Recipe
          </span>
        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse>
          <Navbar.Link
            href="/navbars"
            active={true}
          >
            Home
          </Navbar.Link>
          <Navbar.Link href="/navbars">
            About
          </Navbar.Link>
          <Navbar.Link href="/navbars">
            Services
          </Navbar.Link>
          <Navbar.Link href="/navbars">
            Pricing
          </Navbar.Link>
          <Navbar.Link href="/navbars">
            Contact
          </Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
    </header>
  )
}

export default Header