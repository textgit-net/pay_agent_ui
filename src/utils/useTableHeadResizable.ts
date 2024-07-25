
import VueDraggableResizable from 'vue3-draggable-resizable';
import { DraggableContainer } from 'vue3-draggable-resizable';
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css';
export const useTableHeadResizable = (h, props, children,columns) => {
    debugger
    const { key, ...restProps } = props;
    // console.log("ResizeableTitle", key);
    const col = columns.find(col => {
        const k = col.dataIndex || col.key;
        return k === key;
    });

    if (!col || !col.width) {
        return h("th", { ...restProps }, [...children]);
    }

    const dragProps = {
        key: col.dataIndex || col.key,
        class: "table-draggable-handle",
        attrs: {
            w: 10,
            x: col.width,
            z: 1,
            axis: "x",
            draggable: true,
            resizable: false
        },
        on: {
            dragging: (x, y) => {
                console.log(x, y);
                col.width = Math.max(x, 1);
            }
        }
    };
    const drag = h("vue-draggable-resizable", { ...dragProps });
    return h("th", { ...restProps, class: "resize-table-th" }, [
        ...children,
        drag
    ]);
}
