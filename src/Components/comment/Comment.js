import axios from "axios";
import React , { useRef } from "react";
import { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";
import Cookies from 'js-cookie';

/* 댓글 컴포넌트 */
function Comment(props) {
	const {auth, setAuth} = useContext(AuthContext);
	const {headers, setHeaders} = useContext(HttpHeadersContext);
	const navigate = useNavigate(); // useNavigate 훅 사용하여 navigate 정의
	
	const page = props.page;
	const comment = props.obj;
	const commentId = comment.commentId;
	const { boardId } = useParams(); // boardId, 파라미터 가져오기

	const [show, setShow] = useState(false);

	const [content, setContent] = useState(comment.content);
	const changeContent = (event) => {
		setContent(event.target.value);
	};

	/* 댓글 수정 */
	const updateComment = async () => {
		const csrfToken = Cookies.get('XSRF-TOKEN'); //read csrf token
		const req = {
			content: content
		};
		   // Check if the content is empty or unchanged
		   if (!content || content === comment.content) {
			alert("변경할 내용이 없습니다.");
			props.getCommentList(page);
			return;
		}
	

		await axios.patch(`http://192.168.0.130:8989/board/${boardId}/comment/update/${commentId}`, req, {headers: headers})
		.then((resp) => {
			console.log("[Comment.js] updateComment() success :D");
			console.log(resp.data);

			alert("댓글을 성공적으로 수정했습니다 !");

			// 업데이트된 댓글 목록을 다시 불러오기
			props.getCommentList(page);

		}).catch((err) => {
			console.log("[Comment.js] updateComment() error :<");
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
		});
		updateToggle();
	}

	/* 댓글 삭제 */
	const deleteComment = async () => {
		await axios.delete(`http://3.36.53.96:8989/board/${boardId}}/comment/delete/${commentId}`, {headers: headers})
			.then((resp) => {
				console.log("[BbsComment.js] deleteComment() success :D");
				console.log(resp.data);

				alert("댓글을 성공적으로 삭제했습니다 :D");
				//삭제된 댓글 목록 다시 불러오기
				window.location.reload();
				props.getCommentList(page);

			}).catch((err) => {
				console.log("[BbsComment.js] deleteComment() error :<");
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
			});
	}

	function updateToggle() { 
		setShow(show => !show) 
	}

	

	// 삭제되지 않은 댓글의 경우
	//if (comment.del == 0) {
		return (
			<>
				{/* 상단 영역 (프로필 이미지, 댓글 작성자, 댓글 작성시간) */}
				<div className="my-1 d-flex justify-content-center">
					<div className="col-1">
						<img src="/images/profile-placeholder.png" alt="프로필 이미지"
							className="profile-img" />
					</div>
					<div className="col-5">
						<div className="row">
							<span className="comment-id">{comment.commentWriterName}</span>
						</div>
						<div className="row">
							<span>{comment.createdDate}</span>
						</div>
					</div>

					<div className="col-4 d-flex justify-content-end">
					{
						/* 자신이 작성한 댓글인 경우에만 수정 삭제 가능 */
						(localStorage.getItem("id") == comment.commentWriterName) ?
							<>
								<button className="btn btn-outline-secondary" onClick={updateToggle}><i className="fas fa-edit"></i> 수정</button> &nbsp; 
								<button className="btn btn-outline-danger" onClick={deleteComment}><i className="fas fa-trash-alt"></i> 삭제</button>
							
							</>
							:
							null
					}
					</div>
				</div>

				{
					/* 댓글 수정하는 경우 */
					show ?
						<>
							{/* 하단 영역 (댓글 내용 + 댓글 내용 편집 창) */}
							<div className="my-3 d-flex justify-content-center">
								<textarea className="col-10" rows="5" value={content} onChange={changeContent}></textarea>
							</div>
							<div className="my-1 d-flex justify-content-center">
								<button className="btn btn-dark" onClick={updateComment}><i className="fas fa-edit"></i>수정 완료</button>
							</div>
						</>
					:
						<>
							{/* 하단 영역 (댓글 내용) */}
							<div className="my-3 d-flex justify-content-center">
								<div className="col-10 comment">{content}</div>
							</div>
						</>
				}


			</>
		);
	//}

	// // 삭제된 댓글의 경우
	// else {
	// 	return (
	// 		<>
	// 			<div className="my-5 d-flex justify-content-center">
	// 				<div className="comment">
	// 					<span className="del-span">⚠️ 작성자에 의해 삭제된 댓글입니다.</span>
	// 				</div>
	// 			</div>
	// 		</>
	// 	);
	// }
}

export default Comment;