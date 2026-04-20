import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 text-white text-center px-4">
            <h1 className="text-6xl font-bold mb-4">403 - Unauthorized Access</h1>
            <button
                onClick={() => navigate('/')}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-semibold transition"
            >
                Go to Home
            </button>
        </div>
    );
};
export default Unauthorized;
