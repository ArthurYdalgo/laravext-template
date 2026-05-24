<?php

namespace App\Http\Controllers;

class Controller
{
    /**
     * Get a success response
     *
     * @param mix $messages
     * @param mix $data
     * @param array $meta
     *
     * @return \Illuminate\Http\Response
     */
    public function successResponse($data = null, $message = null)
    {
        $message ??= defaultSuccessResponseMessage();

        $response_data = [
            'message' => $message,
        ];

        if (!is_null($data)) {
            $response_data['data'] = $data;
        }

        return response()->json(
            $response_data,
            200
        );
    }

    /**
     * Get an error response
     *
     * @param mix $messages
     *
     * @return \Illuminate\Http\Response
     */
    public function errorResponse($message = null, $exception = null, $errors = null)
    {
        $response = [
            'message' => $message ?? 'Erro de validação',
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        if (!isEnvProduction() && $exception) {
            $response['exception_message'] = $exception->getMessage();
        }

        return response()->json($response, 422);
    }

    /**
     * Get an not found response
     *
     * @param mix $messages
     *
     * @return \Illuminate\Http\Response
     */
    public function notFoundResponse($message = null, $exception = null)
    {
        $message ??= 'Não encontrado';

        $response = [
            'message' => $message,
        ];
        if ((!isEnvProduction()) && $exception) {
            $response['exception_message'] = $exception->getMessage();
        }

        return response()->json($response, 404);
    }

    /**
     * Get an unauthorized response
     *
     * @param mix $messages
     *
     * @return \Illuminate\Http\Response
     */
    public function unauthorizedResponse($message = null, $exception = null)
    {
        $message ??= 'Não autorizado';

        $response = [
            'message' => $message,
        ];

        if (!isEnvProduction() && $exception) {
            $response['exception_message'] = $exception->getMessage();
        }

        return response()->json($response, 403);
    }

    /**
     * Get an unauthenticated response
     * 
     * @return \Illuminate\Http\Response
     */
    public function unauthenticatedResponse($message = null, $exception = null)
    {
        $message ??= 'Não autenticado';

        $response = [
            'message' => $message,
        ];

        if (!isEnvProduction() && $exception) {
            $response['exception_message'] = $exception->getMessage();
        }

        return response()->json($response, 401);
    }

    /**
     * Get an forbidden response
     * 
     * @param mix $messages
     * 
     * @return \Illuminate\Http\Response
     */
    public function conflictResponse($message = null, $exception = null)
    {
        $messages = $message ?? 'Conflito de dados';

        $response = [
            'message' => $message
        ];

        if (!isEnvProduction() && $exception) {
            $response['exception_message'] = $exception->getMessage();
        }

        return response()->json($response, 409);
    }
}
