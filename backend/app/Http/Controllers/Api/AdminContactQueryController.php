<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ContactQuery;
use Illuminate\Http\Request;

class AdminContactQueryController extends Controller
{
    public function index()
    {
        $queries = ContactQuery::latest()->get();
        return response()->json([
            'success' => true,
            'queries' => $queries,
        ]);
    }

    public function destroy($id)
    {
        $query = ContactQuery::findOrFail($id);
        $query->delete();

        return response()->json([
            'success' => true,
            'message' => 'Contact query deleted successfully',
        ]);
    }
}
