"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unload = exports.load = exports.methods = void 0;
/**
 * @en Methods within the extension can be triggered by message
 * @zh 扩展内的方法，可以通过 message 触发
 */
exports.methods = {
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
function load() {
    // Editor.Message.send('{name}', 'hello');
}
exports.load = load;
/**
 * @en Method triggered when uninstalling the extension
 * @zh 卸载扩展触发的方法
 */
function unload() { }
exports.unload = unload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NvdXJjZS9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBOzs7R0FHRztBQUNVLFFBQUEsT0FBTyxHQUE0QztBQUM5RCxNQUFNO0FBQ04sbURBQW1EO0FBQ25ELDBCQUEwQjtBQUMxQix5Q0FBeUM7QUFDekMsTUFBTTtBQUNOLDhCQUE4QjtBQUM5Qiw0QkFBNEI7QUFDNUIsMENBQTBDO0FBQzFDLEtBQUs7Q0FDTixDQUFDO0FBRUY7OztHQUdHO0FBQ0gsU0FBZ0IsSUFBSTtJQUNsQiwwQ0FBMEM7QUFDNUMsQ0FBQztBQUZELG9CQUVDO0FBRUQ7OztHQUdHO0FBQ0gsU0FBZ0IsTUFBTSxLQUFJLENBQUM7QUFBM0Isd0JBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZW4gTWV0aG9kcyB3aXRoaW4gdGhlIGV4dGVuc2lvbiBjYW4gYmUgdHJpZ2dlcmVkIGJ5IG1lc3NhZ2VcbiAqIEB6aCDmianlsZXlhoXnmoTmlrnms5XvvIzlj6/ku6XpgJrov4cgbWVzc2FnZSDop6blj5FcbiAqL1xuZXhwb3J0IGNvbnN0IG1ldGhvZHM6IHsgW2tleTogc3RyaW5nXTogKC4uLmFueTogYW55KSA9PiBhbnkgfSA9IHtcbiAgLy8gLyoqXG4gIC8vICAqIEBlbiBBIG1ldGhvZCB0aGF0IGNhbiBiZSB0cmlnZ2VyZWQgYnkgbWVzc2FnZVxuICAvLyAgKiBAemgg6YCa6L+HIG1lc3NhZ2Ug6Kem5Y+R55qE5pa55rOVXG4gIC8vICAqIEBwYXJhbSBzdHIgVGhlIHN0cmluZyB0byBiZSBwcmludGVkXG4gIC8vICAqL1xuICAvLyBhc3luYyBoZWxsbyhzdHI/OiBzdHJpbmcpIHtcbiAgLy8gICAgIHN0ciA9IHN0ciB8fCAnV29ybGQnO1xuICAvLyAgICAgcmV0dXJuIGNvbnNvbGUubG9nKGBIZWxsbyAke3N0cn1gKTtcbiAgLy8gfSxcbn07XG5cbi8qKlxuICogQGVuIFRoZSBtZXRob2QgZXhlY3V0ZWQgd2hlbiB0aGUgZXh0ZW5zaW9uIGlzIHN0YXJ0ZWRcbiAqIEB6aCDmianlsZXlkK/liqjnmoTml7blgJnmiafooYznmoTmlrnms5VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxvYWQoKSB7XG4gIC8vIEVkaXRvci5NZXNzYWdlLnNlbmQoJ3tuYW1lfScsICdoZWxsbycpO1xufVxuXG4vKipcbiAqIEBlbiBNZXRob2QgdHJpZ2dlcmVkIHdoZW4gdW5pbnN0YWxsaW5nIHRoZSBleHRlbnNpb25cbiAqIEB6aCDljbjovb3mianlsZXop6blj5HnmoTmlrnms5VcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVubG9hZCgpIHt9XG4iXX0=