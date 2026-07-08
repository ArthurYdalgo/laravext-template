<?php

namespace App\Providers;

use App\Helpers\Routing\CustomMultilingualRegistrar;
use Illuminate\Support\ServiceProvider;
use ChinLeung\MultilingualRoutes\MultilingualRegistrar;
use Illuminate\Support\Facades\Vite;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::useIntegrityKey('integrity');
    }
}
