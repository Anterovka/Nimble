// Утилиты для экспорта HTML/CSS

export function exportHTML(editor: any) {
  const html = editor.getHtml();
  const css = editor.getCss();
  
  const fullHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Экспортированная страница</title>
  <style>
    ${css}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;

  const htmlBlob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
  const cssBlob = new Blob([css], { type: "text/css;charset=utf-8" });
  
  const htmlUrl = URL.createObjectURL(htmlBlob);
  const cssUrl = URL.createObjectURL(cssBlob);
  
  // Скачиваем HTML
  const htmlLink = document.createElement("a");
  htmlLink.href = htmlUrl;
  htmlLink.download = "index.html";
  document.body.appendChild(htmlLink);
  htmlLink.click();
  document.body.removeChild(htmlLink);
  
  // Скачиваем CSS с небольшой задержкой
  setTimeout(() => {
    const cssLink = document.createElement("a");
    cssLink.href = cssUrl;
    cssLink.download = "styles.css";
    document.body.appendChild(cssLink);
    cssLink.click();
    document.body.removeChild(cssLink);
    
    URL.revokeObjectURL(htmlUrl);
    URL.revokeObjectURL(cssUrl);
  }, 100);
}

