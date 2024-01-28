import { Link, NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom"

function Layout(){
  const navigate = useNavigate()
  
  const navigateToLogin=()=>{
    localStorage.removeItem('authToken');
    navigate('/');
  }

return (
  <>
<nav class="navbar navbar-expand-sm navbar-dark bg-dark">
  <div class="container-fluid">
  <img src="https://www.zohowebstatic.com/sites/zweb/images/commonroot/zoho-logo-web.svg"
                    style={{width: "120px"}} alt="logo"/>
    <div class="collapse navbar-collapse" id="mynavbar" style={{marginLeft:"20px"}}>
      <ul class="navbar-nav me-auto">
        <li class="nav-item" style={{marginLeft:"20px"}}>
          <Link class="nav-link font-weight-bold" to="/home">Home</Link>
        </li>
        <li class="nav-item" style={{marginLeft:"20px"}}>
          <Link class="nav-link font-weight-bold" to="/profile">Profile</Link>
        </li>
        <li class="nav-item" style={{marginLeft:"20px"}}>
          <Link class="nav-link font-weight-bold" to="/leaveTracker">Request</Link>
        </li>
        <li class="nav-item" style={{marginLeft:"20px"}}>
          <Link class="nav-link font-weight-bold" to="/register">Register</Link>
        </li>
      </ul>
    </div>
    <button class="btn btn-danger" onClick={navigateToLogin}>Log Out</button>
  </div>
</nav>
</>
)
}

export default Layout;
