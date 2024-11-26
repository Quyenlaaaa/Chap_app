import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Button from "../../components/Button";
import TogglePasswordButton from "../../components/TogglePasswordButton";
import Input from "../../components/Input";
import "./Login.css";

const Form = ({ isSignInPage = true }) => {
    const [data, setData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [verificationMessage, setVerificationMessage] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    // Kiểm tra trạng thái xác thực email từ URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const verified = params.get("verified");
        const error = params.get("error");

        if (verified === "true") {
            setVerificationMessage("Xác thực email thành công! Bạn có thể đăng nhập.");
        } else if (error) {
            setError("Xác thực email thất bại. Vui lòng thử lại.");
        }
    }, [location]);

    // Lấy email đã lưu nếu chọn "Lưu thông tin đăng nhập"
    useEffect(() => {
        if (isSignInPage) {
            const savedEmail = localStorage.getItem("rememberedEmail");
            if (savedEmail) {
                setData((prevData) => ({ ...prevData, email: savedEmail }));
                setRememberMe(true);
            }
        }
    }, [isSignInPage]);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn hành động mặc định của form
        setError("");
        setSuccessMessage("");

        try {
            const url = isSignInPage
                ? "http://localhost:8090/api/auth/login"
                : "http://localhost:8090/api/auth/register";

            const payload = isSignInPage
                ? { email: data.email, password: data.password }
                : { name: data.name, email: data.email, password: data.password };

            if (!isSignInPage && data.password !== data.confirmPassword) {
                setError("Mật khẩu và mật khẩu xác nhận không khớp.");
                return;
            }

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                if (isSignInPage) {
                    // Lưu token khi đăng nhập thành công
                    localStorage.setItem("token", result.result.token);
                    if (rememberMe) {
                        localStorage.setItem("rememberedEmail", data.email);
                    } else {
                        localStorage.removeItem("rememberedEmail");
                    }
                    navigate("/home");
                } else {
                    setSuccessMessage("Đăng ký thành công! Vui lòng kiểm tra email để xác thực.");
                    setData({ name: "", email: "", password: "", confirmPassword: "" });
                }
            } else {
                if (result.code = 1016)
                    setError("Tài khoản chưa xác thực email");
                else
                setError(result.message || "Có lỗi xảy ra.");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
        }
    };

    return (
        <div className="bg-light h-screen flex items-center justify-center">
            <div className="bg-white w-[600px] h-auto shadow-lg rounded-lg p-6">
                <h2 className="text-4xl font-extrabold text-center mb-2">
                    {isSignInPage ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
                </h2>
                <p className="text-xl font-light text-center mb-6">
                    {isSignInPage ? "Chào mừng quay trở lại" : "Hãy trải nghiệm ngay nào"}
                </p>

                {verificationMessage && (
                    <div className="text-green-500 text-center mb-4">{verificationMessage}</div>
                )}
                {error && <div className="text-red-500 text-center mb-4">{error}</div>}
                {successMessage && <div className="text-green-500 text-center mb-4">{successMessage}</div>}

                <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
                    {!isSignInPage && (
                        <Input
                            label="Họ và tên"
                            type="text"
                            name="name"
                            placeholder="Nhập tên của bạn"
                            className="mb-6 w-[75%]"
                            value={data.name}
                            onChange={(e) => setData({ ...data, name: e.target.value })}
                        />
                    )}

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
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Nhập mật khẩu"
                            className="w-full"
                            value={data.password}
                            onChange={(e) => setData({ ...data, password: e.target.value })}
                        />
                        <TogglePasswordButton
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                        />
                    </div>

                    {!isSignInPage && (
                        <div className="relative mb-6 w-[75%]">
                            <Input
                                label="Xác nhận mật khẩu"
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                placeholder="Nhập lại mật khẩu"
                                className="w-full"
                                value={data.confirmPassword}
                                onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
                            />
                            <TogglePasswordButton
                                showPassword={showConfirmPassword}
                                setShowPassword={setShowConfirmPassword}
                            />
                        </div>
                    )}

                    {isSignInPage && (
                        <div className="mb-6 w-[75%] flex items-center">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                checked={rememberMe}
                                onChange={() => setRememberMe(!rememberMe)}
                                className="mr-2"
                            />
                            <label htmlFor="rememberMe" className="text-gray-700">
                                Lưu thông tin đăng nhập
                            </label>
                        </div>
                    )}

                    <Button label={isSignInPage ? "Đăng nhập" : "Đăng ký"} type="submit" className="w-[75%] mb-4" />
                </form>

                {isSignInPage && (
                    <div className="text-center mt-4">
                        <span
                            className="text-primary cursor-pointer underline"
                            onClick={() => navigate("/forgot_password")}
                        >
                            Quên mật khẩu?
                        </span>
                    </div>
                )}

                <div className="text-center mt-2">
                    {isSignInPage ? "Bạn chưa có tài khoản?" : "Bạn đã có tài khoản?"}{" "}
                    <span
                        className="text-primary cursor-pointer underline"
                        onClick={() => navigate(`/${isSignInPage ? "signup" : "login"}`)}
                    >
                        {isSignInPage ? "Đăng ký ngay" : "Đăng nhập"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Form;
