import { useState, useEffect } from "react";
import Button from "../../components/Button";
import Input from "../../components/Input";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const navigate = useNavigate();

    // Lấy token từ URL khi trang được load
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get("token");
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        } else {
            // setError("Không tìm thấy token trong URL.");
            toast.error('Không tìm thấy token trong URL.');
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!newPassword || !confirmPassword) {
            setError("Vui lòng nhập mật khẩu mới và xác nhận mật khẩu.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Mật khẩu và mật khẩu xác nhận không khớp.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8090/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, newPassword }),
            });

            const result = await response.json();

            if (response.ok) {
                setSuccessMessage("Mật khẩu đã được thay đổi thành công.");
                toast.success('Thay đổi mật khẩu thành công');
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
                <div className="text-3xl font-extrabold mb-4">ĐẶT LẠI MẬT KHẨU</div>
                <div className="text-lg font-light mb-10">Nhập mật khẩu mới của bạn</div>

                {error && <div className="text-red-500 mb-4">{error}</div>}
                {successMessage && <div className="text-green-500 mb-4">{successMessage}</div>}

                <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
                    <Input
                        label="Mật khẩu mới"
                        type="password"
                        name="newPassword"
                        placeholder="Nhập mật khẩu mới"
                        className="mb-6 w-[75%]"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Input
                        label="Xác nhận mật khẩu"
                        type="password"
                        name="confirmPassword"
                        placeholder="Nhập lại mật khẩu"
                        className="mb-6 w-[75%]"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <Button label="Cập nhật mật khẩu" type="submit" className="w-[75%]" />
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
