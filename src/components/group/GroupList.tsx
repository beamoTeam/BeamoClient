import {
  IonList,
  IonItem,
  IonImg,
  IonNavLink,
  IonIcon,
  IonListHeader,
  IonLabel,
} from "@ionic/react";
import { Group } from "../../types/group";
import { personCircleOutline, radioButtonOffOutline } from "ionicons/icons";
import css from "./GroupList.module.css";

interface GroupListProps {
  groupList: Group[];
}

export default function GroupList({ groupList }: GroupListProps) {
  return (
    <IonList className={css.list}>
      <IonListHeader>
        <IonLabel>배달 모임</IonLabel>
      </IonListHeader>

      {groupList.map((group) => (
        <IonNavLink key={group.seq} routerDirection="forward">
          <IonItem>
            <IonImg src="./avatar-finn.png" />
            <IonLabel>
              <h2>{group.name}</h2>
              <h3>마감 {group.orderTime.split(" ")[1]}</h3>
              <p>
                {Array(group.maxPersonnel)
                  .fill(0)
                  .map((_, idx) => (
                    <IonIcon key={idx} icon={personCircleOutline} />
                  ))}
                {Array(4 - group.maxPersonnel)
                  .fill(0)
                  .map((_, idx) => (
                    <IonIcon key={idx} icon={radioButtonOffOutline} />
                  ))}
              </p>
            </IonLabel>
          </IonItem>
        </IonNavLink>
      ))}
    </IonList>
  );
}
