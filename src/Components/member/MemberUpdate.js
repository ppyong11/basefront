/* 회원 정보 수정 컴포넌트 */
import axios from "axios";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";
import { AxiosContext } from "react-axios/lib/components/AxiosProvider";

function MemberUpdate(props) {
    const { headers, setHeaders } = useContext(HttpHeadersContext);
	const [name, setName] = useState("");
	const [pwd, setPwd] = useState("");
	const [checkPwd, setCheckPwd] = useState("");

    const email = props.email;

	const navigate = useNavigate();

	const changeName = (event) => {
		setName(event.target.value);
	}

	const changePwd = (event) => {
		setPwd(event.target.value);
	}

	const changeCheckPwd = (event) => {
		setCheckPwd(event.target.value);
	}

    useEffect(() => {
        setHeaders({
            "Authorization": `Bearer ${localStorage.getItem("bbs_access_token")}`
        });
        setName(props.name);
    }, [props.name]);

	/* 회원 정보 수정 */
	const update = async () => {

		const req = {
			password: pwd,
			passwordCheck: checkPwd,
			username: name,
		}

		await axios.patch("http://43.203.242.155:8989/user/update", req, {headers: headers})
			.then((resp) => {
				console.log("[MemberUpdate.js] update() success :D");
				console.log(resp.data);

				alert(resp.data.username + "님의 회원 정보를 수정했습니다");
				navigate("/");

			}).catch((err) => {
				console.log("[MemberUpdate.js] update() error :<");
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
			});
	}

	return (
		<div>
			<table className="table">
				<tbody>
					<tr>
						<th>이메일</th>
						<td>
							<input type="text" className="form-control"  value={email} size="50px" readOnly />
						</td>
					</tr>

					<tr>
						<th>이름</th>
						<td>
							<input type="text" value={name} onChange={changeName} size="50px" />
						</td>
					</tr>

					<tr>
						<th>비밀번호</th>
						<td>
							<input type="password" value={pwd} onChange={changePwd} size="50px" />
						</td>
					</tr>

					<tr>
						<th>비밀번호 확인</th>
						<td>
							<input type="password" value={checkPwd} onChange={changeCheckPwd} size="50px" />
						</td>
					</tr>
				</tbody>
			</table><br />

			<div className="my-3 d-flex justify-content-center">
				<button className="btn btn-outline-secondary" onClick={update}><i className="fas fa-user-plus"></i>정보 수정</button>
			</div>

		</div>
	);
}

export default MemberUpdate;
