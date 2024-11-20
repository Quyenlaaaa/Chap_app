import { useState, useEffect } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginForm = () => {
    const [data, setData] = useState({ email: '', password: '' });
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

        if (!data.email || !data.password) {
            setError("Vui lòng nhập đầy đủ thông tin.");
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
            <div className="bg-white w-[600px] h-[600px] shadow-lg rounded-lg flex flex-col justify-center items-center">
                <div className="text-4xl font-extrabold">ĐĂNG NHẬP</div>
                <div className="text-xl font-light mb-14">Chào mừng quay trở lại</div>

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
                    
                    <Input
                        label="Mật khẩu"
                        type="password"
                        name="password"
                        placeholder="Nhập mật khẩu"
                        className="mb-6 w-[75%]"
                        value={data.password}
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                    />

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

                    <Button label="Sign in" type="submit" className="w-[75%] mb-2" />
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
