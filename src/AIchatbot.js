import React, { useState, useRef, useEffect } from 'react';
import { Upload, Send, Image, Bot, User, Loader2, CheckCircle, AlertCircle, Sparkles, Brain, Zap, MessageSquare, X } from 'lucide-react';

const AIChatbot = () => {
  // 상태 관리
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isLearning, setIsLearning] = useState(false);
  const [learningProgress, setLearningProgress] = useState(0);
  const [isAIReady, setIsAIReady] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  // 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };
  
  // 파일 처리
  const processFiles = (files) => {
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setUploadedImages(prev => [...prev, {
            id: Date.now() + Math.random(),
            url: event.target.result,
            name: file.name,
            size: (file.size / 1024).toFixed(2) + ' KB',
            status: 'uploaded'
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };
  
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };
  
  // AI 학습 시뮬레이션
  const handleLearnFromImages = async () => {
    if (uploadedImages.length === 0) return;
    
    setIsLearning(true);
    setLearningProgress(0);
    
    const simulateLearning = () => {
      return new Promise((resolve) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += Math.random() * 15 + 5;
          if (progress > 100) progress = 100;
          setLearningProgress(Math.floor(progress));
          
          if (progress >= 100) {
            clearInterval(interval);
            resolve();
          }
        }, 300);
      });
    };
    
    await simulateLearning();
    
    setIsLearning(false);
    setIsAIReady(true);
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'system',
      content: '✨ AI 학습이 완료되었습니다! 이제 자연스러운 대화를 나눌 수 있어요.',
      timestamp: new Date()
    }]);
  };
  
  // 메시지 전송
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !isAIReady) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    
    setTimeout(() => {
      const aiResponses = [
        "흥미로운 질문이네요! 제가 학습한 내용을 바탕으로 자세히 설명드릴게요.",
        "좋은 포인트를 짚어주셨네요. 이에 대해 더 깊이 있게 이야기해보겠습니다.",
        "네, 이해했습니다. 관련해서 추가로 알려드릴 내용이 있어요.",
        "맞습니다! 제가 학습한 패턴을 기반으로 더 유용한 정보를 제공해드릴게요.",
        "이 부분은 정말 중요한 개념이에요. 단계별로 설명드리겠습니다."
      ];
      
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const removeImage = (imageId) => {
    setUploadedImages(prev => prev.filter(img => img.id !== imageId));
  };

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
            'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .container {
          display: flex;
          height: 100vh;
          background: #f8f9fa;
        }
        
        .left-panel {
          width: 40%;
          background: white;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
        }
        
        .right-panel {
          flex: 1;
          background: white;
          display: flex;
          flex-direction: column;
        }
        
        .header {
          padding: 24px 32px;
          background: white;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .icon-box {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .icon-box.blue {
          background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
        }
        
        .header-title {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }
        
        .header-subtitle {
          font-size: 14px;
          color: #6b7280;
        }
        
        .content-area {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }
        
        .upload-area {
          border: 2px dashed #d1d5db;
          border-radius: 16px;
          padding: 48px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #f9fafb 0%, white 100%);
        }
        
        .upload-area:hover {
          border-color: #9ca3af;
          background: linear-gradient(135deg, #f3f4f6 0%, white 100%);
        }
        
        .upload-area.dragging {
          border-color: #667eea;
          background: linear-gradient(135deg, #ede9fe 0%, #f3e8ff 100%);
          transform: scale(1.02);
        }
        
        .upload-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        
        .file-list {
          margin-top: 24px;
        }
        
        .file-list-title {
          font-size: 14px;
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .file-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 12px;
          margin-bottom: 8px;
          transition: all 0.2s ease;
        }
        
        .file-item:hover {
          background: #f3f4f6;
        }
        
        .file-icon {
          width: 32px;
          height: 32px;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .file-info {
          flex: 1;
        }
        
        .file-name {
          font-size: 14px;
          font-weight: 500;
          color: #111827;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .file-size {
          font-size: 12px;
          color: #6b7280;
        }
        
        .remove-btn {
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          color: #ef4444;
          cursor: pointer;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.2s ease;
        }
        
        .file-item:hover .remove-btn {
          opacity: 1;
        }
        
        .remove-btn:hover {
          background: #fee2e2;
        }
        
        .action-btn {
          width: 100%;
          padding: 16px 24px;
          margin-top: 32px;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        
        .action-btn.primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          box-shadow: 0 4px 6px rgba(102, 126, 234, 0.25);
        }
        
        .action-btn.primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(102, 126, 234, 0.35);
        }
        
        .action-btn:disabled {
          background: #e5e7eb;
          color: #9ca3af;
          cursor: not-allowed;
        }
        
        .progress-bar {
          width: 100%;
          height: 8px;
          background: #e5e7eb;
          border-radius: 4px;
          overflow: hidden;
          margin-top: 16px;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px;
          transition: width 0.5s ease;
        }
        
        .status-box {
          padding: 16px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .status-box.ready {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          border: 1px solid #86efac;
        }
        
        .status-box.waiting {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
        }
        
        .status-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .status-icon.ready {
          background: #dcfce7;
        }
        
        .status-icon.waiting {
          background: #f3f4f6;
        }
        
        .messages-area {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
        }
        
        .empty-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #f3f4f6 0%, white 100%);
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
        }
        
        .message {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
          animation: fadeIn 0.3s ease;
        }
        
        .message.user {
          justify-content: flex-end;
        }
        
        .message-avatar {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .message-avatar.ai {
          background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
        }
        
        .message-avatar.user {
          background: linear-gradient(135deg, #dbeafe 0%, #c7d2fe 100%);
        }
        
        .message-avatar.system {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
        }
        
        .message-content {
          max-width: 70%;
        }
        
        .message-bubble {
          padding: 12px 16px;
          border-radius: 16px;
          font-size: 14px;
          line-height: 1.5;
        }
        
        .message-bubble.ai {
          background: #f3f4f6;
          color: #111827;
        }
        
        .message-bubble.user {
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
        }
        
        .message-bubble.system {
          background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
          color: #065f46;
          border: 1px solid #86efac;
        }
        
        .message-time {
          font-size: 11px;
          color: #9ca3af;
          margin-top: 4px;
          padding: 0 4px;
        }
        
        .message.user .message-time {
          text-align: right;
        }
        
        .typing-indicator {
          display: flex;
          gap: 4px;
          padding: 12px 16px;
          background: #f3f4f6;
          border-radius: 16px;
          width: fit-content;
        }
        
        .typing-dot {
          width: 8px;
          height: 8px;
          background: #6b7280;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .typing-dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        .input-area {
          padding: 24px 32px;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }
        
        .input-wrapper {
          display: flex;
          gap: 12px;
        }
        
        .input-field {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #d1d5db;
          border-radius: 12px;
          font-size: 14px;
          outline: none;
          transition: all 0.2s ease;
          background: white;
        }
        
        .input-field:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .input-field:disabled {
          background: #f3f4f6;
          color: #9ca3af;
        }
        
        .send-btn {
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          color: white;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        
        .send-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.35);
        }
        
        .send-btn:disabled {
          background: #e5e7eb;
          color: #9ca3af;
          cursor: not-allowed;
        }
        
        .input-hint {
          margin-top: 12px;
          font-size: 12px;
          color: #6b7280;
          display: flex;
          gap: 16px;
        }
        
        .online-indicator {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          background: #10b981;
          border: 2px solid white;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
          }
        }
        
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
      
      <div className="container">
        {/* 왼쪽 패널 */}
        <div className="left-panel">
          <div className="header">
            <div className="header-content">
              <div className="icon-box">
                <Brain size={24} color="white" />
              </div>
              <div>
                <div className="header-title">AI Training Center</div>
                <div className="header-subtitle">대화 이미지로 AI를 학습시켜보세요</div>
              </div>
            </div>
          </div>
          
          <div className="content-area">
            <div 
              className={`upload-area ${isDragging ? 'dragging' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-icon">
                <Upload size={24} color="#7c3aed" />
              </div>
              <div style={{ fontSize: '18px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>
                클릭 또는 드래그하여 업로드
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                PNG, JPG, JPEG (최대 10MB)
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
            
            {uploadedImages.length > 0 && (
              <div className="file-list">
                <div className="file-list-title">
                  <Sparkles size={16} color="#7c3aed" />
                  업로드된 학습 데이터 ({uploadedImages.length})
                </div>
                {uploadedImages.map((image) => (
                  <div key={image.id} className="file-item">
                    <div className="file-icon">
                      <Image size={18} color="#6b7280" />
                    </div>
                    <div className="file-info">
                      <div className="file-name">{image.name}</div>
                      <div className="file-size">{image.size}</div>
                    </div>
                    <button 
                      className="remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(image.id);
                      }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <button
              className="action-btn primary"
              onClick={handleLearnFromImages}
              disabled={uploadedImages.length === 0 || isLearning}
            >
              {isLearning ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  AI 학습 중... {learningProgress}%
                </>
              ) : (
                <>
                  <Zap size={18} />
                  AI 학습 시작하기
                </>
              )}
            </button>
            
            {isLearning && (
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${learningProgress}%` }}
                />
              </div>
            )}
          </div>
          
          <div style={{ padding: '24px', borderTop: '1px solid #f0f0f0' }}>
            <div className={`status-box ${isAIReady ? 'ready' : 'waiting'}`}>
              <div className={`status-icon ${isAIReady ? 'ready' : 'waiting'}`}>
                {isAIReady ? (
                  <CheckCircle size={18} color="#10b981" />
                ) : (
                  <AlertCircle size={18} color="#6b7280" />
                )}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: isAIReady ? '#065f46' : '#4b5563' }}>
                  {isAIReady ? 'AI 준비 완료' : 'AI 학습 대기 중'}
                </div>
                <div style={{ fontSize: '12px', color: isAIReady ? '#059669' : '#6b7280' }}>
                  {isAIReady ? '대화를 시작할 수 있습니다' : '이미지를 업로드하고 학습을 시작하세요'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 오른쪽 패널 */}
        <div className="right-panel">
          <div className="header">
            <div className="header-content">
              <div style={{ position: 'relative' }}>
                <div className="icon-box blue">
                  <MessageSquare size={24} color="white" />
                </div>
                {isAIReady && <div className="online-indicator" />}
              </div>
              <div>
                <div className="header-title">AI Assistant</div>
                <div className="header-subtitle">
                  {isAIReady ? "온라인 • 대화 가능" : "오프라인 • 학습 필요"}
                </div>
              </div>
            </div>
          </div>
          
          <div className="messages-area">
            {messages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <Bot size={48} color="#d1d5db" />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#111827', marginBottom: '8px' }}>
                  {isAIReady ? "대화를 시작해보세요!" : "AI를 먼저 학습시켜주세요"}
                </h3>
                <p style={{ fontSize: '14px', color: '#6b7280', maxWidth: '400px' }}>
                  {isAIReady 
                    ? "학습된 AI와 자연스러운 대화를 나눠보세요. 궁금한 것을 무엇이든 물어보세요!" 
                    : "왼쪽 패널에서 대화 이미지를 업로드하고 AI를 학습시킨 후 대화를 시작할 수 있습니다."}
                </p>
              </div>
            ) : (
              <div>
                {messages.map((message) => (
                  <div key={message.id} className={`message ${message.type}`}>
                    {message.type !== 'user' && (
                      <div className={`message-avatar ${message.type}`}>
                        {message.type === 'system' ? (
                          <Sparkles size={18} color="#10b981" />
                        ) : (
                          <Bot size={18} color="#3b82f6" />
                        )}
                      </div>
                    )}
                    <div className="message-content">
                      <div className={`message-bubble ${message.type}`}>
                        {message.content}
                      </div>
                      <div className="message-time">
                        {new Date(message.timestamp).toLocaleTimeString('ko-KR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                    {message.type === 'user' && (
                      <div className="message-avatar user">
                        <User size={18} color="#6366f1" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="message">
                    <div className="message-avatar ai">
                      <Bot size={18} color="#3b82f6" />
                    </div>
                    <div className="typing-indicator">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          <div className="input-area">
            <div className="input-wrapper">
              <input
                type="text"
                className="input-field"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!isAIReady}
                placeholder={isAIReady ? "메시지를 입력하세요..." : "AI 학습이 필요합니다"}
              />
              <button
                className="send-btn"
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || !isAIReady}
              >
                <Send size={18} />
                <span>전송</span>
              </button>
            </div>
            <div className="input-hint">
              <span>Shift + Enter로 줄바꿈</span>
              <span>•</span>
              <span>Enter로 전송</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;