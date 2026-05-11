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
('LGT-8823', 'Ford Transit Custom', 'F-823-TRN', 'Light Commercial', 'OPERATIVO', 98, 'Sarah Chen');