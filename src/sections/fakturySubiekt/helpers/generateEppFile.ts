import { TEppFile } from "src/types/subiektAllegro";

import companies from "../data/companies";

// Function to generate the EPP file content string from JSON data
export function generateEppFile(data: TEppFile[], invoiceNumber: string, sellDate: string, invoiceDate: string, company: keyof typeof companies) {
    // Static sections based on your provided sample
    const infoSection = `[INFO]\r\n,,1250,,${companies[company].symbol},${companies[company].name},${companies[company].name},"","","",${companies[company].nip},,,,,,,,,,,,`;
  
    const naglowekSection = `[NAGLOWEK]\r\n"FS",1,0,1,,,${invoiceNumber},,,,,,,,,,,,,,,${invoiceDate},${sellDate},,,1,,,,,,,,,,,,0,0,0,0,,,,,,"PLN",1.0000,,,,,0,0,0,,,,,,,`;
  
    // Build the [ZAWARTOSC] section header
    let zawartoscSection = `[ZAWARTOSC]\r\n`;
  
    // Helper to format numbers to 4 decimal places
    const format = (num: string) => parseFloat(num).toFixed(4);
  
    // Loop over each product record to create a CSV row with 21 fields
    data.forEach((item, index) => {
      const lineNumber = index + 1;
      const { sku, quantity, price } = item;
      const VAT = '23';
      
      
      const fields = [
        lineNumber,               // Field 1: Liczba porządkowa (numer pozycji) 
        1,                        // Field 2: Typ towaru  1 - towar  2 - usługa  4 - opakowanie  8 - komplet  16 - opłata dodatkowa 
        `"${sku}"`,               // Field 3: Kod identyfikacyjny towaru (SKU)
        1,                        // Field 4: Rabat procentowy  Prawda - procentowy  Fałsz - wartościowy 
        1,                        // Field 5: Rabat od ceny  Prawda - od ceny  Fałsz - od wartości 
        0,                        // Field 6 Rabat na pozycji kumulowany z rabatem od całego dokumentu 
        0,                        // Field 7 Rabat zablokowany dla tej pozycji 
        "0.0000",                 // Field 8: Wartość udzielonego na pozycji rabatu
        "0.0000",                 // Field 9: Wysokość rabatu udzielonego na pozycji w procentach
        `"szt."`,                 // Field 10: Jednostka miary 
        format(quantity.toString()),         // Field 11: Ilość towaru w jednostce miary 
        "",            // Field 12: Ilość towaru w jednostce magazynowej 
        "",                       // Field 13: Cena magazynowa towaru 
        format(price),         // Field 14: Cena netto towaru 
        "",                       // Field 15: Cena brutto towaru 
        VAT,                      // Field 16: Wysokość stawki podatku VAT w procentach 
        "",        // Field 17: Wartość netto pozycji 
        "",       // Field 18: Wartość VAT 
        "",                       // Field 19: Wartość brutto 
        "",                       // Field 20: Koszt pozycji 
        "",                       // Field 21: Opis usługi jednorazowej 
        ""                        // Field 22: Nazwa usługi jednorazowej 
      ];
      
      const line = fields.join(",");
      zawartoscSection += `${line}\r\n`;
    });
    
    // Combine all sections into one string
    const eppFileContent = `${infoSection}\r\n\r\n${naglowekSection}\r\n\r\n${zawartoscSection}`;
    downloadEppFile(eppFileContent, `${invoiceNumber}.epp`);

    return eppFileContent;
  }
  
  // Function to trigger the download of the file
  function downloadEppFile(content: BlobPart, filename = "export.epp") {
    // Create a Blob with the file content and set its MIME type to text/plain with UTF-8 encoding
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    // Create an anchor element and set the download attribute
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    
    // Append the link to the document, trigger the download, then remove the link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  // Example usage:
  // const jsonData = [
  //   {
  //       "sku": "0000031136",
  //       "quantity": 1,
  //       "price": "3.80",
  //   },
  //   {
  //       "sku": "0000059923",
  //       "quantity": 1,
  //       "price": "3.00",
  //   },
  //   // ... add the rest of your product items
  // ];
  
  // Generate the file content
  // const eppContent = generateEppFile(jsonData);
  // Trigger the download of the .epp file
  // downloadEppFile(eppContent, "myFile.epp");
  