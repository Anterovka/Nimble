export function formatHTML(html: string): string {
  if (!html || !html.trim()) return html;
  
  let formatted = "";
  let indent = 0;
  const indentSize = 2;
  
  html = html.replace(/>\s+</g, "><");
  
  let i = 0;
  let currentLine = "";
  let inTag = false;
  let tagBuffer = "";
  
  while (i < html.length) {
    const char = html[i];
    
    if (char === "<") {
      if (currentLine.trim()) {
        formatted += " ".repeat(indent) + currentLine.trim() + "\n";
        currentLine = "";
      }
      inTag = true;
      tagBuffer = "<";
      i++;
      
      while (i < html.length && html[i] !== ">") {
        tagBuffer += html[i];
        i++;
      }
      if (i < html.length) {
        tagBuffer += ">";
        i++;
      }
      
      const tag = tagBuffer.trim();
      const isClosing = tag.startsWith("</");
      const isSelfClosing = tag.endsWith("/>") || /<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)\b/i.test(tag);
      
      if (isClosing) {
        indent = Math.max(0, indent - indentSize);
        formatted += " ".repeat(indent) + tag + "\n";
      } else {
        formatted += " ".repeat(indent) + tag + "\n";
        if (!isSelfClosing) {
          indent += indentSize;
        }
      }
      
      inTag = false;
      tagBuffer = "";
    } else {
      if (char === "\n" || char === "\r") {
        i++;
        continue;
      }
      currentLine += char;
      i++;
    }
  }
  
  if (currentLine.trim()) {
    formatted += " ".repeat(indent) + currentLine.trim() + "\n";
  }
  
  return formatted.trim();
}

export function formatCSS(css: string): string {
  if (!css || !css.trim()) return css;
  
  let formatted = "";
  let indent = 0;
  const indentSize = 2;
  
  css = css.replace(/\s*{\s*/g, "{").replace(/\s*}\s*/g, "}").replace(/\s*;\s*/g, ";").trim();
  
  let i = 0;
  let currentSelector = "";
  let inRule = false;
  
  while (i < css.length) {
    const char = css[i];
    
    if (char === "{") {
      formatted += (currentSelector.trim() || "") + " {\n";
      indent += indentSize;
      currentSelector = "";
      inRule = true;
      i++;
    } else if (char === "}") {
      indent = Math.max(0, indent - indentSize);
      formatted += "\n" + " ".repeat(indent) + "}\n";
      inRule = false;
      i++;
      
      while (i < css.length && (css[i] === " " || css[i] === "\n" || css[i] === "\r")) {
        i++;
      }
    } else if (char === ";") {
      formatted += ";\n" + " ".repeat(indent);
      i++;
      
      while (i < css.length && (css[i] === " " || css[i] === "\n" || css[i] === "\r")) {
        i++;
      }
    } else if (char === "\n" || char === "\r") {
      i++;
    } else {
      if (inRule) {
        formatted += char;
      } else {
        currentSelector += char;
      }
      i++;
    }
  }
  
  formatted = formatted.replace(/\n{3,}/g, "\n\n");
  
  return formatted.trim();
}

