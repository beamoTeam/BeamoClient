import { IonContent, IonItem, IonLabel, IonImg, IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { anonymousName } from "../../utils/name";
import { useChatMenuState } from "../../lib/recoil/chatMenuState";
import parseMenu from "../../utils/parseMenu";
import css from "./SlideMenu.module.css";

interface SlideMenuProps {
  close: any;
}

export default function SlideMenu({ close }: SlideMenuProps) {
  const [chatMenu] = useChatMenuState();
  if (!chatMenu) {
    return null;
  }
  if (chatMenu.length === 0) {
    return <p>메뉴를 추가 해주세요</p>;
  }

  const parsedChatMenu: any = {};
  chatMenu.forEach((MENU: any) => {
    if (parsedChatMenu[MENU.sender]) {
      parsedChatMenu[MENU.sender] = [
        ...parsedChatMenu[MENU.sender],
        MENU.menu[0],
      ];
    } else {
      parsedChatMenu[MENU.sender] = [MENU.menu[0]];
    }
  });

  const parsedMenus = Object.keys(parsedChatMenu).map((sender: any) => ({
    sender,
    menu: parseMenu(parsedChatMenu[sender]),
  }));

  return (
    <>
      <IonContent>
        <div className={css.SlideMenu}>
          <div className={css.slideHeader}>
            <div></div>
            <IonIcon icon={closeOutline} onClick={close} />
          </div>

          {parsedMenus.map((Menu: { sender: any; menu: any }, idx: number) => {
            return (
              <div key={idx}>
                <IonItem slot="header" color="light">
                  <IonLabel>{anonymousName(Menu.sender)}</IonLabel>
                </IonItem>
                {Menu.menu.map((info: any) => (
                  <div className={css.info} key={info.seq}>
                    <IonImg src={info.img} className={css.img} />
                    <IonLabel>
                      <h4 className={css.name}>
                        {info.name} x {info.count}
                      </h4>
                      <h4 className={css.price}>
                        {info.price.toLocaleString()}원
                      </h4>
                    </IonLabel>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </IonContent>
    </>
  );
}
