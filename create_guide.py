from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY

# Crear el documento PDF
pdf_path = "Guia_Instalacion_SistemaJuridico.pdf"
doc = SimpleDocTemplate(pdf_path, pagesize=letter, topMargin=0.5*inch, bottomMargin=0.5*inch)

# Estilos
styles = getSampleStyleSheet()
title_style = ParagraphStyle(
    'CustomTitle',
    parent=styles['Heading1'],
    fontSize=24,
    textColor=colors.HexColor('#1a3a52'),
    spaceAfter=6,
    alignment=TA_CENTER,
    fontName='Helvetica-Bold'
)

heading2_style = ParagraphStyle(
    'CustomHeading2',
    parent=styles['Heading2'],
    fontSize=14,
    textColor=colors.HexColor('#2c5aa0'),
    spaceAfter=12,
    spaceBefore=12,
    fontName='Helvetica-Bold'
)

heading3_style = ParagraphStyle(
    'CustomHeading3',
    parent=styles['Heading3'],
    fontSize=12,
    textColor=colors.HexColor('#34568B'),
    spaceAfter=6,
    fontName='Helvetica-Bold'
)

body_style = ParagraphStyle(
    'CustomBody',
    parent=styles['Normal'],
    fontSize=10,
    alignment=TA_JUSTIFY,
    spaceAfter=8,
    leading=14
)

# Contenido del documento
story = []

# Portada
story.append(Spacer(1, 1.5*inch))
story.append(Paragraph("GUÍA DE INSTALACIÓN", title_style))
story.append(Paragraph("Sistema Jurídico v1.0.0", styles['Heading2']))
story.append(Spacer(1, 0.5*inch))
story.append(Paragraph("Windows y macOS", styles['Normal']))
story.append(Spacer(1, 2*inch))
story.append(Paragraph("Marzo 2026", styles['Normal']))
story.append(PageBreak())

# Tabla de contenidos
story.append(Paragraph("TABLA DE CONTENIDOS", heading2_style))
toc_items = [
    "1. Requisitos Previos",
    "2. Instalación en Windows",
    "3. Instalación en macOS",
    "4. Errores Comunes y Soluciones",
    "5. Preguntas Frecuentes",
    "6. Soporte Técnico"
]
for item in toc_items:
    story.append(Paragraph(item, body_style))
story.append(PageBreak())

# 1. REQUISITOS PREVIOS
story.append(Paragraph("1. REQUISITOS PREVIOS", heading2_style))

story.append(Paragraph("<b>Para ambos sistemas:</b>", heading3_style))
requisitos_ambos = [
    "Mínimo 500 MB de espacio libre en disco",
    "Conexión a Internet (solo para descarga)",
    "Permisos de administrador en tu equipo"
]
for req in requisitos_ambos:
    story.append(Paragraph("• " + req, body_style))

story.append(Paragraph("<b>Windows:</b>", heading3_style))
story.append(Paragraph("• Windows 10 o superior (64 bits)", body_style))
story.append(Paragraph("• No requiere .NET Framework adicional", body_style))

story.append(Paragraph("<b>macOS:</b>", heading3_style))
story.append(Paragraph("• macOS 10.15 (Catalina) o superior", body_style))
story.append(Paragraph("• Procesador Intel o Apple Silicon (M1/M2/M3)", body_style))
story.append(Paragraph("• Autorización para ejecutar apps de desarrolladores no identificados", body_style))
story.append(Spacer(1, 0.2*inch))
story.append(PageBreak())

# 2. INSTALACIÓN EN WINDOWS
story.append(Paragraph("2. INSTALACIÓN EN WINDOWS", heading2_style))

story.append(Paragraph("<b>Paso 1: Descargar el Instalador</b>", heading3_style))
story.append(Paragraph("1. Descarga el archivo: <b>Sistema Jurídico Setup 1.0.0.exe</b> desde GitHub Actions", body_style))
story.append(Paragraph("2. Guarda el archivo en tu escritorio o carpeta de descargas", body_style))

story.append(Paragraph("<b>Paso 2: Ejecutar el Instalador</b>", heading3_style))
story.append(Paragraph("1. Haz doble clic sobre el archivo .exe", body_style))
story.append(Paragraph("2. Si aparece una ventana de Control de Cuentas de Usuario (UAC): Haz clic en SI", body_style))
story.append(Paragraph("3. Sigue el asistente de instalación:", body_style))
story.append(Paragraph("   - Selecciona la carpeta de instalación (recomendado: C:\\Archivos de programa\\)", body_style))
story.append(Paragraph("   - Marca las opciones deseadas (acceso directo en escritorio, menú de inicio)", body_style))
story.append(Paragraph("   - Haz clic en INSTALAR", body_style))

story.append(Paragraph("<b>Paso 3: Completar la Instalación</b>", heading3_style))
story.append(Paragraph("• Espera a que finalice el proceso", body_style))
story.append(Paragraph("• Haz clic en FINALIZAR", body_style))
story.append(Paragraph("• La aplicación se lanzará automáticamente", body_style))

story.append(Paragraph("<b>Opción: Usar la Versión Portable</b>", heading3_style))
story.append(Paragraph("1. Descarga: <b>SistemaJuridico-portable-1.0.0.exe</b>", body_style))
story.append(Paragraph("2. Haz doble clic para ejecutar directamente (sin instalación)", body_style))
story.append(Paragraph("3. No requiere permisos de administrador", body_style))
story.append(PageBreak())

# 3. INSTALACIÓN EN macOS
story.append(Paragraph("3. INSTALACIÓN EN macOS", heading2_style))

story.append(Paragraph("<b>Paso 1: Descargar la Imagen de Disco</b>", heading3_style))
story.append(Paragraph("1. Descarga el archivo: <b>Sistema Jurídico-1.0.0.dmg</b> desde GitHub Actions", body_style))
story.append(Paragraph("2. El archivo se descargará en tu carpeta de Descargas", body_style))

story.append(Paragraph("<b>Paso 2: Montar la Imagen</b>", heading3_style))
story.append(Paragraph("1. Haz doble clic sobre el archivo .dmg", body_style))
story.append(Paragraph("2. Se abrirá una ventana mostrando la aplicación Sistema Jurídico", body_style))
story.append(Paragraph("3. Verás una carpeta Applications (Aplicaciones)", body_style))

story.append(Paragraph("<b>Paso 3: Instalar la Aplicación</b>", heading3_style))
story.append(Paragraph("1. Arrastra el icono Sistema Jurídico a la carpeta Applications", body_style))
story.append(Paragraph("2. Espera a que se complete la copia (puede tomar 1-2 minutos)", body_style))
story.append(Paragraph("3. Cierra la ventana del instalador", body_style))

story.append(Paragraph("<b>Paso 4: Ejecución Inicial (IMPORTANTE)</b>", heading3_style))
story.append(Paragraph("Primera vez solamente: macOS bloqueará la ejecución por motivos de seguridad.", body_style))
story.append(Paragraph("1. Abre Finder y ve a Aplicaciones", body_style))
story.append(Paragraph("2. Localiza Sistema Jurídico", body_style))
story.append(Paragraph("3. Haz clic DERECHO sobre el icono", body_style))
story.append(Paragraph("4. Selecciona ABRIR en el menú", body_style))
story.append(Paragraph("5. Haz clic en ABRIR en la ventana de confirmación", body_style))
story.append(Paragraph("6. La aplicación se ejecutará", body_style))
story.append(Spacer(1, 0.1*inch))
story.append(Paragraph("Próximas veces: Simplemente haz doble clic normalmente", body_style))

story.append(Paragraph("<b>Paso 5: Desmontar la Imagen</b>", heading3_style))
story.append(Paragraph("1. En el Finder, busca Sistema Jurídico en la barra lateral", body_style))
story.append(Paragraph("2. Haz clic en el icono de expulsar junto a ella", body_style))
story.append(Paragraph("3. Opcionalmente, elimina el archivo .dmg de Descargas", body_style))
story.append(PageBreak())

# 4. ERRORES COMUNES
story.append(Paragraph("4. ERRORES COMUNES Y SOLUCIONES", heading2_style))

story.append(Paragraph("<b>ERROR: No se puede verificar el desarrollador (macOS)</b>", heading3_style))
story.append(Paragraph("<b>Cuando aparece:</b> Primera ejecución de la aplicación en macOS", body_style))
story.append(Paragraph("<b>Solucion rapida (recomendada):</b>", body_style))
story.append(Paragraph("Clic DERECHO en la aplicación → Abrir → Abrir", body_style))
story.append(Spacer(1, 0.15*inch))

story.append(Paragraph("<b>ERROR: No tiene permiso para acceder a este recurso (Windows)</b>", heading3_style))
story.append(Paragraph("<b>Cuando aparece:</b> Instalación en carpeta protegida", body_style))
story.append(Paragraph("1. Desinstala completamente la aplicación", body_style))
story.append(Paragraph("2. Haz clic DERECHO en el instalador .exe", body_style))
story.append(Paragraph("3. Selecciona EJECUTAR COMO ADMINISTRADOR", body_style))
story.append(Paragraph("4. Instala en: C:\\Archivos de programa\\", body_style))
story.append(Spacer(1, 0.15*inch))

story.append(Paragraph("<b>ERROR: La aplicación no responde (ambos sistemas)</b>", heading3_style))
story.append(Paragraph("1. Cierra la aplicación", body_style))
story.append(Paragraph("2. Elimina la carpeta de datos de usuario:", body_style))
story.append(Paragraph("   Windows: C:\\Users\\[TuUsuario]\\AppData\\Local\\Sistema Jurídico\\", body_style))
story.append(Paragraph("   macOS: ~/Library/Application Support/Sistema Jurídico/", body_style))
story.append(Paragraph("3. Reinicia la aplicación", body_style))
story.append(Spacer(1, 0.15*inch))

story.append(Paragraph("<b>ERROR: No se puede conectar a la base de datos (ambos sistemas)</b>", heading3_style))
story.append(Paragraph("<b>Causa:</b> Archivo de base de datos corrupto o permisos insuficientes", body_style))
story.append(Paragraph("1. Cierra la aplicación completamente", body_style))
story.append(Paragraph("2. Busca y elimina el archivo biblioteca.db:", body_style))
story.append(Paragraph("   Windows: %APPDATA%\\Sistema Jurídico\\prisma\\biblioteca.db", body_style))
story.append(Paragraph("   macOS: ~/Library/Application Support/Sistema Jurídico/prisma/biblioteca.db", body_style))
story.append(Paragraph("3. Reinicia la aplicación (se recreará automáticamente)", body_style))
story.append(PageBreak())

# 5. PREGUNTAS FRECUENTES
story.append(Paragraph("5. PREGUNTAS FRECUENTES", heading2_style))

faqs = [
    ("¿Necesito conexión a Internet?", "Solo para la descarga inicial. Una vez instalada, funciona sin conexión."),
    ("¿Puedo desinstalar la aplicación?", "Windows: Panel de Control → Desinstalar un programa → Sistema Jurídico. macOS: Arrastra la aplicación a la Papelera"),
    ("¿Donde se guardan mis datos?", "Windows: %APPDATA%\\Sistema Jurídico/. macOS: ~/Library/Application Support/Sistema Jurídico/"),
    ("¿Puedo ejecutar dos instancias?", "No. La aplicación solo se puede ejecutar una vez por usuario."),
    ("¿Qué hago si olvido mis credenciales?", "Contacta al administrador del sistema para reseteo de credenciales."),
    ("¿Es seguro usar esta aplicación?", "Si. Todos los datos se almacenan localmente sin envio a servidores externos.")
]

for pregunta, respuesta in faqs:
    story.append(Paragraph(f"<b>P: {pregunta}</b>", heading3_style))
    story.append(Paragraph(f"<b>R:</b> {respuesta}", body_style))
    story.append(Spacer(1, 0.1*inch))

story.append(PageBreak())

# 6. SOPORTE TÉCNICO
story.append(Paragraph("6. SOPORTE TECNICO", heading2_style))

story.append(Paragraph("Si experimentas problemas no listados aquí:", body_style))
story.append(Paragraph("1. Verifica tu conexión de Internet", body_style))
story.append(Paragraph("2. Reinicia tu equipo", body_style))
story.append(Paragraph("3. Desinstala y reinstala la aplicación", body_style))
story.append(Spacer(1, 0.2*inch))

story.append(Paragraph("<b>Para soporte adicional o reportar bugs:</b>", heading3_style))
story.append(Paragraph("Email: angelixvrobles1234@outlook.com", body_style))
story.append(Paragraph("GitHub: https://github.com/AngelixVrobles/sistema-juridico", body_style))
story.append(Spacer(1, 0.3*inch))

story.append(Paragraph("<b>Información del Documento</b>", heading3_style))
story.append(Paragraph("Última actualización: Marzo 2026", body_style))
story.append(Paragraph("Aplicación: Sistema Jurídico v1.0.0", body_style))
story.append(Paragraph("Plataformas soportadas: Windows 10+ (64 bits), macOS 10.15+", body_style))
story.append(Spacer(1, 0.3*inch))

story.append(Paragraph("<b>Gracias por usar Sistema Jurídico!</b>", heading2_style))

# Construir el PDF
doc.build(story)
print(f"PDF creado exitosamente: {pdf_path}")
