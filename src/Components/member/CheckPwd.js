import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";
import MemberUpdate from "./MemberUpdate";

function CheckPwd() {
    const { headers, setHeaders } = useContext(HttpHeadersContext);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [pwd, setPwd] = useState("");
    const [showMemberUpdate, setShowMemberUpdate] = useState(false);
	const navigate = useNavigate();
    
    const changeEmail = (event) => {
        setEmail(event.target.value);
    }

    const changeName = (event) => {
        setName(event.target.value);
    }

    const changePwd = (event) => {
        setPwd(event.target.value);
    }

    useEffect(() => {
        // 컴포넌트가 렌더링될 때마다 localStorage의 토큰 값으로 headers를 업데이트
        setHeaders({
            "Authorization": `Bearer ${localStorage.getItem("bbs_access_token")}`
        });
      }, []);

    const passwordCheck = async () => {
        const req = {
            password: pwd
        }

        try {
            const resp = await axios.post("http://3.36.53.96:8989/user/checkPwd", req, { headers: headers });
            console.log("[MemberUpdate.js] checkPwd() success :D");
            console.log(resp.data);
            setEmail(resp.data.email);
            setName(resp.data.username);

            setShowMemberUpdate(true);
        } catch (err) {
            console.log("[MemberUpdate.js] checkPwd() error :<");
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

            const resp = err.response;
            if (resp.status === 400) {
                alert(resp.data);
            }
        }
    }

    return (
        <div>
            {showMemberUpdate ? (
                <MemberUpdate email={email} name={name} />
            ) : (
                <>
                    <table className="table">
                        <tbody>
                            <tr>
                                <th>비밀번호</th>
                                <td>
                                    <input type="password" value={pwd} onChange={changePwd} size="50px" />
                                </td>
                            </tr>
                        </tbody>
                    </table><br />

                    <div className="my-3 d-flex justify-content-center">
                        <button className="btn btn-outline-secondary" onClick={passwordCheck}>
                            <i className="fas fa-user-plus"></i>비밀번호 확인
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default CheckPwd;