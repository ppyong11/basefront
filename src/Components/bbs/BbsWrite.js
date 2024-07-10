import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { HttpHeadersContext } from "../context/HttpHeadersProvider";

import "../../css/bbswrite.css";
import axios from "axios"

function BbsWrite() {
  const { auth, setAuth } = useContext(AuthContext);
  const { headers, setHeaders } = useContext(HttpHeadersContext);

  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]); // 추가: 파일 목록 상태 추가

  const changeTitle = (event) => {
    setTitle(event.target.value);
  };

  const changeContent = (event) => {
    setContent(event.target.value);
  };

  const handleChangeFile = (event) => {
    // 총 5개까지만 허용
    const selectedFiles = Array.from(event.target.files).slice(0, 5);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
  };

  const handleRemoveFile = (index) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  /* 파일 업로드 */
  const fileUpload = async (boardId) => {
	console.log("업로드할 파일 목록:", files);
  if (files.length === 0) {
    console.log("No files to upload");
    return; // 파일이 없으면 업로드를 생략합니다.
  }
    // 파일 데이터 저장
    const fd = new FormData();
    files.forEach((file) => fd.append("file", file));

    await axios
      .post(`http://43.203.242.155:8989/board/${boardId}/file/upload`, fd, { headers: headers })
      .then((resp) => {
        console.log("[file.js] fileUpload() success :D");
        console.log(resp.data);

        alert("파일 업로드 성공 :D");
      })
      .catch((err) => {
        console.log("[FileData.js] fileUpload() error :<");
        console.log(err);
      });
  };

  /* [POST /bbs]: 게시글 작성 */
  const createBbs = async () => {
        // 제목과 내용이 비어 있을 경우 작성 못하도록 유효성 검사
        if (!title.trim()) {
          alert("제목을 입력해주세요.");
          return;
        }
        if (!content.trim()) {
          alert("내용을 입력해주세요.");
          return;
        }
        
    const req = {
      title: title,
      content: content,
    };

    await axios
      .post("http://43.203.242.155:8989/board/write", req, { headers: headers })
      .then((resp) => {
        console.log("[BbsWrite.js] createBbs() success :D");
        console.log(resp.data);
        const boardId = resp.data.boardId;
        console.log("boardId:", boardId);
        fileUpload(boardId);

        alert("새로운 게시글을 성공적으로 등록했습니다 :D");
        navigate(`/bbsdetail/${resp.data.boardId}`); // 새롭게 등록한 글 상세로 이동
      })
      .catch((err) => {
        console.log("[BbsWrite.js] createBbs() error :<");
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
  };

  useEffect(() => {
    // 컴포넌트가 렌더링될 때마다 localStorage의 토큰 값으로 headers를 업데이트
    setHeaders({
      Authorization: `Bearer ${localStorage.getItem("bbs_access_token")}`,
    });

    // 로그인한 사용자인지 체크
    if (!auth) {
      alert("로그인 한 사용자만 게시글을 작성할 수 있습니다 !");
      navigate(-1);
    }
  }, []);

  return (
    <div>
      <table className="table">
        <tbody>
          <tr>
            <th className="table-primary">작성자</th>
            <td>
              <input type="text" className="form-control" value={localStorage.getItem("id")} size="50px" readOnly />
            </td>
          </tr>

          <tr>
            <th className="table-primary">제목</th>
            <td>
              <input type="text" className="form-control" value={title} onChange={changeTitle} size="50px" />
            </td>
          </tr>

          <tr>
            <th className="table-primary">내용</th>
            <td>
              <textarea className="form-control" value={content} onChange={changeContent} rows="10"></textarea>
            </td>
          </tr>
          <tr>
            <th className="table-primary">파일</th>
            <td>
              {files.map((file, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center" }}>
                  <p>
                    <strong>FileName:</strong> {file.name}
                  </p>
                  <button className="delete-button" type="button" onClick={() => handleRemoveFile(index)}>
                    x
                  </button>
                </div>
              ))}
              {files.length < 5 && (
                <div>
                  <input type="file" name="file" onChange={handleChangeFile} multiple="multiple" />
                </div>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="my-5 d-flex justify-content-center">
        <button className="btn btn-outline-secondary" onClick={createBbs}>
          <i className="fas fa-pen"></i> 등록하기
        </button>
      </div>
    </div>
  );
}

export default BbsWrite;
