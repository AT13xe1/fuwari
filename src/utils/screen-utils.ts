/**
 * 检测屏幕方向的工具函数
 */

export type ScreenOrientation = 'portrait' | 'landscape';

/**
 * 根据屏幕宽高比判断屏幕方向
 * @returns 'portrait' 表示竖屏，'landscape' 表示横屏
 */
export function getScreenOrientation(): ScreenOrientation {
  if (typeof window === 'undefined') {
    return 'portrait'; // 默认返回竖屏，在服务器端渲染时使用
  }
  
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  // 当宽度大于高度时为横屏，否则为竖屏
  return width > height ? 'landscape' : 'portrait';
}

/**
 * 添加屏幕方向变化监听器
 * @param callback 屏幕方向变化时的回调函数
 */
export function addOrientationChangeListener(callback: (orientation: ScreenOrientation) => void): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  // 初始调用一次
  callback(getScreenOrientation());
  
  // 创建一个包装函数，将事件转换为方向参数
  const orientationChangeHandler = () => {
    callback(getScreenOrientation());
  };
  
  // 监听窗口大小变化
  window.addEventListener('resize', orientationChangeHandler);
  
  // 监听屏幕方向变化（如果浏览器支持）
  if (window.screen && window.screen.orientation) {
    window.screen.orientation.addEventListener('change', orientationChangeHandler);
  }
  
  // 将处理函数存储在回调函数上，以便后续移除
  (callback as any).orientationChangeHandler = orientationChangeHandler;
}

/**
 * 移除屏幕方向变化监听器
 * @param callback 需要移除的回调函数
 */
export function removeOrientationChangeListener(callback: (orientation: ScreenOrientation) => void): void {
  if (typeof window === 'undefined') {
    return;
  }
  
  // 获取存储的处理函数
  const orientationChangeHandler = (callback as any).orientationChangeHandler;
  
  if (orientationChangeHandler) {
    window.removeEventListener('resize', orientationChangeHandler);
    
    if (window.screen && window.screen.orientation) {
      window.screen.orientation.removeEventListener('change', orientationChangeHandler);
    }
    
    // 清除存储的处理函数
    delete (callback as any).orientationChangeHandler;
  }
}