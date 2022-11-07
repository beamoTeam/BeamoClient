import { IonPage, IonButton, IonSpinner } from "@ionic/react";
import { useState, useRef, useEffect } from "react";
import css from "./Chat.module.css";
import chatService from "../lib/api/ChatService";
import { MessageModel } from "../types/chatMsg";
import { useChatMenuState } from "../lib/recoil/chatMenuState";
import { useHistory } from "react-router";
import { useLoginState } from "../lib/recoil/loginState";
import { useLocation } from "react-router";
import Spinner from "../components/spinner/Spinner";

interface ParsedMsg {
  id: string;
  msg: string | null;
  receiver: string | null;
  roomNum: number;
  sender: string | null;
  date: string | null;
  time: string;
  menu: object | null;
  // enter: string | null;
}

export default function Chat() {
  const [, setChatMenu] = useChatMenuState();
  const history = useHistory();
  const { pathname } = useLocation();
  const [isLogin] = useLoginState();
  const [sendLoading, setSendLoading] = useState<boolean>(false);
  const [msgList, setMsgList] = useState<any | null>(null);
  const [msg, setMsg] = useState<string>("");
  const eventSource = useRef<any>(null);
  const scrollRef = useRef<any>(null);
  const roomNum = Number(pathname.split("/").at(-1));
  const sender = window.localStorage.getItem("CHAT_SENDER");
  const dateHash: any = useRef<any>({});
  const senderHash: any = useRef<any>({});
  const currentSender = useRef<any>(null);

  useEffect(() => {
    if (!isLogin || !roomNum || isNaN(roomNum)) {
      history.goBack();
    }
  }, [isLogin, roomNum, history]);

  // EventSource
  if (!eventSource.current) {
    eventSource.current = new EventSource(
      `${process.env.REACT_APP_CHAT_URL}chat/roomNum/${roomNum}`
    );
  }

  eventSource.current.onmessage = (e: any) => {
    const serverMsg: MessageModel = JSON.parse(e.data);

    const test: ParsedMsg = {
      id: serverMsg.id,
      msg: serverMsg.msg,
      receiver: serverMsg.receiver,
      roomNum: serverMsg.roomNum,
      sender: serverMsg.sender,
      date: "",
      time: "",
      menu: null,
    };

    // 1. menu filtering
    if (serverMsg.sender.includes("mainMenu")) {
      test.msg = null;
      test.menu = JSON.parse(serverMsg.msg);
      test.sender = serverMsg.sender.split("_")[1];
    }

    // 2. teim filtering
    const [yyyy, mm, dd]: any = serverMsg.createdAt;
    const create_date = `${yyyy}년 ${mm}월 ${dd}일`;
    test.date = dateHash.current[create_date] === true ? null : create_date;
    test.time = `${serverMsg.createdAt[3]}:${serverMsg.createdAt[4]}`;

    if (test.menu) {
      setChatMenu((prev: any) => [
        ...prev,
        {
          sender: test.sender,
          menu: test.menu,
        },
      ]);
    }

    if (test.msg) {
      setMsgList((prev: any) => (prev ? [...prev, test] : [test]));
    }
    dateHash.current[create_date] = true;
  };

  // hack
  useEffect(() => {
    scrollRef.current.scrollIntoView(false);
  }, [msgList]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (msg.length === 0) {
      return;
    }
    setSendLoading(true);
    try {
      // api call (send message)
      await chatService.sendMessage({
        sender: sender,
        roomNum,
        msg,
      });
      scrollRef.current.scrollIntoView(false);
    } catch (err) {
      alert("알수없는 오류가 발생했습니다.");
      console.error(err);
    } finally {
      setMsg("");
      setSendLoading(false);
    }
  };

  return (
    <div className={css.chat}>
      <IonPage>
        <ul className={css.textList}>
          {!msgList ? (
            <Spinner />
          ) : (
            msgList.map((message: any) => (
              <div key={message.id}>
                {message.date && <DateIndicator date={message.date} />}
                <div className={css.textBox}>
                  {message.sender !== sender && (
                    <LeftChatBox message={message} />
                  )}
                  {message.sender === sender && (
                    <RightChatBox message={message} />
                  )}
                </div>
              </div>
            ))
          )}
          <div className={css.scrollRef} ref={scrollRef}></div>
        </ul>
        <textarea
          className={css.textField}
          placeholder="채팅을 입력하세요"
          value={msg}
          onChange={(e) => setMsg(e.target.value!)}
        ></textarea>
        <div className={css.send}>
          {sendLoading ? (
            <IonButton>
              <IonSpinner />
            </IonButton>
          ) : (
            <IonButton onClick={onSubmit}>전송</IonButton>
          )}
        </div>
      </IonPage>
    </div>
  );
}

function LeftChatBox({ message }: any) {
  return (
    <div className={css.leftWrap}>
      <div className={css.chatAvatar}></div>
      <div className={css.leftNameBox}>
        <p className={css.leftSender}>{message.sender}</p>
        <p className={css.textBoxL}>{message.msg}</p>
      </div>
    </div>
  );
}

function RightChatBox({ message }: any) {
  return (
    <>
      <p className={css.msgTimeR}>{message.time}</p>
      <p className={css.textBoxR}>{message.msg}</p>
    </>
  );
}

function DateIndicator({ date }: any) {
  return <div className={css.dateLine}>{date}</div>;
}
