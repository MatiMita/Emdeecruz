<?php
// Archivo de traducciones - Traducción de la interfaz

$translations = [
    'es' => [
        // Navegación
        'inicio' => 'Inicio',
        'quienes_somos' => 'Quienes Somos',
        'productos' => 'Productos',
        'contactos' => 'Contactos',
        'email' => 'Email',
        'phone' => 'Teléfono',
        
        // Inicio
        'main_title' => 'TKN',
        'main_subtitle' => 'Texto de ejemplo',
        
        // About
        'nosotros' => 'Nosotros',
        'about_title' => 'TKN',
        'about_description' => 'Aqui se puede describir a la empresa o negocio',
        'empresa_segura' => 'Empresa segura y confiable',
        'empresa_segura_desc' => 'TKN',
        'servicios_altura' => 'Servicios a la altura',
        'servicios_altura_desc' => 'A su alcance para todos',
        
        // Video
        'mira' => 'Mira',
        'video_title' => 'Nuestro video',
        'video_subtitle' => 'De los mejores resultados',
        
        // Team
        'personal_profesional' => 'Personal Profesional',
        'nuestro_team' => 'Nuestro team',
    ],
    'en' => [
        // Navigation
        'inicio' => 'Home',
        'quienes_somos' => 'About Us',
        'productos' => 'Products',
        'contactos' => 'Contact',
        'email' => 'Email',
        'phone' => 'Phone',
        
        // Home
        'main_title' => 'TKN',
        'main_subtitle' => 'Example text',
        
        // About
        'nosotros' => 'About Us',
        'about_title' => 'TKN',
        'about_description' => 'Here you can describe the company or business',
        'empresa_segura' => 'Safe and reliable company',
        'empresa_segura_desc' => 'TKN',
        'servicios_altura' => 'Quality services',
        'servicios_altura_desc' => 'At your reach for everyone',
        
        // Video
        'mira' => 'Watch',
        'video_title' => 'Our video',
        'video_subtitle' => 'From the best results',
        
        // Team
        'personal_profesional' => 'Professional Staff',
        'nuestro_team' => 'Our Team',
    ]
];

function getTranslation($key, $language = 'es') {
    global $translations;
    return $translations[$language][$key] ?? $key;
}

function t($key, $language = 'es') {
    return getTranslation($key, $language);
}
?>
