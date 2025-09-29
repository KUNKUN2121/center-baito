<?php

use App\Http\Controllers\EditController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ShiftChangeRequestsController;
use App\Http\Controllers\ShiftController;
use App\Http\Controllers\ShiftSubmissionController;
use App\Models\Shift;
use App\Models\ShiftSubmission;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


// シフト閲覧ページ
Route::get('/shifts', function () {
    return Inertia::render('Shifts/Index');
})->middleware(['auth', 'verified'])->name('shifts.index');

// シフト希望提出ページ
Route::get('/shifts/request', function () {
    return Inertia::render('Shifts/Request');
})->middleware(['auth', 'verified'])->name('shifts.request');


// --- ADMIN用 ---
Route::prefix('admin')->group(function () {
    Route::get('/shifts', function () {
        return Inertia::render('Shifts/Admin');
    })->middleware(['auth', 'verified'])->name('shifts.admin');
    Route::get('/shifts/edit', function () {
        return Inertia::render('Shifts/Admin/Edit');
    })->middleware(['auth', 'verified'])->name('shifts.admin.editor');

});



require __DIR__.'/auth.php';




// テスト用のapi (認証付き)
Route::middleware('auth')->group(function () {
    // apiのprefix groupをつくる
    Route::group(['prefix' => 'api'], function () {
        Route::get('/user', function (Request $request) {
            return auth()->user();
        });


        Route::get('/dashboard', [ShiftController::class, 'dashboard']);

        // 一般ユーザシフト 閲覧用
        // GET /api/shifts?month=2025-10 のように、クエリで年月を指定
        Route::get('shifts', [ShiftController::class, 'index']);

        // --- シフト希望用 ---
        //
        // GET /shifts-submissions 一覧取得
        // GET /shifts-submissions/{id} 単一取得
        // POST /shifts-submissions 新規作成
        // PUT /shifts-submissions/{id} 更新
        // DELETE /shifts-submissions/{id} 削除
        Route::apiResource('/shifts-submissions', ShiftSubmissionController::class);

        //
        // --- Admin用 ---
        //
        Route::prefix('admin')->group(function () {
            // Editor用
            Route::get('/shifts/edit', [EditController::class, 'show'])->middleware(['auth', 'verified'])->name('shifts.admin.edit');
            Route::post('/shifts/edit/confirm', [EditController::class, 'confirm'])->middleware(['auth', 'verified'])->name('shifts.admin.confirm');
            Route::post('/shifts/edit/publish', [EditController::class, 'publish'])->middleware(['auth', 'verified'])->name('shifts.admin.publish');
        });




        // シフト変更リクエスト
        // Route::post('/shifts/change/request', [ShiftChangeRequestsController::class, 'create'])->middleware(['auth', 'verified'])->name('shifts.change');
        // Route::get('/shifts/change', [ShiftChangeRequestsController::class, 'update'])->middleware(['auth', 'verified'])->name('shifts.change');

    });
});


// Route::post('/api2/shifts/create', [ShiftSubmissionController::class, 'create']);
Route::post('/aaaa/shifts/create', function (Request $request) {
    // test
    return response()->json(['message' => 'Shift created successfully'], 201);
});
