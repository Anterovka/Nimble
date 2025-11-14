function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return url;
}

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
  
  const htmlUrl = downloadFile(htmlBlob, "index.html");
  
  setTimeout(() => {
    const cssUrl = downloadFile(cssBlob, "styles.css");
    URL.revokeObjectURL(htmlUrl);
    URL.revokeObjectURL(cssUrl);
  }, 100);
}

