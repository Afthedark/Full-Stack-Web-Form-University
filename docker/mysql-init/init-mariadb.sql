-- Configuración inicial para MariaDB
SET SQL_MODE = "STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION";

-- Estructura de tabla para la tabla `Formacion`
CREATE TABLE IF NOT EXISTS `Formacion` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nivel_formacion` varchar(140) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `Formacion`
INSERT INTO `Formacion` (`id`, `nivel_formacion`) VALUES
(1, 'Doctorado'),
(2, 'Especialización'),
(3, 'Maestría'),
(4, 'Especialización - Medicoquirúrgica');

-- Estructura de tabla para la tabla `linea_conocimiento`
CREATE TABLE IF NOT EXISTS `linea_conocimiento` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `linea` varchar(145) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `linea_conocimiento`
INSERT INTO `linea_conocimiento` (`id`, `linea`) VALUES
(1, 'Bioética'),
(2, 'Ciencias de la Salud'),
(3, 'Ingeniería y Tecnología'),
(4, 'Ciencias Ambientales'),
(5, 'Ciencias económicas y administrativas'),
(6, 'Arte y Cultura'),
(7, 'Educación y Pedagogía'),
(8, 'Psicología y Ciencias del Comportamiento'),
(9, 'Ciencias Sociales'),
(10, 'Humanidades'),
(11, 'Odontología');

-- Estructura de tabla para la tabla `modalidad`
CREATE TABLE IF NOT EXISTS `modalidad` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `modalidad` varchar(140) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `modalidad`
INSERT INTO `modalidad` (`id`, `modalidad`) VALUES
(1, 'Presencial con interacción directa.'),
(2, 'No tengo preferencia.'),
(3, '100% virtual por flexibilidad.'),
(4, 'Híbrido (presencial y virtual).');

-- Estructura de tabla para la tabla `programa`
CREATE TABLE IF NOT EXISTS `programa` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(145) DEFAULT NULL,
  `formacion` int(11) NOT NULL,
  `modalidad` int(11) NOT NULL,
  `linea_conocimiento` int(11) NOT NULL,
  `plan_estudios` varchar(350) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `fk_programa_formacion` (`formacion`),
  KEY `fk_programa_modalidad` (`modalidad`),
  KEY `fk_programa_linea` (`linea_conocimiento`),
  CONSTRAINT `fk_programa_formacion` FOREIGN KEY (`formacion`) REFERENCES `Formacion` (`id`),
  CONSTRAINT `fk_programa_modalidad` FOREIGN KEY (`modalidad`) REFERENCES `modalidad` (`id`),
  CONSTRAINT `fk_programa_linea` FOREIGN KEY (`linea_conocimiento`) REFERENCES `linea_conocimiento` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Volcado de datos para la tabla `programa`
INSERT INTO `programa` (`id`, `nombre`, `formacion`, `modalidad`, `linea_conocimiento`, `plan_estudios`) VALUES
(1, 'Doctorado en Bioética', 1, 1, 1, ''),
(2, 'Especialización en Bioética', 2, 1, 1, ''),
(3, 'Especialización en Bioética a Distancia', 2, 2, 1, ''),
(4, 'Maestría en Bioética', 3, 1, 1, ''),
(5, 'Posdoctorado en Bioética', 1, 1, 1, ''),
(6, 'Doctorado en Ciencias Biomédicas', 1, 1, 2, ''),
(7, 'Maestría en Ciencias Básicas Biomédicas', 3, 1, 2, ''),
(8, 'Maestría en Estadística Aplicada y Ciencia de Datos', 3, 1, 3, ''),
(9, 'Maestría en Gobernanza en Áreas Protegidas y Gestión del Recurso Biológico', 3, 3, 4, ''),
(10, 'Especialización en Gerencia de Marketing Farmacéutico', 2, 1, 5, ''),
(11, 'Especialización en Gerencia Sostenible del Talento Humano', 2, 3, 5, ''),
(12, 'Especialización en Gerencia Tributaria', 2, 3, 5, ''),
(13, 'Especialización en Investigación de Mercados y del Consumo', 2, 4, 5, ''),
(14, 'Especialización en Mercados Financieros', 2, 3, 5, ''),
(15, 'Especialización en Negocios Internacionales', 2, 3, 5, ''),
(16, 'Maestría en Gestión Sostenible del Talento Humano', 3, 3, 5, ''),
(17, 'Maestría en Investigación de Mercados e Inteligencia de Negocios', 3, 3, 5, ''),
(18, 'Maestría en Negocios Globales', 3, 3, 5, ''),
(19, 'Maestría en Planeación Financiera y Mercado de Capitales', 3, 3, 5, ''),
(20, 'Maestría en Ergonomía y Diseño Universal', 3, 1, 3, ''),
(21, 'Maestría en Industrias Creativas y Culturales', 3, 1, 6, ''),
(22, 'Maestría en Músicas Colombianas', 3, 1, 6, ''),
(23, 'Especialización en Docencia de la Educación Superior', 2, 3, 7, ''),
(24, 'Maestría en Educación', 3, 4, 7, ''),
(25, 'Maestría en Educación Inclusiva e Intercultural', 3, 3, 7, ''),
(26, 'Maestría en Innovación y Tecnologías para la Educación', 3, 3, 7, ''),
(27, 'Especialización en Enfermería Neonatal', 2, 1, 2, ''),
(28, 'Especialización en Seguridad del Paciente', 2, 4, 2, ''),
(29, 'Maestría en Enfermería en Cuidados Paliativos', 3, 1, 2, ''),
(30, 'Maestría en Salud Mental Comunitaria', 3, 1, 8, ''),
(31, 'Maestría en Salud Sexual y Reproductiva', 3, 1, 2, ''),
(32, 'Maestría en Estudios Sociales y Culturales', 3, 1, 9, ''),
(33, 'Maestría en Filosofía de la Ciencia', 3, 1, 10, ''),
(34, 'Especialización en Gerencia de Producción y Productividad', 2, 1, 5, ''),
(35, 'Especialización en Gerencia de Proyectos', 2, 4, 5, ''),
(36, 'Especialización en Seguridad de Redes Telemáticas', 2, 1, 3, ''),
(37, 'Maestría en Gerencia Organizacional de Proyectos', 3, 4, 5, ''),
(38, 'Maestría en Salud Ambiental', 3, 4, 4, ''),
(39, 'Doctorado en Salud Pública', 1, 1, 2, ''),
(40, 'Especialización en Anestesia Cardiovascular y Torácica', 4, 1, 2, ''),
(41, 'Especialización en Anestesiología y Fsb / ANESTESIOLOGÍA', 4, 1, 2, ''),
(42, 'Especialización en Cardiología', 4, 1, 2, ''),
(43, 'Especialización en Cardiología Pediátrica', 4, 1, 2, ''),
(44, 'Especialización en Cirugía de Mano', 4, 1, 2, ''),
(45, 'Especialización en Cirugía del Tórax', 4, 1, 2, ''),
(46, 'Especialización en Cirugía General', 4, 1, 2, ''),
(47, 'Especialización en Cirugía Plástica, Reconstructiva y Estética', 4, 1, 2, ''),
(48, 'Especialización en Cirugía Vascular y Angiología', 4, 1, 2, ''),
(49, 'Especialización en Dermatología', 4, 1, 2, ''),
(50, 'Especialización en Ergonomía', 2, 1, 2, ''),
(51, 'Especialización en Gastroenterología Pediátrica', 4, 1, 2, ''),
(52, 'Especialización en Gerencia de la Calidad en Salud', 2, 1, 2, ''),
(53, 'Especialización en Ginecología y Obstetricia', 4, 1, 2, ''),
(54, 'Especialización en Higiene Industrial', 2, 1, 2, ''),
(55, 'Especialización en Infectología Pediátrica', 4, 1, 2, ''),
(56, 'Especialización en Medicina Crítica y Cuidado Intensivo', 4, 1, 2, ''),
(57, 'Especialización en Medicina Crítica y Cuidado Intensivo Pediátrico', 4, 1, 2, ''),
(58, 'Especialización en Medicina del deporte', 4, 1, 2, ''),
(59, 'Especialización en Medicina del Dolor y Cuidados Paliativos', 4, 1, 2, ''),
(60, 'Especialización en Medicina Familiar', 4, 1, 2, ''),
(61, 'Especialización en Medicina Física y Rehabilitación', 4, 1, 2, ''),
(62, 'Especialización en Medicina Interna Hsc', 4, 1, 2, ''),
(63, 'Especialización en Medicina Materno Fetal', 4, 1, 2, ''),
(64, 'Especialización en Nefrología Pediátrica', 4, 1, 2, ''),
(65, 'Especialización en Neonatología', 4, 1, 2, ''),
(66, 'Especialización en Neumología', 4, 1, 2, ''),
(67, 'Especialización en Neumología Pediátrica', 4, 1, 2, ''),
(68, 'Especialización en Neurocirugía', 4, 1, 2, ''),
(69, 'Especialización en Neurología', 4, 1, 2, ''),
(70, 'Especialización en Oftalmología', 4, 1, 2, ''),
(71, 'Especialización en Oncología Clínica', 4, 1, 2, ''),
(72, 'Especialización en Ortopedia y Traumatología', 4, 1, 2, ''),
(73, 'Especialización en Pediatría', 4, 1, 2, ''),
(74, 'Especialización en Psiquiatría', 4, 1, 2, ''),
(75, 'Especialización en Psiquiatría de enlace e Interconsultas', 4, 1, 2, ''),
(76, 'Especialización en Psiquiatría Infantil y del Adolescente', 4, 1, 2, ''),
(77, 'Especialización en Radiología e Imágenes Diagnósticas', 4, 1, 2, ''),
(78, 'Especialización en Reumatología Pediátrica', 4, 1, 2, ''),
(79, 'Especialización en Salud Familiar y Comunitaria', 2, 1, 2, ''),
(80, 'Especialización en Seguridad y Salud en el Trabajo', 2, 1, 2, ''),
(81, 'Especialización en Urología', 4, 1, 2, ''),
(82, 'Maestría en Administración en Salud', 3, 1, 2, ''),
(83, 'Maestría en Epidemiología', 3, 1, 2, ''),
(84, 'Maestría en Fisiología Traslacional', 3, 1, 2, ''),
(85, 'Maestría en Informática Biomédica', 3, 1, 2, ''),
(86, 'Maestría en Salud Pública', 3, 1, 2, ''),
(87, 'Maestría en Seguridad y Salud en el Trabajo', 3, 1, 2, ''),
(88, 'Especialización en Cirugía Oral y Maxilofacial', 2, 1, 11, ''),
(89, 'Especialización en Endodoncia', 2, 1, 11, ''),
(90, 'Especialización en Odontología Pediátrica', 2, 1, 11, ''),
(91, 'Especialización en Operatoria dental Estética y Materiales dentales', 2, 1, 11, ''),
(92, 'Especialización en Ortodoncia', 2, 1, 11, ''),
(93, 'Especialización en Patología Oral y Medios Diagnósticos', 2, 1, 11, ''),
(94, 'Especialización en Periodoncia y Medicina Oral', 2, 1, 11, ''),
(95, 'Especialización en Prostodoncia', 2, 1, 11, ''),
(96, 'Maestría en Ciencias Odontológicas', 3, 1, 11, ''),
(97, 'Especialización en Psicología Clínica y Autoeficacia Personal', 2, 1, 8, ''),
(98, 'Especialización en Psicología Clínica y desarrollo Infantil', 2, 1, 8, ''),
(99, 'Especialización en Psicología del deporte y el Ejercicio', 2, 1, 8, ''),
(100, 'Especialización en Psicología Organizacional y de la Seguridad y Salud en el Trabajo', 2, 1, 8, ''),
(101, 'Especialización en Psicología Social, Cooperación y Gestión Comunitaria', 2, 1, 8, ''),
(102, 'Maestría en Psicología', 3, 1, 8, '');

-- Estructura de tabla para la tabla `usuario`
CREATE TABLE IF NOT EXISTS `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(145) DEFAULT NULL,
  `email` varchar(145) DEFAULT NULL,
  `celular` varchar(30) DEFAULT NULL,
  `edad` varchar(20) DEFAULT NULL,
  `genero` varchar(20) DEFAULT NULL,
  `profesion` varchar(100) DEFAULT NULL,
  `posgrado` varchar(100) DEFAULT NULL,
  `razones` text DEFAULT NULL,
  `seguridad` varchar(50) DEFAULT NULL,
  `estres` varchar(50) DEFAULT NULL,
  `comodidad_estudio` varchar(50) DEFAULT NULL,
  `metodos_aprendizaje` text DEFAULT NULL,
  `modalidades` varchar(50) DEFAULT NULL,
  `desafios` text DEFAULT NULL,
  `vision_futuro` text DEFAULT NULL,
  `respuesta_dificultad` text DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `financiamiento` text DEFAULT NULL,
  `programa` varchar(100) DEFAULT NULL, -- Programa seleccionado por el usuario (nombre o ID)
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;