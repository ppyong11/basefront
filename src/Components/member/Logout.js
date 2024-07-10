import axios from "axios";
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
			await axios.post("http://43.203.242.155:8989/user/logout", {}, {
			  headers: {
				Authorization: `Bearer ${token}`
			  }
			});

		localStorage.removeItem("bbs_access_token");
		localStorage.removeItem("id");

		alert(auth + "님, 성공적으로 로그아웃 됐습니다 🔒");
		} catch(err) {
			console.log("error: ", token, "saved_token:", localStorage.getItem("bbs_access_token"));
			if (err.response)
				if(err.response.status === 401){
					//토큰 만료
					alert("토큰이 만료되었습니다. 다시 로그인하세요.");
					// 로그아웃 로직 수행
					localStorage.removeItem("id");
					localStorage.removeItem('bbs_access_token');
					// 리다이렉트 수행
					navigate("/login")
					window.location.reload();
				} else if(err.response.status === 403) {
					// 403 Forbidden: 접근 권한이 없는 경우
					alert("비정상적인 접근입니다.");
					navigate("/bbslist")
				}else {
					// 다른 오류 상황에 대한 처리
					console.error('Error fetching data:', err);
					alert("오류가 발생했습니다. 다시 시도해주세요.");
				}
			console.log(err);
			localStorage.removeItem("bbs_access_token");
			localStorage.removeItem("id");
		}
		setAuth(null);
	
		navigate("/");
		window.location.reload();
	};

	useEffect(() => {
		logout();
	}, []);

}

export default Logout;