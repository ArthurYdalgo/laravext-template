<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use Laravel\Socialite\Socialite;
use Laravel\Socialite\Two\User;

class SocialiteTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_user_can_login_with_google(): void
    {
        Socialite::fake('google', User::fake([
            'id' => 'google-1234',
            'name' => 'Jason Beggs',
            'email' => 'jason4@example.com',
        ]));

        $response = $this->get('/auth/google/callback');

        $response->assertRedirect('/dashboard');

        $this->assertDatabaseHas('users', [
            'name' => 'Jason Beggs',
            'email' => 'jason4@example.com',
            'google_id' => 'google-1234',
        ]);
    }

    public function test_user_is_redirected_to_google()
    {
        Socialite::fake('google');

        $response = $this->get('/auth/google/redirect');

        $response->assertRedirect();
    }
}
