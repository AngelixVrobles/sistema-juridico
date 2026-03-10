const { Document, Packer, Paragraph, TextRun, PageBreak, HeadingLevel, AlignmentType, BorderStyle, WidthType } = require('docx');
const fs = require('fs');

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "Arial", size: 22 }
      }
    },
    paragraphStyles: [
      {
        id: "Heading1",
        name: "Heading 1",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "1a3a52" },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 0 }
      },
      {
        id: "Heading2",
        name: "Heading 2",
        basedOn: "Normal",
        next: "Normal",
        quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2c5aa0" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 }
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    children: [
      // PORTADA
      new Paragraph({ text: "", spacing: { line: 800 } }),
      new Paragraph({ text: "", spacing: { line: 800 } }),
      new Paragraph({ text: "", spacing: { line: 800 } }),

      new Paragraph({
        text: "GUÍA DE INSTALACIÓN",
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        style: "Heading1"
      }),

      new Paragraph({
        text: "Sistema Jurídico v1.0.0",
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
        style: "Heading2"
      }),

      new Paragraph({
        text: "Windows y macOS",
        alignment: AlignmentType.CENTER,
        spacing: { after: 800 },
        run: { size: 24 }
      }),

      new Paragraph({ text: "", spacing: { line: 800 } }),
      new Paragraph({ text: "", spacing: { line: 800 } }),

      new Paragraph({
        text: "Marzo 2026",
        alignment: AlignmentType.CENTER,
        run: { size: 24 }
      }),

      new Paragraph({ children: [new PageBreak()] }),

      // TABLA DE CONTENIDOS
      new Paragraph({
        text: "TABLA DE CONTENIDOS",
        style: "Heading2"
      }),

      new Paragraph({ text: "1. Requisitos Previos", spacing: { after: 100 } }),
      new Paragraph({ text: "2. Instalación en Windows", spacing: { after: 100 } }),
      new Paragraph({ text: "3. Instalación en macOS", spacing: { after: 100 } }),
      new Paragraph({ text: "4. Errores Comunes y Soluciones", spacing: { after: 100 } }),
      new Paragraph({ text: "5. Preguntas Frecuentes", spacing: { after: 100 } }),
      new Paragraph({ text: "6. Soporte Técnico", spacing: { after: 400 } }),

      new Paragraph({ children: [new PageBreak()] }),

      // SECCIÓN 1
      new Paragraph({
        text: "1. REQUISITOS PREVIOS",
        style: "Heading2"
      }),

      new Paragraph({
        text: "Para ambos sistemas:",
        spacing: { after: 100 },
        run: { bold: true }
      }),

      new Paragraph({ text: "Mínimo 500 MB de espacio libre en disco", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Conexión a Internet (solo para descarga)", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Permisos de administrador en tu equipo", spacing: { after: 200 }, indent: { left: 360 } }),

      new Paragraph({
        text: "Windows:",
        spacing: { after: 100 },
        run: { bold: true }
      }),

      new Paragraph({ text: "Windows 10 o superior (64 bits)", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "No requiere .NET Framework adicional", spacing: { after: 200 }, indent: { left: 360 } }),

      new Paragraph({
        text: "macOS:",
        spacing: { after: 100 },
        run: { bold: true }
      }),

      new Paragraph({ text: "macOS 10.15 (Catalina) o superior", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Procesador Intel o Apple Silicon (M1/M2/M3)", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Autorización para ejecutar apps de desarrolladores no identificados", spacing: { after: 400 }, indent: { left: 360 } }),

      new Paragraph({ children: [new PageBreak()] }),

      // SECCIÓN 2
      new Paragraph({
        text: "2. INSTALACIÓN EN WINDOWS",
        style: "Heading2"
      }),

      new Paragraph({
        text: "Paso 1: Descargar el Instalador",
        spacing: { after: 100 },
        run: { bold: true }
      }),

      new Paragraph({ text: 'Descarga el archivo: "Sistema Jurídico Setup 1.0.0.exe" desde GitHub Actions', spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Guarda el archivo en tu escritorio o carpeta de descargas", spacing: { after: 200 }, indent: { left: 360 } }),

      new Paragraph({
        text: "Paso 2: Ejecutar el Instalador",
        spacing: { after: 100 },
        run: { bold: true }
      }),

      new Paragraph({ text: "Haz doble clic sobre el archivo .exe", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Si aparece Control de Cuentas de Usuario (UAC): Haz clic en SÍ", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Sigue el asistente: selecciona carpeta (C:\\Archivos de programa\\), marca opciones deseadas", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Haz clic en INSTALAR", spacing: { after: 200 }, indent: { left: 360 } }),

      new Paragraph({
        text: "Paso 3: Completar la Instalación",
        spacing: { after: 100 },
        run: { bold: true }
      }),

      new Paragraph({ text: "Espera a que finalice", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Haz clic en FINALIZAR", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "La aplicación se lanzará automáticamente", spacing: { after: 200 }, indent: { left: 360 } }),

      new Paragraph({
        text: "Opción: Usar la Versión Portable",
        spacing: { after: 100 },
        run: { bold: true }
      }),

      new Paragraph({ text: 'Descarga: "SistemaJuridico-portable-1.0.0.exe"', spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Haz doble clic para ejecutar directamente (sin instalación)", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "No requiere permisos de administrador", spacing: { after: 400 }, indent: { left: 360 } }),

      new Paragraph({ children: [new PageBreak()] }),

      // SECCIÓN 3
      new Paragraph({
        text: "3. INSTALACIÓN EN macOS",
        style: "Heading2"
      }),

      new Paragraph({
        text: "Paso 1: Descargar",
        spacing: { after: 100 },
        run: { bold: true }
      }),

      new Paragraph({ text: 'Descarga el archivo: "Sistema Jurídico-1.0.0.dmg" desde GitHub Actions', spacing: { after: 200 }, indent: { left: 360 } }),

      new Paragraph({
        text: "Paso 2: Montar la Imagen",
        spacing: { after: 100 },
        run: { bold: true }
      }),

      new Paragraph({ text: "Haz doble clic sobre el archivo .dmg", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Se abrirá una ventana con la aplicación", spacing: { after: 200 }, indent: { left: 360 } }),

      new Paragraph({
        text: "Paso 3: Instalar",
        spacing: { after: 100 },
        run: { bold: true }
      }),

      new Paragraph({ text: 'Arrastra el icono "Sistema Jurídico" a la carpeta Applications', spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Espera 1-2 minutos", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Cierra la ventana", spacing: { after: 200 }, indent: { left: 360 } }),

      new Paragraph({
        text: "Paso 4: Ejecución Inicial (IMPORTANTE)",
        spacing: { after: 100 },
        run: { bold: true }
      }),

      new Paragraph({ text: "Primera vez solamente: macOS bloqueará la ejecución por motivos de seguridad.", spacing: { after: 100 }, run: { italics: true } }),

      new Paragraph({ text: "Abre Finder → Aplicaciones", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Haz CLIC DERECHO sobre \'Sistema Jurídico\'", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Selecciona ABRIR", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Haz clic en ABRIR en la confirmación", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Próximas veces: simplemente haz doble clic normalmente", spacing: { after: 200 }, indent: { left: 360 } }),

      new Paragraph({
        text: "Paso 5: Desmontar",
        spacing: { after: 100 },
        run: { bold: true }
      }),

      new Paragraph({ text: "En Finder, haz clic en el icono expulsar junto a la imagen", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Opcionalmente, elimina el archivo .dmg de Descargas", spacing: { after: 400 }, indent: { left: 360 } }),

      new Paragraph({ children: [new PageBreak()] }),

      // SECCIÓN 4
      new Paragraph({
        text: "4. ERRORES COMUNES Y SOLUCIONES",
        style: "Heading2"
      }),

      new Paragraph({
        text: 'ERROR: "No se puede verificar el desarrollador" (macOS)',
        spacing: { after: 100 },
        run: { bold: true }
      }),

      new Paragraph({ text: "Cuando aparece: Primera ejecución", spacing: { after: 100 }, run: { bold: true } }),
      new Paragraph({ text: "Solución: Clic DERECHO en la app → Abrir → Abrir", spacing: { after: 200 }, indent: { left: 360 } }),

      new Paragraph({
        text: 'ERROR: "No tiene permiso para acceder" (Windows)',
        spacing: { after: 100 },
        run: { bold: true }
      }),

      new Paragraph({ text: "Cuando aparece: Instalación en carpeta protegida", spacing: { after: 100 }, run: { bold: true } }),
      new Paragraph({ text: "Desinstala completamente", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Clic DERECHO en .exe → Ejecutar como administrador", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Instala en C:\\Archivos de programa\\", spacing: { after: 200 }, indent: { left: 360 } }),

      new Paragraph({
        text: 'ERROR: "La aplicación no responde" (ambos sistemas)',
        spacing: { after: 100 },
        run: { bold: true }
      }),

      new Paragraph({ text: "Cierra la aplicación", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Elimina carpeta de datos: Windows: C:\\Users\\[Usuario]\\AppData\\Local\\Sistema Jurídico\\", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "macOS: ~/Library/Application Support/Sistema Jurídico/", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Reinicia", spacing: { after: 200 }, indent: { left: 360 } }),

      new Paragraph({
        text: 'ERROR: "No se puede conectar a la base de datos" (ambos)',
        spacing: { after: 100 },
        run: { bold: true }
      }),

      new Paragraph({ text: "Causa: Base de datos corrupta", spacing: { after: 100 }, run: { bold: true } }),
      new Paragraph({ text: "Cierra la aplicación", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Elimina: biblioteca.db", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "  Windows: %APPDATA%\\Sistema Jurídico\\prisma\\biblioteca.db", spacing: { after: 80 }, indent: { left: 720 } }),
      new Paragraph({ text: "  macOS: ~/Library/Application Support/Sistema Jurídico/prisma/biblioteca.db", spacing: { after: 80 }, indent: { left: 720 } }),
      new Paragraph({ text: "Reinicia (se recreará automáticamente)", spacing: { after: 400 }, indent: { left: 360 } }),

      new Paragraph({ children: [new PageBreak()] }),

      // SECCIÓN 5
      new Paragraph({
        text: "5. PREGUNTAS FRECUENTES",
        style: "Heading2"
      }),

      new Paragraph({
        text: "¿Necesito conexión a Internet?",
        spacing: { after: 80 },
        run: { bold: true }
      }),
      new Paragraph({ text: "Solo para descarga inicial. Funciona sin conexión después.", spacing: { after: 200 } }),

      new Paragraph({
        text: "¿Cómo desinstalo?",
        spacing: { after: 80 },
        run: { bold: true }
      }),
      new Paragraph({ text: "Windows - Panel de Control → Desinstalar un programa. macOS - Arrastra a Papelera", spacing: { after: 200 } }),

      new Paragraph({
        text: "¿Dónde se guardan los datos?",
        spacing: { after: 80 },
        run: { bold: true }
      }),
      new Paragraph({ text: "Localmente en tu equipo (Windows: %APPDATA%, macOS: ~/Library)", spacing: { after: 200 } }),

      new Paragraph({
        text: "¿Puedo ejecutar dos instancias?",
        spacing: { after: 80 },
        run: { bold: true }
      }),
      new Paragraph({ text: "No, solo una por usuario", spacing: { after: 200 } }),

      new Paragraph({
        text: "¿Qué hago si olvido mis credenciales?",
        spacing: { after: 80 },
        run: { bold: true }
      }),
      new Paragraph({ text: "Contacta al administrador del sistema", spacing: { after: 200 } }),

      new Paragraph({
        text: "¿Es seguro?",
        spacing: { after: 80 },
        run: { bold: true }
      }),
      new Paragraph({ text: "Sí, todos los datos se almacenan localmente sin envío a servidores externos", spacing: { after: 400 } }),

      new Paragraph({ children: [new PageBreak()] }),

      // SECCIÓN 6
      new Paragraph({
        text: "6. SOPORTE TÉCNICO",
        style: "Heading2"
      }),

      new Paragraph({
        text: "Si experimentas problemas:",
        spacing: { after: 100 },
        run: { bold: true }
      }),

      new Paragraph({ text: "Verifica tu conexión de Internet", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Reinicia tu equipo", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "Desinstala y reinstala la aplicación", spacing: { after: 200 }, indent: { left: 360 } }),

      new Paragraph({
        text: "Para soporte adicional:",
        spacing: { after: 100 },
        run: { bold: true }
      }),

      new Paragraph({ text: "Email: angelixvrobles1234@outlook.com", spacing: { after: 80 }, indent: { left: 360 } }),
      new Paragraph({ text: "GitHub: https://github.com/AngelixVrobles/sistema-juridico", spacing: { after: 300 }, indent: { left: 360 } }),

      new Paragraph({
        text: "Información del Documento",
        spacing: { after: 100 },
        run: { bold: true }
      }),

      new Paragraph({ text: "Última actualización: Marzo 2026", spacing: { after: 80 } }),
      new Paragraph({ text: "Aplicación: Sistema Jurídico v1.0.0", spacing: { after: 80 } }),
      new Paragraph({ text: "Plataformas soportadas: Windows 10+ (64 bits), macOS 10.15+", spacing: { after: 300 } }),

      new Paragraph({
        text: "¡Gracias por usar Sistema Jurídico!",
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 },
        style: "Heading2"
      })
    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync("Guia_Instalacion_SistemaJuridico.docx", buffer);
  console.log("✅ Documento DOCX creado exitosamente: Guia_Instalacion_SistemaJuridico.docx");
});
