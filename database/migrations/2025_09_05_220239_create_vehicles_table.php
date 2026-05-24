<?php

use App\Models\Brand;
use App\Models\Color;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();

            $table->foreignIdFor(Brand::class)->nullable()->constrained()->nullOnDelete();
            $table->foreignIdFor(Color::class)->nullable()->constrained()->nullOnDelete();

            $table->string('type')->index();
            $table->string('license_plate')->index();
            $table->string('name')->index();
            $table->integer('year');
            $table->integer('seats');
            $table->decimal('trunk_capacity', 8, 2)->nullable();
            $table->decimal('price_per_day', 10, 2);

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
