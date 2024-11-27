import { useState } from "react";
import { IconButton } from "./iconButton";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  language: "ja" | "en";
  userMessage: string;
  isMicRecording: boolean;
  isChatProcessing: boolean;
  onChangeUserMessage: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onClickSendButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onClickMicButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
};
export const MessageInput = ({
  language,
  userMessage,
  isMicRecording,
  isChatProcessing,
  onChangeUserMessage,
  onClickMicButton,
  onClickSendButton,
}: Props) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="absolute bottom-0 z-20 w-screen">
      <div className="bg-base text-black">
        <div className="mx-auto max-w-4xl p-16">
          <div className="grid grid-flow-col gap-[8px] grid-cols-[min-content_1fr_min-content]">
            <IconButton
              iconName="24/Microphone"
              className="bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled"
              isProcessing={isMicRecording}
              disabled={isChatProcessing}
              onClick={onClickMicButton}
            />
            <input
              type="text"
              placeholder={
                language == "ja"
                  ? "聞きたいことをいれてね"
                  : "Type your message"
              }
              onChange={onChangeUserMessage}
              disabled={isChatProcessing}
              className="bg-surface1 hover:bg-surface1-hover focus:bg-surface1 disabled:bg-surface1-disabled disabled:text-primary-disabled rounded-16 w-full px-16 text-text-primary typography-16 font-bold disabled"
              value={userMessage}
            ></input>

            <IconButton
              iconName="24/Send"
              className="bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled"
              isProcessing={isChatProcessing}
              disabled={isChatProcessing || !userMessage}
              onClick={onClickSendButton}
            />
          </div>
        </div>
        <div className="py-4 bg-[#413D43] text-center text-white font-Montserrat">
          Powered by GPT-3.5. &nbsp;
          <button
            onClick={toggleCollapse}
            className="inline-flex items-center ml-2 px-3 py-1 rounded-full bg-[#555155] hover:bg-[#656165] transition-colors duration-200"
          >
            <span className="ml-4 mr-1">{isCollapsed ? "More" : "Close"}</span>
            {isCollapsed ? (
              <ChevronDown className="w-24 h-24" />
            ) : (
              <ChevronUp className="w-24 h-24" />
            )}
          </button>
          {!isCollapsed && (
            <div className="mt-2">
              Hatsune Miku, © Crypton Future Media, Inc. 2007, licensed under a CC BY-NC.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
