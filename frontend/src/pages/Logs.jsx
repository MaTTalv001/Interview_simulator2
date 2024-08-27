import React, { useState, useEffect } from "react";
import { useAuth } from "../providers/auth";
import { API_URL } from "../config/settings";
import { Link } from "react-router-dom";

export const Logs = () => {
    const { token } = useAuth();
    const [logs, setLogs] = useState([]);
    const [selectedLog, setSelectedLog] = useState(null);

useEffect(() => {
    fetchLogs();
}, []);

const fetchLogs = async () => {
    try {
        const response = await fetch(`${API_URL}/api/v1/interview_logs`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch logs');
        const data = await response.json();
        setLogs(data);
    } catch (error) {
        console.error("Error fetching logs:", error);
    }
};

return (
<div className="container mx-auto p-4">
    <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">面接ログ</h1>
        <Link to={`/MyPage`} className="btn btn-ghost">
        マイページへ
        </Link>
    </div>
    <div className="alert alert-warning shadow-lg mb-8">
                <div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>注意: フィードバックはAIで生成したものです。あくまでも参考程度としてください。</span>
                </div>
            </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-1 border-r pr-4">
            <h2 className="text-xl font-semibold mb-4">面接一覧</h2>
            {logs.map((log) => (
                <div 
                key={log.id} 
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => setSelectedLog(log)}
                >
                    {new Date(log.created_at).toLocaleString()}
                    </div>
                ))}
                </div>
                <div className="col-span-2">
                    {selectedLog ? (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">面接詳細</h2>
                            <h3 className="text-lg font-medium mb-2">会話ログ：</h3>
                            <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap mb-4">
                                {selectedLog.body}
                                </pre>
                                <h3 className="text-lg font-medium mb-2">フィードバック：</h3>
                                <p className="bg-gray-100 p-4 rounded">{selectedLog.feedback}</p>
                                </div>
                                ) : (
                                <p>左側のリストから面接ログを選択してください。</p>
                                )}
                        </div>
                </div>
        </div>
    );
};

export default Logs;