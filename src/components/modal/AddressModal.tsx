import React, { useCallback, useRef } from "react";
import { IonModal } from "@ionic/react";
import DaumPostcodeEmbed from "react-daum-postcode";
import { useAddrState } from "../../lib/recoil/addrState";
import useLocalStorage from "../../hooks/useLocalStorage";
// import { modalState, modalPresentState } from "../../lib/recoil/modalState";
// import { useRecoilValue, useSetRecoilState } from "recoil";

function AddressModal() {
  const modal = useRef<HTMLIonModalElement>(null);
  const [, setAddr] = useAddrState();
  // const setModal = useSetRecoilState(modalState);
  // const present = useRecoilValue(modalPresentState);
  // const [, setAddr] = useAddrState();

  const dismiss = useCallback(() => {
    modal.current?.dismiss();
  }, []);

  const onComplete = useCallback(
    (data: any) => {
      let fullAddress = data.address;
      let extraAddress = "";

      if (data.addressType === "R") {
        if (data.bname !== "") {
          extraAddress += data.bname;
        }
        if (data.buildingName !== "") {
          extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
        }
        fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
      }
      dismiss();
      setAddr(fullAddress);
      useLocalStorage.set("ADDR", fullAddress);
    },
    [setAddr, dismiss]
  );

  return (
    <div>
      <IonModal
        // isOpen={true}
        ref={modal}
        trigger="open-address-modal"
        initialBreakpoint={0.6}
        breakpoints={[0, 0.25, 0.5, 0.65]}
        // onDidDismiss={onDidDismiss}
      >
        <div style={{ marginTop: "15px", height: "100%" }}>
          <DaumPostcodeEmbed onComplete={onComplete} />
        </div>
      </IonModal>
    </div>
  );
}

export default React.memo(AddressModal);
