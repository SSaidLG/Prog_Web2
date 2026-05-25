-- 1. Crear la base de datos y usarla
CREATE DATABASE IF NOT EXISTS fleetops_db;
USE fleetops_db;

-- 2. Tabla de Vehículos (Alimenta: dashboard.html y flota.html)
CREATE TABLE vehiculos (
    id VARCHAR(15) PRIMARY KEY, -- Ej: 'TRK-2044'
    modelo VARCHAR(100) NOT NULL, -- Ej: 'Freightliner Cascadia 2023'
    placa VARCHAR(20) UNIQUE NOT NULL, -- Ej: 'X-442-BJK'
    categoria VARCHAR(50) NOT NULL, -- Ej: 'Heavy Duty Truck'
    estado ENUM('OPERATIVO', 'MANTENIMIENTO', 'FALLA CRITICA', 'EN RUTA', 'CARGANDO', 'INACTIVO') NOT NULL DEFAULT 'OPERATIVO',
    nivel_combustible INT DEFAULT 100, -- Porcentaje 0-100
    operador VARCHAR(100) DEFAULT NULL, -- Ej: 'Marcus Rivera'
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabla de Inspecciones (Alimenta: inspeccion.html)
CREATE TABLE inspecciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehiculo_id VARCHAR(15) NOT NULL,
    fecha_inspeccion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Motor y Mecánica (Booleanos: 1 = Bien/Revisado, 0 = Falla/Pendiente)
    chk_aceite BOOLEAN DEFAULT FALSE,
    chk_refrigerante BOOLEAN DEFAULT FALSE,
    chk_correas BOOLEAN DEFAULT FALSE,
    
    -- Sistema de Iluminación
    chk_luces_cruce BOOLEAN DEFAULT FALSE,
    chk_luces_intermitentes BOOLEAN DEFAULT FALSE,
    chk_luces_freno BOOLEAN DEFAULT FALSE,
    chk_luces_matricula BOOLEAN DEFAULT FALSE,
    
    -- Ruedas y Neumáticos
    chk_neumaticos_presion BOOLEAN DEFAULT FALSE,
    chk_neumaticos_dibujo BOOLEAN DEFAULT FALSE,
    
    -- Elementos de Seguridad
    chk_frenos BOOLEAN DEFAULT FALSE,
    chk_extintor BOOLEAN DEFAULT FALSE,
    chk_chalecos BOOLEAN DEFAULT FALSE,
    
    -- Detalles adicionales
    observaciones TEXT,
    firma_conductor VARCHAR(100) NOT NULL,
    licencia_conductor VARCHAR(50) NOT NULL,
    
    -- Relación: Si se borra un vehículo, se borran sus inspecciones
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE
);

-- 4. Tabla de Mantenimientos (Alimenta: mantenimiento.html)
CREATE TABLE mantenimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehiculo_id VARCHAR(15) NOT NULL,
    fecha_servicio DATE NOT NULL,
    tipo_servicio VARCHAR(150) NOT NULL, -- Ej: 'Revisión de Frenos y ABS'
    taller VARCHAR(100) NOT NULL, -- Ej: 'EuroTaller Central'
    costo DECIMAL(10, 2) NOT NULL, -- Ej: 1240.00
    estado ENUM('COMPLETADO', 'EN PROCESO', 'URGENTE', 'PROGRAMADO') NOT NULL,
    
    FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id) ON DELETE CASCADE
);

-- 5. Insertar datos de prueba para que podamos ver algo en pantalla
INSERT INTO vehiculos (id, modelo, placa, categoria, estado, nivel_combustible, operador) VALUES 
('TRK-2044', 'Freightliner Cascadia 2023', 'X-442-BJK', 'Heavy Duty Truck', 'OPERATIVO', 82, 'Marcus Rivera'),
('VAN-1102', 'Rivian EDV-700', 'E-002-LNV', 'Electric Van', 'MANTENIMIENTO', 45, 'Elena Fischer'),
('TRK-5591', 'Volvo FH16 Globetrotter', 'V-991-KKS', 'Heavy Duty Truck', 'FALLA CRITICA', 12, 'Jordan Smith'),
('LGT-8823', 'Ford Transit Custom', 'F-823-TRN', 'Light Commercial', 'OPERATIVO', 98, 'Sarah Chen'),
('TRK-3310', 'Kenworth T680', 'K-680-MTR', 'Heavy Duty Truck', 'EN RUTA', 67, 'David Okafor'),
('VAN-2204', 'Mercedes eSprinter', 'M-204-ESP', 'Electric Van', 'OPERATIVO', 88, 'Lucia Romano'),
('TRK-7782', 'Scania R500', 'S-500-RNG', 'Heavy Duty Truck', 'CARGANDO', 34, 'Ahmed Hassan'),
('LGT-4417', 'Renault Master', 'R-417-MST', 'Light Commercial', 'MANTENIMIENTO', 22, 'Nina Petrova'),
('VAN-9905', 'Ford E-Transit', 'F-905-ETR', 'Electric Van', 'OPERATIVO', 76, 'Carlos Mendez'),
('TRK-1188', 'MAN TGX 18.640', 'M-188-TGX', 'Heavy Duty Truck', 'OPERATIVO', 91, 'Sophie Laurent'),
('LGT-6620', 'Iveco Daily', 'I-620-DLY', 'Light Commercial', 'INACTIVO', 5, NULL),
('VAN-3340', 'Rivian EDV-500', 'E-340-RVN', 'Electric Van', 'FALLA CRITICA', 18, 'Tomas Novak'),
('TRK-4455', 'Peterbilt 579', 'P-455-PTB', 'Heavy Duty Truck', 'EN RUTA', 59, 'Grace Kim'),
('LGT-7791', 'Volkswagen Crafter', 'V-791-CRF', 'Light Commercial', 'OPERATIVO', 84, 'Liam Murphy'),
('TRK-9023', 'DAF XF 480', 'D-023-XFF', 'Heavy Duty Truck', 'MANTENIMIENTO', 40, 'Yuki Tanaka'),
-- Nuevos 20 Registros
('TRK-1021', 'Volvo FH16', 'V-021-XYZ', 'Heavy Duty Truck', 'OPERATIVO', 80, 'Luis Garcia'),
('VAN-1022', 'Ford E-Transit', 'F-022-ABC', 'Electric Van', 'EN RUTA', 55, 'Maria Lopez'),
('LGT-1023', 'Renault Master', 'R-023-DEF', 'Light Commercial', 'CARGANDO', 40, 'Carlos Ruiz'),
('SUP-1024', 'Toyota Hilux', 'T-024-GHI', 'Logistics Support', 'OPERATIVO', 95, 'Ana Torres'),
('TRK-1025', 'Kenworth T680', 'K-025-JKL', 'Heavy Duty Truck', 'MANTENIMIENTO', 25, 'Jorge Ramirez'),
('VAN-1026', 'Rivian EDV-700', 'R-026-MNO', 'Electric Van', 'OPERATIVO', 100, 'Sofia Castro'),
('LGT-1027', 'Mercedes Sprinter', 'M-027-PQR', 'Light Commercial', 'FALLA CRITICA', 10, 'Miguel Santos'),
('SUP-1028', 'Ford Ranger', 'F-028-STU', 'Logistics Support', 'EN RUTA', 70, 'Lucia Morales'),
('TRK-1029', 'Freightliner Cascadia', 'F-029-VWX', 'Heavy Duty Truck', 'OPERATIVO', 65, 'Roberto Vega'),
('VAN-1030', 'Mercedes eSprinter', 'M-030-YZA', 'Electric Van', 'INACTIVO', 0, NULL),
('LGT-1031', 'Volkswagen Crafter', 'V-031-BCD', 'Light Commercial', 'OPERATIVO', 88, 'Carmen Ortiz'),
('SUP-1032', 'Toyota Tacoma', 'T-032-EFG', 'Logistics Support', 'EN RUTA', 45, 'Diego Mendez'),
('TRK-1033', 'Scania R500', 'S-033-HIJ', 'Heavy Duty Truck', 'CARGANDO', 90, 'Laura Nuñez'),
('VAN-1034', 'Ford E-Transit', 'F-034-KLM', 'Electric Van', 'MANTENIMIENTO', 30, 'Pedro Aguilar'),
('LGT-1035', 'Iveco Daily', 'I-035-NOP', 'Light Commercial', 'OPERATIVO', 75, 'Rosa Silva'),
('SUP-1036', 'Nissan NP300', 'N-036-QRS', 'Logistics Support', 'OPERATIVO', 85, 'Alberto Gil'),
('TRK-1037', 'Peterbilt 579', 'P-037-TUV', 'Heavy Duty Truck', 'FALLA CRITICA', 5, 'Diana Rojas'),
('VAN-1038', 'Rivian EDV-500', 'R-038-WXY', 'Electric Van', 'EN RUTA', 60, 'Fernando Herrera'),
('LGT-1039', 'Ford Transit Custom', 'F-039-ZAB', 'Light Commercial', 'CARGANDO', 50, 'Monica Cruz'),
('SUP-1040', 'Toyota Hilux', 'T-040-CDE', 'Logistics Support', 'OPERATIVO', 100, 'Andres Campos');

-- ==========================================
-- 6. Tabla de Usuarios (Login / Autenticación)
-- ==========================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Nunca guardamos la contraseña en texto plano
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuario de prueba para entregar el proyecto.
-- Credenciales:  email = admin@fleetops.com   |   contraseña = admin123
-- El hash corresponde a "admin123" generado con bcrypt (10 rondas).
INSERT INTO usuarios (nombre, email, password_hash) VALUES
('Administrador', 'admin@fleetops.com', '$2b$10$qcelH.CsF27vDnwaQab1k.UZ8KlhjeHSp2aS2U6U4BU42V4V.nbGW');

-- ==========================================
-- 7. Datos de prueba: Inspecciones
-- ==========================================
INSERT INTO inspecciones (vehiculo_id, chk_aceite, chk_refrigerante, chk_correas, chk_luces_cruce, chk_luces_intermitentes, chk_luces_freno, chk_luces_matricula, chk_neumaticos_presion, chk_neumaticos_dibujo, chk_frenos, chk_extintor, chk_chalecos, observaciones, firma_conductor, licencia_conductor) VALUES
('TRK-2044', 1,1,1,1,1,1,1,1,1,1,1,1, 'Vehiculo en optimas condiciones.', 'Marcus Rivera', 'LIC-884213'),
('VAN-1102', 1,1,0,1,1,1,1,1,0,1,1,1, 'Correa de distribucion con desgaste. Programado a taller.', 'Elena Fischer', 'LIC-552109'),
('TRK-5591', 0,1,0,1,0,1,1,0,0,0,1,1, 'Falla critica en sistema de frenos. Fuera de servicio.', 'Jordan Smith', 'LIC-330417'),
('LGT-8823', 1,1,1,1,1,1,1,1,1,1,1,1, 'Sin observaciones.', 'Sarah Chen', 'LIC-771265'),
-- Nuevos 20 Registros
('TRK-1021', 1,1,1,1,1,1,1,1,1,1,1,1, 'Todo en orden para viaje largo.', 'Luis Garcia', 'LIC-102100'),
('VAN-1022', 1,1,1,1,1,1,1,1,1,1,1,1, 'Revisión matutina completada.', 'Maria Lopez', 'LIC-102201'),
('LGT-1023', 1,1,1,0,1,1,1,1,1,1,1,1, 'Foco de luz de cruce izquierdo fundido.', 'Carlos Ruiz', 'LIC-102302'),
('SUP-1024', 1,1,1,1,1,1,1,1,1,1,1,1, 'Perfecto estado.', 'Ana Torres', 'LIC-102403'),
('TRK-1025', 1,0,1,1,1,1,1,1,1,1,1,1, 'Nivel de refrigerante bajo, requiere relleno.', 'Jorge Ramirez', 'LIC-102504'),
('VAN-1026', 1,1,1,1,1,1,1,1,1,1,1,1, 'Batería eléctrica al 100%.', 'Sofia Castro', 'LIC-102605'),
('LGT-1027', 0,0,0,1,1,1,1,0,0,0,1,1, 'Falla general mecánica detectada. Detener unidad.', 'Miguel Santos', 'LIC-102706'),
('SUP-1028', 1,1,1,1,1,1,1,1,1,1,1,0, 'Faltan chalecos reflectantes.', 'Lucia Morales', 'LIC-102807'),
('TRK-1029', 1,1,1,1,1,1,1,1,1,1,1,1, 'Inspección de rutina sin problemas.', 'Roberto Vega', 'LIC-102908'),
('VAN-1030', 1,1,1,1,1,1,1,1,1,1,0,1, 'Extintor caducado.', 'Admin Temp', 'LIC-103009'),
('LGT-1031', 1,1,1,1,1,1,1,1,1,1,1,1, 'Vehículo limpio y operativo.', 'Carmen Ortiz', 'LIC-103110'),
('SUP-1032', 1,1,1,1,1,1,1,0,1,1,1,1, 'Presión de llanta trasera derecha baja.', 'Diego Mendez', 'LIC-103211'),
('TRK-1033', 1,1,1,1,1,1,1,1,1,1,1,1, 'Carga asegurada correctamente.', 'Laura Nuñez', 'LIC-103312'),
('VAN-1034', 1,1,1,1,0,1,1,1,1,1,1,1, 'Falla en intermitente trasero.', 'Pedro Aguilar', 'LIC-103413'),
('LGT-1035', 1,1,1,1,1,1,1,1,1,1,1,1, 'Check general aprobado.', 'Rosa Silva', 'LIC-103514'),
('SUP-1036', 1,1,1,1,1,1,1,1,1,1,1,1, 'Lista para supervisión en campo.', 'Alberto Gil', 'LIC-103615'),
('TRK-1037', 1,1,0,1,1,1,1,1,0,0,1,1, 'Frenos largos y banda ruidosa. No operar.', 'Diana Rojas', 'LIC-103716'),
('VAN-1038', 1,1,1,1,1,1,1,1,1,1,1,1, 'Sistemas eléctricos en norma.', 'Fernando Herrera', 'LIC-103817'),
('LGT-1039', 1,1,1,1,1,1,1,1,1,1,1,1, 'Unidad lista para carga vespertina.', 'Monica Cruz', 'LIC-103918'),
('SUP-1040', 1,1,1,1,1,1,1,1,1,1,1,1, 'Todo OK.', 'Andres Campos', 'LIC-104019');

-- ==========================================
-- 8. Datos de prueba: Mantenimientos
-- ==========================================
INSERT INTO mantenimientos (vehiculo_id, fecha_servicio, tipo_servicio, taller, costo, estado) VALUES
('VAN-1102', '2026-05-12', 'Cambio de correa de distribucion', 'EuroTaller Central', 1240.00, 'EN PROCESO'),
('TRK-5591', '2026-05-10', 'Reparacion de sistema de frenos y ABS', 'MecaPro Industrial', 3850.50, 'URGENTE'),
('TRK-2044', '2026-04-28', 'Mantenimiento preventivo 50,000 km', 'EuroTaller Central', 920.00, 'COMPLETADO'),
('LGT-4417', '2026-05-18', 'Revision de suspension', 'TallerExpress Norte', 560.75, 'PROGRAMADO'),
('TRK-9023', '2026-05-15', 'Cambio de aceite y filtros', 'MecaPro Industrial', 410.00, 'COMPLETADO'),
('VAN-3340', '2026-05-20', 'Diagnostico de bateria electrica', 'ElectroFleet Service', 2100.00, 'URGENTE'),
-- Nuevos 20 Registros
('TRK-1025', '2026-05-22', 'Relleno de fluidos y purga de radiador', 'EuroTaller Central', 350.00, 'PROGRAMADO'),
('LGT-1027', '2026-05-11', 'Ajuste mayor de motor y transmisión', 'MecaPro Industrial', 5200.00, 'URGENTE'),
('VAN-1034', '2026-05-19', 'Reemplazo de modulo de luces traseras', 'ElectroFleet Service', 890.00, 'EN PROCESO'),
('TRK-1037', '2026-05-09', 'Cambio de balatas y rectificado de discos', 'TallerExpress Norte', 1850.00, 'URGENTE'),
('SUP-1024', '2026-04-15', 'Alineación y balanceo', 'Neumaticos Pro', 450.00, 'COMPLETADO'),
('TRK-1021', '2026-03-20', 'Mantenimiento preventivo 100,000 km', 'EuroTaller Central', 2500.00, 'COMPLETADO'),
('VAN-1022', '2026-06-05', 'Revisión de sistema de alto voltaje', 'ElectroFleet Service', 1200.00, 'PROGRAMADO'),
('LGT-1023', '2026-05-21', 'Cambio de focos delanteros', 'TallerExpress Norte', 120.00, 'EN PROCESO'),
('SUP-1032', '2026-05-14', 'Reemplazo de llanta derecha y calibración', 'Neumaticos Pro', 950.00, 'COMPLETADO'),
('VAN-1030', '2026-05-01', 'Revisión general por inactividad', 'EuroTaller Central', 500.00, 'COMPLETADO'),
('TRK-1029', '2026-04-10', 'Lavado de inyectores', 'MecaPro Industrial', 1100.00, 'COMPLETADO'),
('LGT-1031', '2026-06-15', 'Ajuste de suspensión delantera', 'TallerExpress Norte', 780.00, 'PROGRAMADO'),
('SUP-1028', '2026-05-17', 'Compra de kit de emergencia (Chalecos)', 'Suministros Global', 150.00, 'COMPLETADO'),
('VAN-1038', '2026-03-30', 'Actualización de software de unidad', 'ElectroFleet Service', 0.00, 'COMPLETADO'),
('TRK-1033', '2026-04-05', 'Engrase de quinta rueda', 'EuroTaller Central', 250.00, 'COMPLETADO'),
('LGT-1035', '2026-06-10', 'Mantenimiento preventivo 20,000 km', 'MecaPro Industrial', 850.00, 'PROGRAMADO'),
('SUP-1036', '2026-05-02', 'Revisión de frenos preventiva', 'TallerExpress Norte', 300.00, 'COMPLETADO'),
('TRK-7782', '2026-05-13', 'Sustitución de filtros de aire de cabina', 'EuroTaller Central', 180.00, 'COMPLETADO'),
('VAN-9905', '2026-04-22', 'Rotación de neumáticos', 'Neumaticos Pro', 200.00, 'COMPLETADO'),
('LGT-1039', '2026-06-01', 'Inspección de chasis y carrocería', 'MecaPro Industrial', 450.00, 'PROGRAMADO');