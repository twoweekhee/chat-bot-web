import React, { useState, useRef, useEffect } from 'react';
import { Upload, Send, Image, Bot, User, Loader2, CheckCircle, AlertCircle, Sparkles, Brain, Zap, MessageSquare, X } from 'lucide-react';
import './AIchatbot.css';

const API_BASE_URL = 'http://127.0.0.1:8000';

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
  
    // 파일 크기 포맷팅 함수
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  // 파일 처리 - 백엔드 전송 + 화면 표시
  const processFiles = async (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }
    
    // 파일 크기 체크 (10MB 제한)
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles = imageFiles.filter(file => {
      if (file.size > maxSize) {
        alert(`${file.name}은(는) 파일 크기가 너무 큽니다. (최대 10MB)`);
        return false;
      }
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    // 1. 먼저 화면에 표시할 데이터 생성 (미리보기용)
    const processedFiles = await Promise.all(
      validFiles.map(async (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              id: Date.now() + Math.random(),
              name: file.name,
              size: formatFileSize(file.size),
              type: file.type,
              url: e.target.result,
              file: file,
              uploadStatus: 'uploading' // 업로드 상태 추가
            });
          };
          reader.readAsDataURL(file);
        });
      })
    );
    
    // 2. 화면에 즉시 표시 (업로딩 상태로)
    setUploadedImages(prev => [...prev, ...processedFiles]);
    
    // 3. 백엔드로 파일 전송
    try {
      const formData = new FormData();
      
      // 파일들을 FormData에 추가
      validFiles.forEach((file, index) => {
        formData.append('files', file);  // 같은 key로 여러 파일
        formData.append(`file_${index}`, file);  // 개별 key로도 파일 추가
      });
      
      // 메타데이터 추가
      formData.append('totalFiles', validFiles.length);
      formData.append('timestamp', new Date().toISOString());
      
      // 백엔드로 전송
      const response = await fetch(`${API_BASE_URL}/api/upload-multiple`, {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('업로드 성공:', result);
        
        // 업로드 성공 시 상태 업데이트
        setUploadedImages(prev => 
          prev.map(img => 
            processedFiles.some(pf => pf.id === img.id) 
              ? { ...img, uploadStatus: 'success', serverId: result.fileIds?.[img.name] }
              : img
          )
        );
        
        // 성공 메시지 표시
        setMessages(prev => [...prev, {
          id: Date.now(),
          type: 'system',
          content: `📁 ${validFiles.length}개의 이미지가 성공적으로 업로드되었습니다.`,
          timestamp: new Date()
        }]);
        
      } else {
        throw new Error(`업로드 실패: ${response.status} ${response.statusText}`);
      }
      
    } catch (error) {
      console.error('업로드 에러:', error);
      
      // 업로드 실패 시 상태 업데이트
      setUploadedImages(prev => 
        prev.map(img => 
          processedFiles.some(pf => pf.id === img.id) 
            ? { ...img, uploadStatus: 'error' }
            : img
        )
      );
      
      // 에러 메시지 표시
      setMessages(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        content: `❌ 업로드 중 오류가 발생했습니다: ${error.message}`,
        timestamp: new Date()
      }]);
      
      alert(`업로드 실패: ${error.message}`);
    }
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