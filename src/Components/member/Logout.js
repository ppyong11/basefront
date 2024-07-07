import axiosInstance from "../context/interceptors";
import { useEffect, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthProvider";

function Logout() {
	const { auth, setAuth } = useContext(AuthContext);
	const navigate = useNavigate();
	
	const logout = async () => {
		const token= localStorage.getItem("bbs_access_token");
		try {
			// 토큰이 포함된 헤더로 로그아웃 요청을 보냄
			await axios.post("http://52.79.43.229:8989/user/logout", {}, {
			  headers: {
				Authorization: `Bearer ${token}`
			  }
			});

		localStorage.removeItem("bbs_access_token");
		localStorage.removeItem("id");

		alert(auth + "님, 성공적으로 로그아웃 됐습니다 🔒");
		setAuth(null);
	
		navigate("/");
		} catch(error) {
			console.log("error: ", token);
			localStorage.removeItem("bbs_access_token");
			localStorage.removeItem("id");
		}
	};

	useEffect(() => {
		logout();
	}, []);

}

export default Logout;