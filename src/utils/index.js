/**
 * 计算字体大小
 * @param {Number} size 字体大小（单位px）
 */
export function computeFontSize(size) {
    const clientWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (!clientWidth) return 12;
    return size * clientWidth / 1920;
}