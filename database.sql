
DROP DATABASE IF EXISTS sofia;
CREATE DATABASE IF NOT EXISTS sofia DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;  -- opcion de codificacion utf8mb4_unicode_ci;
-- RECOMENDACION AL CREAR LA NUEVA BASE DE DATOS LOS CAMPOS DE SELECCION HACERLOS NUMERICOS Y RELACIONAR LAS OPCIONES EN LAS PLANTILLAS 
-- ESTA BASE DE DATOS RELACIONA LA MAYOR PARTE DE LAS SOLICITUDES ESTUDIANTILES 
USE sofia; 

-- tabla general se usa para la configuracion de variables globales y consecutivos 
CREATE TABLE IF NOT EXISTS general  (
    general_numActa BIGINT,
    general_numSolicitud BIGINT
)ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS users(
      id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(10),
      fullname VARCHAR(30),
      email VARCHAR(40) UNIQUE,
      password VARCHAR(100),
      verification  BOOLEAN,
      role  VARCHAR(10),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)ENGINE = INNODB;
-- INSERT INTO users(username,fullname,email,password,verification,role) values('User','UserTest','mavelasquezgi@unal.edu.co','User*',1,'Official');

CREATE TABLE IF NOT EXISTS acta (
    acta_id VARCHAR (16) NOT NULL, -- consecutivo de maximo 3 digitos concatenado con '__' y la fecha 
    acta_fechCrea DATETIME DEFAULT CURRENT_TIMESTAMP(), 
    acta_fechCierre DATETIME,
    acta_tipo ENUM('VITUAL','PRESENCIAL'), -- 1 = virtual, 2 = presencial
    acta_estado ENUM('INACTIVA','ABIERTA','CERRADA'), -- selección de estado del acta: 1 inactiva, 2 abierta, 3 cerrada
    acta_obser VARCHAR (400), -- observaciones en acta
    acta_secretario VARCHAR(50), -- nombre de quien redacta el acta 
    acta_presidente VARCHAR(50), -- nombre de responsable
    acta_lugar VARCHAR(40),  -- donnde se firma 
    acta_invitados VARCHAR(150), -- lista de invitados a la reunión 
    PRIMARY KEY (acta_id)
)ENGINE = INNODB;

INSERT INTO acta(acta_id,acta_fechCrea,acta_fechCierre,acta_tipo,acta_estado,acta_obser,acta_secretario,acta_presidente,acta_lugar,acta_invitados) VALUES(CONCAT(CAST(001 AS CHAR),"__",DATE_FORMAT(CURDATE(), '%Y-%m-%d')),CURRENT_TIMESTAMP(),null,1,1,'ninguna','writer test','president','place','ninguno');
INSERT INTO acta(acta_id,acta_fechCrea,acta_fechCierre,acta_tipo,acta_estado,acta_obser,acta_secretario,acta_presidente,acta_lugar,acta_invitados) VALUES(CONCAT(CAST(002 AS CHAR),"__",DATE_FORMAT(CURDATE(), '%Y-%m-%d')),CURRENT_TIMESTAMP(),null,1,1,'ninguna','writer test','president','place','ninguno');
INSERT INTO acta(acta_id,acta_fechCrea,acta_fechCierre,acta_tipo,acta_estado,acta_obser,acta_secretario,acta_presidente,acta_lugar,acta_invitados) VALUES(CONCAT(CAST(003 AS CHAR),"__",DATE_FORMAT(CURDATE(), '%Y-%m-%d')),CURRENT_TIMESTAMP(),null,1,2,'ninguna','writer test','president','place','ninguno');
-- CHAR   SELECT CAST(DATE_FORMAT(CURDATE(), '%Y-%m-%d') AS CHAR);
-- INSERT INTO acta VALUES(DATE_FORMAT(CAST(DATE_FORMAT(CURDATE(), '%Y-%m-%d') AS CHAR), '%Y-%m-%d'),null,1,1);

CREATE TABLE IF NOT EXISTS departamento (
    departamento_id SMALLINT, -- códigos de los departamentos segun el DANE
    departamento_nombre VARCHAR(50) UNIQUE,
    PRIMARY KEY (departamento_id)
) ENGINE = INNODB;

INSERT INTO departamento VALUES(5,'ANTIOQUIA');
INSERT INTO departamento VALUES(17,'CALDAS');

CREATE TABLE IF NOT EXISTS municipio (
    municipio_id INT AUTO_INCREMENT,
    municipio_codigo SMALLINT,  -- códigos de municipio segun dane 
    municipio_nombre VARCHAR(30) UNIQUE,
    municipio_departamento_id SMALLINT , -- sera el código corespondiente en tabla departamento según DANE
    municipio_codPost SMALLINT, 
    PRIMARY KEY (municipio_id),
    CONSTRAINT fk_mun_dep FOREIGN KEY (municipio_departamento_id) REFERENCES departamento(departamento_id) ON DELETE NO ACTION
) ENGINE = INNODB;

INSERT INTO municipio VALUES(null,1,'MANIZALES',17,0); 
INSERT INTO municipio VALUES(null,174,'CHINCHINA',17,0);

CREATE TABLE IF NOT EXISTS direccion (
    direccion_id INT AUTO_INCREMENT,
    direccion_mun_id INT , -- sera el código según DANE correspondiente en tabla municipio
    direccion_barrio VARCHAR(15),
    direccion_describ VARCHAR(30),
    PRIMARY KEY (direccion_id),
    CONSTRAINT fk_direccion_mun FOREIGN KEY (direccion_mun_id) REFERENCES municipio(municipio_id) ON DELETE NO ACTION
) ENGINE = INNODB;

INSERT INTO direccion VALUES(null,1,'San Jorge','Cra 22 # 48c-12');
INSERT INTO direccion VALUES(null,1,'San Luis','Cra 24 # 45c-12');

CREATE TABLE IF NOT EXISTS asistentes (
    asistentes_id VARCHAR (15) ,
    asistentes_tipDoc ENUM('Registro Civil','Tarjeta de Identidad','Cédula de Ciudadania','Cédula de Extranjeria','Pasaporte'), -- 1 registro civil, 2 tarjeta de identidad, 3 cédula de ciudadanía, 4 cedula de extranjeria, 5 pasaporte 
    asistentes_nom1 VARCHAR (15) NOT NULL,
    asistentes_nom2 VARCHAR (15),
    asistentes_ape1 VARCHAR (15) NOT NULL,
    asistentes_ape2 VARCHAR (15),
    asistentes_tipo ENUM('Pregrado','Posgrado','Especialización','Maestria','Profesor','Administrativo','Externo'), -- si es de pregrado (1), posgrado (2), especialización (3), maestria (4), profesor (5), administrativo (6), externo (7)
    asistentes_genero ENUM('MASCULINO','FEMENINO'), -- masculino (1), femenino (2)
    asistentes_dir_id INT, -- direccion de residencia llave primaria de drección
    asistentes_tel VARCHAR (30), -- número de contacto 
    asistentes_email VARCHAR (40), -- correo personal
    PRIMARY KEY (asistentes_id),
    CONSTRAINT fk_asistentes_direc FOREIGN KEY (asistentes_dir_id) REFERENCES direccion(direccion_id)
)ENGINE = INNODB;

INSERT INTO asistentes VALUES(12345,3,'asistente 1',null,'last name',null,6,2,2,'123456','email@gmail.com');

CREATE TABLE IF NOT EXISTS sede(
	sede_id SMALLINT AUTO_INCREMENT,
    sede_nombre VARCHAR (20) UNIQUE,  
    sede_direc VARCHAR (65), -- direccion del campus principal e la sede 
    sede_tel VARCHAR  (30), -- número de contacto de con área administrativa en la sede
    PRIMARY KEY(sede_id)
)ENGINE = INNODB;

INSERT INTO sede VALUES(null,'MANIZALES',null,null);

CREATE TABLE IF NOT EXISTS activiEconom(
	activiEconomic_id SMALLINT, -- codificada segun código CIOU (Clasificación Internacional Uniforme de Ocupaciones) para Colombia
    activiEconomic_nombre VARCHAR (80) UNIQUE, -- nombre de la actividad económica 
    activiEconomic_descri VARCHAR (150), -- descripción corta de la actividad económica o actividades
    PRIMARY KEY (activiEconomic_id)
)ENGINE = INNODB;

INSERT INTO activiEconom VALUES(2356,'Instructores de tecnología de la información','Instructores de tecnología de la información');
INSERT INTO activiEconom VALUES(2359,'Otros profesionales de la educación no clasificados en otros grupos primarios','Otros profesionales de la educación no clasificados en otros grupos primarios');

CREATE TABLE IF NOT EXISTS infoFami (
    infoFami_id BIGINT AUTO_INCREMENT ,
    infoFami_ingreFamSalario TINYINT(1), -- si los ingresos familiares son por salarios 
    infoFami_ingreFamArriendo TINYINT(1), -- Si ingresos familiares son por arriendos (booleano)
    infoFami_ingreFamNegocio TINYINT(1), -- Si ingresos familiares son por negocios (booleano)
    infoFami_ingreFamCuotaAlimen TINYINT(1), -- Si ingresos familiares son por demanda de alimentos (booleano)
    infoFami_ingreFamAuxilio TINYINT(1), -- Si ingresos familiares son por algún auxilio (booleano)
    infoFami_ingreFamOtro VARCHAR (50), -- descripcion de la otra fuente de ingresos puede estar vacía o nula
    infoFami_relacionPadres ENUM('CASADOS','UNIÓN LIBRE','DIVORCIADOS'), -- relación actual de los padres 1 casados, 2 unión librre, 3 divorciados, 4 
    infoFami_responsablePadre TINYINT(1), 
    infoFami_responsableMadre TINYINT(1),
    infoFami_responsableAcudiente TINYINT(1),
    infoFami_responsableEstudiante TINYINT(1),
    infoFami_ayudaFamiliar Varchar (40),
    infoFami_vivendaPropia ENUM('PROPIA','ARRENDADA','FAMILIAR','EN AMORTIZACIÓN'), -- relación con la vivienda que habita el nucleo familiar: 1 propia, 2 arrendada, 3 vivienda familiar, 4 en amortización
    infoFami_estratoVivienda TINYINT(1) UNSIGNED, -- estrato de la vivienda 1,2,3,4,5,6
    infoFami_telefonoFamilia VARCHAR (15), -- numero de contacto de la familia 
    infoFami_numeroPersonasFamilia TINYINT(2) UNSIGNED, -- cantidad de personas en el grupo familiar
    infoFami_numeroMenoresEdad TINYINT(2) UNSIGNED, -- cantidad de menores de edad en el grupo familiar 
    infoFami_parentescos VARCHAR (100), -- personas que conforman el grupo familiar parentescos: 1 padres, 2 abuelos, 3 hermanos, 4 hijos, 5 primos, 6 tíos, otros familiares
    PRIMARY KEY (infoFami_id)
) ENGINE = INNODB;

INSERT INTO infoFami VALUES(null,1,0,0,0,0,'ninguno',1,0,0,0,0,'ninguno',3,1,'12345',4,0,'1 padres, 2 abuelos, 3 hermanos, 4 hijos, 5 primos, 6 tíos, otros familiares');
INSERT INTO infoFami VALUES(null,1,0,0,0,0,'ninguno',1,0,0,0,0,'ninguno',2,1,'120985',5,1,'1 padres, 2 abuelos, 3 hermanos, 4 hijos, 5 primos, 6 tíos, otros familiares');

CREATE TABLE IF NOT EXISTS tipoEducacion (
    tipoEducacion_id TINYINT AUTO_INCREMENT,
    tipoEducacion_nombre VARCHAR(25) UNIQUE,
    PRIMARY KEY(tipoEducacion_id)
)ENGINE = INNODB;

INSERT INTO tipoEducacion VALUES(null,'PREGRADO');
INSERT INTO tipoEducacion VALUES(null,'POSGRADO');
INSERT INTO tipoEducacion VALUES(null,'ESPECIALIZACIÓN');
INSERT INTO tipoEducacion VALUES(null,'MAESTRIA');
INSERT INTO tipoEducacion VALUES(null,'DOCTORADO');
INSERT INTO tipoEducacion VALUES(null,'POSDOCTORADO');

CREATE TABLE IF NOT EXISTS tipoDiscapacidad (
    tipoDiscapacidad_id TINYINT AUTO_INCREMENT,
    tipoDiscapacidad_nombre VARCHAR(100) UNIQUE,
    PRIMARY KEY(tipoDiscapacidad_id)
)ENGINE = INNODB;

INSERT INTO tipoDiscapacidad VALUES(null,'Ninguna');
INSERT INTO tipoDiscapacidad VALUES(null,'Minusvalía de desplazamiento');
INSERT INTO tipoDiscapacidad VALUES(null,'Discapacidades de la Comunicación');
INSERT INTO tipoDiscapacidad VALUES(null,'Discapacidades de ladisposición del cuerpo');

CREATE TABLE IF NOT EXISTS estudiante  (
    estudiante_id VARCHAR (15) ,
    estudiante_tipDoc ENUM('Registro Civil','Tarjeta de Identidad','Cédula de Ciudadania','Cédula de Extranjeria','Pasaporte'), -- 0 registro civil, 1 tarjeta de identidad, 2 cédula de ciudadanía, 3 cedula de extranjeria, 4 pasaporte
    estudiante_numDoc INT UNSIGNED, 
    estudiante_nom1 VARCHAR (15) NOT NULL,
    estudiante_nom2 VARCHAR (15),
    estudiante_apellido1 VARCHAR (15) NOT NULL,
    estudiante_apellido2 VARCHAR (15),
    estudiante_tipoEducacion_id TINYINT, -- si es de pregrado (1), posgrado (2), especialización (3), maestria (4), doctorado (5), posdoctorado (6)
    estudiante_genero ENUM('Masculino','Femenino'), -- masculino (h) ó (1), femenino (m) ó (2)
    estudiante_estadoCivil ENUM('Soltero','Casado','Unión Libre','Divorciado'), -- estado civil del estudiante: 0 soltero, 1 casado, 2 union libre, 3 divorciado
    estudiante_direccion_id INT, -- direccion de residencia llave primaria de drección
    estudiante_telefono VARCHAR (25), -- número de contacto 
    estudiante_correoInstitucional VARCHAR (40), -- correo institucional
    estudiante_correoPerso VARCHAR(40),
    estudiante_abandonado ENUM('Si','No'), -- si el estudiante fue abandonado por los padres booleano
    estudiante_numeroHijos TINYINT UNSIGNED,
    estudiante_discapacitado_id TINYINT,
    PRIMARY KEY (estudiante_id),
    CONSTRAINT fk_estudiante_discapacidad FOREIGN KEY (estudiante_discapacitado_id) REFERENCES tipoDiscapacidad (tipoDiscapacidad_id),
    CONSTRAINT fk_estudiante_tipoEduca FOREIGN KEY (estudiante_tipoEducacion_id) REFERENCES tipoEducacion (tipoEducacion_id),
    CONSTRAINT fk_estudiante_direc FOREIGN KEY (estudiante_direccion_id) REFERENCES direccion (direccion_id)
)ENGINE = INNODB;

INSERT INTO estudiante VALUES('123456',3,123456,'test',null,'last name',null,2,2,1,1,'123456','test@gmail.com',null,2,0,1);

CREATE TABLE IF NOT EXISTS facultad (
    facultad_id INT auto_increment,
    facultad_nombre VARCHAR(50) UNIQUE,
    PRIMARY KEY (facultad_id)
) ENGINE = INNODB;

INSERT INTO facultad VALUES(null,'Facultad de Ingeniería y Arquitectura');

CREATE TABLE IF NOT EXISTS docente (
    docente_id VARCHAR (15),
    docente_tipoDoc ENUM('Registro Civil','Tarjeta de Identidad','Cédula de Ciudadania','Cédula de Extranjeria','Pasaporte'), -- 0 registro civil, 1 tarjeta de identidad, 2 cédula de ciudadania, 3 cedula de extranjeria, 4 pasaporte 
    docente_numDoc INT UNSIGNED, 
    docente_nom1 VARCHAR (15),
    docente_nom2 VARCHAR (15),
    docente_apellido1 VARCHAR (15),
    docente_apellido2 VARCHAR (15),
    docente_tituloTipoEdu_id TINYINT, -- si es de pregrado, posgrado, especialización, maestria < opcional campo tinyint 1 pregrado, 2 posgrado, 3 especialización, 4 maestria
    docente_genero  ENUM('Masculino','Femenino'), -- masculino (h) ó (1), femenino (m) ó (2)
    docente_estadoCivil ENUM('Soltero','Casado','Unión Libre','Divorciado'), -- estado civil del docente: 0 soltero, 1 casado, 2 uniion libre, 3 divorciado
    docente_direccion_id INT, -- direccion de residencia llave primaria de drección
    docente_telefono VARCHAR (25), -- numero de contacto 
    docente_correoInstitucional VARCHAR (40), -- correo institucional
    docente_facultad_id INT, -- facultad en la que está inscrito
    PRIMARY KEY (docente_id),
    CONSTRAINT fk_docente_fac FOREIGN KEY (docente_facultad_id) REFERENCES facultad (facultad_id),
    CONSTRAINT fk_docente_tituloTipoEdu FOREIGN KEY (docente_tituloTipoEdu_id) REFERENCES tipoEducacion (tipoEducacion_id),
    CONSTRAINT fk_docente_direc FOREIGN KEY (docente_direccion_id) REFERENCES direccion(direccion_id)
)ENGINE = INNODB;

INSERT INTO docente VALUES('123456',3,123456,'test',null,'last name',null,2,2,1,1,'123456','test@gmail.com',1);

CREATE TABLE IF NOT EXISTS programa( -- plan académico 
    programa_id SMALLINT ,
    /*Administración de Empresas (Diurno)  (SNIES 4120 )
    Administración de Empresas (Nocturno)  (SNIES 16911)
    Administración de Sistemas Informáticos  (SNIES 16912 )
    Arquitectura  (SNIES 4126)activiEconom
    Ingeniería Eléctrica  (SNIES 4122)
    Ingeniería Electrónica  (SNIES 4123)
    Ingeniería Física  (SNIES 16915 )
    Ingeniería Industrial  (SNIES 4124 )
    Ingeniería Química (SNIES 4125 )
    Matemáticas (SNIES 16916 )
    segun: https://admisiones.unal.edu.co/pregrado/oferta-de-programas-curriculares/ */
    programa_nivelAcademico ENUM('Pregrado','Posgrado','Especialización','Maestría','Doctorado'), -- 1 pregrado, 2 posgrado, 3 especialización, 4 maestria, 5 doctorado 
    programa_nombre VARCHAR(50), -- nombre del programa 
    programa_descripcion VARCHAR (150), -- descripción corta del programa académico
    PRIMARY KEY(programa_id)
) ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS hermanoEstudiante(
    hermEstud_id INT AUTO_INCREMENT, -- numero 
    hermEstud_estudiante_id VARCHAR(15),
    hermEstud_tipoDocumento ENUM('Registro Civil','Tarjeta de Identidad','Cédula de Ciudadania','Cédula de Extranjeria','Pasaporte'), -- 0 registro civil, 1 tarjeta de identidad, 2 cédula de ciudadania, 3 cedula de extranjeria, 4 pasaporte 
    hermEstud_documentoHermano VARCHAR(15),
    hermEstudiante_nombreHermano VARCHAR(50),
    PRIMARY KEY (hermEstud_id),
    CONSTRAINT fk_hermEstud_estudiante FOREIGN KEY (hermEstud_estudiante_id) REFERENCES estudiante (estudiante_id) ON DELETE NO ACTION
)ENGINE = INNODB;

INSERT INTO hermanoEstudiante VALUES(null,123456,2,'15123793600','test');

CREATE TABLE IF NOT EXISTS padres(
    padres_id VARCHAR (15),
    padres_nom1 VARCHAR (15) NOT NULL,
    padres_nom2 VARCHAR (15),
    padres_apellido1 VARCHAR (15) NOT NULL,
    padres_apellido2 VARCHAR (15),
    padres_tipoParentesco ENUM('Padre','Madre','Acudiente'), -- si es el padre, madre o acudi
    padres_nivelelAcademico ENUM('Analfabela','Basica primaria','Bachiller','Técnico','Tecnólogo','Profesional'), -- nivel de formación académica: 0 analfabela, 1 basica primaria, 2 bachiller, 3 técnico, 4 tecnólogo, 5 profesional
    padres_actividEconomic_id SMALLINT,
    padres_direccion_id INT, -- dirección de residencia 
    padres_estadoCivil ENUM('Soltero','Casado','Unión Libre','Divorciado'), -- estado civil del : 0 soltero, 1 casado, 2 unión libre, 3 divorciado 
    padres_telefono VARCHAR (15), -- numero de contacto 
    padres_correoElectronico VARCHAR (40),
    PRIMARY KEY (padres_id),
    CONSTRAINT fk_padres_actividadEconom FOREIGN KEY (padres_actividEconomic_id) REFERENCES activiEconom (activiEconomic_id),
    CONSTRAINT fk_padres_direccion FOREIGN KEY (padres_direccion_id) REFERENCES direccion(direccion_id)
)ENGINE = INNODB;

INSERT INTO padres VALUES('123456','test',null,'last name',null,2,2,2356,1,3,'123456','test@gmail.com');

CREATE TABLE IF NOT EXISTS asignatura (
    asignatura_id VARCHAR(15),
    asignatura_nombre VARCHAR(50) UNIQUE,
    asignatura_creditos TINYINT,
    asignatura_descripcion VARCHAR(100),
    PRIMARY KEY(asignatura_id)
)ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS secretaria (
    secretaria_id INT AUTO_INCREMENT,
    secretaria_nombre VARCHAR(100),
    secretaria_facultad_id INT,
    PRIMARY KEY(secretaria_id),
    CONSTRAINT fk_secretaria_facultad FOREIGN KEY(secretaria_facultad_id) REFERENCES facultad (facultad_id) -- ? en el caso de bienestar tener un registro en facultad llamado cede 
)ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS solicitud (
    solicitud_id VARCHAR(15),
    solicitud_acta_id VARCHAR(16), 
    solicitud_tipoSolicitud TINYINT NOT NULL, -- listado de los difrentes tipos de solicitudes permitadas en el sistema  
    solicitud_fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP(),
    solicitud_fechaRadicación DATETIME,
    solicitud_periodoSolic ENUM("Primer semestre","Segundo semestre","Inter semestral"), -- selección del periodo para el cual realiza la solicitiud 1 primer semestre, 2 segundo semestre, 3 intersemestral
    solicitud_descripSolicitud VARCHAR (350), -- descripcion de la solicitud realizada
    solicitud_autorizaRespuesta ENUM("Si","No"),-- autorización de la respuesta por correo
    solicitud_observacion VARCHAR(500), -- observaciones por estudiante
    solicitud_estado VARCHAR(10),  -- se rrefiere al estado de la solicitud ejm en revisión, aprobada, reprobada--
    solicitud_sesionComiteFecha DATETIME, -- fecha de sesión en la que se revisa la solicitud por parte de comite asesor
    solicitud_sesionComiteNumero VARCHAR(6), -- sesión en la que se revisa la solicitud por parte de comite asesor
    solicitud_bservacionComite VARCHAR(200), -- obserrvacones por parte de comite asesor
    solicitud_sesionDirectorFecah DATETIME,-- fecha sesión en la que se revisa la solicitud por parte de directores de programa
    solicitud_sesionDirectorNumero VARCHAR(6),-- sesión en la que se revisa la solicitud por parte de directores de programa
    solicitud_sesionDirectorObservacion VARCHAR(200), -- observaciones por parte de dirección de programa 
    solicitud_sesionConsejoSedeFecha DATE,-- fecha sesión en la que se revisa la solicitud por parte de consejo de facultad
    solicitud_sesiionConsejoSedeNumero VARCHAR(6),-- sesión en la que se revisa la solicitud por parte de consejo de facultad
    solicitud_sesionConsejoSedeObservacion VARCHAR(200), -- observacion de consejo de facultad
    PRIMARY KEY (solicitud_id),
    CONSTRAINT fk_solicitud_acta FOREIGN KEY (solicitud_acta_id) REFERENCES acta (acta_id)
)ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS soportes (
    soporte_id VARCHAR(15),
    soporte_descripcion VARCHAR(100),
    soporte_vinculo VARCHAR(250), -- vinculo o path del archivo soporte
    PRIMARY KEY(soporte_id),
    CONSTRAINT fk_soporte_solicitud FOREIGN KEY(soporte_id) REFERENCES solicitud (solicitud_id)
)ENGINE = INNODB;

-- < espacio para las solicitudes > --  
CREATE TABLE IF NOT EXISTS solicitud_pbm(
    spbm_id VARCHAR(15),
    spbm_acta_id VARCHAR (16),
    spbm_estudiante_id VARCHAR(15),
    spbm_antiguedad TINYINT NOT NULL, -- admitido (1), antiguo (2), reingreso (3), reserva de cupo (4)
    spbm_programa_id SMALLINT,/*Administraciónaistentes_estCiv TINYINT, -- estado civil del estudiante: 0 soltero, 1 casado, 2 union libre, 3 divorciadonistración de Sistemas Informáticos  (SNIES 16912 )
                                    Arquitectura  (SNIES 4126)
                                    Ingeniería Civil  (SNIES 4121)
                                    Ingeniería Eléctrica  (SNIES 4122)
                                    Ingeniería Electrónica  (SNIES 4123)
                                    Ingeniería Física  (SNIES 16915 )
                                    Ingeniería Industrial  (SNIES 4124 )
                                    Ingeniería Química (SNIES 4125 )
                                    Matemáticas (SNIES 16916 )
                                    segun: https://admisiones.unal.edu.co/pregrado/oferta-de-programas-curriculares/ 
                                    http://programasacademicos.unal.edu.co/buscar*/
    spbm_semestre TINYINT NOT NULL, -- Numero de semestres o matriculas cursadas -- numero semestre o matrícula
    spbm_programaAnterior_id SMALLINT, -- si ha estado en otra carrera en la universidad verdaderao o falso
    spbm_numeroSolicitud TINYINT UNSIGNED NOT NULL , -- las opciones son 1 2 3 4 5 o mas la cantidad de veces que ha realizado una solicitud 
    spbm_padre_id VARCHAR (15), 
    spbm_madre_id VARCHAR (15),
    spbm_convivenciaPadres TINYINT UNSIGNED, -- convivencia de los padres 1 conviven casados, 2 divorciados, 3 en trámite de divorcio, 4 conviven en unión libre 
    spbm_infoFami_id BIGINT, -- relacion foranea con la información familiar
    spbm_fuentesIngresos VARCHAR(150), -- lista de chequeo ingresos de la familia
    spbm_soportes VARCHAR(150), -- lista de selcción multiple para soportes a anexar 
    spbm_motivoSolicitud VARCHAR (150), -- los motivos de la solicitud lista de seleecion multiple
    spbm_motivoSolicitudOtro VARCHAR (30), -- descripcion de los otros motivos puede estar vacia o nula
    spbm_direcNucleoFami VARCHAR (15), -- dirección de residencia del núcleo familiar
    spbm_barrio VARCHAR (15), -- nombre del barrio donde vive el núcleo familiar
    spbm_muninicipio VARCHAR (5), -- almacenara el codigo del municipio
    spbm_direcNotifica VARCHAR (15), -- dirección para notificación en manizales 
    spbm_barrioNotifica VARCHAR (15), -- nombre del barrio donde se puede enviar la correspondencia según dirección
    spbm_municipioManizales VARCHAR (5), -- almacenara el codigo del municipio en manizales segun dirección
    spbm_telefonoContacto VARCHAR (15), -- numero de contacto del estudiante o persona cercana
    PRIMARY KEY (spbm_id),
    CONSTRAINT fk_spbm_acta FOREIGN KEY (spbm_acta_id) REFERENCES acta (acta_id),
    CONSTRAINT fk_spbm_estudiante FOREIGN KEY (spbm_estudiante_id) REFERENCES estudiante (estudiante_id),
    CONSTRAINT fk_spbm_programa FOREIGN KEY (spbm_programa_id) REFERENCES programa(programa_id),
    CONSTRAINT fk_spbm_programaAnterior FOREIGN KEY (spbm_programaAnterior_id) REFERENCES programa(programa_id),
    CONSTRAINT fk_spbm_pd FOREIGN KEY (spbm_padre_id) REFERENCES padres (padres_id),
    CONSTRAINT fk_spbm_md FOREIGN KEY (spbm_madre_id) REFERENCES padres (padres_id),
    CONSTRAINT fk_spbm_infam FOREIGN KEY (spbm_infoFami_id) REFERENCES infoFami (infoFami_id),
    CONSTRAINT fk_spbm_solicitud_id FOREIGN KEY (spbm_id) REFERENCES solicitud (solicitud_id)
)ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS soliciAdmiAuto (  -- solicitud admision automática
    soliciAdmiAuto_id VARCHAR(15) ,
    soliciAdmiAuto_acta_id VARCHAR(16),
    soliciAdmiAuto_estudiante_id VARCHAR(15), -- documento del estudiante
    soliciAdmiAuto_motivBenefi TINYINT, -- selección motivo por el cual le otorgan el beneficio 1 grado de honor, 2 mejor promedio, 3 ganador mejor TDJ
    soliciAdmiAuto_programa_id SMALLINT, -- identificador de la carrera o plan de estudios 
    PRIMARY KEY (soliciAdmiAuto_id),
    CONSTRAINT fk_soliciAdmiAuto_acta FOREIGN KEY (soliciAdmiAuto_acta_id) REFERENCES acta (acta_id),
    CONSTRAINT fk_soliciAdmiAuto_programa FOREIGN KEY (soliciAdmiAuto_programa_id) REFERENCES programa (programa_id),
    CONSTRAINT fk_soliciAdmiAuto_estudiante FOREIGN KEY (soliciAdmiAuto_estudiante_id) REFERENCES estudiante (estudiante_id),
    CONSTRAINT fk_soliciAdmiAuto_solicitud FOREIGN KEY (soliciAdmiAuto_id) REFERENCES solicitud (solicitud_id)
)ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS soliCambTut (  -- solicitud cambio tutor
    solCamTutor_id VARCHAR(15),
    solCamTutor_solici_id VARCHAR(15),
    solCamTutor_estudiante_id VARCHAR (15),
    solCamTutor_programa_id SMALLINT, -- identificador de la carrera o plan de estudios para el quue realiza la solicitud
    solCamTutor_tutorPropuesto_id VARCHAR (15) NOT NULL, -- selección del maestro propuesto como tutor
    solCamTutor_deparTutor VARCHAR(60), -- descripción del departamento administrativo al que pertenece el profesor  
    solCamTutor_soportes VARCHAR(100), -- lista seleccion multiple documentos de soporte 
    PRIMARY KEY (solCamTutor_id),
    CONSTRAINT fk_soliCamTutor_solicitud FOREIGN KEY (solCamTutor_solici_id) REFERENCES solicitud (solicitud_id),
    CONSTRAINT fk_soliCamTutor_docente FOREIGN KEY (solCamTutor_tutorPropuesto_id) REFERENCES docente (docente_id),
    CONSTRAINT fk_soliCamTutor_est FOREIGN KEY (solCamTutor_estudiante_id) REFERENCES estudiante (estudiante_id),
    CONSTRAINT fk_soliCamTutor_prog FOREIGN KEY (solCamTutor_programa_id) REFERENCES programa (programa_id)
)ENGINE = INNODB;

-- ! < relaciones entre tablas muchos a muchos > --

CREATE TABLE IF NOT EXISTS acta_asistentes (
    actaAsistente_id INT  AUTO_INCREMENT,
    actaAsistente_acta_id VARCHAR(16),
    actaAsistente_asitente_id VARCHAR(15),
    PRIMARY KEY(actaAsistente_id),
    CONSTRAINT fk_actaAsistente_acta FOREIGN KEY(actaAsistente_acta_id) REFERENCES acta(acta_id),
    CONSTRAINT fk_actaAsistente_asistentes FOREIGN KEY(actaAsistente_asitente_id) REFERENCES asistentes (asistentes_id)
)ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS  programa_facultad(
    prograFacult_id INT AUTO_INCREMENT,
    prograFacult_prog_id SMALLINT ,
    prograFacult_facult_id INT ,
    PRIMARY KEY (prograFacult_id),
    CONSTRAINT fk_progSede_prog FOREIGN KEY (prograFacult_prog_id) REFERENCES programa (programa_id),
    CONSTRAINT fk_progSede_sede FOREIGN KEY (prograFacult_facult_id) REFERENCES facultad (facultad_id)
)ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS facultad_sede(
    facultadSede_id INT AUTO_INCREMENT,
    facultadSede_facul_id INT ,
    facultadSede_sed_id SMALLINT ,
    PRIMARY KEY (facultadSede_id),
    CONSTRAINT fk_facultadSede_facul FOREIGN KEY (facultadSede_facul_id) REFERENCES facultad (facultad_id),
    CONSTRAINT fk_facultadSede_sede FOREIGN KEY (facultadSede_sed_id) REFERENCES sede (sede_id)
)ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS programa_estudiante (
    prograEstud_id INT AUTO_INCREMENT,
    prograEstud_programa_id SMALLINT ,
    prograEstud_estud_id VARCHAR (15),
    PRIMARY KEY (prograEstud_id),
    CONSTRAINT fk_progEst_prog FOREIGN KEY (prograEstud_programa_id) REFERENCES programa(programa_id),
    CONSTRAINT fk_progEst_est FOREIGN KEY (prograEstud_estud_id) REFERENCES estudiante(estudiante_id)
)ENGINE = INNODB;

CREATE TABLE IF NOT EXISTS asignatura_programa (
    asignProg_id INT AUTO_INCREMENT,
    asignProg_asign_id VARCHAR(15),
    asignProg_programa_id SMALLINT,
    PRIMARY KEY (asignProg_id),
    CONSTRAINT fk_asignProg_asignatura FOREIGN KEY (asignProg_asign_id) REFERENCES asignatura(asignatura_id),
    CONSTRAINT fk_asignProg_programa FOREIGN KEY (asignProg_programa_id) REFERENCES programa (programa_id)
)ENGINE = INNODB;

-- SELECT CONCAT("A","B");
-- SELECT CONCAT(DATE_FORMAT(SELECT CUTDATE(), '%Y-%m-%d') ,"__",CAST(1 AS UNSIGNED));
-- SELECT CONCAT(DATE_FORMAT(CURDATE(), '%Y-%m-%d') ,"__",CAST(1 AS UNSIGNED));
