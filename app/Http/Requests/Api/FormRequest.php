<?php

namespace App\Http\Requests\Api;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Validation\Validator;

use Illuminate\Foundation\Http\FormRequest as HttpFormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class FormRequest extends HttpFormRequest
{
    /**
     * Handle a failed authorization attempt.
     *
     * @return void
     *
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    protected function failedAuthorization($message = null)
    {
        return failedAuthorizationResponseException($message ?? __('Unauthorized'));
    }

    protected static function summarize($validator)
    {
        $messages = $validator->errors()->all();

        if (!count($messages) || !is_string($messages[0])) {
            return $validator->getTranslator()->get('The given data was invalid.');
        }

        $message = array_shift($messages);

        if ($count = count($messages)) {
            $pluralized = $count === 1 ? 'error' : 'errors';
            $message .= ' ' . $validator->getTranslator()->get("(and :count more $pluralized)", compact('count'));
        }

        return $message;
    }

    protected function failedValidation(Validator|string $validator)
    {
        if (is_string($validator)) {
            $response = (new Controller)->errorResponse($validator);
            throw new HttpResponseException($response);
        }
        
        $response = (new Controller)->errorResponse(self::summarize($validator), errors: $validator->errors()->getMessages());
        throw new HttpResponseException($response);
    }
}
