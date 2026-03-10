/**
 * 图片工具函数集合
 * 提供图片处理相关的实用函数
 */

/**
 * 将文件转换为Base64字符串
 * @param file - 要转换的文件对象
 * @returns Promise<string> - 返回Base64编码的字符串
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * 将Base64字符串转换为Blob对象
 * @param base64 - Base64编码的字符串
 * @param contentType - 内容类型，默认为image/png
 * @returns Blob - 返回Blob对象
 */
export const base64ToBlob = (base64: string, contentType = 'image/png'): Blob => {
  const byteCharacters = atob(base64.split(',')[1]);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type: contentType });
};

/**
 * 压缩图片并返回Base64字符串
 * @param file - 要压缩的图片文件
 * @param maxWidth - 最大宽度，默认为800
 * @param maxHeight - 最大高度，默认为800
 * @param quality - 压缩质量，0-1之间，默认为0.8
 * @returns Promise<string> - 返回压缩后的Base64字符串
 */
export const compressImageToBase64 = (
  file: File, 
  maxWidth = 800, 
  maxHeight = 800, 
  quality = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // 计算新的尺寸
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        
        // 创建canvas并绘制压缩后的图片
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法创建canvas上下文'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // 转换为Base64
        const base64 = canvas.toDataURL(file.type, quality);
        resolve(base64);
      };
      
      img.onerror = () => {
        reject(new Error('图片加载失败'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
  });
};