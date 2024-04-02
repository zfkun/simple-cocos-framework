/**
 * @en Methods within the extension can be triggered by message
 * @zh 扩展内的方法，可以通过 message 触发
 */
export const methods: { [key: string]: (...any: any) => any } = {
  // /**
  //  * @en A method that can be triggered by message
  //  * @zh 通过 message 触发的方法
  //  * @param str The string to be printed
  //  */
  // async hello(str?: string) {
  //     str = str || 'World';
  //     return console.log(`Hello ${str}`);
  // },
};

/**
 * @en The method executed when the extension is started
 * @zh 扩展启动的时候执行的方法
 */
export function load() {
  // Editor.Message.send('{name}', 'hello');
}

/**
 * @en Method triggered when uninstalling the extension
 * @zh 卸载扩展触发的方法
 */
export function unload() {}
