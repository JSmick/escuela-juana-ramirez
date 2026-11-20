INSERT INTO usuario (correo_user, pass_user, id_rol) 
VALUES ('rep.ejemplo@escuela.edu.ve', 
    'clave123', 
    'c'
);
INSERT INTO representantes (
    nom,
    apell,
    cedula,
    telef,
    email,
    direccion,
    is_active,
    created_at,
    id_user
)
VALUES (
    'María',
    'Gómez',
    'V-15987654',
    '0424-7654321',
    'rep.ejemplo@escuela.edu.ve',
    'Barrio Obrero, San Cristóbal',
    true,
    CURRENT_DATE,
    currval('usuario_id_user_seq')
);