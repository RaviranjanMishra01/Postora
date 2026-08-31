import {Link,useNavigate} from "react-router-dom"

function Navbar(){
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const logout = ()=>{
        localStorage.removeItem("token");
        navigate("/login");
    }

    return <>
        <nav  style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"15px 30px",borderBottom:"1px soild #ddd"}} >
            <h2>logo</h2>
            <div style={{display:"flex",gap:"20px"}}>
                <Link to="/">Home</Link>
                {
                    token? (
                        <>
                            <Link to="/blogs">Blogs</Link>
                            <Link to="/create-blog">Create Blog</Link>
                            <Link to="/my-blogs">My Blogs</Link>
                            <Link to="/profile">Profile</Link>  
                            <button onClick={logout}>Logout</button>
                        </>
                    ): (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )
                }
            </div>
        </nav>
    </>
}

export default Navbar;