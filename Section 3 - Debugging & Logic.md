# Section 3: Debugging & Logic

## Problems with the Provided Laravel Code

The given Laravel code has the following issues:

1. **Lack of Authentication**: The endpoint does not check if the user is authenticated, allowing unauthorized access to any expense record.
2. **No Ownership Validation**: There is no verification to ensure the requested expense belongs to the authenticated user, potentially exposing other users' data.
3. **Improper Error Handling**: The code does not handle cases where the expense ID is invalid or not found, which could result in a raw error or null response without proper status codes.

## Rewritten Endpoint

Below is the corrected and improved version of the endpoint, addressing the identified issues by implementing authentication, ownership validation, and proper response handling.

```php
<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ExpenseController extends Controller
{
    public function __construct()
    {
        // apply authentication middleware to secure the endpoint
        $this->middleware('auth:sanctum');
    }

    public function show($id): JsonResponse
    {
        // get the authenticated user
        $user = auth()->user();

        // find the expense that belongs to the authenticated user
        $expense = Expense::where('id', $id)->where('user_id', $user->id)->first();

        if (!$expense) {
            return response()->json([
                'message' => 'Expense not found or you do not have permission to view it.'
            ], 404);
        }

        return response()->json([
            'message' => 'Expense retrieved successfully.',
            'data' => $expense
        ], 200);
    }
}
```