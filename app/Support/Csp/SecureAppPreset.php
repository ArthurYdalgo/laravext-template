<?php

namespace App\Support\Csp;

use Spatie\Csp\Directive;
use Spatie\Csp\Keyword;
use Spatie\Csp\Policy;
use Spatie\Csp\Preset;

class SecureAppPreset implements Preset
{
    public function configure(Policy $policy): void
    {
        $policy
            ->add(Directive::DEFAULT, Keyword::SELF)
            ->add(Directive::CONNECT, Keyword::SELF)
            ->add(Directive::SCRIPT, Keyword::SELF)
            
            // STYLES: We rely strictly on unsafe-inline for React. No nonces here!
            ->add(Directive::STYLE, Keyword::SELF)
            ->add(Directive::STYLE, Keyword::UNSAFE_INLINE)
            ->add(Directive::STYLE, 'https://fonts.bunny.net')

            ->add(Directive::FONT, Keyword::SELF)
            ->add(Directive::FONT, 'https://fonts.bunny.net')

            ->add(Directive::IMG, Keyword::SELF)
            ->add(Directive::IMG, 'data:');

        // CRITICAL: We ONLY add the nonce to the SCRIPT directive, NOT the STYLE directive.
        $policy->addNonce(Directive::SCRIPT);
    }
}