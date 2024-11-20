import { useState, useEffect } from "react";
import Button from "../../components/Button";
import TogglePasswordButton from "../../components/TogglePasswordButton";
import Input from "../../components/Input";
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Form = ({ isSignInPage = true }) => {
    const [data, setData] = useState({ email: '', password: '', confirmPassword: '' });
    const [showPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Load saved email if "remember me" was previously selected
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setData((prevData) => ({ ...prevData, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!isSignInPage && (!data.password || !data.confirmPassword || data.password !== data.confirmPassword)) {
            setError("Vui lòng nhập đúng mật khẩu.");
            setTimeout(() => setError(""), 1000);
            return;
        }

        // Save email to local storage if "Remember Me" is checked
        if (rememberMe) {
            localStorage.setItem('rememberedEmail', data.email);
        } else {
            localStorage.removeItem('rememberedEmail');
        }

        localStorage.setItem('user:token', 'mocked_token');
        setSuccessMessage("Đăng nhập thành công.");
        setTimeout(() => {
            setSuccessMessage("");
            navigate('/');
        }, 700);
    };

    return (
        <div className="bg-light h-screen flex items-center justify-center">
            <div className="bg-white w-[600px] h-[800px] shadow-lg rounded-lg flex flex-col justify-center items-center">
                <div className="text-4xl font-extrabold">{isSignInPage ? 'ĐĂNG NHẬP' : 'ĐĂNG KÝ'}</div>
                <div className="text-xl font-light mb-14">{isSignInPage ? 'Chào mừng quay trở lại' : 'Hãy trải nghiệm ngay nào'}</div>
                
                {error && <div className="text-red-500 mb-4">{error}</div>}
                {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

                <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
                    <Input 
                        label="Email" 
                        type="email" 
                        name="email" 
                        placeholder="Nhập email" 
                        className="mb-6 w-[75%]" 
                        value={data.email} 
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                    />
                    
                    <div className="relative mb-6 w-[75%]">
                        <Input 
                            label="Mật khẩu" 
                            type={showPassword ? 'text' : 'password'} 
                            name="password" 
                            placeholder="Nhập mật khẩu" 
                            className="w-full" 
                            value={data.password} 
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                        />
                        <TogglePasswordButton 
                            showConfirmPassword={showConfirmPassword} 
                            setShowConfirmPassword={setShowConfirmPassword} 
                        />
                    </div>

                    {isSignInPage && (
                        <div className="mb-6 w-[75%] flex items-center">
                            <input 
                                type="checkbox" 
                                id="rememberMe" 
                                checked={rememberMe} 
                                onChange={() => setRememberMe(!rememberMe)}
                                className="mr-2"
                            />
                            <label htmlFor="rememberMe" className="text-gray-700">Lưu thông tin đăng nhập</label>
                        </div>
                    )}

                    {!isSignInPage && (
                        <div className="relative mb-14 w-[75%]">
                            <Input 
                                label="Nhập lại mật khẩu" 
                                type={showConfirmPassword ? 'text' : 'password'} 
                                name="confirmPassword" 
                                placeholder="Nhập lại mật khẩu" 
                                className="w-full" 
                                value={data.confirmPassword} 
                                onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                            />
                            <TogglePasswordButton 
                            showConfirmPassword={showConfirmPassword} 
                            setShowConfirmPassword={setShowConfirmPassword} 
                            />
                        </div>
                    )}

                    <Button label={isSignInPage ? 'Sign in' : 'Sign up'} type="submit" className="w-[75%] mb-2" />
                </form>
                
                {isSignInPage && (
                    <div className="mt-4">
                        <span 
                            className="text-primary cursor-pointer underline"
                            onClick={() => navigate('/forgot_password')}
                        >
                            Quên mật khẩu?
                        </span>
                    </div>
                )}

                <div>
                    {isSignInPage ? "Bạn chưa có tài khoản? " : "Bạn đã có tài khoản? "}
                    <span className="text-primary cursor-pointer underline" onClick={() => navigate(`/${isSignInPage ? 'signup' : 'login'}`)}>
                        {isSignInPage ? 'Tạo tài khoản' : 'Đăng nhập'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Form;