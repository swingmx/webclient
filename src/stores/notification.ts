import { defineStore } from "pinia";
import { NotifType } from "../enums";
import { Notif } from "../interfaces";

const useToast = defineStore("notification", {
  state: () => ({
    notifs: <Notif[]>[],
  }),
  actions: {
    showNotification(new_text: string, new_type?: NotifType) {
      this.notifs.push(<Notif>{
        text: new_text,
        type: new_type,
      });

      setTimeout(() => {
        this.notifs.shift();
      }, 3000);
    },
    showError(text: string) {
      this.showNotification(text, NotifType.Error);
    },
    showSuccess(text: string){
      this.showNotification(text, NotifType.Success);
    },
    showGenericError(){
      this.showError("Failed! Something went wrong!")
    }
  },
});

class Notification {
  constructor(text: string, type: NotifType = NotifType.Info) {
    useToast().showNotification(text, type);
  }
}

export { NotifType, Notification, useToast };
