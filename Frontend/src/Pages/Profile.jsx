import { useNavigate } from "react-router-dom";
function Profile(){
    const navigate = useNavigate();
    function logout(){
        localStorage.removeItem("token");
        navigate("/login",{
            replace:true
        })
    }
    return <>
        <h1>welcome to profile page guys</h1>
        <button onClick={()=>{logout()}}>logout</button>
    </>   
}

export default Profile;