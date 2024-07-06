import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Axios 인스턴스 생성
const axiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if(error.response){
      if (error.response.status === 401) {
        //토큰 만료
        alert("토큰이 만료되었습니다. 다시 로그인하세요.");
        // 로그아웃 로직 수행
        localStorage.removeItem('bbs_access_token');
        // 리다이렉트 수행
        window.location.href = '/login';  // useNavigate를 사용할 수 없기 때문에 window.location.href 사용
      }
      else if(error.response.status === 403) {
        // 403 Forbidden: 접근 권한이 없는 경우
        alert("비정상적인 접근입니다.");
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
