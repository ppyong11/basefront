import axios from "axios";
import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { HttpHeadersContext } from "../context/HttpHeadersProvider";

function CommentWrite(props) {
	const { headers } = useContext(HttpHeadersContext);
	const { boardId } = useParams(); // 파라미터 가져오기

	const id = localStorage.getItem("id");

	const [content, setContent] = useState("");
	const navigate = useNavigate();

	const chageContent = (event) => {
		setContent(event.target.value);
	}

	const createComment = async() => {
        if (!content.trim()) {
			alert("내용을 입력해주세요.");
			return;
		  }
		const req = {
			content: content,
		}
		await axios.post(`http://3.36.53.96:8989/board/${boardId}/comment/write`, req, {headers: headers})
		.then((resp) => {
			console.log("[CommentWrite.js] createComment() success :D");
			console.log(resp.data);
			alert("댓글을 성공적으로 등록했습니다 :D");
			navigate(0);

		}).catch((err) =>  {
            console.log("[CommentWrite.js] createComment() error :<");
            if (err.response) {
                if (err.response.status === 401) {
                    // 토큰 만료
                    alert("토큰이 만료되었습니다. 다시 로그인하세요.");
                    // 로그아웃 로직 수행
                    localStorage.removeItem("id");
                    localStorage.removeItem('bbs_access_token');
                    // 리다이렉트 수행
                    navigate("/login")
                    window.location.reload();
                } else if (err.response.status === 403) {
                    // 403 Forbidden: 접근 권한이 없는 경우
                    alert("비정상적인 접근입니다.");
                    navigate("/bbslist")
                } else {
                    // 다른 오류 상황에 대한 처리
                    console.error('Error fetching data:', err);
                    alert("오류가 발생했습니다. 다시 시도해주세요.");
				}
			}
            console.log(err);
		});
	}

	return (
		<>
				{/* 상단 영역 (프로필 이미지, 댓글 작성자) */}
				<div className="my-1 d-flex justify-content-center">
					<div className="col-1">
						<img src="/images/profile-placeholder.png" alt="프로필 이미지"
							className="profile-img"/>
					</div>

					<div className="col-7">
						<span className="comment-id" >{id}</span>
					</div>
					<div className="col-2 my-1 d-flex justify-content-end">
						<button className="btn btn-outline-secondary" onClick={createComment}><i className="fas fa-comment-dots"></i> 댓글 추가</button>
					</div>
				</div>
				{/* 하단 영역 (댓글 내용) */}
				<div className="my-3 d-flex justify-content-center">
					<textarea className="col-10" rows="1" value={content} onChange={chageContent}></textarea>
				</div><br/><br/>
		</>
	)
}

export default CommentWrite;