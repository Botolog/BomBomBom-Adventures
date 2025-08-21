import {KEY} from "../../shared/defs"

export var width: number = 500;
export var height: number = 250;

// export function keyInput(inputKeys: string[]): ArrayBuffer{
//   const toSend: number[] = []
//   // if ("k" in inputKeys) moveCam(-15, 0);
//   // if (";" in inputKeys) moveCam(15, 0);
//   // if ("o" in inputKeys) moveCam(0, 15);
//   // if ("l" in inputKeys) moveCam(0, -15);
//   if ("ArrowLeft" in inputKeys)  toSend.push(KEYS.LEFT)
//   if ("ArrowRight" in inputKeys) toSend.push(KEYS.RIGHT)
//   if ("ArrowUp" in inputKeys)    toSend.push(KEYS.UP)
//   if ("ArrowDown" in inputKeys)  toSend.push(KEYS.DOWN)
//   // if ("a" in inputKeys) Me.control(-1, 0);
//   // if ("d" in inputKeys) Me.control(1, 0);
//   // if ("w" in inputKeys) Me.control(0, 0.02);
//   // if ("s" in inputKeys) Me.control(0, -0.2);
//   // if (" " in inputKeys) Me.meleeAttack();
//   // if ("`" in inputKeys) gameTick();
//   // if (inputKeys.includes("q")) console.log(

//   //   // SCENEMANAGER.currentScene.camera.inView(new Vector2()).toString()
//   // );
//   // CAMERA.forceCenterCam(Me.body.coordinates)
//   return new Uint8Array(toSend).buffer
// }

// export function areSetsEqual(setA: Set<string>, setB: Set<string>): bool {
//   // Check if the sizes are different first, which is the fastest check.
//   // If the sizes don't match, the sets cannot be equal.
//   if (setA.size !== setB.size) {
//     return false;
//   }

//   // Iterate over each element of setA.
//   // The 'for...of' loop is a great way to iterate over iterables in AssemblyScript
//   // without creating a closure.
//   for (const element of setA) {
//     // For each element, check if the other set (setB) contains it.
//     // The `has()` method on a Set is very efficient (average O(1)).
//     // If we find even one element from setA that is not in setB, we can
//     // immediately return false, as the sets are not equal.
//     if (!setB.has(element)) {
//       return false;
//     }
//   }

//   // If the function reaches this point, it means all elements in setA were
//   // found in setB, and the sizes were equal. Therefore, the sets are equal.
//   return true;
// }