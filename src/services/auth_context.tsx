import React, {createContext, useEffect, useState} from 'react';

interface   AuthContextType {
        isLogin: boolean;
        accessToken : string | null;
        logout: () => void;
        login: (token: string) => void;
}

export const AuthContext = createContext<AuthContextType>({
    isLogin: false,
    accessToken: null,
    logout: () => {},
    login: (token: string) => {},
});


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLogin, setIsLogin] = useState<boolean>(() => !!localStorage.getItem('accessToken')
  );
  
    const [accessToken, setAccessToken] = useState<string | null>(() => {
      return localStorage.getItem('accessToken');
    });

    const login = (token: string) => {
      localStorage.setItem('accessToken', token);
      setAccessToken(token);
      setIsLogin(true); // <-- QUAN TRỌNG: cập nhật lại isLogin
    };
  
    const logout = () => {
      localStorage.removeItem('accessToken');
      setAccessToken(null);
      setIsLogin(false);
      
    };
    useEffect(() => {
        const checkTokenValidity = async () => {
          const token = localStorage.getItem('accessToken');
          if (!token) return;
    
          try {
            const res = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
            const data = await res.json();
    
            if (data.error) {
              console.warn('Token hết hạn:', data.error);
              alert('Phiên đăng nhập Facebook đã hết hạn. Vui lòng đăng nhập lại.');
              logout();
            }
          } catch (error) {
            console.error('Lỗi khi kiểm tra token:', error);
            alert('Không thể kiểm tra phiên đăng nhập Facebook.');
            logout();
          }
        };
    
        checkTokenValidity();
      }, []);
  
    return (
      <AuthContext.Provider value={{ isLogin, accessToken, login, logout }}>
        {children}
      </AuthContext.Provider>
    );
  };