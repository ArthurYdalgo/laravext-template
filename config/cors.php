<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods'   => ['*'],
    'allowed_origins'   => [
        'https://car-rental-saet-2025-main-rfctpl.laravel.cloud',
        'http://localhost:3000',
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers'   => ['*'],
    'exposed_headers'   => [],
    'max_age'           => 3600,
    'supports_credentials' => false,
];
