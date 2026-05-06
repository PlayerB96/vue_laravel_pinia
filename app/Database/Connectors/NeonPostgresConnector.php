<?php

namespace App\Database\Connectors;

use Illuminate\Database\Connectors\PostgresConnector;

/**
 * Neon + libpq sin SNI (p.ej. PHP/XAMPP en Windows).
 *
 * Opción documentada D: `endpoint=<id>;<password>` en el campo contraseña.
 *
 * @see https://neon.tech/docs/connect/connection-errors
 */
class NeonPostgresConnector extends PostgresConnector
{
    public function connect(array $config)
    {
        if (! empty($config['neon_endpoint']) && ! empty($config['password'])) {
            $config['password'] = 'endpoint='.$config['neon_endpoint'].';'.$config['password'];
        }

        return parent::connect($config);
    }
}
