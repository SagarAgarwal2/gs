import jsPDF from 'jspdf';

/**
 * Escapes a string to be safely included in a CSV.
 */
function escapeCSV(val: any): string {
  if (val === null || val === undefined) return '';
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Exports an array of objects to a CSV file.
 *
 * @param filename The name of the file to save (e.g., 'data.csv')
 * @param data The array of objects to export
 * @param columns Array of objects defining header and data key mappings
 */
export function exportToCSV<T>(
  filename: string,
  data: T[],
  columns: { header: string; key: keyof T | ((row: T) => string | number) }[]
) {
  const headers = columns.map((col) => escapeCSV(col.header)).join(',');
  const rows = data.map((row) =>
    columns
      .map((col) => {
        let val;
        if (typeof col.key === 'function') {
          val = col.key(row);
        } else {
          val = row[col.key];
        }
        return escapeCSV(val);
      })
      .join(',')
  );

  const csvContent = [headers, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Exports an SVG element to a PNG image.
 */
export function exportSvgToImage(svgElement: SVGSVGElement, filename: string) {
  const serializer = new XMLSerializer();
  let svgData = serializer.serializeToString(svgElement);
  
  // Ensure xmlns is present for standalone rendering
  if (!svgData.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    svgData = svgData.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const width = svgElement.clientWidth || svgElement.getBoundingClientRect().width;
  const height = svgElement.clientHeight || svgElement.getBoundingClientRect().height;
  
  // Adjust canvas size for better resolution
  const scale = 2;
  canvas.width = width * scale;
  canvas.height = height * scale;
  
  if (ctx) {
    ctx.scale(scale, scale);
    // Draw background (SVG might be transparent)
    ctx.fillStyle = '#ffffff'; // or extract from theme
    ctx.fillRect(0, 0, width, height);
  }

  const img = new Image();
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  img.onload = () => {
    ctx?.drawImage(img, 0, 0, width, height);
    const pngUrl = canvas.toDataURL('image/png');
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = pngUrl;
    link.click();
    URL.revokeObjectURL(url);
  };
  img.src = url;
}

/**
 * Exports an SVG element to a PDF.
 */
export function exportSvgToPdf(svgElement: SVGSVGElement, filename: string) {
  const serializer = new XMLSerializer();
  let svgData = serializer.serializeToString(svgElement);
  
  if (!svgData.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    svgData = svgData.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const width = svgElement.clientWidth || svgElement.getBoundingClientRect().width;
  const height = svgElement.clientHeight || svgElement.getBoundingClientRect().height;
  
  const scale = 2;
  canvas.width = width * scale;
  canvas.height = height * scale;
  
  if (ctx) {
    ctx.scale(scale, scale);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
  }

  const img = new Image();
  const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  img.onload = () => {
    ctx?.drawImage(img, 0, 0, width, height);
    const pngUrl = canvas.toDataURL('image/png', 1.0);
    
    // Calculate PDF dimensions (A4 landscape)
    const pdf = new jsPDF({
      orientation: width > height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [width, height]
    });
    
    pdf.addImage(pngUrl, 'PNG', 0, 0, width, height);
    pdf.save(filename);
    URL.revokeObjectURL(url);
  };
  img.src = url;
}
