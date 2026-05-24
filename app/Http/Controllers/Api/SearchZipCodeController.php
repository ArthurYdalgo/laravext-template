<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SearchZipCodeController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        $zip_code = $request->input('zip_code');

        return $this->successResponse(data: searchZipCode($zip_code));
    }
}
