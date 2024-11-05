import { NavLink } from "react-router-dom";


function Nav(){
  return (
    <>
    <div className="navContainer">
      <NavLink to = "/about">About</NavLink>
      <br />
      <NavLink to = "/contact">Contact Me</NavLink>
      <br />
      <NavLink to = "/home">Home</NavLink>
    </div>

    </>
  )
}
export default Nav;