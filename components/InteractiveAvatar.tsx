import type { StartAvatarResponse } from "@heygen/streaming-avatar";

import StreamingAvatar, {
  AvatarQuality,
  StreamingEvents, TaskMode, TaskType, VoiceEmotion,
} from "@heygen/streaming-avatar";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Input,
  Select,
  SelectItem,
  Spinner,
  Chip,
  Tabs,
  Tab,
  Tooltip,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { useMemoizedFn, usePrevious } from "ahooks";
import { MessageSquareText, Mic, ArrowLeft, Link, FileText, FileUp, File } from "lucide-react";
import { useRouter } from "next/navigation";
import mammoth from 'mammoth';

import InteractiveAvatarTextInput from "./InteractiveAvatarTextInput";

import { AVATARS, STT_LANGUAGE_LIST } from "@/app/lib/constants";

type KnowledgeBaseType = 'url' | 'text' | 'pdf' | 'doc';

export default function InteractiveAvatar() {
  const router = useRouter();
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isLoadingRepeat, setIsLoadingRepeat] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [knowledgeBase, setKnowledgeBase] = useState<string>("");
  const [avatarId, setAvatarId] = useState<string>("");
  const [language, setLanguage] = useState<string>('en');

  const [data, setData] = useState<StartAvatarResponse>();
  const [text, setText] = useState<string>("");
  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatar | null>(null);
  const [chatMode, setChatMode] = useState("text_mode");
  const [isUserTalking, setIsUserTalking] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  const [selectedKnowledgeType, setSelectedKnowledgeType] = useState<KnowledgeBaseType | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processingStatus, setProcessingStatus] = useState<string>('');

  useEffect(() => {
    const selectedAvatarId = localStorage.getItem('selectedAvatarId');
    if (selectedAvatarId) {
      setAvatarId(selectedAvatarId);
      localStorage.removeItem('selectedAvatarId');
    }
  }, []);

  async function fetchAccessToken() {
    try {
      const response = await fetch("/api/get-access-token", {
        method: "POST",
      });
      const token = await response.text();

      console.log("Access Token:", token); // Log the token to verify

      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
    }

    return "";
  }

  async function startSession() {
    setIsLoadingSession(true);
    setLoadingMessage("Initializing your avatar session... This may take a few seconds.");

    const newToken = await fetchAccessToken();
    if (!newToken) {
      setLoadingMessage("Having trouble connecting. Please try again.");
      setIsLoadingSession(false);
      return;
    }

    setLoadingMessage("Almost ready! Setting up your interactive experience...");

    avatar.current = new StreamingAvatar({
      token: newToken,
    });
    avatar.current.on(StreamingEvents.AVATAR_START_TALKING, (e) => {
      console.log("Avatar started talking", e);
    });
    avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, (e) => {
      console.log("Avatar stopped talking", e);
    });
    avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
      console.log("Stream disconnected");
      endSession();
    });
    avatar.current?.on(StreamingEvents.STREAM_READY, (event) => {
      console.log(">>>>> Stream ready:", event.detail);
      setStream(event.detail);
      setLoadingMessage("");
    });
    avatar.current?.on(StreamingEvents.USER_START, (event) => {
      console.log(">>>>> User started talking:", event);
      setIsUserTalking(true);
    });
    avatar.current?.on(StreamingEvents.USER_STOP, (event) => {
      console.log(">>>>> User stopped talking:", event);
      setIsUserTalking(false);
    });
    try {
      const res = await avatar.current.createStartAvatar({
        quality: AvatarQuality.Low,
        avatarName: avatarId,
        knowledgeBase: knowledgeBase,
        // knowledgeBase: "https://www.appclick.ng/about.php", // Or use a custom `knowledgeBase`.
        // knowledgeId: knowledgeId, // Or use a custom `knowledgeBase`.
        voice: {
          // voice_id: "26b2064088674c80b1e5fc5ab1a068eb",
          rate: 1.5, // 0.5 ~ 1.5
          emotion: VoiceEmotion.EXCITED,
          // elevenlabsSettings: {
          //   stability: 1,
          //   similarity_boost: 1,
          //   style: 1,
          //   use_speaker_boost: false,
          // },
        },
        video_encoding: {
          codec: "h264", // Video codec (h264 or vp8)
        },
        language: language,
        disableIdleTimeout: true,
      } as any);

      setData(res);
      // default to voice mode
      await avatar.current?.startVoiceChat({
        useSilencePrompt: false
      });
      setChatMode("voice_mode");
    } catch (error) {
      console.error("Error starting avatar session:", error);
      setLoadingMessage("Something went wrong. Please try again.");
    } finally {
      setIsLoadingSession(false);
      setLoadingMessage("");
    }
  }
  async function handleSpeak() {
    setIsLoadingRepeat(true);
    if (!avatar.current) {
      return;
    }
    await avatar.current.speak({ text: text, taskType: TaskType.TALK, taskMode: TaskMode.SYNC }).catch((e) => {
    });
    setIsLoadingRepeat(false);
  }
  async function handleInterrupt() {
    if (!avatar.current) {
      return;
    }
    await avatar.current
      .interrupt()
      .catch((e) => {
      });
  }
  async function endSession() {
    await avatar.current?.stopAvatar();
    setStream(undefined);
  }

  const handleChangeChatMode = useMemoizedFn(async (v) => {
    if (v === chatMode) {
      return;
    }
    if (v === "text_mode") {
      avatar.current?.closeVoiceChat();
    } else {
      await avatar.current?.startVoiceChat();
    }
    setChatMode(v);
  });

  const previousText = usePrevious(text);
  useEffect(() => {
    if (!previousText && text) {
      avatar.current?.startListening();
    } else if (previousText && !text) {
      avatar?.current?.stopListening();
    }
  }, [text, previousText]);

  useEffect(() => {
    return () => {
      endSession();
    };
  }, []);

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
      };
    }
  }, [mediaStream, stream]);

  const handlePdfClick = () => {
    setSelectedKnowledgeType('pdf');
    if (fileInputRef.current) {
      fileInputRef.current.accept = '.pdf';
      fileInputRef.current.click();
    }
  };

  const handleDocClick = () => {
    setSelectedKnowledgeType('doc');
    if (fileInputRef.current) {
      fileInputRef.current.accept = '.docx';
      fileInputRef.current.click();
    }
  };

  const extractPdfContent = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'pdf');

    const cookies = document.cookie.split(';');
    const authToken = cookies
      .find(cookie => cookie.trim().startsWith('authToken='))
      ?.split('=')[1];

    if (!authToken) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch('/api/process-document', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to extract PDF content: ${response.status}`);
      }

      const data = await response.json();

      if (typeof data === 'string') {
        return data;
      } else if (data.content) {
        return data.content;
      } else if (data.text) {
        return data.text;
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      throw error;
    }
  };

  const extractDocxContent = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'docx');

    const cookies = document.cookie.split(';');
    const authToken = cookies
      .find(cookie => cookie.trim().startsWith('authToken='))
      ?.split('=')[1];

    if (!authToken) {
      throw new Error('Authentication token not found');
    }

    try {
      const response = await fetch('/api/process-document', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to extract DOCX content: ${response.status}`);
      }

      const data = await response.json();

      if (typeof data === 'string') {
        return data;
      } else if (data.content) {
        return data.content;
      } else if (data.text) {
        return data.text;
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      throw error;
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);
    setIsProcessingFile(true);
    setKnowledgeBase(''); // Clear previous content
    setProcessingStatus('Processing...');

    try {
      let extractedText = '';

      if (selectedKnowledgeType === 'pdf') {
        extractedText = await extractPdfContent(file);
      } else if (selectedKnowledgeType === 'doc') {
        extractedText = await extractDocxContent(file);
      }

      // Add type check before cleaning the text
      if (typeof extractedText === 'string') {
        // Clean up the extracted text
        extractedText = extractedText
          .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
          .trim();               // Remove leading/trailing whitespace
      } else {
        console.error('Unexpected extractedText type:', typeof extractedText);
        throw new Error('Extracted text is not a string');
      }

      setKnowledgeBase(extractedText);
      setProcessingStatus('Processed');
    } catch (error) {
      console.error('Error processing file:', error);
      setProcessingStatus('Failed to process');
      setKnowledgeBase('');
    } finally {
      setIsProcessingFile(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <Card className="bg-white border border-gray-200">
        <CardBody className="h-[350px] flex flex-col justify-center items-center bg-white">
          {stream ? (
            <div className="h-[400px] w-full max-w-[900px] justify-center items-center flex rounded-lg overflow-hidden">
              <video
                ref={mediaStream}
                autoPlay
                playsInline
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              >
                <track kind="captions" />
              </video>
              <div className="flex flex-col gap-1 absolute bottom-3 right-3">
                <Button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs px-3"
                  size="sm"
                  onClick={handleInterrupt}
                >
                  Interrupt task
                </Button>
                <Button
                  className="bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-xs px-3"
                  size="sm"
                  onClick={endSession}
                >
                  End session
                </Button>
              </div>
            </div>
          ) : !isLoadingSession ? (
            <div className="h-full justify-center items-center flex flex-col gap-2 w-[500px] self-center relative">
              <Button
                isIconOnly
                className="absolute -left-40 top-0 bg-transparent"
                onClick={() => router.back()}
              >
                <ArrowLeft className="text-gray-600" size={24} />
              </Button>
              <div className="flex flex-col gap-1 w-full px-2">
                {!selectedKnowledgeType && (
                  <p className="text-xs text-gray-600 text-center">
                    Select a knowledge base option to begin
                  </p>
                )}
                <div className="grid grid-cols-4 gap-2">
                  <Tooltip
                    content="Enter URL"
                    delay={0}
                    classNames={{
                      content: "bg-gradient-to-tr from-purple-600 to-pink-500 text-white font-medium"
                    }}
                  >
                    <Button
                      className={`flex items-center justify-center p-4 h-14 transition-all duration-300 ${selectedKnowledgeType === 'url'
                        ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg scale-105'
                        : 'bg-gradient-to-tr from-white to-purple-50 hover:from-purple-50 hover:to-purple-100 border border-purple-100 shadow-sm hover:shadow-md hover:scale-105'
                        }`}
                      onClick={() => setSelectedKnowledgeType('url')}
                    >
                      <Link
                        size={24}
                        className={`${selectedKnowledgeType === 'url'
                          ? 'text-white'
                          : 'text-purple-500'
                          } transition-colors`}
                      />
                    </Button>
                  </Tooltip>

                  <Tooltip
                    content="Text Content"
                    delay={0}
                    classNames={{
                      content: "bg-gradient-to-tr from-purple-600 to-pink-500 text-white font-medium"
                    }}
                  >
                    <Button
                      className={`flex items-center justify-center p-4 h-14 transition-all duration-300 ${selectedKnowledgeType === 'text'
                        ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg scale-105'
                        : 'bg-gradient-to-tr from-white to-rose-50 hover:from-rose-50 hover:to-rose-100 border border-purple-100 shadow-sm hover:shadow-md hover:scale-105'
                        }`}
                      onClick={() => setSelectedKnowledgeType('text')}
                    >
                      <FileText
                        size={24}
                        className={`${selectedKnowledgeType === 'text'
                          ? 'text-white'
                          : 'text-pink-500'
                          } transition-colors`}
                      />
                    </Button>
                  </Tooltip>

                  <Tooltip
                    content="Upload PDF"
                    delay={0}
                    classNames={{
                      content: "bg-gradient-to-tr from-purple-600 to-pink-500 text-white font-medium"
                    }}
                  >
                    <Button
                      className={`flex items-center justify-center p-4 h-14 transition-all duration-300 ${selectedKnowledgeType === 'pdf'
                        ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg scale-105'
                        : 'bg-gradient-to-tr from-white to-fuchsia-50 hover:from-fuchsia-50 hover:to-fuchsia-100 border border-purple-100 shadow-sm hover:shadow-md hover:scale-105'
                        }`}
                      onClick={handlePdfClick}
                    >
                      <FileUp
                        size={24}
                        className={`${selectedKnowledgeType === 'pdf'
                          ? 'text-white'
                          : 'text-fuchsia-500'
                          } transition-colors`}
                      />
                    </Button>
                  </Tooltip>

                  <Tooltip
                    content="Upload Word Document"
                    delay={0}
                    classNames={{
                      content: "bg-gradient-to-tr from-purple-600 to-pink-500 text-white font-medium"
                    }}
                  >
                    <Button
                      className={`flex items-center justify-center p-4 h-14 transition-all duration-300 ${selectedKnowledgeType === 'doc'
                        ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white shadow-lg scale-105'
                        : 'bg-gradient-to-tr from-white to-violet-50 hover:from-violet-50 hover:to-violet-100 border border-purple-100 shadow-sm hover:shadow-md hover:scale-105'
                        }`}
                      onClick={handleDocClick}
                    >
                      <File
                        size={24}
                        className={`${selectedKnowledgeType === 'doc'
                          ? 'text-white'
                          : 'text-violet-500'
                          } transition-colors`}
                      />
                    </Button>
                  </Tooltip>
                </div>

                <div className="mt-2">
                  {selectedKnowledgeType === 'url' && (
                    <Input
                      placeholder="Enter URL"
                      value={knowledgeBase}
                      onChange={(e) => setKnowledgeBase(e.target.value)}
                      startContent={<Link size={18} />}
                    />
                  )}

                  {selectedKnowledgeType === 'text' && (
                    <Textarea
                      placeholder="Enter or paste your text content"
                      value={knowledgeBase}
                      onChange={(e) => setKnowledgeBase(e.target.value)}
                      minRows={3}
                      maxRows={4}
                      classNames={{
                        input: "text-sm py-1",
                        base: "border-1 border-gray-200"
                      }}
                    />
                  )}

                  {(selectedKnowledgeType === 'pdf' || selectedKnowledgeType === 'doc') && (
                    <div className="flex flex-col gap-0.5">
                      {selectedFileName && (
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-2 px-2 py-1 bg-gray-50 rounded-lg">
                            {selectedKnowledgeType === 'pdf' ? (
                              <FileUp size={14} className="text-fuchsia-500" />
                            ) : (
                              <File size={14} className="text-violet-500" />
                            )}
                            <span className="text-gray-600 text-xs">{selectedFileName}</span>
                            {isProcessingFile ? (
                              <Spinner size="sm" color="secondary" />
                            ) : (
                              <span className={`text-xs ${processingStatus === 'Processed' ? 'text-green-500' :
                                processingStatus === 'Failed to process' ? 'text-red-500' :
                                  'text-gray-500'}`}>
                                {processingStatus}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {knowledgeBase && (
                        <div className="flex flex-col gap-0.5">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-500">
                              Extracted Content
                            </span>
                            <span className="text-xs text-gray-400">
                              {knowledgeBase.length} characters
                            </span>
                          </div>
                          <Textarea
                            value={knowledgeBase}
                            isReadOnly
                            minRows={3}
                            maxRows={4}
                            placeholder="Extracted content will appear here..."
                            classNames={{
                              input: "bg-gray-50 text-sm py-1",
                              base: "border-1 border-gray-200"
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div style={{ display: 'none' }}>
                  <p className="text-sm font-medium leading-none">
                    {/* Custom Avatar ID (optional) */}
                    Selected Avatar
                  </p>
                  <Input
                    placeholder="Enter a custom avatar ID"
                    value={avatarId}
                    onChange={(e) => setAvatarId(e.target.value)}
                    isReadOnly
                  />
                </div>
                {/* <Select
                  placeholder="Or select one from these example avatars"
                  size="md"
                  onChange={(e) => {
                    setAvatarId(e.target.value);
                  }}
                  selectedKeys={avatarId ? [avatarId] : []}
                >
                  {AVATARS.map((avatar) => (
                    <SelectItem
                      key={avatar.avatar_id}
                      textValue={avatar.avatar_id}
                    >
                      {avatar.name}
                    </SelectItem>
                  ))}
                </Select> */}
                <Select
                  placeholder="Select language"
                  className="max-w-xs"
                  selectedKeys={[language]}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                  }}
                  classNames={{
                    trigger: "h-6 min-h-unit-6",
                    value: "text-xs",
                    base: "min-h-unit-6",
                    label: "hidden",
                  }}
                >
                  {STT_LANGUAGE_LIST.map((lang) => (
                    <SelectItem
                      key={lang.key}
                      startContent={
                        <div className="w-4 h-4 rounded-full flex items-center justify-center bg-gray-100">
                          <span className="text-xs">{lang.flag}</span>
                        </div>
                      }
                      className="text-sm"
                    >
                      {lang.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <Button
                className="bg-gradient-to-tr from-indigo-500 to-indigo-300 w-full text-white mt-1"
                size="sm"
                variant="shadow"
                onClick={startSession}
                isDisabled={!knowledgeBase.trim()}
              >
                Start session
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Spinner color="primary" size="lg" />
              {loadingMessage && (
                <div className="text-center max-w-md">
                  <p className="text-indigo-500 font-medium animate-pulse">
                    {loadingMessage}
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    This process usually takes 10-15 seconds
                  </p>
                </div>
              )}
            </div>
          )}
        </CardBody>
        <Divider className="bg-gray-200" />
        <CardFooter className="flex flex-col gap-3 relative bg-white">
          <Tabs
            aria-label="Chat mode options"
            selectedKey={chatMode}
            onSelectionChange={(v) => {
              handleChangeChatMode(v);
            }}
            classNames={{
              tabList: "gap-4",
              cursor: "w-full bg-indigo-500",
              tab: "h-10 w-10 data-[selected=true]:text-white",
              tabContent: "text-indigo-500"
            }}
          >
            <Tab
              key="text_mode"
              title={
                <Tooltip
                  content="Chat"
                  delay={0}
                  classNames={{
                    content: "bg-gradient-to-tr from-purple-600 to-pink-500 text-white font-medium"
                  }}
                >
                  <MessageSquareText
                    size={24}
                    className={`${chatMode === "text_mode"
                      ? "text-white"
                      : "text-indigo-500"
                      } transition-colors`}
                  />
                </Tooltip>
              }
              aria-label="Text mode"
            />
            <Tab
              key="voice_mode"
              title={
                <Tooltip
                  content="Voice"
                  delay={0}
                  classNames={{
                    content: "bg-gradient-to-tr from-purple-600 to-pink-500 text-white font-medium"
                  }}
                >
                  <Mic
                    size={24}
                    className={`${chatMode === "voice_mode"
                      ? "text-white"
                      : "text-indigo-500"
                      } transition-colors`}
                  />
                </Tooltip>
              }
              aria-label="Voice mode"
            />
          </Tabs>
          {chatMode === "text_mode" ? (
            <div className="w-full flex relative">
              <InteractiveAvatarTextInput
                disabled={!stream}
                input={text}
                label=""
                loading={isLoadingRepeat}
                placeholder="Type something for the avatar to respond"
                setInput={setText}
                onSubmit={handleSpeak}
              />
              {text && (
                <Chip className="absolute right-16 top-3">Listening</Chip>
              )}
            </div>
          ) : (
            <div className="w-full text-center">
              <Button
                isDisabled={!isUserTalking}
                className="bg-gradient-to-tr from-indigo-500 to-indigo-300 text-white"
                size="md"
                variant="shadow"
              >
                {isUserTalking ? "Listening" : "Voice chat"}
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>
      {/* <p className="font-mono text-right">
        <span className="font-bold">Console:</span>
        <br />
        {debug}
      </p> */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileUpload}
        accept={selectedKnowledgeType === 'pdf' ? '.pdf' : '.docx'}
      />
    </div>
  );
}
