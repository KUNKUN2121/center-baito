<?php

use App\Http\Controllers\EditController;
use App\Http\Controllers\ProfileController;
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

// 管理パネル
Route::get('/shifts/admin', function () {
    return Inertia::render('Shifts/Admin');
})->middleware(['auth', 'verified'])->name('shifts.admin');

// 管理パネル Editor
Route::get('/shifts/admin/edit', function () {
    return Inertia::render('Shifts/Admin/Edit');
})->middleware(['auth', 'verified'])->name('shifts.admin.editor');



require __DIR__.'/auth.php';




// テスト用のapi (認証付き)
Route::middleware('auth')->group(function () {
    // apiのprefix groupをつくる
    Route::group(['prefix' => 'api'], function () {
        Route::get('/user', function (Request $request) {
            return auth()->user();
        });

        Route::get('shifts/request', [ShiftSubmissionController::class, 'index']);
        Route::post('shifts/create', [ShiftSubmissionController::class, 'create']);

        // Editor用
        Route::get('/shifts/admin/edit/show', [EditController::class, 'show'])->middleware(['auth', 'verified'])->name('shifts.admin.editor.index');
        Route::post('/shifts/admin/edit/confirm', [EditController::class, 'confirm'])->middleware(['auth', 'verified'])->name('shifts.admin.editor.change');

    });

    // シフト希望提出のCRUD操作
    Route::apiResource('shift-submissions', ShiftSubmissionController::class);
});


// Route::post('/api2/shifts/create', [ShiftSubmissionController::class, 'create']);
Route::post('/aaaa/shifts/create', function (Request $request) {
    // test
    return response()->json(['message' => 'Shift created successfully'], 201);
});
