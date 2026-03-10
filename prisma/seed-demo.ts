/**
 * seed-demo.ts — Datos de prueba realistas para el Sistema Jurídico
 * Genera: 50 clientes, 10 juzgados, 100 expedientes, 200 libros, 60 préstamos
 * Uso: npx tsx prisma/seed-demo.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Datos base ──────────────────────────────────────────────────────────────

const NOMBRES = [
  "Alejandro García Morales", "María Fernández López", "José Rodríguez Hernández",
  "Ana Martínez González", "Carlos Sánchez Pérez", "Laura Díaz Ramírez",
  "Miguel Torres Jiménez", "Isabel Ruiz Flores", "Roberto Reyes Mendoza",
  "Carmen Castro Vargas", "Francisco Morales Ortega", "Guadalupe Herrera Medina",
  "Arturo Jiménez Castillo", "Rosa Muñoz Guerrero", "Manuel Álvarez Cruz",
  "Silvia López Romero", "Jorge González Navarro", "Patricia Torres Santos",
  "Ricardo Martínez Ávila", "Verónica Sánchez Domínguez", "Eduardo Flores Vega",
  "Mónica Ramírez Aguilar", "Antonio Gutiérrez Ibarra", "Leticia Moreno Campos",
  "Fernando Castro Delgado", "Claudia Rivera Lozano", "Héctor Mendoza Paredes",
  "Norma Vargas Esquivel", "Raúl Ortega Cisneros", "Esperanza Luna Figueroa",
  "Óscar Reyes Cabrera", "Sandra Jiménez Salinas", "Alberto González Villanueva",
  "Yolanda Pérez Montoya", "Gerardo Morales Fuentes", "Alicia Herrera Bravo",
  "Ernesto Díaz Cervantes", "Lucía Sánchez Orozco", "Rodrigo García Tapia",
  "Martha Torres Peñaloza", "Daniel Ruiz Mendívil", "Adriana López Zenteno",
  "Javier Castillo Espinoza", "Irma González Arroyo", "Víctor Hernández Quintero",
  "Gabriela Reyes Saucedo", "Enrique Flores Pacheco", "Teresa Morales Briones",
  "Ramón Jiménez Palacios", "Beatriz Castro Villalobos",
];

const COLONIAS = [
  "Col. Del Valle, CDMX", "Col. Roma Norte, CDMX", "Col. Polanco, CDMX",
  "Col. Narvarte, CDMX", "Col. Doctores, CDMX", "Col. Santa Fe, CDMX",
  "Fracc. Las Américas, Ecatepec", "Col. Centro, Tlalnepantla",
  "Col. Anzures, CDMX", "Col. Lomas de Chapultepec, CDMX",
];

const JUZGADOS_DATA = [
  { nombre: "Juzgado 1° de lo Civil del DF",          jurisdiccion: "Civil",          direccion: "Av. Juárez 48, Col. Centro, CDMX",       telefono: "55 5512-3456" },
  { nombre: "Juzgado 3° de Proceso Oral Mercantil",   jurisdiccion: "Mercantil",      direccion: "Bucareli 128, Col. Juárez, CDMX",         telefono: "55 5512-7891" },
  { nombre: "Juzgado 5° Penal del TSJCDMX",           jurisdiccion: "Penal",          direccion: "Niños Héroes 132, Col. Doctores, CDMX",   telefono: "55 5761-2345" },
  { nombre: "Juzgado 2° de lo Familiar del DF",       jurisdiccion: "Familiar",       direccion: "Av. Insurgentes Sur 476, CDMX",           telefono: "55 5540-9012" },
  { nombre: "Juzgado 7° de Distrito en Materia Civil",jurisdiccion: "Civil Federal",  direccion: "Sidar y Rovirosa 236, CDMX",              telefono: "55 5709-3456" },
  { nombre: "Juzgado 4° Laboral del TSJCDMX",         jurisdiccion: "Laboral",        direccion: "Dr. José Ma. Vértiz 745, CDMX",           telefono: "55 5519-8901" },
  { nombre: "Juzgado 6° de Distrito Administrativo",  jurisdiccion: "Administrativo", direccion: "Av. Reforma 99, Col. Tabacalera, CDMX",   telefono: "55 5535-2345" },
  { nombre: "Juzgado 2° de Proceso Oral Civil",       jurisdiccion: "Civil",          direccion: "Fray Servando T. de Mier 55, CDMX",       telefono: "55 5522-6789" },
  { nombre: "Tribunal Laboral Conciliatorio CDMX",    jurisdiccion: "Laboral",        direccion: "Av. Chapultepec 480, CDMX",               telefono: "55 5564-0123" },
  { nombre: "Juzgado 1° de lo Familiar Ecatepec",     jurisdiccion: "Familiar",       direccion: "Av. Central 56, Ecatepec, EdoMex",        telefono: "55 5887-4567" },
];

const TIPOS_CASO = ["Divorcio", "Civil", "Penal", "Laboral", "Mercantil", "Familiar", "Contencioso"] as const;
const ESTADOS_CASO = ["Activo", "Activo", "Activo", "En Espera", "Inactivo"] as const;
const ABOGADOS = [
  "Lic. Arturo Mendoza R.", "Lic. Sofía Guerrero P.", "Lic. Héctor Villanueva C.",
  "Lic. Carmen Ibáñez F.", "Lic. Roberto Salas M.", "Lic. Diana Peña L.",
];
const METODOS_PAGO = ["Transferencia", "Efectivo", "Cheque"] as const;

const DESCRIPCIONES_CASO: Record<string, string[]> = {
  Divorcio:      ["Divorcio contencioso por separación mayor a 2 años", "Divorcio voluntario con liquidación de bienes", "Disolución del vínculo matrimonial con menores involucrados"],
  Civil:         ["Reclamación por daños y perjuicios contractuales", "Cobro de deuda derivada de contrato de compraventa", "Demanda de cumplimiento forzoso de contrato"],
  Penal:         ["Defensa por cargo de fraude genérico Art. 386 CPF", "Representación legal por robo calificado", "Querella por delito de amenazas y hostigamiento"],
  Laboral:       ["Demanda por despido injustificado con 8 años de antigüedad", "Reclamación de prestaciones de ley no pagadas", "Demanda por acoso laboral y hostigamiento sexual"],
  Mercantil:     ["Cobro de facturas impagas por servicios prestados", "Disolución de sociedad anónima por conflicto de socios", "Demanda por incumplimiento de contrato de compraventa mercantil"],
  Familiar:      ["Fijación de pensión alimentaria para menores de edad", "Controversia sobre patria potestad y guarda y custodia", "Juicio de adopción plena de menor en situación de desamparo"],
  Contencioso:   ["Recurso de revisión fiscal ante TFJFA", "Nulidad de resolución administrativa de IMSS", "Impugnación de acto de molestia de autoridad municipal"],
};

const CONTRAPARTES = [
  "Constructora Norteña SA de CV", "Transportes del Bajío SA", "María de los Ángeles Torres",
  "Banco Azteca SA Institución de Banca Múltiple", "Grupo Industrial del Norte SA",
  "Pedro Escobedo Ramírez", "Muebles y Enseres del Centro SA de CV",
  "Almacenes Nacionales de Depósito SA", "Ferretería La Paloma SC",
  "Luis Fernando González Medina", "Servicios Profesionales Integrados SA de CV",
];

// ─── Libros por sección ───────────────────────────────────────────────────────

const LIBROS_POR_SECCION: Record<string, { titulo: string; autor: string }[]> = {
  CIV: [
    { titulo: "Código Civil Federal Comentado", autor: "Ernesto Gutiérrez y González" },
    { titulo: "Derecho de Obligaciones", autor: "Rafael Rojina Villegas" },
    { titulo: "Teoría General de las Obligaciones", autor: "Ernesto Gutiérrez" },
    { titulo: "Contratos Civiles en México", autor: "Jorge Alfredo Domínguez" },
    { titulo: "Bienes y Sucesiones", autor: "Rafael Rojina Villegas" },
    { titulo: "Derecho de Familia", autor: "Julián Güitrón Fuenteverde" },
    { titulo: "La Prescripción en el Derecho Civil", autor: "Agustín Acosta Romero" },
    { titulo: "Responsabilidad Civil Extracontractual", autor: "Fernando Castellanos Tena" },
    { titulo: "Derecho Real de Propiedad", autor: "Guillermo Floris Margadant" },
    { titulo: "Derecho Civil Comparado", autor: "Aníbal Sierralta Ríos" },
    { titulo: "Nulidades en Derecho Civil", autor: "Jorge Alfredo Domínguez" },
    { titulo: "Posesión y Propiedad", autor: "Rafael de Pina" },
    { titulo: "Manual de Derecho Civil", autor: "Roberto de Ruggiero" },
    { titulo: "Obligaciones Contractuales", autor: "Álvaro D'Ors" },
    { titulo: "Derecho de Sucesiones México", autor: "Eduardo Pallares" },
    { titulo: "El Concubinato ante el Derecho", autor: "Ignacio Galindo Garfias" },
    { titulo: "Arrendamiento Civil", autor: "Antonio de Ibarrola" },
    { titulo: "Copropiedad y Condominios", autor: "Miguel Ángel Zamora y Valencia" },
    { titulo: "Compraventa Civil", autor: "Rafael De Pina Vara" },
    { titulo: "Mandato y Representación", autor: "Bernardo Pérez Fernández del Castillo" },
    { titulo: "Hipoteca y Prenda", autor: "Alejandro Quijano Baz" },
    { titulo: "Donación y Liberalidades", autor: "Ernesto Gutiérrez y González" },
    { titulo: "Derecho Civil Tomo I", autor: "Marcel Planiol" },
    { titulo: "Código Civil Código Federal de Procedimientos", autor: "Varios Autores" },
    { titulo: "Introducción al Derecho Civil", autor: "Guillermo Floris Margadant" },
  ],
  PEN: [
    { titulo: "Código Penal Federal Comentado", autor: "Sergio García Ramírez" },
    { titulo: "Derecho Penal Parte General", autor: "Fernando Castellanos Tena" },
    { titulo: "Derecho Procesal Penal", autor: "Carlos Barragán Salvatierra" },
    { titulo: "Teoría del Delito", autor: "Eugenio Raúl Zaffaroni" },
    { titulo: "Sistema Penal Acusatorio en México", autor: "José Daniel Hidalgo Murillo" },
    { titulo: "Derecho Penal Económico", autor: "Edgardo Donna" },
    { titulo: "Criminología", autor: "Alfonso Reyes Echandía" },
    { titulo: "Código Nacional de Procedimientos Penales", autor: "Varios Autores" },
    { titulo: "Derechos del Imputado", autor: "Sergio García Ramírez" },
    { titulo: "La Pena y la Prisión Preventiva", autor: "Isidro González Soria" },
    { titulo: "Delitos Contra la Salud", autor: "Moisés Moreno Hernández" },
    { titulo: "El Juicio Oral Penal en México", autor: "Luis Jiménez de Asúa" },
    { titulo: "Delitos Patrimoniales", autor: "Celestino Porte Petit" },
    { titulo: "Autoría y Participación", autor: "Eugenio Raúl Zaffaroni" },
    { titulo: "La Culpabilidad en el Derecho Penal", autor: "Fernando Castellanos Tena" },
    { titulo: "Víctimas del Delito", autor: "Leopoldo Calvete Rangel" },
    { titulo: "Dogmática Penal Funcionalista", autor: "Claus Roxin" },
    { titulo: "La Imputación Objetiva", autor: "Jakobs-Cancio Meliá" },
    { titulo: "Delitos Sexuales", autor: "Eduardo López Betancourt" },
    { titulo: "Penal Especial Tomo I", autor: "Héctor Fix Fierro" },
    { titulo: "Amparo en Materia Penal", autor: "Marco Antonio Díaz" },
    { titulo: "Las Medidas Cautelares", autor: "Carlos Natarén Nandayapa" },
    { titulo: "El Ministerio Público en México", autor: "Juventino Castro y Castro" },
    { titulo: "Técnicas de Litigación Oral", autor: "Andrés Baytelman A." },
    { titulo: "Psicología Criminal", autor: "Mariana Colín Aparicio" },
  ],
  LAB: [
    { titulo: "Ley Federal del Trabajo Comentada", autor: "Néstor de Buen Lozano" },
    { titulo: "Derecho del Trabajo Tomo I", autor: "Mario de la Cueva" },
    { titulo: "Derecho Procesal del Trabajo", autor: "Alberto Trueba Urbina" },
    { titulo: "Seguridad Social en México", autor: "Alfredo Sánchez Castañeda" },
    { titulo: "El Despido Injustificado", autor: "Néstor de Buen Lozano" },
    { titulo: "Contratos Colectivos de Trabajo", autor: "Mario de la Cueva" },
    { titulo: "Huelga y Conflictos Colectivos", autor: "Miguel Bermúdez Cisneros" },
    { titulo: "Riesgos de Trabajo", autor: "Climent Beltrán Juan B." },
    { titulo: "IMSS Ley del Seguro Social", autor: "Varios Autores" },
    { titulo: "Derecho Laboral Burocrático", autor: "Rafael Tena Suck" },
    { titulo: "Trabajo de las Mujeres", autor: "Graciela Bensusán" },
    { titulo: "Trabajo de Menores", autor: "Santiago Barajas Montes de Oca" },
    { titulo: "Acoso Laboral", autor: "Patricia Kurczyn Villalobos" },
    { titulo: "Reforma Laboral 2019", autor: "José Dávalos Morales" },
    { titulo: "Pruebas en el Proceso Laboral", autor: "Arturo Valenzuela García" },
    { titulo: "Salario y Jornada", autor: "Roberto Muñoz Ramón" },
    { titulo: "Outsourcing y Subcontratación", autor: "Alfredo Sánchez Castañeda" },
    { titulo: "Derecho Colectivo del Trabajo", autor: "Héctor Santos Azuela" },
    { titulo: "Relaciones Individuales de Trabajo", autor: "Néstor de Buen Lozano" },
    { titulo: "Estabilidad en el Empleo", autor: "Mario de la Cueva" },
    { titulo: "INFONAVIT Ley y Jurisprudencia", autor: "Varios Autores" },
    { titulo: "Pensiones y Retiro IMSS", autor: "Francisco Morales Gutiérrez" },
    { titulo: "Carga de la Prueba Laboral", autor: "Rafael Tena Suck" },
    { titulo: "Procedimiento de Huelga", autor: "Juan B. Climent Beltrán" },
    { titulo: "Contrato Individual de Trabajo", autor: "Euquerio Guerrero López" },
  ],
  MER: [
    { titulo: "Código de Comercio Comentado", autor: "Jorge Barrera Graf" },
    { titulo: "Derecho Mercantil", autor: "Raúl Cervantes Ahumada" },
    { titulo: "Derecho Bancario Mexicano", autor: "Eduardo Acosta Romero" },
    { titulo: "Títulos y Operaciones de Crédito", autor: "Raúl Cervantes Ahumada" },
    { titulo: "Sociedades Mercantiles", autor: "Mantilla Molina Roberto" },
    { titulo: "Letras de Cambio y Pagarés", autor: "Raúl Cervantes Ahumada" },
    { titulo: "Ley General de Títulos y Crédito", autor: "Varios Autores" },
    { titulo: "Concurso Mercantil", autor: "Carlos Felipe Dávalos Mejía" },
    { titulo: "Contratos Mercantiles Atípicos", autor: "Arturo Díaz Bravo" },
    { titulo: "Seguros y Fianzas", autor: "Eduardo Acosta Romero" },
    { titulo: "Propiedad Industrial e Intelectual", autor: "Mauricio Jalife Daher" },
    { titulo: "Derecho de la Competencia Económica", autor: "Héctor Cuadra" },
    { titulo: "Quiebras y Suspensión de Pagos", autor: "Jorge Barrera Graf" },
    { titulo: "Fusión y Escisión de Sociedades", autor: "Bernardo Pérez Fernández" },
    { titulo: "Contratos Bursátiles", autor: "Arturo Díaz Bravo" },
    { titulo: "Franquicias en México", autor: "Enrique Díaz Madrigal" },
    { titulo: "Comercio Electrónico Legal", autor: "José Ovalle Favela" },
    { titulo: "Garantías Mobiliarias", autor: "Carlos Gómez Lara" },
    { titulo: "Arbitraje Comercial", autor: "Carlos Alberto Matheus López" },
    { titulo: "LGSM Comentada", autor: "Mantilla Molina Roberto" },
    { titulo: "Práctica Forense Mercantil", autor: "Carlos Arellano García" },
    { titulo: "Negocios Internacionales", autor: "Daniel Márquez Gómez" },
    { titulo: "Fideicomiso Mercantil", autor: "Eduardo Acosta Romero" },
    { titulo: "Valores Bursátiles", autor: "Arturo Díaz Bravo" },
    { titulo: "Registro de Comercio", autor: "Roberto Mantilla Molina" },
  ],
  CON: [
    { titulo: "Constitución Política Comentada", autor: "Felipe Tena Ramírez" },
    { titulo: "Derecho Constitucional Mexicano", autor: "Felipe Tena Ramírez" },
    { titulo: "Las Garantías Individuales", autor: "Ignacio Burgoa Orihuela" },
    { titulo: "El Juicio de Amparo", autor: "Ignacio Burgoa Orihuela" },
    { titulo: "Derecho de Amparo", autor: "Juventino V. Castro" },
    { titulo: "Derechos Humanos en México", autor: "Miguel Carbonell" },
    { titulo: "El Sistema Presidencial Mexicano", autor: "Jorge Carpizo" },
    { titulo: "Poder Legislativo Federal", autor: "Cecilia Mora-Donatto" },
    { titulo: "El Poder Judicial de la Federación", autor: "Arturo Zaldívar" },
    { titulo: "Federalismo Mexicano", autor: "Daniel Moreno" },
    { titulo: "Reforma Constitucional en México", autor: "Diego Valadés" },
    { titulo: "Fuentes del Derecho Constitucional", autor: "José de Jesús Gudiño Pelayo" },
    { titulo: "Control de Constitucionalidad", autor: "Eduardo Ferrer Mac-Gregor" },
    { titulo: "Acción de Inconstitucionalidad", autor: "Héctor Fix-Fierro" },
    { titulo: "El Estado Mexicano", autor: "Enrique Serna" },
    { titulo: "Partidos Políticos y Democracia", autor: "Jorge Carpizo" },
    { titulo: "Derecho Electoral Mexicano", autor: "José Woldenberg" },
    { titulo: "Tratados Internacionales", autor: "Carlos Arellano García" },
    { titulo: "Supremacía Constitucional", autor: "Miguel Carbonell" },
    { titulo: "Los Derechos Sociales", autor: "José Luis Caballero Ochoa" },
    { titulo: "Controversias Constitucionales", autor: "Hugo A. Concha Cantú" },
    { titulo: "SCJN Jurisprudencia Constitucional", autor: "Varios Autores" },
    { titulo: "Iniciativa Ciudadana de Ley", autor: "Susana Thalía Pedroza de la Llave" },
    { titulo: "Juicio Político en México", autor: "Gonzalo Moctezuma Barragán" },
    { titulo: "Derechos Políticos", autor: "Olga Sánchez Cordero" },
  ],
  ADM: [
    { titulo: "Derecho Administrativo Mexicano", autor: "Gabino Fraga" },
    { titulo: "Derecho Fiscal", autor: "Ernesto Flores Zavala" },
    { titulo: "Código Fiscal de la Federación", autor: "Varios Autores" },
    { titulo: "ISR Impuesto Sobre la Renta", autor: "Adolfo Arrioja Vizcaíno" },
    { titulo: "IVA Impuesto al Valor Agregado", autor: "Ernesto Flores Zavala" },
    { titulo: "Procedimiento Administrativo", autor: "Andrés Serra Rojas" },
    { titulo: "IMSS Cuotas y Aportaciones", autor: "Francisco Morales Gutiérrez" },
    { titulo: "Recursos Administrativos", autor: "Carlos Arellano García" },
    { titulo: "Derecho Aduanal", autor: "Felipe Acosta Roca" },
    { titulo: "Licitaciones Públicas", autor: "Marcos Cortés Hernández" },
    { titulo: "Responsabilidades Administrativas", autor: "Jesús Díaz Notario" },
    { titulo: "SAT Código Fiscal", autor: "Varios Autores" },
    { titulo: "Contratación Pública", autor: "Jorge Fernández Ruiz" },
    { titulo: "Sanciones Administrativas", autor: "Rafael Martínez Morales" },
    { titulo: "Transparencia y Acceso a la Información", autor: "Juan Pablo Guerrero Amparán" },
    { titulo: "Tribunales Administrativos", autor: "Eloy Rodríguez Luna" },
    { titulo: "TFJA Ley Orgánica y Práctica", autor: "Varios Autores" },
    { titulo: "IMPI Propiedad Industrial Gubernamental", autor: "Mauricio Jalife Daher" },
    { titulo: "Expropiación por Causa de Utilidad", autor: "Guillermo Hector Herrejon" },
    { titulo: "Obras Públicas y Servicios", autor: "Jorge Fernández Ruiz" },
    { titulo: "Concesiones Administrativas", autor: "Andrés Serra Rojas" },
    { titulo: "Derecho Municipal Mexicano", autor: "Manuel González Oropeza" },
    { titulo: "Planeación Democrática en México", autor: "José Natividad González Parás" },
    { titulo: "Control Interno Gubernamental", autor: "Varios Autores" },
    { titulo: "CONAGUA Ley de Aguas Nacionales", autor: "Varios Autores" },
  ],
  COD: [
    { titulo: "Constitución Política 2024", autor: "Cámara de Diputados" },
    { titulo: "Código Civil Federal 2024", autor: "Porrúa Editores" },
    { titulo: "Código de Procedimientos Civiles DF", autor: "Porrúa Editores" },
    { titulo: "Código Penal Federal 2024", autor: "Porrúa Editores" },
    { titulo: "Código Nacional de Procedimientos Penales", autor: "Porrúa Editores" },
    { titulo: "Ley Federal del Trabajo 2024", autor: "Porrúa Editores" },
    { titulo: "Código de Comercio 2024", autor: "Porrúa Editores" },
    { titulo: "Ley General de Sociedades Mercantiles", autor: "Porrúa Editores" },
    { titulo: "Ley de Amparo 2024", autor: "Porrúa Editores" },
    { titulo: "Código Fiscal de la Federación 2024", autor: "Tax Editores Unidos" },
    { titulo: "Ley del ISR 2024", autor: "Tax Editores Unidos" },
    { titulo: "Ley del IVA 2024", autor: "Tax Editores Unidos" },
    { titulo: "Ley del IEPS 2024", autor: "Tax Editores Unidos" },
    { titulo: "CPEUM y Tratados Internacionales", autor: "Varios Editores" },
    { titulo: "Ley Orgánica del Poder Judicial", autor: "Cámara de Senadores" },
    { titulo: "Ley Federal de Procedimiento Administrativo", autor: "Porrúa Editores" },
    { titulo: "Ley Federal de Trabajo de los Servidores Públicos", autor: "IAPEM" },
    { titulo: "Ley del Seguro Social 2024", autor: "Porrúa Editores" },
    { titulo: "Ley del INFONAVIT 2024", autor: "Porrúa Editores" },
    { titulo: "Ley Agraria Comentada", autor: "Isaías Rivera Rodríguez" },
    { titulo: "Reglamentación Ambiental Federal", autor: "Semarnat" },
    { titulo: "Ley de Migración", autor: "Varios Autores" },
    { titulo: "Código Militar de Justicia", autor: "Sedena" },
    { titulo: "Leyes de Salud y Bioseguridad", autor: "SSA" },
    { titulo: "Compilación Legislativa 2024", autor: "IIJ-UNAM" },
  ],
  JUR: [
    { titulo: "Semanario Judicial Tomo I-2023", autor: "SCJN" },
    { titulo: "Semanario Judicial Tomo II-2023", autor: "SCJN" },
    { titulo: "Semanario Judicial Tomo I-2022", autor: "SCJN" },
    { titulo: "Tesis Jurisprudenciales Pleno", autor: "SCJN" },
    { titulo: "Tesis Aisladas 1a Sala 2022-2023", autor: "SCJN" },
    { titulo: "Tesis Aisladas 2a Sala 2022-2023", autor: "SCJN" },
    { titulo: "Jurisprudencia en Materia Civil", autor: "Magistrados SCJN" },
    { titulo: "Jurisprudencia en Materia Penal", autor: "Magistrados SCJN" },
    { titulo: "Jurisprudencia en Materia Laboral", autor: "SCJN-STPS" },
    { titulo: "Jurisprudencia Administrativa Fiscal", autor: "TFJA" },
    { titulo: "Criterios Interpretativos 2021-2022", autor: "SCJN" },
    { titulo: "Precedentes Vinculantes", autor: "SCJN Pleno" },
    { titulo: "Jurisprudencia Constitucional", autor: "SCJN" },
    { titulo: "Tesis de Tribunales Colegiados 2023", autor: "Tribunales Colegiados" },
    { titulo: "Índice Jurisprudencial SCJN 2020-2023", autor: "SCJN" },
    { titulo: "Jurisprudencia TEPJF 2022", autor: "TEPJF" },
    { titulo: "Jurisprudencia TFJFA 2023", autor: "TFJA" },
    { titulo: "Contradicción de Tesis 2023", autor: "SCJN" },
    { titulo: "Amparos Directos Relevantes 2022", autor: "Varios Tribunales" },
    { titulo: "Registro Digital SCJN Manual", autor: "Varios Autores" },
    { titulo: "Derechos Humanos Jurisprudencia", autor: "Miguel Carbonell" },
    { titulo: "Criterios de la CNDH", autor: "CNDH" },
    { titulo: "Precedentes Internacionales CIDH", autor: "Corte IDH" },
    { titulo: "Manual Semanario Judicial Electrónico", autor: "SCJN" },
    { titulo: "Tesis Relevantes en Amparo", autor: "SCJN Editorial" },
  ],
};

const PERSONAS_PRESTAMO = [
  "Estudiante: Carlos Mejía", "Lic. Ana Torres", "Pasante: Luis Ríos",
  "Dr. Rodrigo Campos", "Estudiante: Sofía Hernández", "Notaria: Blanca Estela",
  "Maestro: Gerardo Vega", "Pasante: Diana Montes", "Lic. Roberto Tapia",
  "Estudiante: Paola Sánchez", "Juez: Arturo Medina", "Secretaria: Nora Guzmán",
  "Actuario: José Luis Kim", "Estudiante: Marco Suárez", "Lic. Claudia Peña",
];

// ─── Utilidades ──────────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function phonesMX(): string {
  const area = ["55", "33", "81", "222", "667", "477"][Math.floor(Math.random() * 6)];
  const num  = Math.floor(Math.random() * 90000000 + 10000000);
  return `(${area}) ${String(num).slice(0, 4)}-${String(num).slice(4)}`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🌱 Iniciando seed de datos de demostración...\n");

  // ── 1. Clientes ──────────────────────────────────────────────────────────────
  console.log("👤 Creando 50 clientes...");
  const clientesCreados: { id: string; nombre: string; telefono: string; email: string }[] = [];

  for (let i = 0; i < NOMBRES.length; i++) {
    const nombre   = NOMBRES[i];
    const apellido = nombre.split(" ").slice(1).join("").toLowerCase().replace(/\s/g, "");
    const email    = `${nombre.split(" ")[0].toLowerCase()}.${apellido}@email.com`;
    const c = await prisma.cliente.create({
      data: {
        nombre,
        telefono:  phonesMX(),
        email,
        direccion: `Calle ${randInt(1, 200)} No. ${randInt(1, 500)}, ${pick(COLONIAS)}`,
        notas:     i % 5 === 0 ? "Cliente referido por colega" : "",
      },
    });
    clientesCreados.push(c);
  }
  console.log(`   ✅ ${clientesCreados.length} clientes creados`);

  // ── 2. Juzgados ──────────────────────────────────────────────────────────────
  console.log("⚖️  Creando 10 juzgados...");
  for (const j of JUZGADOS_DATA) {
    await prisma.juzgado.upsert({
      where:  { nombre: j.nombre },
      update: {},
      create: j,
    });
  }
  console.log("   ✅ 10 juzgados creados");

  // ── 3. Expedientes ────────────────────────────────────────────────────────────
  console.log("📁 Creando 100 expedientes con pagos y notas...");

  const years = [2023, 2024, 2025];
  const counters: Record<number, number> = { 2023: 0, 2024: 0, 2025: 0 };
  let expedientesCount = 0;

  for (let i = 0; i < 100; i++) {
    const year     = pick(years);
    const tipo     = pick([...TIPOS_CASO]);
    const estado   = pick([...ESTADOS_CASO]);
    const cliente  = pick(clientesCreados);
    const juzgado  = pick(JUZGADOS_DATA);
    const abogado  = pick(ABOGADOS);
    const cotizacion = randInt(15, 200) * 1000;
    const metodo   = pick([...METODOS_PAGO]);
    const desc     = pick(DESCRIPCIONES_CASO[tipo] ?? [""]);

    counters[year]++;
    const numero = `EXP-${year}-${String(counters[year]).padStart(3, "0")}`;

    // Pagos: entre 1 y 4
    const numPagos = randInt(1, 4);
    const pagos: { descripcion: string; monto: number; fecha: Date }[] = [];
    let acumulado = 0;

    for (let p = 0; p < numPagos; p++) {
      const esPrimero = p === 0;
      const monto = esPrimero
        ? Math.round(cotizacion * (randInt(20, 40) / 100) / 100) * 100
        : Math.round(cotizacion * (randInt(10, 25) / 100) / 100) * 100;
      acumulado += monto;
      pagos.push({
        descripcion: esPrimero ? "Anticipo inicial" : pick(["Abono", "Segundo abono", "Pago parcial", "Pago acordado"]),
        monto,
        fecha: daysAgo(randInt(30, 400)),
      });
    }

    // Notas: entre 1 y 3
    const notas: { texto: string; fecha: Date }[] = [];
    const notasTextos = [
      "Cliente proporcionó documentación completa",
      "Se notificó a la contraparte. Pendiente respuesta.",
      "Audiencia programada para próxima semana",
      "Se requiere apostilla de documentos",
      "Contraparte solicitó prórroga de 15 días",
      "Juez ordenó diligencia para el mes siguiente",
      "Se recibió oferta de arreglo extrajudicial",
      "Perito presentó dictamen técnico favorable",
      "Testigos confirmados para la audiencia",
      "Expediente en revisión por autoridad superior",
    ];
    const numNotas = randInt(1, 3);
    for (let n = 0; n < numNotas; n++) {
      notas.push({ texto: pick(notasTextos), fecha: daysAgo(randInt(5, 300)) });
    }

    // Documentos metadata (sin archivo físico)
    const docs: { nombre: string; tipo: string; tamanio: string; rutaArchivo: string }[] = [];
    if (Math.random() > 0.4) {
      const docTypes = [
        { nombre: "Demanda inicial.pdf", tipo: "PDF", tamanio: `${randInt(150, 800)} KB` },
        { nombre: "Poder notarial.pdf",  tipo: "PDF", tamanio: `${randInt(80, 200)} KB` },
        { nombre: "Acta de nacimiento.jpg", tipo: "JPG", tamanio: `${randInt(300, 900)} KB` },
        { nombre: "Contrato firmado.pdf", tipo: "PDF", tamanio: `${randInt(200, 600)} KB` },
        { nombre: "Identificacion oficial.jpg", tipo: "JPG", tamanio: `${randInt(100, 400)} KB` },
      ];
      const numDocs = randInt(1, 2);
      for (let d = 0; d < numDocs; d++) {
        docs.push({ ...pick(docTypes), rutaArchivo: "" });
      }
    }

    await prisma.expediente.create({
      data: {
        numero,
        cliente:         cliente.nombre,
        clienteTelefono: cliente.telefono,
        clienteEmail:    cliente.email,
        juzgado:         juzgado.nombre,
        abogado,
        contraparte:     pick(CONTRAPARTES),
        descripcion:     desc,
        tipo,
        estado,
        cotizacion,
        metodoPago:      metodo,
        createdAt:       daysAgo(randInt(30, 700)),
        pagos:           { create: pagos },
        notas:           { create: notas },
        documentos:      { create: docs },
      },
    });
    expedientesCount++;
  }
  console.log(`   ✅ ${expedientesCount} expedientes creados`);

  // ── 4. Libros ──────────────────────────────────────────────────────────────────
  console.log("📚 Creando 200 libros (25 por sección)...");

  const secciones = await prisma.seccion.findMany({ include: { vigas: true } });
  let librosCount = 0;

  for (const seccion of secciones) {
    const librosSeccion = LIBROS_POR_SECCION[seccion.prefijo] ?? [];
    const vigas         = seccion.vigas;

    if (vigas.length === 0 || librosSeccion.length === 0) continue;

    // Crear una viga adicional para tener más espacio (V04, V05)
    for (const extra of ["V04", "V05"]) {
      const exists = vigas.find((v) => v.numero === extra);
      if (!exists) {
        const v = await prisma.viga.create({
          data: { numero: extra, capacidad: 20, seccionId: seccion.id },
        });
        vigas.push(v);
      }
    }

    for (let i = 0; i < librosSeccion.length; i++) {
      const libro = librosSeccion[i];
      const viga  = vigas[Math.floor(i / 8)]; // Distribución en vigas (8 libros por viga)
      const codigo = `${seccion.prefijo}-${viga.numero}-${String(i + 1).padStart(3, "0")}`;
      const estado = Math.random() > 0.85 ? "Prestado" : "Disponible";

      try {
        await prisma.libro.create({
          data: {
            codigo,
            titulo:    libro.titulo,
            autor:     libro.autor,
            seccionId: seccion.id,
            vigaId:    viga.id,
            posicion:  `Pos. ${(i % 8) + 1}`,
            estado,
            createdAt: daysAgo(randInt(100, 800)),
          },
        });
        librosCount++;
      } catch {
        // Ignore duplicate code errors
      }
    }
  }
  console.log(`   ✅ ${librosCount} libros creados`);

  // ── 5. Préstamos ────────────────────────────────────────────────────────────────
  console.log("📖 Creando préstamos...");

  const librosDisponibles = await prisma.libro.findMany({ where: { estado: "Disponible" }, take: 60 });
  let prestamosCount = 0;

  for (let i = 0; i < Math.min(60, librosDisponibles.length); i++) {
    const libro      = librosDisponibles[i];
    const devuelto   = Math.random() > 0.35;
    const diasSalida = randInt(5, 120);
    const fechaSalida = daysAgo(diasSalida);
    const fechaDevolucion = devuelto ? daysAgo(randInt(1, diasSalida - 1)) : null;

    await prisma.prestamo.create({
      data: {
        libroId:         libro.id,
        persona:         pick(PERSONAS_PRESTAMO),
        fechaSalida,
        fechaDevolucion: fechaDevolucion ?? undefined,
        devuelto,
        createdAt:       fechaSalida,
      },
    });

    // Actualizar estado del libro
    if (!devuelto) {
      await prisma.libro.update({
        where: { id: libro.id },
        data:  { estado: "Prestado" },
      });
    }

    prestamosCount++;
  }
  console.log(`   ✅ ${prestamosCount} préstamos creados`);

  // ── Resumen final ───────────────────────────────────────────────────────────────
  console.log("\n═══════════════════════════════════════");
  console.log("✅ SEED DE DEMOSTRACIÓN COMPLETADO");
  console.log("═══════════════════════════════════════");
  console.log(`   👤 Clientes:     ${clientesCreados.length}`);
  console.log(`   ⚖️  Juzgados:     10`);
  console.log(`   📁 Expedientes:  ${expedientesCount}`);
  console.log(`   📚 Libros:       ${librosCount}`);
  console.log(`   📖 Préstamos:    ${prestamosCount}`);
  console.log("═══════════════════════════════════════\n");
}

main()
  .catch((e) => { console.error("❌ Error en seed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
