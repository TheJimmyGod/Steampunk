import Phaser from "phaser";
// EventBus는 React 구성 요소와 Phaser 
// 장면 간에 이벤트를 내보내는 데 사용됩니다.
export const EventBus = new Phaser.Events.EventEmitter();