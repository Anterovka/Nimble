import JSZip from 'jszip';

async function urlToBase64(url: string, type: 'image' | 'font' = 'image'): Promise<string> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn(`Не удалось загрузить ${type === 'image' ? 'изображение' : 'шрифт'} ${url}:`, error);
    return url;
  }
}

async function extractImagesFromDataURLs(html: string): Promise<{ html: string; images: Map<string, Blob> }> {
  const processedHtml = html;
  const images = new Map<string, Blob>();
  let imageCounter = 0;

  const imgTagRegex = /<img\s+([^>]*?)>/gi;
  let match;
  const imgTags: Array<{ fullMatch: string; attributes: string }> = [];
  
  while ((match = imgTagRegex.exec(html)) !== null) {
    imgTags.push({
      fullMatch: match[0],
      attributes: match[1],
    });
  }
  
  let updatedHtml = html;
  
  for (const imgTag of imgTags) {
    let dataUrl: string | null = null;
    let mimeType: string | null = null;
    let base64Data: string | null = null;
    let quote: string = '"';
    
    const dataUrlPatternWithQuotes = /src\s*=\s*(["'])(data:image\/([^;]+);base64,([^"']+))\1/i;
    const dataUrlMatch = imgTag.attributes.match(dataUrlPatternWithQuotes);
    
    if (dataUrlMatch && dataUrlMatch[2]) {
      dataUrl = dataUrlMatch[2];
      mimeType = dataUrlMatch[3];
      base64Data = dataUrlMatch[4];
      quote = dataUrlMatch[1];
    } else {
      const srcMatch = imgTag.attributes.match(/src\s*=\s*([^\s>]+)/i);
      if (srcMatch && srcMatch[1]) {
        const srcValue = srcMatch[1];
        const cleanSrc = srcValue.replace(/^["']|["']$/g, '');
        
        if (cleanSrc.startsWith('data:image/')) {
          const dataUrlMatch = cleanSrc.match(/data:image\/([^;]+);base64,(.+)/i);
          if (dataUrlMatch && dataUrlMatch[1] && dataUrlMatch[2]) {
            mimeType = dataUrlMatch[1];
            base64Data = dataUrlMatch[2];
            dataUrl = cleanSrc;
            quote = '"';
          }
        }
      }
    }
    
    if (dataUrl && mimeType && base64Data) {
      try {
        if (!base64Data || base64Data.length === 0) {
          continue;
        }
        
        let byteCharacters: string;
        try {
          byteCharacters = atob(base64Data);
        } catch (error) {
          continue;
        }
        
        if (byteCharacters.length === 0) {
          continue;
        }
        
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        
        if (byteArray.length < 10) {
          continue;
        }
        
        const extension = mimeType === 'jpeg' ? 'jpg' : mimeType;
        const imageName = `image${++imageCounter}.${extension}`;
        const imagePath = `images/${imageName}`;
        
        const blob = new Blob([byteArray], { type: `image/${mimeType}` });
        
        if (blob.size === 0) {
          continue;
        }
        
        images.set(imagePath, blob);
        
        let newAttributes = imgTag.attributes;
        const srcPatternWithQuotes = /src\s*=\s*(["'])([^"']+)\1/i;
        const srcMatch = newAttributes.match(srcPatternWithQuotes);
        
        if (srcMatch) {
          newAttributes = newAttributes.replace(
            srcPatternWithQuotes,
            `src=${quote}${imagePath}${quote}`
          );
        } else {
          const srcPatternNoQuotes = /src\s*=\s*([^\s>]+)/i;
          newAttributes = newAttributes.replace(
            srcPatternNoQuotes,
            `src=${quote}${imagePath}${quote}`
          );
        }
        
        const newFullMatch = `<img ${newAttributes}>`;
        const escapedFullMatch = imgTag.fullMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        updatedHtml = updatedHtml.replace(escapedFullMatch, newFullMatch);
      } catch (error) {
      }
    }
  }
  
  return { html: updatedHtml, images };
}

async function inlineAssets(html: string, css: string): Promise<{ html: string; css: string }> {
  let processedHtml = html;
  let processedCss = css;
  const imgTagRegex = /<img\s+([^>]*?)>/gi;
  let match;
  const imgTags: Array<{ fullMatch: string; attributes: string }> = [];
  
  while ((match = imgTagRegex.exec(html)) !== null) {
    imgTags.push({
      fullMatch: match[0],
      attributes: match[1],
    });
  }
  
  for (const imgTag of imgTags) {
    let src: string | null = null;
    let quote: string = '';
    
    const dataUrlPattern = /src\s*=\s*(["'])(data:image\/[^;]+;base64,[^"']+)\1/i;
    const dataUrlMatch = imgTag.attributes.match(dataUrlPattern);
    if (dataUrlMatch && dataUrlMatch[2]) {
      src = dataUrlMatch[2];
      quote = dataUrlMatch[1];
    } else {
      const srcMatch = imgTag.attributes.match(/src\s*=\s*(["'])([^"']+)\1/i);
      if (srcMatch) {
        src = srcMatch[2];
        quote = srcMatch[1];
      } else {
        const srcMatchNoQuote = imgTag.attributes.match(/src\s*=\s*([^\s>]+)/i);
        if (srcMatchNoQuote) {
          src = srcMatchNoQuote[1];
          quote = '';
        }
      }
    }
    
    if (!src) {
      continue;
    }
    
    if (src.startsWith('data:') || src.startsWith('blob:')) {
      if (src.startsWith('data:')) {
        const dataUrlLength = src.length;
        if (dataUrlLength > 10 * 1024 * 1024) {
        }
        
        if (!src.includes('base64,') && !src.includes('data:image/')) {
        } else {
          if (quote && src.includes(quote)) {
            const escapedSrc = src.replace(new RegExp(quote, 'g'), quote === '"' ? '&quot;' : '&#39;');
            const newAttributes = imgTag.attributes.replace(/src\s*=\s*(["'])([^"']+)\1/i, `src=${quote}${escapedSrc}${quote}`);
            const newFullMatch = `<img ${newAttributes}>`;
            processedHtml = processedHtml.replace(imgTag.fullMatch, newFullMatch);
          }
        }
      }
      continue;
    }
    
    if (!src.trim()) {
      continue;
    }
    
    try {
      const base64 = await urlToBase64(src, 'image');
      if (base64 && base64.startsWith('data:')) {
        const newAttributes = imgTag.attributes.replace(/src\s*=\s*(["']?)([^"'\s>]+)\1/i, `src=${quote}${base64}${quote}`);
        const newFullMatch = `<img ${newAttributes}>`;
        processedHtml = processedHtml.replace(imgTag.fullMatch, newFullMatch);
      }
    } catch (error) {
    }
  }

  const bgImageRegex = /url\(["']?([^"')]+)["']?\)/gi;
  const bgMatches = [...css.matchAll(bgImageRegex)];
  
  for (const match of bgMatches) {
    const url = match[1];
    
    if (url.startsWith('data:')) {
      continue;
    }
    
    try {
      const base64 = await urlToBase64(url, 'image');
      processedCss = processedCss.replace(match[0], `url(${base64})`);
    } catch (error) {
    }
  }

  const fontFaceRegex = /@font-face\s*\{[^}]*url\(["']?([^"')]+)["']?\)[^}]*\}/gi;
  const fontMatches = [...css.matchAll(fontFaceRegex)];
  
  for (const match of fontMatches) {
    const url = match[1];
    
    if (url.startsWith('data:')) {
      continue;
    }
    
    try {
      const base64 = await urlToBase64(url, 'font');
      processedCss = processedCss.replace(match[0], match[0].replace(url, base64));
    } catch (error) {
    }
  }

  return { html: processedHtml, css: processedCss };
}

/**
 * Создаёт HTML и CSS с извлеченными изображениями
 */
export async function buildDeployFiles(editor: any): Promise<{ html: string; css: string; images: Map<string, Blob> }> {
  const html = editor.getHtml();
  const css = editor.getCss();
  
  const { html: htmlWithImages, images } = await extractImagesFromDataURLs(html);
  
  let processedCss = css;
  
  if (!processedCss || processedCss.trim().length === 0) {
    processedCss = `* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }`;
  }
  
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 2L28 8V24L16 30L4 24V8L16 2Z" fill="#667eea" stroke="#764ba2" stroke-width="1"/><path d="M11 16L16 11L21 16L16 21L11 16Z" fill="white" fill-opacity="0.9"/></svg>`;
  const faviconDataUrl = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;
  
  const fullHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Развёрнутый сайт</title>
  <link rel="icon" type="image/svg+xml" href="${faviconDataUrl}">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  ${htmlWithImages}
</body>
</html>`;

  return { html: fullHtml, css: processedCss, images };
}

/**
 * Создаёт ZIP архив с index.html, styles.css и изображениями
 */
export async function createDeployZip(
  htmlContent: string,
  cssContent: string,
  images: Map<string, Blob>
): Promise<Blob> {
  const zip = new JSZip();
  
  zip.file('index.html', htmlContent);
  
  if (cssContent && cssContent.trim().length > 0) {
    zip.file('styles.css', cssContent);
  }
  
  if (images.size > 0) {
    const imagesFolder = zip.folder('images');
    if (imagesFolder) {
      images.forEach((blob, path) => {
        const fileName = path.replace('images/', '');
        imagesFolder.file(fileName, blob);
      });
    }
  }
  
  return await zip.generateAsync({ type: 'blob' });
}

/**
 * Интерфейс параметров деплоя
 */
export interface DeployParams {
  deployType?: 'vps' | 'builder_vps';
  host?: string;
  port?: number;
  username?: string;
  password?: string;
  deployPath?: string;
  domain?: string;
  email?: string;
  nginxConfig?: boolean;
  enableSSL?: boolean;
  projectId?: number | null;
}

/**
 * Деплой сайта на VPS
 */
export async function deployToVPS(
  editor: any,
  params: DeployParams,
  apiClient: any
): Promise<{ success: boolean; message: string; url?: string }> {
  try {
    const { html, css, images } = await buildDeployFiles(editor);
    
    const zipBlob = await createDeployZip(html, css, images);
    
    if (!zipBlob || zipBlob.size === 0) {
      throw new Error('Не удалось создать ZIP архив');
    }
    
    const zipFile = new File([zipBlob], 'site.zip', { type: 'application/zip' });
    
    const formData = new FormData();
    formData.append('site_zip', zipFile);
    formData.append('deploy_type', params.deployType || 'vps');
    
    if (params.deployType === 'vps') {
      // VPS параметры (свой сервер)
      if (params.host) {
        formData.append('host', params.host);
      }
      if (params.port) {
        formData.append('port', params.port.toString());
      }
      if (params.username) {
        formData.append('username', params.username);
      }
      if (params.password) {
        formData.append('password', params.password);
      }
      if (params.deployPath) {
        formData.append('deploy_path', params.deployPath);
      }
      if (params.domain) {
        formData.append('domain', params.domain);
      }
      if (params.email) {
        formData.append('email', params.email);
      }
      formData.append('nginx_config', params.nginxConfig ? 'true' : 'false');
      formData.append('enable_ssl', params.enableSSL ? 'true' : 'false');
    }
    // Для builder_vps параметры не нужны - используются из админки
    
    if (params.projectId) {
      formData.append('project_id', params.projectId.toString());
    }
    
    // Отправляем на бэкенд
    const response = await apiClient.post('/deploy/', formData) as {
      success: boolean;
      message: string;
      url?: string;
      nginx?: {
        success: boolean;
        message: string;
      };
    };
    
    return {
      success: response.success,
      message: response.message,
      url: response.url,
    };
  } catch (error: any) {
    const message = (error as any).detail?.message || (error as any).message || 'Ошибка деплоя';
    return {
      success: false,
      message,
    };
  }
}

