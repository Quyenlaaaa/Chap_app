import { useState } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setError("Vui lòng nhập email.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8090/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage("Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email.");
                toast.success('Email đặt lại mật khẩu đã được gửi');
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                setError(result.message || "Có lỗi xảy ra.");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Có lỗi xảy ra. Vui lòng thử lại sau.");
        }
    };

    return (
        <div className="bg-light h-screen flex items-center justify-center">
            <div className="bg-white w-[500px] h-[400px] shadow-lg rounded-lg flex flex-col justify-center items-center">
                <div className="text-3xl font-extrabold mb-4">QUÊN MẬT KHẨU</div>
                <div className="text-lg font-light mb-10">Nhập email của bạn để đặt lại mật khẩu</div>

                {message && <div className="text-green-500 mb-4">{message}</div>}
                {error && <div className="text-red-500 mb-4">{error}</div>}

                <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
                    <Input
                        label="Email"
                        type="email"
                        name="email"
                        placeholder="Nhập email"
                        className="mb-6 w-[75%]"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button label="Gửi yêu cầu" type="submit" className="w-[75%]" />
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
