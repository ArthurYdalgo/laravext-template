<?php

use App\Models\PaymentMethod;
use App\Models\Rental;
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
        Schema::create('payment_method_rental', function (Blueprint $table) {
            $table->id();

            $table->foreignIdFor(PaymentMethod::class)->constrained();
            $table->foreignIdFor(Rental::class)->constrained();
            $table->decimal('amount', 10, 2);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_method_rental');
    }
};
